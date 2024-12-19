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
      const initialToken1Balance = await token1.balanceOf(liquidityProvider.address);
      const initialToken2Balance = await token2.balanceOf(liquidityProvider.address);

      await expect(zettoDex.connect(liquidityProvider).removeLiquidity(liquidityToBeRemoved))
        .to.emit(zettoDex, "LiquidityRemoved")
        .withArgs(liquidityProvider.address, liquidityToBeRemoved);

      const finalToken1Balance = await token1.balanceOf(liquidityProvider.address);
      const finalToken2Balance = await token2.balanceOf(liquidityProvider.address);

      expect(finalToken1Balance).to.be.gt(initialToken1Balance);
      expect(finalToken2Balance).to.be.gt(initialToken2Balance);
      expect(await zettoDex.liquidityProvided(liquidityProvider.address)).to.equal(0);
    });

    it("should revert if 0 amounts", async () => {
      await expect(zettoDex.connect(liquidityProvider).removeLiquidity(0)).to.be.revertedWith(
        "Invalid liquidity amount"
      );

      await expect(zettoDex.connect(owner).removeLiquidity(100)).to.be.revertedWith(
        "Invalid liquidity amount"
      );
    });
  });

  describe("Swap Tokens", () => {
    beforeEach(async () => {
      // setup tokens for liquidity
      const amount1 = ethers.parseEther("100");
      const amount2 = ethers.parseEther("100");

      // add liquidity to Dex to enable swapping
      await token1.connect(liquidityProvider).approve(await zettoDex.getAddress(), amount1);
      await token1.connect(liquidityProvider).approve(await zettoDex.getAddress(), amount2);
      await zettoDex.connect(liquidityProvider).addLiquidity(amount1, amount2);

      // approval of trader to trade the token in Dex
      await token1.connect(trader).approve(await zettoDex.getAddress(), ethers.parseEther("50"));
      await token2.connect(trader).approve(await zettoDex.getAddress(), ethers.parseEther("50"));
    });

    it("can swap token1 for token2", async () => {
      const amountIn = ethers.parseEther("10");
      const initialToken2Balance = await token2.balanceOf(trader.address);

      await expect(
        zettoDex
          .connect(trader)
          .swapTokens(await token1.getAddress(), await token2.getAddress(), amountIn)
      ).to.emit(zettoDex, "TokenSwapped");

      const finalToken2Balance = await token2.balanceOf(trader.address);
      expect(finalToken2Balance).to.be.gt(initialToken2Balance);
    });

    it("can swap token2 for token1", async () => {
      const amountIn = ethers.parseEther("5");
      const initialToken1Balance = await token1.balanceOf(trader.address);

      await expect(
        zettoDex
          .connect(trader)
          .swapTokens(await token2.getAddress(), await token1.getAddress(), amountIn)
      ).to.emit(zettoDex, "TokenSwapped");

      const finalToken1Balance = await token1.balanceOf(trader.address);
      expect(finalToken1Balance).to.be.gt(initialToken1Balance);
    });

    it("should revertwith error message if insufficient amount ", async () => {
      await expect(
        zettoDex.connect(trader).swapTokens(await token1.getAddress(), await token2.getAddress(), 0)
      ).to.be.revertedWith("Insufficient amount input");
    });
  });
});
