var express = require('express'); //for the express server
var morgan = require('morgan'); //to log middleware
var cors = require('cors'); //to prevent weird localhost issues
var axios = require('axios');
var keys = require('./pandaScoreKeys');

var clairvoyanceRouter = require('./expressRoutes/clairvoyanceRouter.js');

var apiToken = keys.token;
var hostname = "localhost";
var port = 3001; 

var app = express();
app.use(morgan('dev'));
app.use(cors());

app.use('/matches', clairvoyanceRouter);

app.use(express.static('public'));

app.listen(port, hostname, function(){
  console.log(`Server running at http://${hostname}:${port}/`);
  	axios.get('https://api.pandascore.co/lives?token=' + apiToken)
	  .then(response => {
	    console.log(response.data);
	  })
	  .catch(error => {
	    console.log(error);
	});
});


