
var bodypaser = require("body-parser");
var express = require('express');
var cookieparser = require("cookie-parser");
var app = express();
var port = 3020;

app.use(bodypaser.urlencoded({extended: true}));
app.use(bodypaser.json());
app.use(cookieparser());

var routes = require('./routes/routes.js'); //importing route
routes(app); //register the route

app.listen(port);

console.log("Server started on port: " + port);