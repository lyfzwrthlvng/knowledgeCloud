var express = require('express');
var app = express.createServer();

app.get('/', function (req, res) {
   
});

app.configure

app.use(function(req, res, next) {
    res.status(404).send("Sorry, that route doesn't exist. Have a nice day :)");
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000.');
});

