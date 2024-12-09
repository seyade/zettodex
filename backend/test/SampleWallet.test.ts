import { expect } from "chai";
import { ethers } from "hardhat";
import { SampleWallet } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("SampleWallet", () => {
  let sampleWallet: SampleWallet;
  let userOne: SignerWithAddress;
  let userTwo: SignerWithAddress;

  beforeEach(async () => {
    [userOne, userTwo] = await ethers.getSigners();

    const SampleWalletFactory = await ethers.getContractFactory("SampleWallet");

    sampleWallet = await SampleWalletFactory.deploy();

    await sampleWallet.waitForDeployment();
  });

  describe("Deposit", () => {
    it("allows deposit of funds for User #1", async () => {
      const fundAmount = ethers.parseEther("0.1");

      await userOne.sendTransaction({
        to: await sampleWallet.getAddress(),
        value: fundAmount,
      });

      const balance = await ethers.provider.getBalance(await sampleWallet.getAddress());
      expect(balance).to.equal(fundAmount);
    });

    it("allows deposit of funds for User #2", async () => {
      const fundAmount = ethers.parseEther("0.1");

      await userTwo.sendTransaction({
        to: await sampleWallet.getAddress(),
        value: fundAmount,
      });

      const balance = await ethers.provider.getBalance(await sampleWallet.getAddress());
      expect(balance).to.equal(fundAmount);
    });
  });

  describe("Withdrawal", () => {
    it("allows withdrawal of funds for User #1", async () => {
      const depositAmount = ethers.parseEther("2.0");

      await sampleWallet.connect(userOne).deposit({ value: depositAmount });

      const initialContractBalance = await ethers.provider.getBalance(
        await sampleWallet.getAddress()
      );

      const initialUserBalance = await ethers.provider.getBalance(userOne.address);

      const withdrawal = await sampleWallet.connect(userOne).withdraw(depositAmount);

      const receipt = await withdrawal.wait();

      const gasUsed = receipt?.gasUsed || 0n;
      const gasPrice = receipt?.gasPrice || 0n;
      const gasCost = gasUsed * gasPrice;

      const finalContractBalance = await ethers.provider.getBalance(
        await sampleWallet.getAddress()
      );

      const finalUserBalance = await ethers.provider.getBalance(userOne.address);

      expect(finalContractBalance).to.equal(initialContractBalance - depositAmount);

      expect(finalUserBalance).to.be.closeTo(
        initialUserBalance + depositAmount - gasCost,
        ethers.parseEther("0.001")
      );
    });

    it("allows withdrawal of funds for User #2", async () => {
      const depositAmount = ethers.parseEther("2.0");

      await sampleWallet.connect(userTwo).deposit({ value: depositAmount });

      const initialContractBalance = await ethers.provider.getBalance(
        await sampleWallet.getAddress()
      );

      const initialUserBalance = await ethers.provider.getBalance(userTwo.address);

      const withdrawal = await sampleWallet.connect(userTwo).withdraw(depositAmount);

      const receipt = await withdrawal.wait();

      const gasUsed = receipt?.gasUsed || 0n;
      const gasPrice = receipt?.gasPrice || 0n;
      const gasCost = gasUsed * gasPrice;

      const finalContractBalance = await ethers.provider.getBalance(
        await sampleWallet.getAddress()
      );

      const finalUserBalance = await ethers.provider.getBalance(userTwo.address);

      expect(finalContractBalance).to.equal(initialContractBalance - depositAmount);

      expect(finalUserBalance).to.be.closeTo(
        initialUserBalance + depositAmount - gasCost,
        ethers.parseEther("0.001")
      );
    });

    it("reverts transaction if wrong user attempts to withdraw", async () => {
      const depositAmount = ethers.parseEther("1.0");

      sampleWallet.connect(userOne).deposit({ value: depositAmount });

      await expect(sampleWallet.connect(userTwo).withdraw(depositAmount)).to.be.rejectedWith(
        "Insufficient balance."
      );
    });
  });
});
