var utils = require('./utils.js');
var async = require('async');

exports.list = function(req, res){
var txn=req.session.ecryt_key;
var coid = req.session.coid;
var txnid=req.body.id;
/*var txnid = 12348;*/

console.log("txnid : ",req.body);

function getAllKpis(callback){
    async.parallel([
      async.apply(utils.get_taskdata,parseInt(txnid),parseInt(txnid),txn)
    ], function(err, done) {
        if(err) console.log(err);
        return callback(err,done);
  });
}


  getAllKpis(function(err,result){
    if(err){
      console.log(err);
    }
    console.log(result);
    console.log(JSON.stringify({"resp":result[0][0]}));
    res.send(result[0][0]);  
  });
}

exports.events = function(req, res){
    var user = req.session.user;
    var Qry = " ";
    var params = [];
    if(user.syno != '1'){
     
    Qry="SELECT COUNT(*) as title,DATE_FORMAT(STR_TO_DATE(t1.nmd, '%d/%m/%Y'), '%Y-%m-%d') as start FROM tbl_leadupdate t1 WHERE t1.date_gen = (SELECT MAX(t2.date_gen) FROM tbl_leadupdate t2 WHERE t2.leadid = t1.leadid) AND t1.leadstatus <> 36 AND t1.leadstatus <> 37 AND userid =? AND nmd <> ''  GROUP by start;SELECT COUNT(*) as title,DATE_FORMAT(STR_TO_DATE(t1.nmd, '%d/%m/%Y'), '%Y-%m-%d') as start FROM tbl_leadupdate t1 WHERE t1.date_gen = (SELECT MAX(t2.date_gen) FROM tbl_leadupdate t2 WHERE t2.leadid = t1.leadid) AND t1.leadstatus <> 36 AND t1.leadstatus <> 37 AND FIND_IN_SET(userid,(select GROUP_CONCAT(enid) as id from (select enid,mgrid from tbl_login WHERE mgrid is not null order by mgrid, enid) u,(select @pv := ?) i where find_in_set(mgrid, @pv) > 0 and @pv := concat(@pv, ',', enid))) AND nmd <> ''  GROUP by start" ;  
        params= [user.enid,user.enid];
    
    }else{
        Qry = "SELECT COUNT(*) as title,DATE_FORMAT(STR_TO_DATE(t1.nmd, '%d/%m/%Y'), '%Y-%m-%d') as start FROM tbl_leadupdate t1 WHERE t1.date_gen = (SELECT MAX(t2.date_gen) FROM tbl_leadupdate t2 WHERE t2.leadid = t1.leadid) AND t1.leadstatus <> 36 AND t1.leadstatus <> 37 AND nmd <> ''  GROUP by start;SELECT COUNT(*) as title,DATE_FORMAT(STR_TO_DATE(t1.nmd, '%d/%m/%Y'), '%Y-%m-%d') as start FROM tbl_leadupdate t1 WHERE t1.date_gen = (SELECT MAX(t2.date_gen) FROM tbl_leadupdate t2 WHERE t2.leadid = t1.leadid) AND t1.leadstatus <> 36 AND t1.leadstatus <> 37  AND nmd <> ''  GROUP by start";  
    }

      db.query(Qry,params,function(err, results){
         var orders ={};
            if (err){ 
              throw err;
            }
        else{
           orders.my = JSON.parse(JSON.stringify(results[0]));
           orders.other = JSON.parse(JSON.stringify(results[1]));
        }
          console.log("Calender result",JSON.stringify(orders));
         res.send(JSON.stringify(orders));  
    });
}


exports.leadlist = function(req, res) {
    var txn = req.session.ecryt_key;
    var coid = req.session.coid;
    var lid = req.body.lid;
    var scrno = 575;

    function getserv(callback) {
        async.parallel([
            async.apply(utils.getleaddetails,lid,parseInt(scrno),txn)
        ], function(err, done) {
            if(err) console.log(err);
            /*return getserv(done,callback); */ 
            return callback(err,done);
        });
    }

    

    getserv(function(err, result) {

        if (err) {
            throw err;
        }
        console.log("Update auto: ", result[0][0]);
        if(result != null)
        res.send(result[0][0]);
      else
         res.send([]);
        /* res.render('parameter_setup',{fields:done[0],groups:done[1]}); */
        // res.send({scrndtl:result[0]});  

    });
}