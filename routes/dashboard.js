var utils = require('./utils.js');
var async = require('async');
var scrno;

exports.list = function(req, res){
    var all = req.session.syno;
	var txn=req.session.ecryt_key;
	var coid = req.session.user.coid;
	var user = req.session.user;
	scrno=575;// for fab buttons
	scrnotsk_d = 579; //for task dialog 
	function getAllKpis(callback){
    	async.parallel([
			async.apply(utils.getscrndtl,coid,parseInt(scrno),txn),
			async.apply(utils.get_groups,coid,parseInt(scrno),txn),
    		async.apply(utils.get_datastore,coid,parseInt(scrno),txn),

    		async.apply(utils.getscrndtl,coid,parseInt(scrnotsk_d),txn),
			async.apply(utils.get_groups,coid,parseInt(scrnotsk_d),txn),
    		async.apply(utils.get_datastore,coid,parseInt(scrnotsk_d),txn),

    		async.apply(utils.get_leadhistdata,parseInt(1),parseInt(scrno),txn,user),
    		async.apply(utils.get_leadhistdata,parseInt(2),parseInt(scrno),txn,user),
    		async.apply(utils.get_leadhistdata,parseInt(3),parseInt(scrno),txn,user),
    		async.apply(utils.get_leadhistdata,parseInt(4),parseInt(scrno),txn,user),
			async.apply(utils.getKpis,user)
   		], function(err, done) {
		console.log(done[0]);
        	if(err) console.log(err);
			return callback(err,done);
  		});
	}
//sample function 
	function get_sanctions(callback){

	var Qry="";
      db.query(Qry,[user.enid],function(err, results){
            if (err){ 
              throw err;
            }
		else{
           var orders =JSON.stringify(results);  // Scope is larger than function  
		}
		callback(err,orders);
    });
};

	getAllKpis(function(err,result){
		if(err){
			throw err;
		}	   
    	res.render('dashboard.ejs',{fields:result[0],groups:result[1],scrndtl:result[2][0],fieldstsk_d:result[3],groupstsk_d:result[4],scrndtltsk_d:result[5][0],key_overduetask:result[6],key_currenttask:result[7],key_upcomingtask:result[8],key_unplannedtask:result[9],kpis:result[10][0]});         	
	});
};
