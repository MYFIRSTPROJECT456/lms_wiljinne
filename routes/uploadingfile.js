var utils = require('./utils.js');
var async = require('async');
var fs = require("fs");
var multer = require('multer'); 
var express = require('express');
var bodyParser=require("body-parser");
var app = express();
var readline = require('readline'); 
var csv = require("csvtojson");
    
    var filename;
    var filesize;
    var extesion;
    var filedata = [];
exports.upload = function(req, res){

    var coid = req.session.coid;
    var userid = req.session.user.enid;
    
    var uploadid ;

    function getAllKpis(callback){
            console.log("Uploadid",uploadid);
        var filewithdir = './Contents/'+filename;
        async.parallel([
            async.apply(utils.insert_staging,uploadid,uploadid,filewithdir,filesize)
        ], function(err, done) {
            if(err) console.log(err);
            res.redirect('/uploadfile');
        });
    }

    var Storage = multer.diskStorage({  
        destination: function(req, file, callback) {  
            callback(null, "./Contents");  
        },  
        filename: function(req, file, callback) {  
            filename = coid + "_" +userid + "_" + Date.now() + "_" + file.originalname;
            var i = filename.lastIndexOf('.');
            extesion = (i < 0) ? '' : filename.substr(i);
            console.log(extesion);

            callback(null, filename);  
        }  
    });  

    var upload = multer({ storage: Storage }).array("imgUploader", 3); //Field name and max count 
    upload(req, res, function (err) {
        if (err) {
            return res.end("Something went wrong!");
        }
        uploadid = req.body.uploadid;

        filesize = req.headers['content-length'];
        console.log("upload filesize : ",uploadid);
        getAllKpis();
        // res.render('uploadfile.ejs');
        // res.redirect('localhost/uploadfile.ejs');
    });
}
