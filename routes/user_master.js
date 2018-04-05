var utils = require('./utils.js');
var async = require('async');
var scrno="576";

exports.list = function(req, res){
var txn=req.session.ecryt_key;
var coid = req.session.coid;

function getAllKpis(callback){
    async.parallel([
	async.apply(utils.get_datastore,coid,parseInt(scrno),txn)
   ], function(err, done) {
        if(err) console.log(err);
/*return getserv(done,callback); */ 
return callback(err,done);
  });
}

function getserv(tbln,callback){
	callback(err,tbln);
}


getAllKpis(function(err,result){

if(err){
throw err;
}
console.log("Parameter result: ",result);
    res.render('user_master.ejs',{scrndtl:result[0][0]});  
});
}
