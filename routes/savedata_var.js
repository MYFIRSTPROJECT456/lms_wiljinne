var async = require('async');
var utils = require('./utils.js');
var Validation = require('./lib/validate.js');


var Save_Process={ 
  savemaster: function(col1,col2,col3,col4,callback){
    var txn=col2;
    var coid = col1.coid;
    var userid=col1.enid;
    var user=col1;
    var tuser=col4;
    var scrid=col3;
    var query = "";
    var params = [];
console.log("Scrid",scrid);
console.log("Screen details which were added",tuser);
function getAllKpis(callback){
    async.parallel([
        async.apply(utils.get_datastore,coid,parseInt(scrid),txn),
        async.apply(utils.getscrndtl,coid,parseInt(scrid),txn)  
    ], function(err, result) {
      //  console.log("validate screen details",JSON.stringify(result));
        if(err) console.log(err);
        update(tuser,result[1],function(err,results){
          if(err){
            //res.send({status:'0',err_msg:"Could not save :- \n"+results.err_msg});
            var error=new Error("Could not save :- \n"+results.err_msg);
            callback(error,result);
          }
          else{
             preprocess(result[0][0],function(err,result){
              if(err){
                    var error=new Error("Failed while saving data");
                 return   callback(error,result);
                    }
                    else {
                  return  callback(err,result); 
                    }
                });
           }
          });
  });
}

function update(data,scrndtl,callback){
  var txnid=parseInt(scrid);
  console.log("ID:"+scrndtl);
  return Validation.validate_value(txnid,data,scrndtl,callback);
};

function preprocess(data,callback){
  var proceed=false;
switch(scrid) 
{
case "575"://lead
          params.push(""+(new Date().getFullYear())+""+(Math.floor(Math.random() * 10000000)));
         /* var count= checkLeadExist(proceed,callback);
          console.log("processed",count);
          if(count>0){proceed =false;}else{proceed =true;}
          */break;
case "576"://user
console.log("inside preprocessing");
          break;
case "577"://CP
          break;
case "578"://CM
          break;
case "579"://task
          break;
}
        for(var x in tuser){
            if (x == 'data-table1_length') {
            }else{
                params.push(tuser[x]);
            }
        }
        params.push(parseInt(userid));
        params.push(parseFloat(0.0));
        params.push(parseFloat(0.0));
        //if(proceed){
        return savedata(data,params,callback);
  /*} else{
    var error=new Error("Failed in pre-proceesing");
                 return   callback(error,data);
    }*/

};


function savedata(data,param,callback){

    console.log("Save params",data,params);

    query = data.col6;
    db.query(query, param, function(err, results) {
          var insertresp = JSON.parse(JSON.stringify(results));
            if (err) {
              // throw err;
            } 
/*                console.log('response : ', JSON.stringify(results));*/
                return postprocessing(err,insertresp,data,param,callback); // Scope is larger than function 
      /*          console.log(JSON.stringify(insertresp));*/
                
        });
}

function postprocessing(err,insertresp,data,param,callback){

//console.log("scrid pp"+scrid);

switch(scrid) 
{
case "575"://lead
          insertresp["leadid"]=param[0];
          return callback(err,insertresp);
          break;
case "576"://user
          console.log("Inside login");
          return insertlogin(param,callback);
          break;
case "577"://CP
          return callback(err,insertresp);
          break;
case "578"://CM
          return callback(err,insertresp);
          break;
case "579"://task
        console.log("checks",tuser.taskstatus,user.roleid);
        if(tuser.taskstatus=="6" && user.roleid == "60" ){
          return saveMgr(callback);
        }else{
          return callback(err,insertresp);
        }
          break;
    }
};

function saveMgr(callback){

var sql1="INSERT INTO `tbl_task` (`name`,`taskdesc`,`duedate`,`taskstatus`,`assignto`,`userid`, `txn_latid`, `txn_longid`) VALUES (?,?,?,?,(select enid from tbl_login WHERE roleid=61),?,?,?)";
   var params = [];
        params.push(tuser.name +"-Execution");
        params.push("Please execute the project as per the contract");
        params.push(tuser.duedate);//add due date
        params.push("3");
        params.push(userid);
        params.push(parseFloat(0.0));
        params.push(parseFloat(0.0));
  db.query(sql1,params,function(err, results){
    console.log("Error manager",err);
           return callback(err,results);   
      });
}

function updatetask(callback){
var sql1="INSERT INTO `tbl_task` (`name`,`taskdesc`,`duedate`,`taskstatus`,`assignto`,`userid`, `txn_latid`, `txn_longid`) VALUES (?,?,?,?,(select enid from tbl_login WHERE roleid=61),?,?,?)";
   var params = [];
        params.push(tuser.name +"-Execution");
        params.push("Please execute the project as per the contract");
        params.push(tuser.duedate);//add due date
        params.push("3");
        params.push(userid);
        params.push(parseFloat(0.0));
        params.push(parseFloat(0.0));
  db.query(sql1,params,function(err, results){
           return callback(err,results);   
      });
}

function checkLeadExist(proceed){
var sql1="SELECT count(*) as count FROM `tbl_leads` WHERE email=? and mobileno =?";
   var params = [];
        params.push(tuser.email);
        params.push(tuser.mobileno);
  db.query(sql1,params,function(err, results){  
     var resp = JSON.parse(JSON.stringify(results));
      console.log("check lead ex",results,params);
     if(parseInt(resp[0].count) > 0){
                   var error=new Error("Record already exists");
                   proceed=false;
                 return  1;
           }
              else{
                proceed=true;
             return 0;
           }   
      });
};

function insertlogin(param,callback){
  var query ="INSERT INTO `tbl_login` (`coid`,`enname`, `loginid`, `pwd`, `roleid`,`mgrid`) VALUES (?,?,?,?,?,?)";
  var params=[];
  params.push(coid);
  params.push(param[0]);
  params.push(param[6]);
  params.push("pass@123");
  params.push(param[7]);
    params.push(param[8]);
  db.query(query, params, function(err, results) {

            if (err) {
               throw err;
                   }
                 var insertresp = JSON.parse(JSON.stringify(results));
                return callback(err, insertresp); // Scope is larger than function               
        });
}

getAllKpis(function(err,result){
 callback(err,result); 
});
}
}
  module.exports = Save_Process; 