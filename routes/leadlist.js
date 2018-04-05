var utils = require('./utils.js');
var async = require('async');


exports.list = function(req, res){
var txn=req.session.ecryt_key;
var coid = req.session.coid;
req.session.user.calldate = '';
req.session.user.calltype = '';
var scrno="575";
scrnotsk_d = "579"
function getAllKpis(callback){
    async.parallel([
	async.apply(utils.getscrndtl,coid,parseInt(scrno),txn),
	async.apply(utils.get_groups,coid,parseInt(scrno),txn),
	async.apply(utils.get_datastore,coid,parseInt(scrno),txn)
   ], function(err, done) {
        if(err) console.log(err);

/*return getserv(done,callback);*/  
return callback(err,done);
  });
}

function getserv(done,callback){

var servtbl=done[2][0].col4;
    async.parallel([
  async.apply(utils.getcolumns,servtbl)
   ], function(err, result) {
        if(err) console.log(err);
            console.log("Columns",result); 
done.push(JSON.parse(JSON.stringify(result[0])));
 callback(err,done);
  });
}


getAllKpis(function(err,result){

if(err){
throw err;
}
console.log("Parameter result: ",result);
    res.render('lead_list.ejs',{fields:result[0],groups:result[1],scrndtl:result[2][0]});
 
/* res.render('parameter_setup',{fields:done[0],groups:done[1]}); */  
});
}

