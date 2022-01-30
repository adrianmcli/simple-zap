const { expect } = require("chai");
const { ethers } = require("hardhat");
const FiatTokenV2ABI = require("./ABIs/FiatTokenV2.json");

describe("Foo", function () {
  let foo;
  this.beforeAll("", async function () {
    const Foo = await ethers.getContractFactory("Foo");
    foo = await Foo.deploy();
    await foo.deployed();
  });

  it("Can get WETH address from UniswapV2 Router", async function () {
    expect(await foo.getWETHAddress()).to.equal(
      "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    );
  });

  it("Can mint ourselves 1000 USDC", async function () {
    const { provider } = ethers;
    const user = await provider.getSigner(0);
    const userAddress = await user.getAddress();

    // impersonate the USDC contract owner
    const ownerAddress = "0xFcb19e6a322b27c06842A71e8c725399f049AE3a";
    await provider.send("hardhat_impersonateAccount", [ownerAddress]);
    const owner = await ethers.getSigner(ownerAddress);

    // setup contract
    const usdcAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"; // USDC
    const usdc = new ethers.Contract(usdcAddress, FiatTokenV2ABI, owner);

    const before = await usdc.balanceOf(userAddress);

    // make ourselves the master minter and mint ourselves some USDC
    await usdc.updateMasterMinter(userAddress);
    const amount = ethers.utils.parseUnits("1000", 6);
    await usdc.connect(user).configureMinter(userAddress, amount);
    await usdc.connect(user).mint(userAddress, amount);

    const after = await usdc.balanceOf(userAddress);
    expect(after.sub(before)).to.equal(amount);
  });
});

// TODO give mysef ETH
// TODO use router to swap USDC -> ETH
