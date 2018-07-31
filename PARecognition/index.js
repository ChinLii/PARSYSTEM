var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var morgan = require('morgan');
var path = require('path');


//Configuration part 
var app = new express();
var port = 3000 || process.env.PORT;

//import router part 
var htmlRouter = require('./app/routers/htmlRouter');

//encoding part 
app.use(bodyParser()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//set view part 
app.use(morgan('dev'));
app.use('/',htmlRouter);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.listen(port);
console.log("The magic happens on port "+ port);