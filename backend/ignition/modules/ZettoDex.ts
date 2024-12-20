import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ZettoDexModule = buildModule("ZettoDexModule", (m) => {
  const ZUSDC = m.contract("MockERC20", ["Zetto USDC", "ZUSDC", "1000000000"], { id: "zusdc_v1" });
  const ZETTO = m.contract("MockERC20", ["Zetto Token", "ZETTO", "1000000000"], { id: "zetto_v1" });
  const zettoDex = m.contract("ZettoDex", [ZUSDC, ZETTO], {
    id: "ZettoDex_v1",
    after: [ZUSDC, ZETTO], // ensure these tokens are deployed first
  });

  return { ZUSDC, ZETTO, zettoDex };
});

export default ZettoDexModule;
