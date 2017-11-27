var express = require('express');
var cors = require('cors');
var app = express();
app.use(cors());
var expressWs = require('express-ws')(app);
var clairvoyanceRouter = require('./expressRoutes/clairvoyanceRouter.js');
const keys = require('./pandaScoreKeys');
var ClientSocket = require('ws');
var port = 3000;
var wager = require('./contractRequests');


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

var currentMatch = null;
var pandaSocket = new ClientSocket('wss://live.test.pandascore.co/matches/28125?token=' + keys.token);
var takingMessages = true;

pandaSocket.onmessage = function(event) {

  if(takingMessages){ //make sure that it doesn't complicate things when writing to blockchain

    try{

      takingMessages = false;

      var tempData = JSON.parse(event.data);

      if(currentMatch == null){

        if(tempData.type != 'hello'){

          currentMatch = wager.requestNewWager(currentMatch);
          currentMatch.gameData = tempData;

        }

      } else {

        currentMatch.gameData = tempData;

        if(currentMatch.gameData.game.finished){

          currentMatch = wager.requestStopBetting(currentMatch);
          wager.canDistribute ? wager.requestDistributeMoney(currentMatch): wager.requestReturnMoney(currentMatch);

          currentMatch = {}; // reset game

        } else {

          currentMatch = wager.getUpdateMoneyPool(currentMatch);
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


