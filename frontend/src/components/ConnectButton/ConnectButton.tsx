"use client";

import React from "react";
import { useWeb3Connect } from "@/hooks/useWeb3Connect";

const ConnectButton = () => {
  const { isConnected, account, error, connect, disconnect } = useWeb3Connect();

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div
      className={`inline-flex bg-[#370617] rounded-full ${isConnected ? "pl-4 pr-1 py-1" : ""}`}
    >
      <div className="font-semibold">
        {!isConnected && (
          <button
            className="py-2 px-4 bg-lime-900 rounded-full"
            onClick={connect}
          >
            Connect
          </button>
        )}

        {isConnected && (
          <>
            <span>
              {account?.slice(0, 4)}...{account?.slice(-4)}
            </span>
            <button
              className="ml-2 py-2 px-4 bg-lime-900 rounded-full"
              onClick={disconnect}
            >
              Disconnect
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ConnectButton;
