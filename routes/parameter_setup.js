var utils = require('./utils.js');
var async = require('async');
var scrno="572";

exports.list = function(req, res){
var txn=req.session.ecryt_key;
var coid = req.session.coid;

function getAllKpis(callback){
    async.parallel([
          get_params
   ], function(err, done) {
        if(err) console.log(err);
        return callback(err,done);
  });
}

function get_params(callback){
var getcustomers = " SELECT (SELECT codename from tbl_codemaster WHERE tbl_codemaster.code=tbl_codevalue.cvmasterid) as type,cvvalule FROM `tbl_codevalue` ";

      db.query(getcustomers, function(err, results){
            if (err){ 
              throw err;
            }
  else{
           var customers =JSON.parse(JSON.stringify(results));  // Scope is larger than function  
  }
  return callback(err,customers);
    });
};

getAllKpis(function(err,result){

if(err){
throw err;
}/*
console.log("Parameter result: ",result);*/
    res.render('parameter_setup.ejs',{params:result[0]});  
/* res.render('parameter_setup',{fields:done[0],groups:done[1]}); */  
});
}

exports.save = function(req, res){
    var tuser=JSON.parse(req.body.formdata);
    console.log("From paramter",tuser);
      var param_type=tuser[0].param_type;
      var param_name=tuser[0].param_name;
      var param_parent=tuser[0].param_parent;

  var sql1="INSERT INTO `tbl_codevalue` (`cvmasterid`, `cvvalule`, `parentid`) VALUES (?,?,?)";

  db.query(sql1,[param_type,param_name,param_parent] ,function(err, results){      
    if(results !=null && results.affectedRows>0){
            res.send({status:'1'});   
    }else{
            res.send({status:'0'});  
    }              
      });
       
};
