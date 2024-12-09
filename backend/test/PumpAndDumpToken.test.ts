import { expect } from "chai";
import { ethers } from "hardhat";
import { PumpAndDumpToken } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("PumpAndDumpToken", () => {
  let token: PumpAndDumpToken;
  let owner: SignerWithAddress;
  let recipient: SignerWithAddress;
  let spender: SignerWithAddress;
  const INITIAL_SUPPLY = ethers.parseUnits("10000", 18);

  beforeEach(async () => {
    const [_owner, _recipient, _spender] = await ethers.getSigners();

    owner = _owner;
    recipient = _recipient;
    spender = _spender;

    const TokenContract = await ethers.getContractFactory("PumpAndDumpToken");
    token = await TokenContract.deploy(INITIAL_SUPPLY);
  });

  describe("Deployment", () => {
    it("should have the correct token info", async () => {
      expect(await token.name()).to.equal("PumpAndDump");
      expect(await token.symbol()).to.equal("PANDD");
      expect(await token.decimal()).to.equal("18");
    });

    it("should have minted the initial supply to the owner", async () => {
      const ownerBalance = await token.balances(owner.address);
      expect(ownerBalance).to.equal(INITIAL_SUPPLY);
      expect(await token.totalSupply()).to.equal(INITIAL_SUPPLY);
    });
  });

  describe("Transfer", () => {
    it("should transfer tokens successfully", async () => {
      const amount = ethers.parseUnits("1000", 18);

      await expect(token.transfer(recipient.address, amount))
        .to.emit(token, "Transfer")
        .withArgs(owner.address, recipient.address, amount);

      expect(await token.balances(recipient.address)).to.equal(amount);
      expect(await token.balances(owner.address)).to.equal(INITIAL_SUPPLY - amount);
    });

    it("should revert when insufficient balance", async () => {
      const excessiveAmount = ethers.parseUnits("15000", 18);

      await expect(token.transfer(recipient.address, excessiveAmount)).to.be.rejectedWith(
        "Insufficient balance"
      );
    });
  });

  describe("Approve and TransferFrom Spender", () => {
    it("should approve and allow transferFrom", async () => {
      const amount = ethers.parseUnits("50", 18);

      // approve
      await token.approve(spender.address, amount);

      expect(await token.allowances(owner.address, spender.address)).to.equal(amount);

      // transfer from owner to recipient as spender
      await expect(token.connect(spender).transferFrom(owner.address, recipient.address, amount))
        .to.emit(token, "Transfer")
        .withArgs(owner.address, recipient.address, amount);

      expect(await token.balances(owner.address)).to.equal(INITIAL_SUPPLY - amount);
      expect(await token.balances(recipient.address)).to.equal(amount);
    });

    it("should revert transferFrom with insufficient balance", async () => {
      const amount = ethers.parseUnits("1000", 18);

      await expect(
        token.connect(spender).transferFrom(owner.address, recipient.address, amount)
      ).to.be.rejectedWith("Allowance exceeded");
    });
  });

  describe("Mint", () => {
    it("should mint tokens to the owner", async () => {
      const amount = ethers.parseUnits("25000", 18);
      const initialBalance = await token.balances(owner.address);
      const initialTotalSupply = await token.totalSupply();

      await expect(token.mint(amount))
        .to.emit(token, "Mint")
        .withArgs(owner.address, amount)
        .and.to.emit(token, "Transfer")
        .withArgs(ethers.ZeroAddress, owner.address, amount);

      expect(await token.balances(owner.address)).to.equal(initialBalance + amount);
      expect(await token.totalSupply()).to.be.equal(initialTotalSupply + amount);
    });
  });

  describe("Burn", () => {
    it("should burn tokens from owner", async () => {
      const amount = ethers.parseUnits("500", 18);
      const initialBalance = await token.balances(owner.address);
      const initialTotalSupply = await token.totalSupply();

      await expect(token.burn(amount))
        .to.emit(token, "Burn")
        .withArgs(owner.address, amount)
        .and.to.emit(token, "Transfer")
        .withArgs(owner.address, ethers.ZeroAddress, amount);

      expect(await token.balances(owner.address)).to.equal(initialBalance - amount);
      expect(await token.totalSupply()).to.be.equal(initialTotalSupply - amount);
    });
  });
});
