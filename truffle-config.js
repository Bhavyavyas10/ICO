const HDWalletProvider = require("@truffle/hdwallet-provider");

const path = require("path");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      port: 8545,
    },
    kovan: {
      provider: function () {
        return new HDWalletProvider(
          `situate filter sausage wolf melt general swift almost pelican middle session wage`,
          `https://kovan.infura.io/v3/4e1930aa5d3746908f69149b0731416b`
        );
      },
      network_id: 42,
      networkCheckTimeout: 100000,
      gas: 6700000,
    },
    rinkeby: {
      provider: function () {
        return new HDWalletProvider(
          `session spare pride peasant feel father decade remove zone stock paper rhythm`,
          `https://rinkeby.infura.io/v3/4e1930aa5d3746908f69149b0731416b`
        );
      },
      network_id: 4,
      networkCheckTimeout: 100000,
      //gas: 6700000,
    },
  },
  compilers: {
    solc: {
      version: "^0.8.0",
      optimizer: {
        enabled: true,
        runs: 200, // Optimize for how many times you intend to run the code
      },
    },
  },
};
