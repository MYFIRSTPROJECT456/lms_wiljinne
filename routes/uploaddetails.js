var utils = require('./utils.js');
var async = require('async');


function getserv(err,fresult,callback){
var mainres=[];
  for(var i = 0; i < fresult.length; ++i) {
         var json = fresult[i];
         var result =[];
         for(var prop in json) {
        //  console.log(json[prop]);
                result.push(json[prop]);
         }
  mainres.push(result);
     }
  callback(err,mainres);
  
}


exports.list = function(req, res) {
    function getAllKpis(callback) {
        var Qry = "SELECT batchno,filename,filesize, CASE WHEN STATUS = '0' THEN 'pending' WHEN STATUS = '1' THEN 'proccessing' WHEN STATUS = '2' THEN 'processed' end as Status, accptedcount,rejectedcount from (SELECT batchno,filename,filesize,Status,(SELECT COUNT(Status) from tbl_channel_partner_staging WHERE tbl_uploadlog.batchno=tbl_channel_partner_staging.batchno and Status=1) as accptedcount,(SELECT COUNT(Status) from tbl_channel_partner_staging WHERE tbl_uploadlog.batchno=tbl_channel_partner_staging.batchno and Status=-1) as rejectedcount FROM `tbl_uploadlog` UNION SELECT batchno,filename,filesize,Status,(SELECT COUNT(Status) from tbl_users_staging WHERE tbl_uploadlog.batchno=tbl_users_staging.batchno and Status=1) as accptedcount,(SELECT COUNT(Status) from tbl_users_staging WHERE tbl_uploadlog.batchno=tbl_users_staging.batchno and Status=-1) as rejectedcount FROM `tbl_uploadlog` UNION SELECT batchno,filename,filesize,Status,(SELECT COUNT(Status) from tbl_leads_staging WHERE tbl_uploadlog.batchno=tbl_leads_staging.batchno and Status=1) as accptedcount,(SELECT COUNT(Status) from tbl_leads_staging WHERE tbl_uploadlog.batchno=tbl_leads_staging.batchno and Status=-1) as rejectedcount FROM `tbl_uploadlog` UNION SELECT batchno,filename,filesize,Status,(SELECT COUNT(Status) from tbl_coupon_staging WHERE tbl_uploadlog.batchno=tbl_coupon_staging.batchno and Status=1) as accptedcount,(SELECT COUNT(Status) from tbl_coupon_staging WHERE tbl_uploadlog.batchno=tbl_coupon_staging.batchno and Status=-1) as rejectedcount FROM `tbl_uploadlog`) AS main WHERE accptedcount >0 AND rejectedcount > 0 or Status =0 ORDER by 1 DESC";
        db.query(Qry, [], function(err, results) {
            if (err) {
                console.log(err);
            } else {
                var fresult = JSON.parse(JSON.stringify(results)); // Scope is larger than function  
            }
            return getserv(err,fresult,callback);  
        });
    }

    getAllKpis(function(err, result) {

        if (err) {
            console.log(err);
        }
        //console.log("Datatable result: ", result);
        res.send(JSON.parse(JSON.stringify({
            "data": result
        })));
    });
}
exports.alist = function(req, res) {
    function getAllKpis(callback) {
        var Qry = "SELECT batchno,filename,uploadtype from ( SELECT batchno,(SELECT filename from tbl_uploadlog WHERE tbl_uploadlog.batchno=tbl_users_staging.batchno) as filename,(SELECT col2 from tbl_uploadcode1 WHERE tbl_uploadcode1.col1= (SELECT uploadtype from tbl_uploadlog WHERE tbl_uploadlog.batchno=tbl_users_staging.batchno)) as uploadtype  FROM tbl_users_staging where status ='1' UNION ALL SELECT batchno,(SELECT filename from tbl_uploadlog WHERE tbl_uploadlog.batchno=tbl_channel_partner_staging.batchno) as filename,(SELECT col2 from tbl_uploadcode1 WHERE tbl_uploadcode1.col1= (SELECT uploadtype from tbl_uploadlog WHERE tbl_uploadlog.batchno=tbl_channel_partner_staging.batchno)) as uploadtype  FROM tbl_channel_partner_staging  where status ='1' UNION ALL SELECT batchno,(SELECT filename from tbl_uploadlog WHERE tbl_uploadlog.batchno=tbl_coupon_staging.batchno) as filename,(SELECT col2 from tbl_uploadcode1 WHERE tbl_uploadcode1.col1= (SELECT uploadtype from tbl_uploadlog WHERE tbl_uploadlog.batchno=tbl_coupon_staging.batchno)) as uploadtype  FROM tbl_coupon_staging  where status ='1' UNION ALL SELECT batchno,(SELECT filename from tbl_uploadlog WHERE tbl_uploadlog.batchno=tbl_leads_staging.batchno) as filename,(SELECT col2 from tbl_uploadcode1 WHERE tbl_uploadcode1.col1= (SELECT uploadtype from tbl_uploadlog WHERE tbl_uploadlog.batchno=tbl_leads_staging.batchno)) as uploadtype  FROM tbl_leads_staging  where status ='1') AS main where batchno is not null order by 1 desc";
        db.query(Qry, [], function(err, results) {
            if (err) {
                console.log(err);
            } else {
                var fresult = JSON.parse(JSON.stringify(results)); // Scope is larger than function  
            }
            return getserv(err,fresult,callback);  
        });
    }

    getAllKpis(function(err, result) {

        if (err) {
            console.log(err);
        }
        //console.log("Datatable result: ", result);
        res.send(JSON.parse(JSON.stringify({
            "data": result
        })));
    });
}
exports.rlist = function(req, res) {
    function getAllKpis(callback) {
        var Qry = "SELECT batchno,filename,uploadtype,err_msg from ( SELECT batchno,(SELECT filename from tbl_uploadlog WHERE tbl_uploadlog.batchno=tbl_users_staging.batchno) as filename,(SELECT col2 from tbl_uploadcode1 WHERE tbl_uploadcode1.col1= (SELECT uploadtype from tbl_uploadlog WHERE tbl_uploadlog.batchno=tbl_users_staging.batchno)) as uploadtype ,err_msg FROM tbl_users_staging where status ='-1' UNION ALL SELECT batchno,(SELECT filename from tbl_uploadlog WHERE tbl_uploadlog.batchno=tbl_channel_partner_staging.batchno) as filename,(SELECT col2 from tbl_uploadcode1 WHERE tbl_uploadcode1.col1= (SELECT uploadtype from tbl_uploadlog WHERE tbl_uploadlog.batchno=tbl_channel_partner_staging.batchno)) as uploadtype ,err_msg FROM tbl_channel_partner_staging  where status ='-1' UNION ALL SELECT batchno,(SELECT filename from tbl_uploadlog WHERE tbl_uploadlog.batchno=tbl_coupon_staging.batchno) as filename,(SELECT col2 from tbl_uploadcode1 WHERE tbl_uploadcode1.col1= (SELECT uploadtype from tbl_uploadlog WHERE tbl_uploadlog.batchno=tbl_coupon_staging.batchno)) as uploadtype ,err_msg FROM tbl_coupon_staging  where status ='-1' UNION ALL  SELECT batchno,(SELECT filename from tbl_uploadlog WHERE tbl_uploadlog.batchno=tbl_leads_staging.batchno) as filename,(SELECT col2 from tbl_uploadcode1 WHERE tbl_uploadcode1.col1= (SELECT uploadtype from tbl_uploadlog WHERE tbl_uploadlog.batchno=tbl_leads_staging.batchno)) as uploadtype,err_msg FROM tbl_leads_staging  where status ='-1') AS main where batchno is not null order by 1 desc";
        db.query(Qry, [], function(err, results) {
            if (err) {
                console.log(err);
            } else {
                var fresult = JSON.parse(JSON.stringify(results)); // Scope is larger than function  
            }
            return getserv(err,fresult,callback);  
        });
    }

    getAllKpis(function(err, result) {

        if (err) {
            console.log(err);
        }
        //console.log("Datatable result: ", result);
        res.send(JSON.parse(JSON.stringify({
            "data": result
        })));
    });
}