var express = require('express'); //for the express server
var morgan = require('morgan'); //to log middleware
var cors = require('cors'); //to prevent weird localhost issues

var hostname = "localhost";
var port = 3001; 

var app = express();
app.use(morgan('dev'));
app.use(cors());


//probably will need some router here that will be our oracle

app.use(express.static('public'));

app.listen(port, hostname, function(){
  console.log(`Server running at http://${hostname}:${port}/`);
});


