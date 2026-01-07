"use server";

import qs from "query-string";

const BASE_URL = process.env.BASE_URL;
const API_KEY = process.env.API_KEY;

export async function fetchCoinData<T>(
  endpoint: string,
  params?: QueryParams,
  revalidate = 60
): Promise<T> {
  const url = qs.stringifyUrl(
    {
      url: `${BASE_URL}/${endpoint}`,
      query: params,
    },
    { skipEmptyString: true, skipNull: true }
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
