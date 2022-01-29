//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./IUniswapV2Router02.sol";

contract Foo {
    IUniswapV2Router02 private constant router =  IUniswapV2Router02(0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D);

    constructor() {
        console.log("Hello from Foo constructor");
    }

    function getWETHAddress() public pure returns (address) {
        return router.WETH();
    }
}
