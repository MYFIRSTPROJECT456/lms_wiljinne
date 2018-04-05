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


    var Upload_Process={ 
  uploadmaster: function(col1,col2,col3,col4,callback){

    var coid = col1.coid;
    var userid = col1.enid;
    var leadid =col2;

    function getAllKpis(callback){
            console.log("Uploadid",leadid);
        var filewithdir = './Contents/'+filename;
       
	var Qry="UPDATE `tbl_leadupdate` SET fileurl=? WHERE leadid =?";
      db.query(Qry,[filewithdir,leadid],function(err, results){
            if (err){ 
              throw err;
            }
		else{
           var orders =JSON.parse(JSON.stringify(results));  // Scope is larger than function  
		}
		callback(err,orders);
    });
    }

    var Storage = multer.diskStorage({  
        destination: function(req, file, callback) {  
            callback(null, "./Contents");  
        },  
        filename: function(req, file, callback) {  
            filename = coid + "_" +userid + "_"+leadid + "_" + Date.now() + "_" + file.originalname;
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
        uploadid = req.body.leadid;

        filesize = req.headers['content-length'];
        console.log("upload filesize : ",leadid);
        getAllKpis();
        // res.render('uploadfile.ejs');
        // res.redirect('localhost/uploadfile.ejs');
    });
}
}

  module.exports = Upload_Process; 
