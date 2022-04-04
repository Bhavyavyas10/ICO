var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var ERC = artifacts.require("./TestToken.sol");
var ICO = artifacts.require("./ICO.sol")

module.exports = function (deployer) {
  deployer.deploy(SimpleStorage,5);
  deployer.deploy(ERC,"Demo","TT",1000000,"0xe5a15B3446d830b726fEBaCF4B72614f0D9a1F62");
  deployer.deploy(ICO);
};
