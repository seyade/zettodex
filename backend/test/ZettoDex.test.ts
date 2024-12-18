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
    //get all the actors address
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

  describe("Constructor", () => {
    it("should set the correct tokens", async () => {
      expect(await zettoDex.token1()).to.equal(await token1.getAddress());
      expect(await zettoDex.token2()).to.equal(await token2.getAddress());
    });

    it("should revert when the zero address", async () => {
      const ZettoDexFactory = await ethers.getContractFactory("ZettoDex");

      await expect(
        ZettoDexFactory.deploy(ethers.ZeroAddress, await token2.getAddress())
      ).to.be.revertedWith("Invalid token address");
      await expect(
        ZettoDexFactory.deploy(await token1.getAddress(), ethers.ZeroAddress)
      ).to.be.revertedWith("Invalid token address");
    });

    it("should revert if tokens are the same", async () => {
      const ZettoDexFactory = await ethers.getContractFactory("ZettoDex");

      await expect(
        ZettoDexFactory.deploy(await token1.getAddress(), await token1.getAddress())
      ).to.be.revertedWith("Tokens must be different");
    });
  });

  describe("Add Liquidity", () => {
    it("should add initial liquidity pair", async () => {
      const amount1 = ethers.parseEther("100");
      const amount2 = ethers.parseEther("100");

      await token1.connect(liquidityProvider).approve(await zettoDex.getAddress(), amount1);

      await token2.connect(liquidityProvider).approve(await zettoDex.getAddress(), amount2);

      await expect(zettoDex.connect(liquidityProvider).addLiquidity(amount1, amount2))
        .to.emit(zettoDex, "LiquidityAdded")
        .withArgs(liquidityProvider.address, amount1);

      expect(await zettoDex.totalLiquidity()).to.equal(amount1);
      expect(await zettoDex.reserve1()).to.equal(amount1);
      expect(await zettoDex.reserve2()).to.equal(amount2);
    });

    it("should revert if 0 amounts", async () => {
      await expect(zettoDex.connect(liquidityProvider).addLiquidity(0, 100)).to.be.revertedWith(
        "Amounts must be more than 0"
      );
      await expect(zettoDex.connect(liquidityProvider).addLiquidity(100, 0)).to.be.revertedWith(
        "Amounts must be more than 0"
      );
    });
  });

  describe("Remove Liquidity", () => {
    beforeEach(async () => {
      const amount1 = ethers.parseEther("100");
      const amount2 = ethers.parseEther("100");

      await token1.connect(liquidityProvider).approve(await zettoDex.getAddress(), amount1);
      await token2.connect(liquidityProvider).approve(await zettoDex.getAddress(), amount2);

      await zettoDex.connect(liquidityProvider).addLiquidity(amount1, amount2);
    });

    it("should remove liquidity pair", async () => {
      const liquidityToBeRemoved = await zettoDex.liquidityProvided(liquidityProvider.address);
    });

    it("should revert if 0 amounts", async () => {});
  });
});
