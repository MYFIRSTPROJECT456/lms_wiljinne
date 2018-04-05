var request = require('request');
module.exports = {
	assigntofilter: function(reqbody, cb){
    console.log("Selected assignies : ",reqbody);
    var assingto  = reqbody.assignto;
    var leadtype  = reqbody.leadtype;
    var leadstatus  = reqbody.leadstatus;
    var startdate  = reqbody.startdate;
    var enddate  = reqbody.enddate;
    var mainres=[];

  var sql = "select leadname,mobileno,email,(select tbl_codevalue.cvvalule from tbl_codevalue where tbl_codevalue.cvmasterid=3 and tbl_codevalue.cvid=tbl_leads.source) as `source`,address,(case WHEN (select leadstatus from tbl_leadupdate WHERE tbl_leads.leadid = tbl_leadupdate.leadid ORDER BY tbl_leadupdate.txnid DESC LIMIT 1) = '36' THEN 'Dropped' WHEN (select leadstatus from tbl_leadupdate WHERE tbl_leads.leadid = tbl_leadupdate.leadid ORDER BY tbl_leadupdate.txnid DESC LIMIT 1) = '37' THEN 'Closed' ELSE 'OPEN' END) as status, (select tbl_login.enname from tbl_login where tbl_login.enid = tbl_leads.assignto) as `assignto`,(select tbl_codevalue.cvvalule from tbl_codevalue where tbl_codevalue.cvmasterid=6 and tbl_codevalue.cvid=tbl_leads.leadtype) as `leadtype`, refname,refnumber,(select tbl_codevalue.cvvalule from tbl_codevalue where tbl_codevalue.cvmasterid=11 and tbl_codevalue.cvid=tbl_leads.products) as `products`,leadid from tbl_leads";
  
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
    whereclause += " (SELECT leadstatus from tbl_leadupdate WHERE tbl_leads.leadid = tbl_leadupdate.leadid ORDER BY tbl_leadupdate.txnid DESC LIMIT 1) = "+leadstatus;
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
	console.log('my sql query'+sql);
      db.query(sql,function(error, result){
        if (error) {
          console.log(error);
        }
        else{
          var fresult =JSON.parse(JSON.stringify(result));
          for(var i = 0; i < fresult.length; ++i) {
            var json = fresult[i];
            var result =[];
            for(var prop in json) {
             if( prop!=null && json[prop] !=null && json[prop] != '' && prop.toString().includes("date")){
              var formatted=utils.get_dateString(json[prop]);
              result.push(formatted); 
            }
      else if (prop.toString() == "status" && json["status"] == "Dropped"){
   //              console.log("Lead name: "+ json["leadname"] +" Lead status:"+json[prop]);
                 result.push('Not Interested');
            }
     else{
                   //console.log("key",json[prop]);
                  result.push(json[prop]);
                    }    
        }
     mainres.push(result);
        }
      }
          return cb(error, mainres)
        
      });		
	

    },
    stagefilter: function(id, cb){

		if (id) {

	var sql = "SELECT * FROM `tbl_codevalue` WHERE cvid in("+id+")";

      db.query(sql,function(error, result){
        if (error) {
          console.log(error);
        }
        else{
          return cb(error, result)
        }
      });		
	}

    },
    statusfilter: function(id, cb){

		if (id) {

	var sql = "SELECT * FROM `tbl_codevalue` WHERE cvid in("+id+")";

      db.query(sql,function(error, result){
        if (error) {
          console.log(error);
        }
        else{
          return cb(error, result)
        }
      });		
	}

    },
    datefilter: function(id, cb){

		if (id) {

	var sql = "SELECT * FROM `tbl_leads` WHERE date_gen in("+id+")";

      db.query(sql,function(error, result){
        if (error) {
          console.log(error);
        }
        else{
          return cb(error, result)
        }
      });		
	}

    }
}	