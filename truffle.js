const HDWalletProvider = require("truffle-hdwallet-provider");

const mnemonic = "rookie hungry unhappy leave rich town december option note hollow seven draft";

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      gas: 4700000,
      gasPrice: 10000000000, // 10 gwei
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    kovan: {
      gas: 4700000,
      gasPrice: 10000000000, // 10 gwei
      provider: new HDWalletProvider(mnemonic, "https://kovan.infura.io"),
      network_id: "42"
    },
    ropsten: {
      gas: 4700000,
      gasPrice: 10000000000, // 10 gwei
      provider: new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/06af9f3e62cf41d3a458c346b7dca44c"),
      network_id: "3"
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
};
