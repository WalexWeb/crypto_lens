import { useEffect, useRef, useState } from "react";

const WS_URL = `${process.env.NEXT_PUBLIC_WS_URL}?x_cg_api_key=${process.env.NEXT_PUBLIC_API_KEY}`;

export const useWebsocket = ({
  coinId,
  poolId,
  liveInterval,
}: UseWebsocketProps): UseWebsocketReturn => {
  const wsRef = useRef<WebSocket | null>(null);
  const subscribed = useRef<Set<string>>(new Set());

  const [price, setPrice] = useState<ExtendedPriceData | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [ohlcv, setOhlcv] = useState<OHLCData | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    // Сериализация отправки сообщений
    const send = (payload: Record<string, any>) =>
      ws.send(JSON.stringify(payload));

    const handleMessage = (event: MessageEvent) => {
      const msg: WebSocketMessage = JSON.parse(event.data);

      // Обработка сообщений
      if (msg.type === "ping") {
        send({ type: "pong" });
        return;
      }

      // Подтверждение подключения
      if (msg.type === "confirm_subscription") {
        const { channel } = JSON.parse(msg?.identifier ?? "");

        subscribed.current.add(channel);
      }

      // Обработка других типов сообщений
      if (msg.c === "C1") {
        setPrice({
          usd: msg.p || 0,
          coin: msg.i,
          price: msg.p,
          change24h: msg.pp,
          marketCap: msg.m,
          volume24h: msg.v,
          timestamp: msg.t,
        });
      }

      // Обработка торговых данных
      if (msg.c === "G2") {
        const newTrade: Trade = {
          price: msg.pu,
          value: msg.vo,
          timestamp: msg.t ?? 0,
          type: msg.ty,
          amount: msg.to,
        };

        setTrades((prev) => [newTrade, ...prev].slice(0, 7));
      }

      // Обработка данных OHLCV
      if (msg.ch === "G3") {
        const timestamp = msg.t ?? 0;

        const candle: OHLCData = [
          timestamp,
          Number(msg.o ?? 0),
          Number(msg.h ?? 0),
          Number(msg.l ?? 0),
          Number(msg.c ?? 0),
        ];

        setOhlcv(candle);
      }
    };

    ws.onopen = () => setIsConnected(true);

    ws.onmessage = handleMessage;

    ws.onclose = () => setIsConnected(false);

    return () => ws.close();
  }, []);

  useEffect(() => {
    if (!isConnected) return;

    const ws = wsRef.current;
    if (!ws) return;

    const send = (payload: Record<string, any>) =>
      ws.send(JSON.stringify(payload));

    // Отмена подписок при изменении зависимостей
    const unsubscribeAll = () => {
      subscribed.current.forEach((channel) => {
        send({
          command: "unsubscribe",
          identifier: JSON.stringify({ channel }),
        });
      });
      subscribed.current.clear();
    };

    const subscribe = (channel: string, data?: Record<string, any>) => {
      if (subscribed.current.has(channel)) return;

      send({
        command: "subscribe",
        identifier: JSON.stringify({ channel }),
      });

      // Отправка дополнительных данных, если необходимо
      if (data) {
        send({
          command: "message",
          identifier: JSON.stringify({ channel }),
          data: JSON.stringify(data),
        });
      }
    };

    // Очистка данных при изменении зависимостей
    queueMicrotask(() => {
      setPrice(null);
      setTrades([]);
      setOhlcv(null);

      unsubscribeAll();

      subscribe('CGSimplePrice', {
        coin_id: [coinId], action: 'set_tokens'
      })
    })

    const poolAddress = poolId?.replace('_', ":");

    if (poolAddress) {
      subscribe('OnChainTrade', {
        'network_id:pool_address': [poolAddress],
        action: 'set_pools'
      })

      subscribe('OnChainOHLCV', {
        'network_id:pool_address': [poolAddress],
        interval: liveInterval,
        action: 'set_pools'
      })
    }
  }, [coinId, poolId, liveInterval]);

  return {
    price,
    trades,
    ohlcv,
    isConnected,
  }
};
