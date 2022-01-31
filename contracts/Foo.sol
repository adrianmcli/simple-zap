//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./interfaces/IUniswapV2Router02.sol";
import "./interfaces/IERC20.sol";

contract Foo {
    address private constant usdcAddress = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;
    address private constant wethAddress = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    address private constant UniV2RouterAddress = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    
    IUniswapV2Router02 private constant router =  IUniswapV2Router02(UniV2RouterAddress);

    function getWETHAddress() public pure returns (address) {
        return router.WETH();
    }

    function swapUSDCToEth(uint exactUsdcAmount, uint minEthAmount) public returns (uint) {
        // get USDC from user into this contract
        IERC20(usdcAddress).transferFrom(msg.sender, address(this), exactUsdcAmount);
        
        // allow UniswapV2 Router to spend this contract's USDC
        IERC20(usdcAddress).approve(UniV2RouterAddress, exactUsdcAmount);

        // build the path for swapping
        address[] memory path = new address[](2);
        path[0] = usdcAddress;
        path[1] = wethAddress;

        // execute swap using UniswapV2 Router
        uint deadline = uint(block.timestamp + 60);
        uint[] memory result = router.swapExactTokensForETH(exactUsdcAmount, minEthAmount, path, msg.sender, deadline);
        return result[0];
    }
}
