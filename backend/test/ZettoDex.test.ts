import { ethers } from "hardhat";
import { expect } from "chai";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { ZettoDex, MockERC20 } from "../typechain-types";

describe("ZettoDex", () => {
  let zettoDex: ZettoDex;
  let token1: MockERC20;
  let token2: MockERC20;
  let owner: SignerWithAddress;
  let liquidityProvider: SignerWithAddress;
  let trader: SignerWithAddress;

  beforeEach(async () => {
    [owner, liquidityProvider, trader] = await ethers.getSigners();

    // deploy dex and tokens
    const MockERC20Factory = await ethers.getContractFactory("MockERC20");
    token1 = await MockERC20Factory.deploy("TokenOne", "TKONE", ethers.parseEther("10000"));
    token2 = await MockERC20Factory.deploy("TokenTwo", "TKTWO", ethers.parseEther("10000"));

    const ZettoDexFactory = await ethers.getContractFactory("ZettoDex");
    zettoDex = await ZettoDexFactory.deploy(await token1, await token2);

    // approve LP provider
    await token1
      .connect(liquidityProvider)
      .approve(await zettoDex.getAddress(), ethers.parseEther("1000"));
    await token2
      .connect(liquidityProvider)
      .approve(await zettoDex.getAddress(), ethers.parseEther("1000"));

    // transfer tokens to LP provider and trader
    await token1.transfer(liquidityProvider.address, ethers.parseEther("1000"));
    await token2.transfer(liquidityProvider.address, ethers.parseEther("1000"));
    await token1.transfer(trader.address, ethers.parseEther("500"));
    await token2.transfer(trader.address, ethers.parseEther("500"));
  });

  describe("Constructir", () => {
    it("should set the correct tokens", async () => {
      expect(await zettoDex.token1()).to.equal(await token1.getAddress());
      expect(await zettoDex.token2()).to.equal(await token2.getAddress());
    });
  });
});
