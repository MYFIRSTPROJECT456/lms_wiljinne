var utils = require('./utils.js');
var async = require('async');


exports.allocate = function(req, res){

console.log("Req body",req.body);

function getAllKpis(callback){

    async.waterfall([
        getleads,
        allocateleads
    ], function(err, results) {
        if (err) {
            return next(err);
        } else {
            // res.redirect("/task_list");
            callback(err,results);
        }
    });	
}

function allocateleads(result,callback) {
        if(result){
          var formdata = JSON.parse(req.body.formdata)[0];
           var leadcount = parseInt(formdata.noleads);
          var users = formdata.users;

          var userids;
          if (users) {
            userids = users.split(",");
          }
          // console.log("Selected  leadids : ",sql,error,result);

          var addedcounts = 1;

          var leads = [];
          var leadids = "";
          var isAdded = false;
          console.log("Total records",result.length);
          for (var i = 0; i < result.length ; i++) {
            if (isAdded) {
                leadids+= ",";  
            }
            if (i%50 == 0) {
              console.log("Continue ...");
            }
            leadids+= result[i].leadid;
            isAdded = true;

            if (i==leadcount-1) {
              console.log("Inside condition",leadcount);
              leads.push(leadids);
              leadids = "";
              isAdded = false;
              // addedcounts = addedcounts+1;
              leadcount += parseInt(formdata.noleads);
            }else if(i == result.length-1){
              leads.push(leadids);
              leadids = "";
              isAdded = false;
            }
            // var sql1 = "UPDATE `tbl_leads` SET assignto = 999 WHERE leadid IN()"
          }
          for (var i = 0; i < leads.length; i++) {
            console.log("Leadids : ",leads[i]);
          }
          if (userids) {
              var sqls = ""
              isAdded = false;
              if (userids.length<leads.length) {
                for (var i = 0; i < userids.length; i++) {
               
                  if (i<userids.length-1) {
                      sqls += "UPDATE `tbl_leads` SET assignto = "+userids[i]+" WHERE leadid IN("+leads[i]+");" 
                      console.log("lead counts 111 :  ",leads[i].split(",").length);  
                  }else{
                    var leadidss = "";
                    for (var j = i; j < leads.length; j++) {
                        if (isAdded) {
                          leadidss+=",";
                        }
                        leadidss+=leads[j];
                        isAdded = true;
                        console.log("lead counts 222 :  ",leads[j].split(",").length);
                    }
                    sqls += "UPDATE `tbl_leads` SET assignto = "+userids[i]+" WHERE leadid IN("+leadidss+");"
                    console.log("sqls leadidsss :  ",leadidss.split(",").length);
                  }
                  console.log("sqls 1 : ",i," : ",sqls);
                }  
              }else{
                for (var i = 0; i < leads.length; i++) {
                   console.log("sqls 2 : ",i," : ",sqls);
                  sqls += "UPDATE `tbl_leads` SET assignto = "+userids[i]+" WHERE leadid IN("+leads[i]+");"
                }
              }
              console.log("sqls 3 : ",sqls);
              
              db.query(sqls, function(err, results) {
                console.log("Lead allocations result", err, results);
                callback(err,results);
            }); 
          }
      }
    }

function getleads(callback) {
       var reqbody = req.body;
    var formdata = JSON.parse(req.body.formdata)[0];
    var assingto  = reqbody.assignto;
    var leadtype  = reqbody.leadtype;
    var leadstatus  = reqbody.leadstatus;
    var startdate  = reqbody.startdate;
    var enddate  = reqbody.enddate;
    var mainres=[];
    
    console.log("formdata : ",formdata);
      var sql = "select leadid from tbl_leads ";
      
      var whereclause = "";
      var assignedwhere = "";
      if(assingto){
        assignedwhere += " assignto in ("+assingto+")";
      }
      if(leadtype){
        if(whereclause)
        {
          whereclause += " AND ";
        }
        whereclause += " tbl_leadupdate.stage = "+leadtype;
      }

      if(leadstatus){
        if(whereclause)
        {
          whereclause += " AND ";
        }
        whereclause += " tbl_leadupdate.leadstatus = "+leadstatus;
      }

      if(startdate && enddate){
        if(whereclause){
          whereclause += " AND ";
        }
        whereclause += " tbl_leadupdate.date_gen BETWEEN STR_TO_DATE('"+ startdate+ "', '%m/%d/%Y') AND STR_TO_DATE('"+ enddate+"', '%m/%d/%Y')";
      }
      
      if(whereclause || assignedwhere){
          sql += " WHERE ";
          if(assignedwhere){
            sql +=  assignedwhere;
            if(whereclause){
              sql +=  " AND ";
            }
          }
          if(whereclause){
            sql +="leadid in (SELECT leadid FROM tbl_leadupdate WHERE "+whereclause+")";
          }
      }
      console.log("Select statement : ",sql);
      // var sql1 = sql + " LIMIT "+formdata.noleads;
      console.log("Select statement1 : ",sql);
        db.query(sql,  function(err, results) {
            console.log("", err, results);

            callback(null,results);

            // if (results) {
            //     callback(null,0);
            // } else {
            //     callback(null,-1);
            // }
        });

    }

getAllKpis(function(err,result){
    if(err){
      throw err;
    }
    // console.log("Parameter result: ",result);
    if(result != null && result.affectedRows > 0){
      res.send({status:'1'});  
    }else{
      res.send({status:'0',err_msg:"Failed to allocate data"});
    }
  });
}
