var express = require('express');
var cors = require('cors');
var app = express();
app.use(cors());
var expressWs = require('express-ws')(app);
var clairvoyanceRouter = require('./expressRoutes/clairvoyanceRouter.js');
const keys = require('./pandaScoreKeys');
var ClientSocket = require('ws');
var port = 3000;

//imports for connecting to contract, https://ethereum.stackexchange.com/questions/24684/truffle-and-node-js
var Web3              = require('web3'),
    contract          = require('truffle-contract'),
    path              = require('path')
    WagerContractJSON = require(path.join(__dirname, 'build/contracts/Wager.json'));

var provider = new Web3.providers.HttpProvider("http://localhost:9545");
var account_one = "0x627306090abab3a6e1400e9345bc60c78a8bef57"; //account that deploys contract in Truffle

var WagerContract = contract(WagerContractJSON);
WagerContract.setProvider(provider);

//====================== REST Routes ==============================//
app.use('/', clairvoyanceRouter); //for REST

app.use(function (req, res, next) {
  console.log('middleware');
  req.testing = 'testing';
  return next();
});
 
app.get('/', function(req, res, next){
  console.log('get route', req.testing);
  res.end();
});

//============================ Websocket begins ===============================

var currentMatch = {};
var pandaSocket = new ClientSocket('wss://live.test.pandascore.co/matches/28125?token=' + keys.token);
var takingMessages = true;
var wager;

pandaSocket.onmessage = function(event) {

  if(takingMessages){ //make sure that it doesn't complicate things when writing to blockchain

    try{

      takingMessages = false;

      var temp = JSON.parse(event.data);

      //currentMatch doesn't exist
      if(currentMatch.wagerEventId == null && temp.type != 'hello'){

        var tempMatch = {
          wagerEventId: 0,
          gameId: '28125',
          takingBets: false,
          moneyPoolFor: 0,
          moneyPoolAgainst: 0,
          gameData: temp
        };

        WagerContract.deployed().then(function(instance) {
          wager = instance;
          return wager.newWagerEvent(0, {from: account_one});
        }).then(function(result) {

          console.log("started taking bets");

          for (var i = 0; i < result.logs.length; i++) {
            var log = result.logs[i];

            if (log.event == "TakingBets") {
              console.log("The event id: " + log.args._wagerEventId.c[0]);
              tempMatch.wagerEventId = log.args._wagerEventId.c[0];
              tempMatch.takingBets = log.args._isBetting;
              break;
            }
          }

        }).catch(function (e){
          console.log(e);
        }) 

        currentMatch = tempMatch;

      } else {


        if (currentMatch.gameData.game.finished == true){

          var distribute = false;
          
          //stop from allowing bets
          wager.stopBetting(currentMatch.wagerEventId, {from: account_one}).then(function(result){
            console.log("ended taking bets");
            for (var i = 0; i < result.logs.length; i++) {
              var log = result.logs[i];

              if (log.event == 'Distributable') {
                currentMatch.takingBets = log.args._isBetting;
                distribute = log.args._enoughToDistribute;
              }
            }

          }).catch(function (e){
            console.log(e);
          }); 

          if(distribute){

            var redWinner = false; //should be taken from gameData, but the test API call doesn't have it

            wager.distributeMoney(currentMatch.wagerEventId, redWinner, {from: account_one}).then(function(result){
              console.log("distributed winnings");
            }).catch(function (e){
              console.log(e);
            }); 

          } else {

            wager.returnMoney(currentMatch.wagerEventId, {from: account_one}).then(function(result){
              console.log("returned bets");
            }).catch(function (e){
              console.log(e);
            }); 

            currentMatch = {}; //reset currentMatch
          } 

        } else {

          //update the bettings items
          wager.getMoneyPoolAgainst.call(currentMatch.wagerEventId, {from: account_one}).then(function(result){
            console.log("Money pool against red win: " + result.toNumber());
            currentMatch.moneyPoolAgainst = result.toNumber();
          }).catch(function (e){
            console.log(e);
          }); 

          wager.getMoneyPoolFor.call(currentMatch.wagerEventId, {from: account_one}).then(function(result){
            console.log("Money pool for red win: " + result.toNumber());
            currentMatch.moneyPoolFor = result.toNumber();
          }).catch(function (e){
            console.log(e);
          }); 

        }
      }

    } catch(error) {
      //console.log(error);
    }

    takingMessages = true;
  }

}
 
//=================== Websocket routes =======================/

app.ws('/:match_id', function(ws, req) {

  ws.on('open', function open() {
    console.log('connected');
  });

  ws.on('close', function close() {
    console.log('disconnected');
  });

  ws.on('message', function(msg) {
    setInterval(function() {
      ws.send(JSON.stringify(currentMatch));
    }, 10000);
  }).catch(function (e){
    console.log(e);
  });

});
 
app.listen(port, function(){
  console.log("Server listening at: " +  port);
});


