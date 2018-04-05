
var async = require('async');
var gerror = '0';
var gerror_msg = '';
exports.push = function(req, res){

    var post = req.body;
    var aleadtype = ['109','110','111'];
    var asource = ['8','9','10','11','12','13','14','15','16','17','18','19','20'];
    var aproducts = ['94','95'];
    var ausers = ['10','15','16','17','18'];

    if (post.leadtype && (aleadtype.indexOf(post.leadtype) > -1)) {
} else {
   gerror = '1';
 gerror_msg = 'Lead type should be as per Lead type ids provided ';
}
    
     if (post.products && (aproducts.indexOf(post.products) > -1)) {
} else {
   gerror = '1';
 gerror_msg = 'Products should be as per product ids provided';
}
    
     if (post.source && (asource.indexOf(post.source) > -1)) {
} else {
   gerror = '1';
 gerror_msg = 'Source should be as per source ids provided ';
}
 
     if (post.assignto && (ausers.indexOf(post.assignto) > -1)) {
} else {
   gerror = '1';
 gerror_msg = 'Assignto should be as per User ids provided ';
}
    
    
    if(gerror == '0'){
    var leadid = ""+(new Date().getFullYear())+""+(Math.floor(Math.random() * 10000000));    
    var leadname = post.leadname || '';
    var mobileno = post.mobileno || '';
    var email = post.email || '';
    var source = post.source || '';
    var address = post.address || '';
    var assignto = post.assignto || '';
    var refname = post.refname || '';
    var refnumber = post.refnumber || '';
    var products = post.products || '';
    var leadtype = post.leadtype || '';
    
var getmenuqry = "INSERT INTO `tbl_leads` (`leadid`, `leadname`, `mobileno`, `email`, `source`, `address`, `assignto`, `refname`, `refnumber`, `products`,`leadtype`,`userid`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
    
    params = [leadid,leadname,mobileno,email,source,address,assignto,refname,refnumber,products,leadtype,'19'];
      db.query(getmenuqry,params, function(err, results){
   if (err || results.affectedRows == 0){
    res.send({
        status: '1',
        status_msg : 'Error while saving'
    });
            }
   else{
    res.send({
        status: '0',
        status_msg : 'Success'
    });
   }       
});
    }else{
        res.send({
        status: gerror,
        status_msg : gerror_msg
    });
        gerror = '0';
        gerror_msg = '';
    }
    
               }
