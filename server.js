var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);
const cors = require('cors');
var clairvoyanceRouter = require('./expressRoutes/clairvoyanceRouter.js');
const keys = require('./pandaScoreKeys');
var ClientSocket = require('ws');

app.use('/', clairvoyanceRouter); //for REST
app.use(cors());

app.use(function (req, res, next) {
  console.log('middleware');
  req.testing = 'testing';
  return next();
});
 
app.get('/', function(req, res, next){
  console.log('get route', req.testing);
  res.end();
});
 
//=================== Websocket begins =======================/

app.ws('/:match_id', function(ws, req) {
  ws.on('message', function(msg) {
    console.log(msg);
  });
  console.log('socket', req.testing);

  var pandaSocket;
  if(req.params.match_id == 'test'){
	pandaSocket = new ClientSocket('wss://live.test.pandascore.co/matches/28125?token=' + keys.token);
  } else {
	pandaSocket = new ClientSocket("wss://live.pandascore.co/matches/" + req.params.match_id + "?token=" + keys.token);
  }

  pandaSocket.onmessage = function(event) {
	ws.send(event.data);
  }
	
});
 
app.listen(3000);


