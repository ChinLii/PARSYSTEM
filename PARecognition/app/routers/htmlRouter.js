var express = require('express');
var router = express.Router();
var zerorpc = require("zerorpc");
var multer = require('multer');
var fs = require("fs");
var request = require("request");

var upload = multer({
   dest: '../uploads/'
});

router.get('/',function(req,res){
    res.render('index');
})

router.get('/contact',function(req,res){
    res.render('contact');
})

router.get('/system',function(req,res){
    res.render('system');
})

router.get('/parsystem',function(req,res){
    res.render('parsystem');
})

router.post('/upload',upload.single('file'),function(req,res){
    var file = __dirname + '/' + req.file.filename;
    fs.rename(req.file.path, "../uploads/data.txt", function(err) {
        if (err) {
          console.log(err);
          res.json({"error":true,"message":"Upload failure."});
        } else {
            res.redirect('/parsystem');
        }
      });
})

 module.exports = router;