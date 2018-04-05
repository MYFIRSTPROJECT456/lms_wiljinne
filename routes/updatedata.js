var async = require('async');
var Upload = require('./uploadpdf.js');

exports.reschedule = function(req, res){
var tuser=JSON.parse(req.body.formdata);
var scrid=req.body.scrid;
var lid=req.body.leadid;
var userid=req.session.user.enid;
console.log("rescheduledata",tuser);

function updatelead(callback){
  var sql1="INSERT INTO `tbl_leadupdate` (`leadid`, `remarks`, `email`,`stage`, `leadstatus`, `nmd`,`userid`) VALUES (?,?,?,?,?,?,?);"
  var params = [];
        var parsed = tuser;
        params.push(lid);
        for(var x in parsed[0]){
                params.push(parsed[0][x]);
        }
params.push(userid);
console.log("rescheduledata params",params);
  db.query(sql1,params,function(err, results){ 
  if(err) console.log(err);     
    if(results !=null && results.affectedRows>0){
         
            return  performaction(results,callback); 
    }else{
             return callback(err,results);  
    }              
      });
}

function droplead(callback){
  var sql1="UPDATE `tbl_leads` set status ='-1' WHERE leadid=?";
    db.query(sql1,[lid],function(err, results){ 
             callback(err,results);               
      });
}

function closelead(callback){
  var sql1="INSERT INTO `tbl_sanctions` (`txnrefno`, `txntype`, `senderid`) VALUES (?,?,?)";
    db.query(sql1,[lid,scrid,userid],function(err, results){ 
            /* return Upload.uploadmaster(user,lid,null,null,callback);  */
             callback(err,results);             
      });
}

function performaction(results,callback){
if(tuser[0].status == "36")//drop
{
      return droplead(callback);
}
else if (tuser[0].status == "37")//closed
{
      return closelead(callback);
}
else//none
{
      callback(null,results);
}
}

updatelead(function(err,results){
    if(err){
      throw err;
    }
    console.log("Update results",results);
    var finalresult=JSON.parse(JSON.stringify(results));
             console.log("FInal saving result",finalresult);
       if(finalresult != null && finalresult.affectedRows > 0){
        res.send({status:'1'});  
  }
  else{
        res.send({status:'0',err_msg:"Failed while saving data"});
  }
  });
};


exports.update = function(req, res){
var tuser=JSON.parse(req.body.formdata);
var scrid=req.body.scrid;
var lid=req.body.leadid;

console.log("Update data",tuser);
  var sql1="UPDATE `tbl_leads` SET `leadname` = ?, `mobileno` = ?, `email` = ?, `source` = ?,`address` = ?, `assignto` = ?, `refname` = ?, `refnumber` = ?, `products` = ?, `coupon` = ?, `leadtype` = ? WHERE `tbl_leads`.`leadid` = ?;"

   var params = [];
        var parsed = tuser;
        for(var x in parsed[0]){
              params.push(parsed[0][x]);
        }
        params.push(lid);
        console.log("params update",params);
  db.query(sql1,params,function(err, results){  
  if(err) console.log(err);    
    if(results !=null && results.affectedRows>0){
            res.send({status:'1'});   
    }else{
            res.send({status:'0'});  
    }              
      });
/*  res.send({status:'0'}); */  
};


exports.updatetask = function(req, res){
var scrid=req.body.scrid;
var lid=req.body.id;
var tuser=JSON.parse(req.body.formdata);

console.log("inside update task");

function updatedata(callback){
var sql1="UPDATE `tbl_task` SET status =? WHERE txnid =?"
   var params = [];
   var status='-1';
 /*  if(tuser[0].taskstatus == '6'){
    status='1';
   }*/
    params.push(status);
        params.push(lid);
  db.query(sql1,params,function(err, results){  
return callback(err,results);            
      });
}

function savedata(callback){
var sql1="INSERT INTO `tbl_notifications` (`senderid`, `receiverid`, `fcmid`, `title`, `notify_type`, `notify_url`, `click_action`, `msg`, `data`) VALUES (?, NULL, NULL, NULL, NULL, NULL, NULL, 'New task created', ?)"
   var params = [];
        params.push(req.session.user.enid);
        params.push("data to be stored");
  db.query(sql1,params,function(err, results){  
           return callback(err,results);   
      });
}

async.parallel([
        updatedata,
         savedata
    ], function(err, results) {
        if(err) console.log(err);  
         var result=JSON.parse(JSON.stringify(results));
    if(result !=null && result[0].affectedRows>0 && result[1].affectedRows>0){
            res.send({status:'1'});   
    }else{
            res.send({status:'0'});  
    } 
  });
/*  res.send({status:'0'}); */  
};
