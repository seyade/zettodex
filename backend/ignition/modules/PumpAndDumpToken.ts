import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ethers } from "hardhat";

const PumpAndDumpTokenModule = buildModule("PumpAndDumpTokenModule", (m) => {
  const INIT_SUPPLY: bigint = ethers.parseUnits("10000000", 18);
  const pumpAndDumpToken = m.contract("PumpAndDumpToken", [INIT_SUPPLY]);

  return { pumpAndDumpToken };
});

export default PumpAndDumpTokenModule;
