"use server";

import qs from "query-string";

const BASE_URL = process.env.BASE_URL;
const API_KEY = process.env.API_KEY;

export async function fetchCoinData<T>(
  endpoint: string,
  params?: QueryParams,
  revalidate = 60,
): Promise<T> {
  const url = qs.stringifyUrl(
    {
      url: `${BASE_URL}/${endpoint}`,
      query: params,
    },
    { skipEmptyString: true, skipNull: true },
  );

  const response = await fetch(url, {
    headers: {
      "x-cg-demo-api-key": API_KEY,
      "Content-Type": "application/json",
    } as Record<string, string>,
    next: { revalidate },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

// Получение информации о пулах ликвидности для заданной монеты
export async function getPools(
  id: string,
  network?: string | null,
  contractAddress?: string | null,
): Promise<PoolData> {
  const fallback: PoolData = {
    id: "",
    address: "",
    name: "",
    network: "",
  };

  if (network && contractAddress) {
    // Если предоставлены сеть и адрес контракта, ищем пул по ним
    try {
      const poolData = await fetchCoinData<{ data: PoolData[] }>(
        `/onchain/networks/${network}/tokens/${contractAddress}/pools`,
      );

      // Возвращаем первый пул из полученных данных или значение по умолчанию
      return poolData.data?.[0] ?? fallback;
    } catch (error) {
      console.log(error);
      return fallback;
    }
  }

  // Если сеть или адрес контракта не предоставлены, ищем пул по идентификатору монеты
  try {
    const poolData = await fetchCoinData<{ data: PoolData[] }>(
      "/onchain/search/pools",
      { query: id },
    );

    return poolData.data?.[0] ?? fallback;
  } catch {
    return fallback;
  }
}
