var utils = require('./utils.js');
var async = require('async');
var scrno;

 exports.list = function(req, res){
	var txn=req.session.ecryt_key;
	var coid = req.session.coid;
	scrno=575;// for fab buttons
	var txnid=1;
	var leadname=req.body.lead;
	var user=req.session.user;
	function getAllKpis(callback){
    	async.parallel([
			async.apply(utils.get_leadsearch,leadname,parseInt(scrno),txn)
   		], function(err, done) {
        	if(err) console.log(err);
			/*return getserv(done,callback); */ 
			return callback(err,done);
  		});
	}
	// console.log(joverduetask);

	getAllKpis(function(err,result){
		if(err){
			console.log(err);
		}
		 console.log("Leadsearch data",result);
	    // res.render('dashboard.ejs',{fields:result[0],groups:result[1],scrndtl:result[2][0],fieldstsk_d:result[3],groupstsk_d:result[4],scrndtltsk_d:result[5][0],key_overduetask:joverduetask,key_currenttask:jcurrenttask,key_upcomingtask:jupcomingtask,key_unschedulelist:junschedulelist});     
    	 res.render('lead_search.ejs',{fields:result[0],history:[]});  
	});    
};

 exports.alist = function(req, res){
	var txn=req.session.ecryt_key;
	var coid = req.session.coid;
		var user=req.session.user;
	function getAllKpis(callback){
    	async.parallel([
			async.apply(utils.get_leadsearchauto,user.enid)
   		], function(err, done) {
        	if(err) console.log(err);
			/*return getserv(done,callback); */ 
			return callback(err,done);
  		});
	}
	// console.log(joverduetask);

	getAllKpis(function(err,result){
		if(err){
			console.log(err);
		}
	//	console.log("Leadsearch data",result[0]);
//		var main_res=JSON.parse(JSON.stringify());
	    // res.render('dashboard.ejs',{fields:result[0],groups:result[1],scrndtl:result[2][0],fieldstsk_d:result[3],groupstsk_d:result[4],scrndtltsk_d:result[5][0],key_overduetask:joverduetask,key_currenttask:jcurrenttask,key_upcomingtask:jupcomingtask,key_unschedulelist:junschedulelist});     
    	 res.send(result[0]);  
    	
	});    
};