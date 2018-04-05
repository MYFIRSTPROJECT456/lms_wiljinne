var utils = require('./utils.js');
var Validation = require('./lib/validate.js');
var async = require('async');


exports.list = function(req, res){
var txn="904697ab-8e60-11e7-bce2-000d3a1134dd";
var coid = 5;
var scrno="560";
var uploadid="4";
var batchno="59";
var table;
function getAllKpis(callback){
    async.parallel([
	async.apply(utils.getscrndtl,coid,parseInt(scrno),txn),
  async.apply(utils.get_uploadcode,uploadid)
   ], function(err, done) {
        if(err) console.log(err);
        table=done[1][0].storage;
          get_orders(done[1][0].selectsql,done[0],callback); 
  });
}

function get_orders(Qry,scrndtl,callback){

      db.query(Qry, [batchno],function(err, results){
            if (err){ 
              throw err;
            }
	else{
           var orders =JSON.parse(JSON.stringify(results));  // Scope is larger than function  
	}

return validateall(orders,scrndtl,callback); 
    });
};
function validateall(data,scrndtl,txncallback){
/*console.log("Staging result: ",data);*/
async.forEach(data, function(value, callback) {
        update(value,scrndtl,function(err,result){
           var response =JSON.parse(JSON.stringify(result));
               updatestaging(response,callback);
    
});
        }, function(err, results) {
          console.log("results",results);
         return  txncallback(err,results);
});
};

function update(data,scrndtl,callback){
var txnid=data.txnid;
delete data['txnid'];
 return Validation.validate_value(txnid,data,scrndtl,callback);
};

function updatestaging(response,callback){
  var position=response.txnid;
  var err_msg=response.err_msg;
  var status=response.status;
  var Qry = "UPDATE "+table+" SET `err_msg` = ?,`status`=? WHERE "+table+".`txnid` = ?";
    params=[err_msg,status,position];
db.query(Qry,params ,function(err, results){
  if(status == '-1')
     callback(new Error("Failure"),results);
   else
    callback(err,results);
});
}

getAllKpis(function(err,result){
  if(err) res.send({scrndtl:result,status:"failed"});
  else 
 res.send({scrndtl:result,status:"Success"});  
});
}
