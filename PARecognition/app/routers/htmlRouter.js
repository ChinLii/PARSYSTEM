var express = require('express');
var router = express.Router();
var request = require("request");
var History = require("../models/history");
var fs = require('fs');
var moment = require('moment');


//home page
router.get('/',function(req,res){
    res.render('index');
})
//contact page
router.get('/contact',function(req,res){
    res.render('contact');
})
//upload file page
router.get('/system',function(req,res){
    res.render('system');
})
//history page
router.get('/history',function(req,res){
    History.find({},{},{sort: { '_id': -1 }},function(err,result){
        if(err){
            res.status(404).render("error",{message: "Something went wrong in History database. ", redirect: ""});
        }else{
            res.render('history',{data : result});
        }
    }).sort({ date: -1 })
})

//create new analyse file
router.get('/parsystem',function(req,res){
    //check the file which have a right content or not 
    fs.readFile('/Users/kananekatichatviwat/Documents/PARSYSTEM/uploads/data.txt',"utf8", function read(err, data) {
        if (err) {
            res.status(404).render("error",{message : "The file cannot be opened. Please try again.",redirect: "system"})
        }
        content = data.split("\n");
        content = content[0];
        content = content.split(",");
        if (content.length === 6){ 
            //call get request from python algorithm
            request('http://localhost:8000/list/', function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var tempHistory = new History();
                    var result = JSON.parse(body);
                    var activitiesList = result["activitiesList"];
                    var timestamp = result["time"];
                    var xAxis = result["x-axis"];
                    var yAxis = result["y-axis"];
                    var zAxis = result["z-axis"];
                    tempHistory.name = moment().format('MMMM Do YYYY, h:mm:ss a');
                    tempHistory.activitiesList = activitiesList;
                    tempHistory.timestamp = timestamp;
                    tempHistory.xAxis = xAxis;
                    tempHistory.yAxis = yAxis;
                    tempHistory.zAxis = zAxis;
                    tempHistory.save(function(err){
                        if(err){
                            res.status(404).render("error",{message : "Something went wrong in Python server. Please try again later.",redirect: "system"});
                        }else{
                            res.status(200).render('parsystem',{'activitiesList':activitiesList, 'timestamp': timestamp, 'xAxis':xAxis,'yAxis':yAxis,'zAxis':zAxis})
                        }
                    })
                }
            })
            
        }else{
            res.status(404).render("error",{message : "The file is in the wrong format, please try to upload again",redirect: "system"});
        }
    });
})
//load the database 
router.get('/load/parsystem/:id',function(req,res){
    History.findOne({"_id":req.params.id},function(err,result){
        if(err){
            res.status(404).render("error",{message: "Something went wrong in History database. ", redirect: "history"})
        }else{
            var activitiesList = result.activitiesList;
            var timestamp = result.timestamp;
            var xAxis = result.xAxis;
            var yAxis = result.yAxis;
            var zAxis = result.zAxis;
            res.status(201).render("loadData",{'activitiesList':activitiesList, 'timestamp': timestamp, 'xAxis':xAxis,'yAxis':yAxis,'zAxis':zAxis,'name':result.name})
        }
    })
})


 module.exports = router;