var express = require('express');
var router = express.Router();
var fs = require("fs");
var multer = require("multer");
var History = require('../models/history');
var upload = multer({
    dest: '../uploads/'
 });

//upload file test data
router.post('/upload',upload.single('file'),function(req,res){
    fs.rename(req.file.path, "../uploads/data.txt", function(err) {
        if (err) {
            console.log(err);
            res.status(500).json({"error":true,"message":"Upload failure."});
        } else {
            res.redirect('/parsystem');
        }
    });
})

router.get('/getHistory',function(req,res){
    History.find({},{},{sort: { '_id': -1 }},function(err,result){
        if(err){
            res.status(404).render("error",{message: "Something went wrong in History database. ", redirect: ""});
        }else{
            res.status(200).json({data : result});
        }
    }).sort({ date: -1 }) 
})

router.post('/updateName',function(req,res){
    History.update({'_id': req.body.id}, {$set : {'name': req.body.name}},function(err,result){
        if(err){
            console.log(err);
            res.status(500).json({"error": true,"message": "Update failure"});
        }else{
            res.status(200).json({"error": false, "message": "Already updated"});
        }
    })
})

router.post('/save',function(req,res){
    var tempHistory = new History();
    if(req.body._id){
        tempHistory._id = req.body._id;
    }
    tempHistory.name = req.body.name;
    tempHistory.activitiesList= req.body.activitiesList.split(",");
    tempHistory.timestamp = req.body.timestamp.split(",");
    tempHistory.xAxis = req.body.xAxis.split(",");
    tempHistory.yAxis = req.body.yAxis.split(",");
    tempHistory.zAxis = req.body.zAxis.split(",");
    tempHistory.save(function(err){
        if(err){
            res.status(404).json({"error":true,"message":"Something went wrong in Node.js server. Please try again later.",redirect: "system"});
        }else{
            res.status(200).json({"error":false,"message":"save history successful!"});
        }
    })
})

router.post('/deleteHistory',function(req,res){
    History.remove({'_id': req.body.id},function(err){
        if(err){
            console.log(err);
            res.status(500).json({"error": true,"message": err});
        }else{
            res.status(200).json({"message": "Already deleted! "});
        }
    })
})

 module.exports = router;