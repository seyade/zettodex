import Link from "next/link";
import React from "react";

type HeaderProps = {
  children: React.ReactNode;
};

const Header = ({ children }: HeaderProps) => {
  return (
    <nav className="flex items-center p-4">
      <div className="flex gap-4 text-sm font-semibold">
        <Link href="/dex">Swap</Link>
        <Link href="/liquidity">Liquidity</Link>
      </div>
      {children}
    </nav>
  );
};

export default Header;
