"use client";

import { useCallback, useEffect, useState } from "react";

export type Web3Connect = {
  isConnected?: boolean;
  account?: string;
  chainId?: string;
};

export function useWeb3Connect() {
  const [state, setState] = useState<Web3Connect>({
    isConnected: false,
    account: "",
    chainId: "",
  });
  const [error, setError] = useState(<string | null>null);

  const checkConnection = useCallback(async () => {
    if (typeof window.ethereum === "undefined") {
      throw new Error("Please install a Ethereum wallet, e.g. Metamask.");
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length > 0) {
        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        });

        setState({
          isConnected: true,
          account: accounts[0],
          chainId,
        });
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Oops! There is an error."
      );
    }
  }, []);

  const connect = useCallback(async () => {
    if (typeof window.ethereum === "undefined") {
      throw new Error("Please install a Ethereum wallet, e.g. Metamask.");
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const chainId = await window.ethereum.request({
        method: "eth_chainId",
      });

      setState({
        isConnected: true,
        account: accounts[0],
        chainId,
      });
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Oops! There is an error."
      );
    }
  }, []);

  const disconnect = useCallback(() => {
    setState({
      isConnected: false,
      account: null,
      chainId: null,
    });

    if (window.ethereum) {
      window.ethereum.removeAllListeners("accountChanged");
      window.ethereum.removeAllListeners("chainChanged");
    }
  }, []);

  useEffect(() => {
    checkConnection();

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else {
          setState((prev) => ({
            ...prev,
            account: accounts[0],
          }));
        }
      });

      window.ethereum.on("chainChanged", (chainId: string) => {
        setState((prev) => ({
          ...prev,
          chainId,
        }));
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners("accountsChanged");
        window.ethereum.removeAllListeners("chainChanged");
      }
    };
  }, [checkConnection, disconnect]);

  return {
    ...state,
    error,
    connect,
    disconnect,
    checkConnection,
  };
}
