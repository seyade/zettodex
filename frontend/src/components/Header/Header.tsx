import Link from "next/link";
import React from "react";

type HeaderProps = {
  children: React.ReactNode;
};

const Header = ({ children }: HeaderProps) => {
  return (
    <nav className="flex items-center p-4">
      <div className="flex flex-1 gap-1 text-sm font-semibold">
        <Link
          href="/dex"
          className="py-2 px-3 rounded-sm hover:bg-white/10 transition-all duration-300"
        >
          Swap
        </Link>
        <Link
          href="/liquidity"
          className="py-2 px-3 rounded-sm hover:bg-white/10 transition-all duration-300"
        >
          Liquidity
        </Link>
      </div>
      {children}
    </nav>
  );
};

export default Header;
