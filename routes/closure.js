var async = require('async');

exports.approve = function(req, res){
var scrid=req.body.scrid;
var lid=req.body.lid;
var tuser=JSON.parse(req.body.formdata);

console.log("inside update task lid"+lid);

function updatedata(callback){
var sql1="UPDATE `tbl_sanctions` SET sanctionremarks=?,tat=?,sanctionstatus='1',txndate=? WHERE txnrefno=?"
   var params = [];
        var parsed = tuser;
                for(var x in parsed[0]){
                params.push(parsed[0][x]);
        }
        params.push(lid);
        params.shift();
          db.query(sql1,params,function(err, results){  
            return callback(err,results);            
      });
}

function savedata(callback){
var sql1="INSERT INTO `tbl_task` (`name`,`taskdesc`,`duedate`,`taskstatus`,`assignto`,`userid`, `txn_latid`, `txn_longid`) VALUES (?,?,?,?,(select enid from tbl_login WHERE roleid=60),?,?,?)";
   var params = [];
        params.push(tuser[0].leadname +"-"+tuser[0].products+"-Order Verification");
        params.push("Please confirm the scope of the work with Customer");
        params.push(tuser[0].duedate);
        params.push("3");
        params.push(req.session.user.enid);
        params.push(parseFloat(0.0));
        params.push(parseFloat(0.0));

  db.query(sql1,params,function(err, results){  
           return callback(err,results);   
      });
}

async.parallel([
        updatedata,
         savedata
    ], function(err, result) {
        console.log("Result from closure accept",result);
        if(err) console.log(err);  
    if(result !=null && result[0].affectedRows>0 && result[1].affectedRows>0){
            res.send({status:'1'});   
    }else{
            res.send({status:'0'});  
    } 
  });
/*  res.send({status:'0'}); */  
};

exports.reject = function(req, res){
var scrid=req.body.scrid;
var lid=req.body.lid;
var tuser=JSON.parse(req.body.formdata);

console.log("inside update task");

function updatedata(callback){
var sql1="UPDATE `tbl_leadupdate` SET leadstatus ='35' WHERE leadid =?"
   var params = [];
        params.push(lid);
  db.query(sql1,params,function(err, results){  
return callback(err,results);            
      });
}

function savedata(callback){
var sql1="UPDATE `tbl_sanctions` SET sanctionremarks=?,tat=?,sanctionstatus='-1',txndate=? WHERE txnrefno=?";
   var params = [];
        var parsed = tuser;
                for(var x in parsed[0]){
                params.push(parsed[0][x]);
        }
        params.push(lid);
  db.query(sql1,params,function(err, results){  
           return callback(err,results);   
      });
}

async.parallel([
        updatedata,
         savedata
    ], function(err, result) {
        if(err) console.log(err);  
        console.log("Result from closure reject",result);
    if(result !=null && result[0].affectedRows>0 && result[1].affectedRows>0){
            res.send({status:'1'});   
    }else{
            res.send({status:'0'});  
    } 
  });
/*  res.send({status:'0'}); */  
};
