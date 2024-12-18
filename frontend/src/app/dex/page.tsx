"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

type DexProps = {};

function Dex({}: DexProps) {
  const [fromCurrentPrice, setFromCurrentPrice] = useState("");
  const [toCurrentPrice, setToCurrentPrice] = useState();
  const [sellAmount, setSellAmount] = useState("");
  const [buyAmount, setBuyAmount] = useState("");
  const [totalSellAmount, setTotalSellAmount] = useState(0);
  const [totalBuyAmount, setTotalBuyAmount] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(0);
  // const [inputValue, setInputValue] = useState("");

  const onHandleClick = () => {
    alert("Crypto List popup");
  };

  const handleSellAmountChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event?.currentTarget;
    setSellAmount(value);
    setTotalSellAmount(Number(value) * 250);
    setTotalBuyAmount(Number(value) * 250);
  };

  const handleBuyAmountChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event?.currentTarget;
    setBuyAmount(event?.currentTarget.value);
    setTotalBuyAmount(Number(value) * 250);
  };

  const calculateExchangeRate = () => {
    setExchangeRate(Number(sellAmount) * 215);
  };

  useEffect(() => {}, []);

  return (
    <div>
      <article>
        <div className="w-1/3 py-6 px-2 bg-[#370617]/50 rounded-xl">
          <h3 className="font-bold text-lg py-2 px-4 mb-2 bg-slate-900 rounded-full inline-flex">
            Swap
          </h3>
          <form>
            <div className="SellAmount relative w-full flex bg-[#000814] rounded-xl border-transparent border p-4 min-h-10">
              <div className="w-full">
                <span className="text-sm text-white/50 font-semibold">
                  Sell
                </span>
                <input
                  className="w-full bg-[#000814] placeholder:text-white/75 text-xl font-semibold"
                  inputMode="decimal"
                  type="text"
                  placeholder="0.00"
                  name="sellAmount"
                  value={sellAmount}
                  onChange={handleSellAmountChange}
                />
                <span className="flex text-xs text-white/50 font-normal">
                  ${totalSellAmount ? totalSellAmount : "0.00"}
                </span>
              </div>
              <div className="flex items-center justify-end w-full">
                <button
                  className="flex items-center justify-between h-10 py-4 px-3 rounded-lg space-x-2 bg-[#001d3d] text-white"
                  onClick={onHandleClick}
                >
                  <span className="">
                    <Image
                      className="rounded-full"
                      src={"/assets/sol.png"}
                      alt={"crypto icon"}
                      width={24}
                      height={24}
                    />
                  </span>
                  <span className="text-sm font-semibold">SOL</span>
                  <span>
                    <ChevronDown />
                  </span>
                </button>
              </div>
            </div>

            <div className="z-10 flex justify-center items-center relative py-px">
              <button className="absolute bg-slate-900 p-2 rounded-full border-4 border-zinc-400">
                <ChevronsUpDown />
              </button>
            </div>

            <div className="BuyAmount relative w-full flex bg-[#000814] rounded-xl border-transparent border p-4 min-h-10">
              <div className="w-full">
                <span className="text-sm text-white/50 font-semibold">Buy</span>
                <input
                  className="w-full bg-[#000814] placeholder:text-white/75 text-xl font-semibold"
                  inputMode="decimal"
                  type="text"
                  placeholder="0.00"
                  name="buyAmount"
                  value={totalBuyAmount}
                  disabled
                />
                <span className="flex text-xs text-white/50 font-normal">
                  ${totalBuyAmount ? totalBuyAmount : "0.00"}
                </span>
              </div>
              <div className="flex items-center justify-end w-full">
                <button
                  className="flex items-center justify-between h-10 py-4 px-3 rounded-lg space-x-2 bg-[#001d3d] text-white"
                  onClick={onHandleClick}
                >
                  <span className="">
                    <Image
                      className="rounded-full"
                      src={"/assets/usdc.png"}
                      alt={"crypto icon"}
                      width={24}
                      height={24}
                    />
                  </span>
                  <span className="text-sm font-semibold">SOL</span>
                  <span>
                    <ChevronDown />
                  </span>
                </button>
              </div>
            </div>

            <div>
              <button className="flex w-full py-4 px-6 mt-4 justify-center items-center rounded-lg bg-[#002855] hover:bg-[#002855]/75 transition-colors duration-300">
                <span className="text-lg font-semibold ">Swap</span>
              </button>
            </div>
          </form>
        </div>
      </article>
    </div>
  );
}

export default Dex;
