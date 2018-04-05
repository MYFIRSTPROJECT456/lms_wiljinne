//var utils = require('./utils.js');
var async = require('async');


exports.list = function(req, res){
    var user =req.session.user;
    var calldate = req.body.calldate;
    var type = req.body.type;
//    console.log("calldate",calldate);

function getAllKpis(callback){
req.session.user.calldate = calldate;
req.session.user.calltype = type;
    
var user = req.session.user;
var params=[];

var Qry="SELECT (select leadname from tbl_leads WHERE tbl_leads.leadid = t1.leadid) as leadname,(select mobileno from tbl_leads WHERE tbl_leads.leadid = t1.leadid) as number,(select email from tbl_leads WHERE tbl_leads.leadid = t1.leadid) as email,(select tbl_codevalue.cvvalule from tbl_codevalue where tbl_codevalue.cvmasterid=3 and tbl_codevalue.cvid=((select source from tbl_leads WHERE tbl_leads.leadid = t1.leadid))) as `source`,(select tbl_codevalue.cvvalule from tbl_codevalue where tbl_codevalue.cvmasterid=6 and tbl_codevalue.cvid=((select leadtype from tbl_leads WHERE tbl_leads.leadid = t1.leadid))) as `leadtype`,(select address from tbl_leads WHERE tbl_leads.leadid = t1.leadid) as address,t1.leadid as id,nmd,(select tbl_login.enname from tbl_login WHERE tbl_login.enid= t1.userid) as user FROM tbl_leadupdate t1 WHERE t1.date_gen = (SELECT MAX(t2.date_gen) FROM tbl_leadupdate t2 WHERE t2.leadid = t1.leadid) AND t1.leadstatus <> 36 AND t1.leadstatus <> 37 AND nmd = DATE_FORMAT(STR_TO_DATE(?, '%Y-%m-%d'), '%d/%m/%Y')" ;


if(user.syno != '1'){
    
if(type == "1"){
Qry += " AND userid =?";
params.push(calldate);
params.push(user.enid);
} else {

Qry += " AND FIND_IN_SET(userid,(select GROUP_CONCAT(enid) as id from (select enid,mgrid from tbl_login WHERE mgrid is not null order by mgrid, enid) u,(select @pv := ?) i where find_in_set(mgrid, @pv) > 0 and @pv := concat(@pv, ',', enid))) "; 
params.push(calldate);
params.push(user.enid);

}
}else{
    params.push(calldate);
}
    
      db.query(Qry,params,function(err, results){
            if (err){ 
              throw err;
            }
                   var orders =JSON.parse(JSON.stringify(results));  // Scope is larger than function        
//         console.log("Calender result",orders);
         return callback(err,orders);  
    });    
    
}

getAllKpis(function(err,result){

if(err){
throw err;
}
//console.log("Call list: ",result);
    res.render('call_list.ejs',{calls:result});
 
/* res.render('parameter_setup',{fields:done[0],groups:done[1]}); */  
});
}

