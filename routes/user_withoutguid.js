/*exports.login = function(req, res){
req.session.coid="5";
req.session.ecryt_key="904697ab-8e60-11e7-bce2-000d3a1134dd";
res.render('dashboard.ejs');       
};*/

exports.login = function(req, res){
   var message = '';
   var sess = req.session; 
 
   if(req.method == "POST"){
      var post  = req.body;
      var tenantid=post.PRM01;
      var name= post.PRM02;
      var pass= post.PRM03;

	var sql1="SELECT coid, enid, enname, loginid, roleid,mgrid, if(photo_url is null or photo_url=''  , CONCAT('"+url+"','contents/u00.png'),CONCAT('"+url+"',photo_url)) photo FROM `tbl_login` WHERE upper(loginid) = upper(?) and pwd = ?";
  
    db.query(sql1,[name,pass] ,function(err, results){      
         if(results != null && results.length>0){
  			req.session.user = results[0];
        res.locals.user = results[0];

        get_info(function(err,result){
        if(err){
            throw err;
        }else{
      		global.menudata=result; 
      		console.log(global.menudata); 
      		req.session.coid="5";
			    req.session.ecryt_key="904697ab-8e60-11e7-bce2-000d3a1134dd";
          res.redirect('/dashboard');
     	  }
      });
   }else{
            message = 'Wrong Credentials.';
            console.log('Wrong Credentials.');
            res.render('index.ejs',{message: message});
         }                 
      });
   } else {
        message='method not post';
        console.log('method not post');
        res.render('index.ejs',{message: message});
   }  



function get_info(callback){
var getmenuqry      = " select tbl_menu.menuid, menuname, object, pmenuid,fld_faicon from tbl_menu where tbl_menu.status=0 order by seq";
   var session =req.session.user;
   db.query(getmenuqry, function(err, results){
  if (err){
    throw err;
  }
  else{
    var menudata =JSON.parse(JSON.stringify(results));  // Scope is larger than function  
  }
  return callback(err,menudata);

  });
};
};

exports.logout = function(req, res){
    req.session.destroy();
res.redirect('/');       
};