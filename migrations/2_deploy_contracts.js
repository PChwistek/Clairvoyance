var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var Wager = artifacts.require("./Wager.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(Wager);
};
