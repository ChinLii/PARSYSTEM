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

router.post('/updateName',function(req,res){
    console.log(req.body.id);
    History.update({'_id': req.body.id}, {$set : {'name': req.body.name}},function(err,result){
        if(err){
            console.log(err);
            res.status(500).json({"error": true,"message": "Update failure"});
        }else{
            res.status(200).json({"error": false, "message": "Already updated"});
        }
    })
})

 module.exports = router;