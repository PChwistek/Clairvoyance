/*eslint-disable no-console*/
/*eslint-disable no-undef*/
/*eslint-disable no-unused-vars*/

//imports for connecting to contract, https://ethereum.stackexchange.com/questions/24684/truffle-and-node-js
var Web3 = require('web3'),
  contract = require('truffle-contract'),
  path = require('path'),
  WagerContractJSON = require(path.join(__dirname, 'build/contracts/Wager.json'));

var provider = new Web3.providers.HttpProvider('http://localhost:9545');
var account_one = '0x627306090abab3a6e1400e9345bc60c78a8bef57'; //account that deploys contract in Truffle

var WagerContract = contract(WagerContractJSON);
WagerContract.setProvider(provider);

var wager = {

  wagerInstance: {},

  canDistribute: false,

  requestNewWager: function(){

    var tempMatch = {
      wagerEventId: 0,
      gameId: '28125',
      takingBets: false,
      moneyPoolFor: 0,
      moneyPoolAgainst: 0,
      canDistribute: false
    };

    WagerContract.deployed()
    .then(function(instance) {
      this.wagerInstance = instance;
      return this.wagerInstance.newWagerEvent(0, {from: account_one});
    }).then(function(result) {
      console.log('started taking bets');
      for (var i = 0; i < result.logs.length; i++) {
        var log = result.logs[i];
        if (log.event == 'TakingBets') {
          console.log('The event id: ' + log.args._wagerEventId.c[0]);
          tempMatch.wagerEventId = log.args._wagerEventId.c[0];
          tempMatch.takingBets = log.args._isBetting;
          break;
        }
      }
    }).catch(function (e){
      console.log(e);
    }); 

    return tempMatch;
  },

  requestStopBetting: function(tempMatch){

    wagerInstance.stopBetting(tempMatch.wagerEventId, {from: account_one})
    .then(function(result) {
      console.log('stopped taking bets');
    }).catch(function (e){
      console.log(e);
    }); 

  },

  requestDistributeMoney: function(tempMatch){

    var redWinner = false; //should be taken from gameData, but the test API call doesn't have it
    wagerInstance.distributeMoney(tempMatch.wagerEventId, redWinner, {from: account_one})
    .then(function(result) {
      console.log('distributed winnings');
    }).catch(function (e){
      console.log(e);
    }); 

  },

  requestReturnMoney: function(tempMatch){

    wagerInstance.returnMoney(tempMatch.wagerEventId, {from: account_one})
    .then(function(result) {
      console.log('returned bets');
    }).catch(function (e){
      console.log(e);
    }); 
 
  },

  getUpdateMoneyPool: function(tempMatch){

    wagerInstance.getMoneyPoolAgainst.call(tempMatch.wagerEventId, {from: account_one})
    .then(function(result) {
      console.log('Money pool for blue win: ' + result.toNumber());
      tempMatch.moneyPoolAgainst = result.toNumber();
    }).catch(function (e){
      console.log(e);
    }); 

    wagerInstance.getMoneyPoolFor.call(tempMatch.wagerEventId, {from: account_one})
    .then(function(result) {
      console.log('Money pool for red win: ' + result.toNumber());
      tempMatch.moneyPoolFor = result.toNumber();
    }).catch(function (e){
      console.log(e);
    }); 

    return tempMatch;
  }
};

module.exports = wager;



