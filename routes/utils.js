var request = require('request');
module.exports = {
  getscrndtl: function gettxn(col1,col2,txn,txncallback){
var Qry   = "SELECT col3,cast(aes_decrypt(col4, ?) as char) as col4,cast(aes_decrypt(col5, ?) as char) as col5,cast(aes_decrypt(col6, ?) as char) as col6,col7,col8,cast(aes_decrypt(col9, ?) as char) as col9,cast(aes_decrypt(col10, ?) as char) as col10,col11,col12,cast(aes_decrypt(col13, ?) as char) as col13,cast(aes_decrypt(col14, ?) as char) as col14,col15,col16,col17,col18,cast(aes_decrypt(col19, ?) as char) as col19,cast(aes_decrypt(col20, ?) as char) as col20,col25 FROM `syscontrol2` where col1= ? and col2= ? and col8 <> 8 and col22 <>1 order by col11,col12";

      db.query(Qry,[txn,txn,txn,txn,txn,txn,txn,txn,txn,col1,col2], function(err, results){
            if (err){ 
           console.log(err);
            }
	else{
          var fresult =JSON.parse(JSON.stringify(results));  // Scope is larger than function  
}
	return txncallback(err,fresult);
    });
},
  get_groups: function get_groups(col1,col2,txn,callback){

var getmenuqry = "SELECT col12,cast(aes_decrypt(col13, ?) as char) as col13,cast(aes_decrypt(col14, ?) as char) as col14 FROM `syscontrol2`  WHERE col2 =? and col8 <> 8 GROUP BY 1,2,3 order by col12";

      db.query(getmenuqry,[txn,txn,col2], function(err, results){
   if (err){
     console.log(err);
            }
   else{
             var menudata =JSON.parse(JSON.stringify(results));  // Scope is larger than function  
   }
   
return callback(err,menudata);
    });
},
get_datastore: function get_datastore(col1,col2,txn,callback){
var getDatastoreQry = "SELECT col2 ,cast(aes_decrypt(col3, ?) as char) as col3,cast(aes_decrypt(col4, ?) as char) as col4,cast(aes_decrypt(col5, ?) as char) as col5,cast(aes_decrypt(col6, ?) as char) as col6,cast(aes_decrypt(col7, ?) as char) as col7,cast(aes_decrypt(col9, ?) as char) as col9 FROM syscontrol3 WHERE col1 =? AND col2 =?";

      db.query(getDatastoreQry,[txn,txn,txn,txn,txn,txn,col1,col2], function(err, results){
   if (err){
       console.log(err);
            }
   else{
             var data =JSON.parse(JSON.stringify(results));  // Scope is larger than function  
   }
   
return callback(err,data);
    });
},
get_tbldata: function get_tbldata(col1,col2,txn,user,callback){
//change query as per
var query = "SELECT * FROM `tbl_task`";

if(col1 == 1 ){
query += " WHERE STR_TO_DATE(duedate, '%m/%d/%Y') < date_format(date(now()),'%Y-%m-%d') and taskstatus <> 6 and status <> -1";
}
else if(col1 == 2){
query += " WHERE STR_TO_DATE(duedate, '%m/%d/%Y') = date_format(date(now()),'%Y-%m-%d') and taskstatus <> 6 and status <> -1";
}
  else if(col1 == 3){
query += " WHERE STR_TO_DATE(duedate, '%m/%d/%Y') > date_format(date(now()),'%Y-%m-%d') and taskstatus <> 6 and status <> -1";
}
else if(col1 == 4){
  query += " WHERE duedate ='' and taskstatus <> '6' and status <> '-1'";
}
query += " and assignto= ?;";

      db.query(query,[user.enid],function(err, results){
   if (err){
      //throw err;
        console.log(err);
            }
   else{
             var rsponse =JSON.parse(JSON.stringify(results));  // Scope is larger than function  
   }
 /*  console.log("Task data",rsponse);*/
return callback(err,rsponse);
    });
},
get_leadhistdata: function get_leadhistdata(col1,col2,txn,user,callback){
//change query as per
    var params = [];
var query = "SELECT leadid as txnid,(select tbl_leads.leadname from tbl_leads WHERE tbl_leads.leadid = t1.leadid) as title,t1.nmd as start,(select tbl_login.enname FROM tbl_login WHERE tbl_login.enid = t1.userid) as username FROM tbl_leadupdate t1 WHERE t1.date_gen = (SELECT MAX(t2.date_gen) FROM tbl_leadupdate t2 WHERE t2.leadid = t1.leadid) AND t1.leadstatus <> 36 AND t1.leadstatus <> 37";

if(col1 == 1 ){
query += " AND STR_TO_DATE(t1.nmd, '%d/%m/%Y') < DATE_FORMAT(NOW(), '%Y-%m-%d')  AND nmd <> ''";
}
else if(col1 == 2){
query += " AND STR_TO_DATE(t1.nmd, '%d/%m/%Y') = DATE_FORMAT(NOW(), '%Y-%m-%d')  AND nmd <> ''";
}
  else if(col1 == 3){
query += " AND STR_TO_DATE(t1.nmd, '%d/%m/%Y') > DATE_FORMAT(NOW(), '%Y-%m-%d')  AND nmd <> ''";
}
else if(col1 == 4){
  query += "  AND nmd = ''";
}

if(user.syno != '1'){    
query += " AND (FIND_IN_SET(userid,(select GROUP_CONCAT(enid) as id from (select enid,mgrid from tbl_login WHERE mgrid is not null order by mgrid, enid) u,(select @pv := ?) i where find_in_set(mgrid, @pv) > 0 and @pv := concat(@pv, ',', enid))) OR FIND_IN_SET(userid,?)) ";
 params =    [user.enid,user.enid];
}
query += " ORDER BY STR_TO_DATE(t1.nmd, '%d/%m/%Y');";

      db.query(query,params,function(err, results){
   if (err){
      //throw err;
        console.log(err);
            }
   else{
             var rsponse =JSON.parse(JSON.stringify(results));  // Scope is larger than function  
   }
 /*  console.log("Task data",rsponse);*/
return callback(err,rsponse);
    });
},

get_taskdata: function get_taskdata(col1,col2,txn,callback){
/*console.log('txnid : ',col1);*/
var query = "SELECT * FROM `tbl_task`  WHERE txnid=?";

      db.query(query,[col1], function(err, results){
   if (err){
      throw err;
            }
   else{
        /*    console.log('response : ',JSON.stringify(results));*/
            var taskdata =JSON.parse(JSON.stringify(results));  // Scope is larger than function 
   /*         console.log(JSON.stringify(taskdata));*/
    }
   
return callback(err,taskdata);
    });
},
get_uploadcode: function get_uploadcode(col1,txn,callback){
/*console.log('txnid : ',col1);*/
  var query = "SELECT col3,col4,cast(aes_decrypt(col5, ?) as char) as selectsql,cast(aes_decrypt(col6,?) as char) as insertsql,col7 FROM `tbl_uploadcode1` WHERE col1 =?";

   db.query(query,[txn,txn,col1], function(err, results){
   if (err){
    console.log(err);
  }
  else{
    /*    console.log('response : ',JSON.stringify(results));*/
            var taskdata =JSON.parse(JSON.stringify(results));  // Scope is larger than function 
       //     console.log("From upload code",JSON.stringify(taskdata));
          }

          return callback(null,taskdata);
        });
},

    insert_staging: function insert_staging(uploadid,uploadtype,filename, filesize,callback) {
 /*       console.log('filename : ', filename);*/
        // var query = "INSERT INTO `tbl_uploadlog` (`uploadtype`, `filename`, `filesize`, `Status`) VALUES (?, ?, ?, ?)";
        var query = "INSERT INTO `tbl_uploadlog` (`uploadid`, `uploadtype`, `filename`, `filesize`, `Status`, `accptedcount`, `rejectedcount`) VALUES (?, ?, ?, ?, '0', '0', '0');"
        db.query(query, [uploadid,uploadtype,filename, filesize,], function(err, results) {
            if (err) {
         console.log(err);
            } else {
     /*           console.log('response : ', JSON.stringify(results));*/
                var staging = JSON.parse(JSON.stringify(results)); // Scope is larger than function 
           /*     console.log(JSON.stringify(staging));*/
            }
            return callback(err, staging);
        });
    },

get_leadsearch: function get_leadsearch(col1,col2,txn,callback){

if(col1==null || col1 =="")
{
  col1="";
}
console.log('Search column ',col1);
var query = "SELECT * FROM `tbl_leads` WHERE LOWER(leadname) REGEXP LOWER(?) and status <> -1";

      db.query(query,[col1], function(err, results){
   if (err){
     console.log(err);
            }
   else{
          /*  console.log('response : ',JSON.stringify(results));*/
            var leadsearch =JSON.parse(JSON.stringify(results));  // Scope is larger than function 
        /*    console.log(JSON.stringify(leadsearch));*/
    }
   
return callback(err,leadsearch);
    });
},
get_leadsearchauto: function get_leadsearchauto(userid,callback){
var query = "SELECT CONCAT(leadname,' , ',email,' , ',mobileno) as title,leadid as id FROM `tbl_leads` where status <> -1";

      db.query(query,[], function(err, results){
   if (err){
   console.log(err);
            }
   else{
          /*  console.log('response : ',JSON.stringify(results));*/
            var leadsearch =JSON.parse(JSON.stringify(results));  // Scope is larger than function 
        /*    console.log(JSON.stringify(leadsearch));*/
    }
   
return callback(err,leadsearch);
    });
},

get_history: function get_history(txnid,col2,txn,callback){

/*console.log('history : ',txnid);*/
var query = "SELECT * FROM `tbl_leadupdate` where leadid=?";

      db.query(query,[txnid], function(err, results){
   if (err){
   console.log(err);
            }
   else{
        /*    console.log('response : ',JSON.stringify(results));*/
            var history =JSON.parse(JSON.stringify(results));  // Scope is larger than function 
     /*       console.log(JSON.stringify(history));*/
    }
   
return callback(err,history);
    });
},

save_data: function save_data(col1,col2,txn){
var options = {
    url: 'http://localhost:3000/savedata',
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    form: {'scrid': col1,'formdata':col2}
}

request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        res.send(response);
    }
})  
},

