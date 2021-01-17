# crowdfunding-ETH

A crowdfunding DApp based on Ethereum.

## Environment

- Node.js 14.15.4

## Request

To run the project, you need to install

- MetaMask
- Ganache


## Build

1. open Ganache and start a workspace with host ip and port 8545
2. Configure the `truffle-config.js` by adding

```javascript
development: {
	host: "127.0.0.1",
	port: 8545,
	network_id: "*",
}
```
3. Deploy a chain and modify the contract address in `src/eth/crowdfunding.js`

4. Run in terminal

```bash
npm install
yarn start
```

## Result

![avator](Image/all.png)
![avator](Image/create.png)
![avator](Image/cont.png)

Have fun!