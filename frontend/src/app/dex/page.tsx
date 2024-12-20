"use client";

import React, { useEffect, useState } from "react";
import { ChevronsUpDown } from "lucide-react";
import SwapInput from "./SwapInput";
import Link from "next/link";
import Header from "@/components/Header";

function Dex() {
  const [sellAmount, setSellAmount] = useState("");
  const [totalSellAmount, setTotalSellAmount] = useState(0);
  const [totalBuyAmount, setTotalBuyAmount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onToggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleSellAmountChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event?.currentTarget;
    setSellAmount(value);
    setTotalSellAmount(Number(value) * 250);
    setTotalBuyAmount(Number(value) * 250);
  };

  return (
    <div>
      <Header />
      <article>
        <section className="flex items-center justify-center h-screen bg-teal-950/10">
          <div className="w-1/3 py-6 px-4 bg-[#370617]/50 rounded-xl">
            <h3 className="font-bold text-lg py-2 px-4 mb-2 bg-slate-900 rounded-full inline-flex">
              Swap
            </h3>
            <form>
              <SwapInput
                amountType="sellAmount"
                value={sellAmount}
                totalAmount={totalSellAmount}
                cryptoIcon="/assets/sol.png"
                onChange={handleSellAmountChange}
                onClick={onToggleModal}
                inputTitle="Sell"
                showTotal
              />

              <div className="z-10 flex justify-center items-center relative py-px">
                <button className="absolute bg-slate-900 p-2 rounded-full border-4 border-zinc-400">
                  <ChevronsUpDown />
                </button>
              </div>

              <SwapInput
                amountType="buyAmount"
                value={totalBuyAmount.toString()}
                totalAmount={totalBuyAmount}
                cryptoIcon="/assets/usdc.png"
                onChange={handleSellAmountChange}
                onClick={onToggleModal}
                inputTitle="Buy"
                showTotal
                disabled
              />

              <div>
                <button className="flex w-full py-4 px-6 mt-4 justify-center items-center rounded-lg bg-[#002855] hover:bg-[#002855]/75 transition-colors duration-300">
                  <span className="text-lg font-semibold ">Swap</span>
                </button>
              </div>
            </form>
          </div>
        </section>
      </article>
    </div>
  );
}

export default Dex;