getleaddetails:function getleaddetails(lid,col1,col2,callback){
  console.log("Lead id from details",lid);

        var query = "SELECT * FROM `tbl_leads` where leadid =? and status <> -1";

        db.query(query, [lid], function(err, results) {
            if (err) {
               console.log(err);
            } else {
                var leadsearch = JSON.parse(JSON.stringify(results)); // Scope is larger than function 
            }
            callback(err, leadsearch);
        });
    },

    getcolumns:function getleaddetails(lid,callback){

        var query = "SELECT GROUP_CONCAT(COLUMN_NAME) as allcolumns FROM INFORMATION_SCHEMA.COLUMNS WHERE  TABLE_NAME=? AND COLUMN_NAME NOT IN ('txnid','userid','mis_sts','status','date_gen','txn_latid','txn_longid')";

        db.query(query, [lid], function(err, results) {
            if (err) {
                console.log(err);
            } else {
                var leadsearch = JSON.parse(JSON.stringify(results));
               // console.log("Columns of table",leadsearch); // Scope is larger than function 
            }
            callback(err, leadsearch);
        });
    },
    getKpis:function getKpis(user,callback){
var params = [];
        var query = " ";
        if(user.syno != '1'){
        query += "select (select count(*) from tbl_leads WHERE (tbl_leads.assignto=? OR EXISTS(SELECT enid from tbl_login WHERE tbl_login.mgrid =?))) as tleads,(SELECT count(*) from tbl_task WHERE  status <> -1) as toverview,(SELECT count(*) FROM tbl_leadupdate t1 WHERE t1.date_gen = (SELECT MAX(t2.date_gen) FROM tbl_leadupdate t2 WHERE t2.leadid = t1.leadid) AND t1.leadstatus <> 36 AND t1.leadstatus <> 37   AND nmd <> '' AND userid = ?) as ptasks, 0 as lfunnel";
            params= [user.enid, user.enid, user.enid];
        }else{
             query += "select (select count(*) from tbl_leads) as tleads,(SELECT count(*) from tbl_task WHERE  status <> -1) as toverview,(SELECT count(*) FROM tbl_leadupdate t1 WHERE t1.date_gen = (SELECT MAX(t2.date_gen) FROM tbl_leadupdate t2 WHERE t2.leadid = t1.leadid) AND t1.leadstatus <> 36 AND t1.leadstatus <> 37   AND nmd <> '') as ptasks, 0 as lfunnel";
        }
            
        db.query(query,params,function(err, results) {
            if (err) {
              console.log(err);
            } else {
                var kpis = JSON.parse(JSON.stringify(results));
               // console.log("Columns of table",leadsearch); // Scope is larger than function 
            }
            callback(err, kpis);
        });
    },
