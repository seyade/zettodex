// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract PumpAndDumpToken {
  string public name = "PumpAndDump";
  string public symbol = "PANDD";
  uint256 public decimal = 18;
  uint256 public totalSupply;

  mapping(address => uint256) public balances;
  mapping(address => mapping(address => uint256)) public allowances;

  event Transfer(address indexed from, address indexed to, uint256 value);
  event Approval(address indexed owner, address indexed spender, uint256 value);
  event Mint(address indexed to, uint256 value);
  event Burn(address indexed from, uint256 value);

  constructor(uint256 initialSupply) {
    _mint(msg.sender, initialSupply);
  }

  function transfer(address to, uint256 amount) public returns (bool) {
    require(balances[msg.sender] > amount, "Insufficient balance");
    _transfer(msg.sender, to, amount);
    return true;
  }

  function approve(address spender, uint216 amount) public returns (bool) {
    allowances[msg.sender][spender] = amount;
    emit Approval(msg.sender, spender, amount);
    return true;
  }

  function transferFrom(address from, address to, uint256 amount) public returns (bool) {
    require(balances[from] >= amount, "Insufficient balance");
    require(allowances[from][msg.sender] >= amount, "Allowance exceeded");

    allowances[from][msg.sender] -= amount;
    _transfer(from, to, amount);

    return true;
  }

  function mint(uint256 amount) public {
    _mint(msg.sender, amount);
  }

  function burn(uint256 amount) public {
    require(balances[msg.sender] > amount, "Insufficient balance to burn");
    _burn(msg.sender, amount);
  }

  function _transfer(address from, address to, uint256 amount) private {
    require(to != address(0), "Invalid address");
    balances[from] -= amount;
    balances[to] += amount;
    emit Transfer(from, to, amount);
  }

  function _mint(address to, uint256 amount) private {
    require(to != address(0), "Invalid address");
    totalSupply += amount;
    balances[to] += amount;
    emit Mint(to, amount);
    emit Transfer(address(0), to, amount);
  }

  function _burn(address from, uint256 amount) private {
    balances[from] -= amount;
    totalSupply -= amount;
    emit Burn(from, amount);
    emit Transfer(from, address(0), amount);
  }
}
