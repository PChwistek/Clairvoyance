var express = require('express');
var cors = require('cors');
var app = express();
app.use(cors());
var expressWs = require('express-ws')(app);
var clairvoyanceRouter = require('./expressRoutes/clairvoyanceRouter.js');
const keys = require('./pandaScoreKeys');
var ClientSocket = require('ws');
var port = 4040;

//imports for connecting to contract, https://ethereum.stackexchange.com/questions/24684/truffle-and-node-js
var Web3              = require('web3'),
    contract          = require('truffle-contract'),
    path              = require('path')
    WagerContractJSON = require(path.join(__dirname, 'build/contracts/Wager.json'));

var provider = new Web3.providers.HttpProvider("http://localhost:9545");
var account_one = "0x627306090abab3a6e1400e9345bc60c78a8bef57";

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

  if(takingMessages){ //make sure that it doesn't run over a Smart Contract event that is taking some time

    try{

      takingMessages = false;

      var temp = JSON.parse(event.data);
      //currentMatch doesn't exist
      if(currentMatch.id == null && temp.type != 'hello'){

        var tempMatch = {
          id: '28125',
          isOngoing: !temp.game.finished,
          wagerEventId: 0,
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
              // We found the event!
              break;
            }
          }
          console.log(log);
        }).catch(function(e) {
          console.log(e);
        }) 

        currentMatch = tempMatch;

      } else {

        currentMatch.isOngoing = !temp.game.finished;

        currentMatch.isOngoing = false;
       // console.log(currentMatch.isOngoing);

        if (currentMatch.isOngoing == false){
          
          wager.stopBetting(0, {from: account_one}).then(function(result){
            console.log("ended taking bets");
          }, function(error){
            console.log(error);
          }); 

          currentMatch = {};
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

  ws.on('message', function(msg) {
    console.log(msg);
  });
  console.log('socket', req.testing);

});
 
app.listen(port, function(){
  console.log("Server listening at: " +  port);
});