get_dateString:function(raw_date){
var dateformatted="";
var months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
                var date=new Date(raw_date).toISOString().slice(0,10).replace('T',' ').toString();
                var d1 = date.split("-");
                var temp_date = new Date(d1[0], parseInt(d1[1])-1, d1[2]);
                  var day = temp_date.getDate()+1;
                  var month = months[temp_date.getMonth()];
                  var year = temp_date.getFullYear();
                  if(day >0 && day < 10)
                    day ="0"+day;
                  dateformatted=""+day+"-"+month+"-"+year;
  return dateformatted;
},
    insert_data: function insert_data(col1, col2, col3, callback) {
   /*     console.log('txnid : ', col1);*/
        var query = col1;

        var params = [];
        var parsed = JSON.parse(JSON.stringify(col2));
        for(var x in parsed){
       /*     console.log("key : ",x , parsed[0][x] );*/
            if (x == 'data-table1_length') {
//                parsed[0].splice(x, 1);
            }else{
                params.push(parsed[x]);
            }
        }
        //params.shift();
        params.push(col3);
        params.push(parseFloat(0.0));
        params.push(parseFloat(0.0));

        db.query(query, params, function(err, results) {
            if (err) {
       console.log(err);
            } else {
        //        console.log('response : ', JSON.stringify(results));
                var insertresp = JSON.parse(JSON.stringify(results)); // Scope is larger than function 
      /*          console.log(JSON.stringify(insertresp));*/
            }
            return callback(err, insertresp);
        });
    },
	Noleads: function(cb){
      var sql = "SELECT COUNT(*)as lead FROM tbl_leads";

      db.query(sql,function(error, result){
        if (error) {
          console.log(error);
        }
        else{
          return cb(error, result)
        }
      });
    },
    getStatus: function(cb){
      var sql = "SELECT cvid, cvvalule FROM `tbl_codevalue` WHERE cvmasterid=5";

      db.query(sql,function(error, result){
        if (error) {
          console.log(error);
        }
        else{
          return cb(error, result)
        }
      });
    },
    getStage: function(cb){
      var sql = "SELECT cvid, cvvalule FROM `tbl_codevalue` WHERE cvmasterid = 4";

      db.query(sql,function(error, result){
        if (error) {
          console.log(error);
        }
        else{
          return cb(error, result)
        }
      });
    }
};

