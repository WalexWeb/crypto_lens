import CoinsPagination from "@/components/CoinsPagination";
import DataTable from "@/components/DataTable";
import { fetchCoinData } from "@/lib/coingecko.actions";
import { cn, formatCurrency, formatPercentage } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const page = async ({ searchParams }: NextPageProps) => {
  const { page } = await searchParams;

  const currentPage = Number(page) || 1;

  const perPage = 10;

  const coinsData = await fetchCoinData<CoinMarketData[]>("/coins/markets", {
    vs_currency: "usd",
    order: "market_cap_desc",
    per_page: perPage,
    page: currentPage,
    sparkline: false,
  });

  const columns: DataTableColumn<CoinMarketData>[] = [
    {
      header: "Rank",
      cellClassName: "rank-cell",
      cell: (coin) => (
        <>
          #{coin.market_cap_rank}
          <Link href={`/coins/${coin.id}`} aria-label="View coin details" />
        </>
      ),
    },
    {
      header: "Name",
      cellClassName: "token-cell",
      cell: (coin) => (
        <div className="token-info">
          <Image src={coin.image} alt={coin.name} width={36} height={36} />
          <p>
            {coin.name} ({coin.symbol})
          </p>
        </div>
      ),
    },
    {
      header: "Price",
      cellClassName: "price-cell",
      cell: (coin) => formatCurrency(coin.current_price),
    },
    {
      header: "24h Change",
      cellClassName: "change-cell",
      cell: (coin) => {
        const isTrendingUp = coin.price_change_percentage_24h > 0;
        return (
          <div
            className={cn(
              "change-value",
              isTrendingUp ? "text-green-500" : "text-red-500",
            )}
          >
            {isTrendingUp && "+"}
            {formatPercentage(coin.price_change_percentage_24h)}
          </div>
        );
      },
    },
    {
      header: "Market Cap",
      cellClassName: "market-cap-cell",
      cell: (coin) => formatCurrency(coin.market_cap),
    },
  ];

  const hasMorePages = coinsData.length === perPage;

  // Оценка общего количества страниц
  const estimatedTotalPages =
    currentPage >= 100 ? Math.ceil(currentPage / perPage) * 100 + 100 : 100;

  return (
    <main id="coins-page">
      <div className="content">
        <h4>All Coins</h4>

        <DataTable
          tableClassName="coins-table"
          columns={columns}
          data={coinsData}
          rowKey={(coin) => coin.id}
        />

        <CoinsPagination
          currentPage={currentPage}
          totalPages={estimatedTotalPages}
          hasMorePages={hasMorePages}
        />
      </div>
    </main>
  );
};

export default page;
