const { expect } = require("chai");
const { ethers } = require("hardhat");
const FiatTokenV2ABI = require("./ABIs/FiatTokenV2.json");

describe("Foo", function () {
  let foo;
  this.beforeAll("", async function () {
    // setup Foo contract
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

    // assertions
    const after = await usdc.balanceOf(userAddress);
    expect(after.sub(before)).to.equal(amount);
  });

  it("Can swap USDC -> ETH", async function () {
    const { provider, utils } = ethers;
    const user = await provider.getSigner(0);
    const userAddress = await user.getAddress();

    // setup contract
    const usdcAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"; // USDC
    const usdc = new ethers.Contract(usdcAddress, FiatTokenV2ABI, user);

    const amount = utils.parseUnits("1000", 6);

    // approval for contract to spend my USDC
    await usdc.approve(foo.address, amount);

    // record balances before swap
    const usdcBefore = await usdc.balanceOf(userAddress);
    const ethBefore = await provider.getBalance(userAddress);

    // execute swap
    await foo.connect(user).swapUSDCToEth(amount, ethers.constants.Zero);

    // record balances after swap
    const usdcAfter = await usdc.balanceOf(userAddress);
    const ethAfter = await provider.getBalance(userAddress);

    // assertions
    const usdcLost = utils.formatUnits(usdcBefore.sub(usdcAfter), 6);
    const ethGained = utils.formatEther(ethAfter.sub(ethBefore));
    expect(usdcLost).to.equal("1000.0");
    expect(ethGained).to.equal("0.382814971421528175");
  });
});
