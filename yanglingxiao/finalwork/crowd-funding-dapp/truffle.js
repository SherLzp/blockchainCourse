module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "localhost",
      port: 7545,
      network_id: "*", // Match any network id
      gas: 6300000
    }
  },
  compilers: {
    solc: {
      version: "0.4.24",
      docker: false,
      settings: {
        optimizer: {
          enabled: false,
          runs: 20
        },
        evmVersion: "byzantium"
      }
    }
  }
};
