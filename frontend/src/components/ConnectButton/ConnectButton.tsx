"use client";

import React from "react";
import { useWeb3Connect } from "@/hooks/useWeb3Connect";

const ConnectButton = () => {
  const { isConnected, account, error, connect, disconnect } = useWeb3Connect();

  if (error) {
    return <div>{error}</div>;
  }

  return <div>ConnectButton</div>;
};

export default ConnectButton;
