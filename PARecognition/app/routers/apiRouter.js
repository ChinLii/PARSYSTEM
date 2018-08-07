var express = require('express');
var router = express.Router();
var fs = require("fs");
var multer = require("multer");
var upload = multer({
    dest: '../uploads/'
 });

//upload file test data
router.post('/upload',upload.single('file'),function(req,res){
    fs.rename(req.file.path, "../uploads/data.txt", function(err) {
        if (err) {
            console.log(err);
            res.status(200).json({"error":true,"message":"Upload failure."});
        } else {
            res.redirect('/parsystem');
        }
    });
})

 module.exports = router;