var utils = require('./utils.js');
var async = require('async');
var scrno,lid;

 exports.list = function(req, res){
 	
	var txn=req.session.ecryt_key;
	var coid = req.session.coid;
	console.log(req.body);
	lid=req.body.lval;//req.body.lid;
	function getAllKpis(callback){
    	async.parallel([
		get_maindetails,
		get_history
   		], function(err, done) {
        	if(err) console.log(err);
			/*return getserv(done,callback); */ 
			return callback(err,done);
  		});
	}


	function get_maindetails(callback){

	var Qry="SELECT leadid,leadname,mobileno,email,(SELECT cvvalule FROM tbl_codevalue WHERE tbl_codevalue.cvid=tbl_leads.source) as source, address, (select enname from tbl_login WHERE tbl_login.enid=tbl_leads.assignto) as assignto,refname,refnumber,(SELECT cvvalule FROM tbl_codevalue WHERE tbl_codevalue.cvid=tbl_leads.products) as products,(SELECT cvvalule FROM tbl_codevalue WHERE tbl_codevalue.cvid=tbl_leads.leadtype) as leadtype,txn_latid,txn_longid,date_format(date_gen, '%d/%m/%Y') as date_gen   FROM `tbl_leads` WHERE leadid = ?";
      db.query(Qry,[lid],function(err, results){
            if (err){ 
              throw err;
            }
		else{
           var orders =JSON.parse(JSON.stringify(results));  // Scope is larger than function  
		}

		callback(err,orders);
    });
};


	function get_history(callback){

	var Qry="SELECT remarks,email,(SELECT cvvalule FROM tbl_codevalue WHERE tbl_codevalue.cvid=tbl_leadupdate.leadstatus) as leadstatus,(SELECT cvvalule FROM tbl_codevalue WHERE tbl_codevalue.cvid=tbl_leadupdate.stage) as stage,nmd,date_gen,(SELECT enname from tbl_login WHERE tbl_login.enid=tbl_leadupdate.userid) as metby FROM `tbl_leadupdate` WHERE leadid =? order by txnid desc";
      db.query(Qry,[lid],function(err, results){
            if (err){ 
              throw err;
            }
		else{
           var orders =JSON.parse(JSON.stringify(results));  // Scope is larger than function  
		}

		callback(err,orders);
    });
};
	// console.log(joverduetask);

	getAllKpis(function(err,result){
		if(err){
			console.log(err);
		}
		var f1=result[0][0];
		f1["history"]=result[1];
		console.log("history result result: ",f1);
   		res.render('lead_search.ejs',{f:f1});    	
	});

     
     
};
