var express = require('express');
var bodyParser = require('body-parser');
var axios = require('axios');
var keys = require('../pandaScoreKeys');


var clairvoyanceRouter = express.Router();

var apiToken = keys.token;


clairvoyanceRouter.use(bodyParser.json());

clairvoyanceRouter.get('/', (req, res) => {
	res.writeHead(200, { 'Content-Type': 'text/plain' });
	res.end("Got to the clairvoyanceRouter");
});

/*
clairvoyanceRouter.route("/")
.all({
	axios.get('https://api.pandascore.co/lives?token=' + apiToken)
	  .then(response => {
	    console.log(response.data);
	  })
	  .catch(error => {
	    console.log(error);
	}); 
}); */


module.exports = clairvoyanceRouter;


