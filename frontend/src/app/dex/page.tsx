"use client";

import React from "react";
import Image from "next/image";

type DexProps = {};

function Dex({}: DexProps) {
  const onHandleClick = () => {};
  return (
    <div>
      <article>
        <div className="w-1/2">
          <form>
            <div className="relative flex bg-[#370617] bg- rounded-xl border-transparent border p-4 min-h-24">
              <div>
                <input
                  className="h-full w-full bg-transparent placeholder:text-white/50 text-xl font-semibold"
                  inputMode="decimal"
                  type="text"
                  placeholder="0.00"
                  name="fromAmount"
                />
                <span>$0.00</span>
              </div>
              <div>
                <button
                  className="flex items-center h-10 space-x-3 bg-[#001d3d] text-white"
                  onClick={onHandleClick}
                >
                  <span className="rounded-full">
                    <Image
                      src={"/assets/sol.png"}
                      alt={"crypto icon"}
                      width={24}
                      height={24}
                    />
                  </span>
                  <span>ETH</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </article>
    </div>
  );
}

export default Dex;
