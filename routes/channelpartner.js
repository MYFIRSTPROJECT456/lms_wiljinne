var utils = require('./utils.js');
var async = require('async');
var scrno="577";

exports.list = function(req, res){
var txn=req.session.ecryt_key;
var coid = req.session.coid;

function getAllKpis(callback){
    async.parallel([
	async.apply(utils.get_datastore,coid,parseInt(scrno),txn)
   ], function(err, done) {
        if(err) console.log(err);
return callback(err,done);
  });
}

function getserv(tbln,callback){
/*
var custtbl="tbl"+session.coid+""+tbln[0][0].scrnid;
var servtbl="tbl"+session.coid+""+tbln[1][0].scrnid;

var Qry = " SELECT  Custid, prodid, (select name from "+custtbl+" where "+custtbl+".txnid =  "+servtbl+".Custid and "+custtbl+".coid="+servtbl+".coid ) customer,  (select prodname from tbl_productdetails where tbl_productdetails.prodid = "+servtbl+".prodid and tbl_productdetails.coid="+servtbl+".coid) Product,SrvDesp as issue_description, SrnNo as prdsrlno, ifnull(imgurl1,'NA') issue_img1, ifnull(imgurl2,'NA') issue_img2, ifnull(imgurl3,'NA') issue_img3, ifnull(imgurl4,'NA') issue_img4, ifnull(imgurl5,'NA') issue_img5, ifnull(vdourl,'NA') issue_vdo, datediff(now(),date_gen) pending FROM "+servtbl+" WHERE coid = ? and status = 0 and  "+servtbl+".userid = ifnull(?,"+servtbl+".userid)";
        
      db.query(Qry,[session.coid,null], function(err, results){
            if (err){ 
              console.log(err);
            }
	else{
           var fresult =JSON.parse(JSON.stringify(results));  // Scope is larger than function  
	}*/
	callback(err,tbln);
 /*   });*/
}


getAllKpis(function(err,result){

if(err){
console.log(err);
}
/*console.log("Parameter result: ",result);
*/res.render('channel_partner.ejs',{scrndtl:result[0][0]});  
/* res.render('parameter_setup',{fields:done[0],groups:done[1]}); */  
});
}
