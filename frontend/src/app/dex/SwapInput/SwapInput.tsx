import { ChevronDown } from "lucide-react";
import Image from "next/image";
import React from "react";

type SwapInputProps = {
  amountType: string;
  inputTitle: string;
  cryptoIcon: any;
  totalAmount?: number;
  value: string;
  showTotal?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick: () => void;
} & React.InputHTMLAttributes<HTMLInputElement>;

const SwapInput = ({
  amountType,
  totalAmount,
  showTotal,
  inputTitle,
  value,
  onChange,
  onClick,
  cryptoIcon,
  ...props
}: SwapInputProps) => {
  return (
    <div className="SellAmount relative w-full flex bg-[#000814] rounded-xl border-transparent border p-4 min-h-10">
      <div className="w-full">
        <span className="text-sm text-white/50 font-semibold">
          {inputTitle && inputTitle}
        </span>
        <input
          className="w-full bg-[#000814] placeholder:text-white/75 text-xl font-semibold"
          inputMode="decimal"
          placeholder="0.00"
          name={amountType}
          value={value}
          onChange={onChange}
          {...props}
        />
        {showTotal && (
          <span className="flex text-xs text-white/50 font-normal">
            ${totalAmount ? totalAmount : "0.00"}
          </span>
        )}
      </div>
      <div className="flex items-center justify-end w-full">
        <button
          className="flex items-center justify-between h-10 py-4 px-3 rounded-lg space-x-2 bg-[#001d3d] text-white"
          onClick={onClick}
        >
          <span className="">
            <Image
              className="rounded-full"
              src={cryptoIcon}
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
  );
};

export default SwapInput;
