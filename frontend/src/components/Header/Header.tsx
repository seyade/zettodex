import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <nav className="flex items-center justify-center p-4">
      <div className="flex gap-4 text-sm font-semibold">
        <Link href="/dex">Swap</Link>
        <Link href="/liquidity">Liquidity</Link>
      </div>
    </nav>
  );
};

export default Header;
