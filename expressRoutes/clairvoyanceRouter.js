var express = require('express');
var bodyParser = require('body-parser');
var axios = require('axios');
var keys = require('../pandaScoreKeys');


var clairvoyanceRouter = express.Router();

clairvoyanceRouter.use(bodyParser.json());


clairvoyanceRouter.use('/', function (req, res, next) {
	next();
});

clairvoyanceRouter.get('/', function (req, res, next) {
	res.end("Got to the clairvoyanceRouter");
});

clairvoyanceRouter.get('/live', (req, res) => {
	var currentEvents = [];
	axios.get('https://api.pandascore.co/lives?token=' + keys.token)
	  .then(response => {
	    var events = response.data;
	    for (var i = events.length - 1; i >= 0; i--) {
	    	if(events[i].event.is_active ==  true){
	    		currentEvents.push(events[i]);
	    	}
	    };
	  	res.json(currentEvents);
	  })
	  .catch(error => {
	    console.log(error);
	});
});

module.exports = clairvoyanceRouter;


