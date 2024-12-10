// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ZettoDex {
  IERC20 public token1;
  IERC20 public token2;

  mapping(address => uint256) public liquidityProvided;

  uint256 public totalLiquidity;
  uint256 public reserve1;
  uint256 public reserve2;

  event LiquidityAdded(address indexed provider, uint256 amount);
  event LiquidityRemoved(address indexed provider, uint256 amount);
  event TokenSwapped(address indexed trader, uint256 amountIn, uint256 amountOut);

  constructor(address _token1, address _token2) {
    require(_token1 != address(0) && _token2 != address(0), "Invalid token address");
    require(_token1 != _token2, "Tokens must be different");

    token1 = IERC20(_token1);
    token2 = IERC20(_token2);
  }

  function addLiquidity(uint256 amount1, uint256 amount2) external {
    require(amount1 > 0 && amount2 > 0, "Amounts must be more than 0");
    require(token1.transferFrom(msg.sender, address(this), amount1), "Token 1 transfer failed");
    require(token2.transferFrom(msg.sender, address(this), amount2), "Token 1 transfer failed");

    uint256 liquidity;

    if (totalLiquidity == 0) {
      liquidity += amount1;
    } else {
      liquidity = (amount1 * totalLiquidity) / reserve1;
    }

    // update reserves and liquidity
    liquidityProvided[msg.sender] += liquidity;
    totalLiquidity += liquidity;
    reserve1 += amount1;
    reserve2 += amount2;

    emit LiquidityAdded(msg.sender, liquidity);
  }
}
