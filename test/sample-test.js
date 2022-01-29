const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Foo", function () {
  let foo;
  this.beforeAll("", async function () {
    const Foo = await ethers.getContractFactory("Foo");
    foo = await Foo.deploy();
    await foo.deployed();
  });
  it("First test", async function () {
    expect(await foo.getWETHAddress()).to.equal(
      "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    );
  });
});

// TODO give myself USDC
// TODO give mysef ETH
// TODO use router to swap USDC -> ETH
