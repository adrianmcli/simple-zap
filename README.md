# Simple Zap Example

This project demonstrates a basic Hardhat project interacting with an external contract.

Its abilities are demonstrated in the `test/sample-test.js` file:

1. You can grab information from an external contract (e.g. WETH address).
2. You can mint yourself USDC tokens for testing.
3. You can make a swap on UniswapV2 on behalf of the user.

Try running the test (it is pinned to a block number and therefore should be deterministic):

```shell
yarn test
```

# Environment Variables

Create a `.env` file at the project root with the following:

```
RPC_URL=https://eth-mainnet.alchemyapi.io/v2/<alchemy_api_key>
```
