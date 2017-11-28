var Wager = artifacts.require("./Wager.sol");

module.exports = function(deployer) {
  deployer.deploy(Wager, {gas: 3000000}); //for some reason TRPC is acting up 
};
