// SPDX-License-Identifier: none
pragma solidity ^0.8.27;

contract ZettoWallet {
  mapping(address => uint256) private balances;

  event Deposit(address indexed user, uint256 amount);
  event Withdrawal(address indexed user, uint256 amount);

  receive() external payable {}

  function deposit() public payable {
    uint256 depositAmount = msg.value;
    require(depositAmount > 0, "Please deposit some ETH.");
    balances[msg.sender] += depositAmount;
    emit Deposit(msg.sender, depositAmount);
  }

  function withdraw(uint256 amount) public payable {
    uint256 userBalance = balances[msg.sender];
    require(amount > 0, "Amount must be more than 0.");
    require(userBalance >= amount, "Insufficient balance.");

    balances[msg.sender] = userBalance - amount;

    (bool success, ) = msg.sender.call{value: amount}("");
    require(success, "Transafer failed");
    emit Withdrawal(msg.sender, amount);
  }

  function getBalance() public view returns (uint256) {
    return balances[msg.sender];
  }

  function getWalletBalance() public view returns (uint256) {
    return address(this).balance;
  }
}
