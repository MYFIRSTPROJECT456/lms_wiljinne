var utils = require('./utils.js');
var Validation = require('./lib/validate.js');
var async = require('async');
var Save = require('./savedata_var.js');

var Master_Process={ 
	processmaster: function(col1,col2,col3,col4,callback){
var coid = col1.coid;
var userid=col1.enid;
var user=col1;
var uploadid=col2;
var batchno=col3;
var txn=col4;
console.log("Upload id :",uploadid);
var table,mainins,scrno;;
function getAllKpis(callback){
  get_scrn(uploadid,function(err,result){
  	scrno=result.col7;
  	console.log("Updated scrno :",result);
    async.parallel([
	async.apply(utils.getscrndtl,coid,parseInt(scrno),txn),
 	 async.apply(utils.get_uploadcode,uploadid,txn),
  	async.apply(utils.get_datastore,coid,parseInt(scrno),txn)
   ], function(err, done) {
        if(err) console.log(err);
        table=done[1][0].col3;
        mainins=done[2][0];
          get_orders(done[1][0].selectsql,done[0],callback); 
  });
        				    
});

}


function get_scrn(uploadid,callback){
  async.parallel([
 	 async.apply(utils.get_uploadcode,uploadid,txn)
   ], function(err, done) {
 callback(err,done[0][0]); 
  });
};




function get_orders(Qry,scrndtl,callback){

      db.query(Qry, [batchno],function(err, results){
            if (err){ 
              console.log(err);
            }
	else{
           var orders =JSON.parse(JSON.stringify(results));  // Scope is larger than function  
	}

return validateall(orders,scrndtl,callback); 
    });
};

function validateall(data,scrndtl,txncallback){
/*console.log("Staging result: ",data);*/
async.forEachLimit(data, 10,function(value, callback) {
        update(value,scrndtl,function(err,result){

        	 var response =JSON.parse(JSON.stringify(result));
        	 return updatestaging(response,err,value,callback);     	  
        	  //savedata(value,mainins);					    
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

function updatestaging(response,errorp,value,callback){
  var position=response.txnid;
  var err_msg=response.err_msg;
  var status=response.status;
  console.log("Record:",status);
  var Qry = "UPDATE "+table+" SET `err_msg` = ?,`status`=? WHERE "+table+".`txnid` = ?";
    params=[err_msg,status,position];
			db.query(Qry,params ,function(err, results){
  if(status == '-1'){
  	var error;
     callback(error,results);
  }
   else{
   	if(errorp){
   		callback(err,results);
   	}else
	 Save.savemaster(user,txn,scrno,value,callback);
   	}
	
});
}

function updatebatchstatus(){
  var Qry = "UPDATE `tbl_uploadlog` SET Status ='2' WHERE batchno =?";
    params=[batchno];
			db.query(Qry,params ,function(err, results){
});
}

function savedata(value,data){
  //  console.log("query resp data : ",data);
    //  console.log("query resp value : ",value);
    query = data.col6;
    var fresult =JSON.parse(JSON.stringify(value)); 
    async.parallel([
        async.apply(utils.insert_data,query,fresult,parseInt(userid)) 
    ], function(err, result) {
        if(err) console.log(err);
  });
}

getAllKpis(function(err,result){
	updatebatchstatus();
  if(err)
   callback(err,result);
  else 
 callback(err,result); 
});
}
}
	module.exports = Master_Process; 
