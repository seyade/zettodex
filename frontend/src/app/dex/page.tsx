"use client";

import React, { useState } from "react";
import { ChevronsUpDown, SettingsIcon } from "lucide-react";
import SwapInput from "./SwapInput";

import ZettoDexABI from "../../utils/abis/ZettoDex_ABI.json";
import TokenABI from "../../utils/abis/MockERC20_ABI.json";

import tokenlist from "../../utils/constants/tokenlist.json";
import Modal from "@/components/Modal/Modal";

function Dex() {
  const [sellAmount, setSellAmount] = useState("");
  const [totalSellAmount, setTotalSellAmount] = useState(0);
  const [totalBuyAmount, setTotalBuyAmount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tokenOneAmount, setTokenOneAmount] = useState();
  const [tokenTwoAmount, setTokenTwoAmount] = useState();
  const [tokenOne, setTokenOne] = useState(tokenlist[0]);
  const [tokenTwo, setTokenTwo] = useState(tokenlist[1]);

  const ZETTODEX_CONTRACT = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const TOKEN1_CONTRACT = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const TOKEN2_CONTRACT = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

  const [swapInput, setSwapInput] = useState({
    fromToken: "",
    toToken: "",
    amountIn: "",
  });

  const switchTokens = () => {
    const one = tokenOne;
    const two = tokenTwo;
    setTokenOne(two);
    setTokenTwo(one);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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
    <>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div>
          {[1, 2, 3, 4, 5].map((n) => (
            <p key={n}>{n}</p>
          ))}
        </div>
      </Modal>
      <article>
        <section className="flex items-center justify-center h-screen bg-teal-950/10">
          <div className="w-1/3 py-6 px-4 bg-[#370617]/50 rounded-xl">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg py-2 px-4 mb-2 bg-slate-900 rounded-full inline-flex">
                Swap
              </h3>
              <SettingsIcon />
            </div>

            <form>
              <SwapInput
                amountType="sellAmount"
                value={sellAmount}
                totalAmount={totalSellAmount}
                cryptoIcon="/assets/eth.png"
                cryptoAsset={tokenOne}
                onChange={handleSellAmountChange}
                onClick={openModal}
                inputTitle="Sell"
                showTotal
              />

              <div className="z-10 flex justify-center items-center relative py-px">
                <div
                  className="absolute bg-slate-900 hover:bg-slate-800 transition-colors duration-300 p-2 rounded-full border-4 border-zinc-400 cursor-pointer"
                  onClick={switchTokens}
                >
                  <ChevronsUpDown />
                </div>
              </div>

              <SwapInput
                amountType="buyAmount"
                value={totalBuyAmount.toString()}
                totalAmount={totalBuyAmount}
                cryptoIcon="/assets/usdc.png"
                cryptoAsset={tokenTwo}
                onChange={handleSellAmountChange}
                onClick={openModal}
                inputTitle="Buy"
                showTotal
                disabled
              />

              <div>
                <button className="flex w-full py-4 px-6 mt-4 justify-center items-center rounded-lg bg-[#002855] hover:bg-[#002855]/75 transition-colors duration-300">
                  <span className="text-lg font-semibold">Swap</span>
                </button>
              </div>
            </form>
          </div>
        </section>
      </article>
    </>
  );
}

export default Dex;
