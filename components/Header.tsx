"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();

  return (
    <header>
      <div className="main-container inner">
        <Link href="/">CryptoLens</Link>

        <nav>
          <Link
            href="/"
            className={cn("nav-link", {
              "is-active": pathname === "/",
              "is-home": true,
            })}
          >
            Home
          </Link>

          <p>Search Modal</p>

          <Link
            href="/coins"
            className={cn("nav-link", {
              "is-active": pathname === "/coins",
              "is-home": false,
            })}
          >
            All coins
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
