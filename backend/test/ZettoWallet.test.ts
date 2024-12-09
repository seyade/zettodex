import { expect } from "chai";
import { ethers } from "hardhat";
import { SampleWallet, ZettoWallet } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("SampleWallet", () => {
  let zettoWallet: ZettoWallet;
  let userOne: SignerWithAddress;
  let userTwo: SignerWithAddress;

  beforeEach(async () => {
    [userOne, userTwo] = await ethers.getSigners();

    const ZettoWalletFactory = await ethers.getContractFactory("ZettoWallet");

    zettoWallet = await ZettoWalletFactory.deploy();

    await zettoWallet.waitForDeployment();
  });

  describe("Deposit", () => {
    it("allows deposit of funds for User #1", async () => {
      const fundAmount = ethers.parseEther("0.1");

      await userOne.sendTransaction({
        to: await zettoWallet.getAddress(),
        value: fundAmount,
      });

      const balance = await ethers.provider.getBalance(await zettoWallet.getAddress());
      expect(balance).to.equal(fundAmount);
    });

    it("allows deposit of funds for User #2", async () => {
      const fundAmount = ethers.parseEther("0.1");

      await userTwo.sendTransaction({
        to: await zettoWallet.getAddress(),
        value: fundAmount,
      });

      const balance = await ethers.provider.getBalance(await zettoWallet.getAddress());
      expect(balance).to.equal(fundAmount);
    });
  });

  describe("Withdrawal", () => {
    it("allows withdrawal of funds for User #1", async () => {
      const depositAmount = ethers.parseEther("2.0");

      await zettoWallet.connect(userOne).deposit({ value: depositAmount });

      const initialContractBalance = await ethers.provider.getBalance(
        await zettoWallet.getAddress()
      );

      const initialUserBalance = await ethers.provider.getBalance(userOne.address);

      const withdrawal = await zettoWallet.connect(userOne).withdraw(depositAmount);

      const receipt = await withdrawal.wait();

      const gasUsed = receipt?.gasUsed || 0n;
      const gasPrice = receipt?.gasPrice || 0n;
      const gasCost = gasUsed * gasPrice;

      const finalContractBalance = await ethers.provider.getBalance(await zettoWallet.getAddress());

      const finalUserBalance = await ethers.provider.getBalance(userOne.address);

      expect(finalContractBalance).to.equal(initialContractBalance - depositAmount);

      expect(finalUserBalance).to.be.closeTo(
        initialUserBalance + depositAmount - gasCost,
        ethers.parseEther("0.001")
      );
    });

    it("allows withdrawal of funds for User #2", async () => {
      const depositAmount = ethers.parseEther("2.0");

      await zettoWallet.connect(userTwo).deposit({ value: depositAmount });

      const initialContractBalance = await ethers.provider.getBalance(
        await zettoWallet.getAddress()
      );

      const initialUserBalance = await ethers.provider.getBalance(userTwo.address);

      const withdrawal = await zettoWallet.connect(userTwo).withdraw(depositAmount);

      const receipt = await withdrawal.wait();

      const gasUsed = receipt?.gasUsed || 0n;
      const gasPrice = receipt?.gasPrice || 0n;
      const gasCost = gasUsed * gasPrice;

      const finalContractBalance = await ethers.provider.getBalance(await zettoWallet.getAddress());

      const finalUserBalance = await ethers.provider.getBalance(userTwo.address);

      expect(finalContractBalance).to.equal(initialContractBalance - depositAmount);

      expect(finalUserBalance).to.be.closeTo(
        initialUserBalance + depositAmount - gasCost,
        ethers.parseEther("0.001")
      );
    });

    it("reverts transaction if wrong user attempts to withdraw", async () => {
      const depositAmount = ethers.parseEther("1.0");

      zettoWallet.connect(userOne).deposit({ value: depositAmount });

      await expect(zettoWallet.connect(userTwo).withdraw(depositAmount)).to.be.rejectedWith(
        "Insufficient balance."
      );
    });
  });
});
