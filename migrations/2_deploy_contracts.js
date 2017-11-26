var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var Wager = artifacts.require("./Wager.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(Wager, {gas: 3000000}); //for some reason TRPC is acting up 
};
