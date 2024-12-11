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
    require(token2.transferFrom(msg.sender, address(this), amount2), "Token 2 transfer failed");

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

  function removeLiquidity(uint256 liquidity) external {
    require(
      liquidity > 0 && liquidity <= liquidityProvided[msg.sender],
      "Invalid liquidity amount"
    );

    // calculate token amount to return
    uint256 amount1 = (liquidity * reserve1) / totalLiquidity;
    uint256 amount2 = (liquidity * reserve2) / totalLiquidity;

    // update reserves and liquidity
    liquidityProvided[msg.sender] -= liquidity;
    totalLiquidity -= liquidity;
    reserve1 -= amount1;
    reserve2 -= amount2;

    require(token1.transfer(msg.sender, amount1), "Token 1 transfer failed");
    require(token2.transfer(msg.sender, amount2), "Token 2 transfer failed");

    emit LiquidityRemoved(msg.sender, liquidity);
  }

  function swapTokens(IERC20 fromToken, IERC20 toToken, uint256 amountIn) external {
    require(amountIn > 0, "Insufficient amount input");
    require(
      (fromToken == token1 && toToken == token2) || (fromToken == token1 && toToken == token2),
      "Invalid token pair"
    );
    require(
      fromToken.transferFrom(msg.sender, address(this), amountIn),
      "Input token transfer failed"
    );

    uint256 amountOut;

    if (fromToken == token1) {
      // swap token1 for token2
      amountOut = (amountIn * reserve2) / reserve1;
      reserve1 += amountIn;
      reserve2 -= amountOut;
    } else {
      // swap token2 for token1
      amountOut = (amountIn * reserve1) / reserve2;
      reserve2 += amountIn;
      reserve1 -= amountOut;
    }

    require(toToken.transfer(msg.sender, amountOut), "Output token transfer failed");

    emit TokenSwapped(msg.sender, amountIn, amountOut);
  }
}
