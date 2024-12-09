// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Dex {
  mapping(address => mapping(address => uint256)) public liquidityPools;

  function swap(address tokenIn, address tokenOut, uint256 amountIn) public {}
}