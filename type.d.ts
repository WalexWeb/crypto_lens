interface NextPageProps {
  params: Promise<{ [key: string]: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

type OHLCData = [number, number, number, number, number];

// Chart
type Period =
  | "daily"
  | "weekly"
  | "monthly"
  | "3months"
  | "6months"
  | "yearly"
  | "max";

interface CandlestickChartProps {
  data?: OHLCData[];
  liveOhlcv?: OHLCData | null;
  coinId: string;
  height?: number;
  children?: React.ReactNode;
  mode?: "historical" | "live";
  initialPeriod?: Period;
  liveInterval?: "1s" | "1m";
  setLiveInterval?: (interval: "1s" | "1m") => void;
}

// Coins
interface TrendingCoin {
  item: {
    id: string;
    name: string;
    symbol: string;
    market_cap_rank: number;
    thumb: string;
    large: string;
    data: {
      price: number;
      price_change_percentage_24h: {
        usd: number;
      };
    };
  };
}

interface CoinMarketData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  last_updated: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  rowKey: (row: T, index: number) => React.Key;
  tableClassName?: string;
  headerClassName?: string;
  headerRowClassName?: string;
  headerCellClassName?: string;
  bodyRowClassName?: string;
  bodyCellClassName?: string;
}

interface DataTableColumn<T> {
  header: React.ReactNode;
  cell: (row: T, index: number) => React.ReactNode;
  headClassName?: string;
  cellClassName?: string;
}

type PaginationLinkProps = {
  isActive?: boolean;
  size?: ButtonSize;
} & React.ComponentProps<"a">;

interface Pagination {
  currentPage: number;
  totalPages: number;
  hasMorePages: boolean;
}

interface CoinDetailsData {
  id: string;
  name: string;
  symbol: string;
  asset_platform_id?: string | null;
  detail_platforms?: Record<
    string,
    {
      geckoterminal_url: string;
      contract_address: string;
    }
  >;
  image: {
    large: string;
    small: string;
  };
  market_data: {
    current_price: {
      usd: number;
      [key: string]: number;
    };
    price_change_24h_in_currency: {
      usd: number;
    };
    price_change_percentage_24h_in_currency: {
      usd: number;
    };
    price_change_percentage_30d_in_currency: {
      usd: number;
    };
    market_cap: {
      usd: number;
    };
    total_volume: {
      usd: number;
    };
  };
  market_cap_rank: number;
  description: {
    en: string;
  };
  links: {
    homepage: string[];
    blockchain_site: string[];
    subreddit_url: string;
  };
  tickers: Ticker[];
}

// Categories
interface Category {
  name: string;
  top_3_coins: string[];
  market_cap_change_24h: number;
  market_cap: number;
  volume_24h: number;
}

// Utils
type QueryParams = Record<string, string | number | boolean | undefined>;

// Websocket

interface Trade {
  price?: number;
  timestamp?: number;
  type?: string;
  amount?: number;
  value?: number;
}

interface ExtendedPriceData {
  usd: number;
  coin?: string;
  price?: number;
  change24h?: number;
  marketCap?: number;
  volume24h?: number;
  timestamp?: number;
}

interface UseWebsocketProps {
  coinId: string;
  poolId: string;
  liveInterval?: "1s" | "1m";
}

interface UseWebsocketReturn {
  price: ExtendedPriceData | null;
  trades: Trade[];
  ohlcv: OHLCData | null;
  isConnected: boolean;
}

interface WebSocketMessage {
  type?: string;
  c?: string;
  ch?: string;
  i?: string;
  p?: number;
  pp?: number;
  pu?: number;
  m?: number;
  v?: number;
  vo?: number;
  o?: number;
  h?: number;
  l?: number;
  t?: number;
  to?: number;
  ty?: string;
  channel?: string;
  identifier?: string;
}

interface PoolData {
  id: string;
  address: string;
  name: string;
  network: string;
}

// Live Data Wrapper
interface LiveDataProps {
  coinId: string;
  poolId: string;
  coin: CoinDetailsData;
  coinOHLCData?: OHLCData[];
  children?: React.ReactNode;
}

interface LiveCoinHeaderProps {
  name: string;
  image: string;
  livePrice: number;
  livePriceChangePercentage24h: number;
  priceChangePercentage30d: number;
  priceChange24h: number;
}
