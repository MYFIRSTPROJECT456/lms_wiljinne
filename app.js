

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , compression = require('compression')
  , async = require('async')
  , session = require('express-session');
var multer = require('multer');  

var app = express();
var mysql      = require('mysql');
var bodyParser=require("body-parser");

//database connection
/*var connection = mysql.createConnection({
              host     : '172.104.17.202',
              user     : 'pmp_admin',
              password : 'Mdex@2312',
              database : 'FV00014',
		      debug    :  false,
	          multipleStatements: true
            });
*/
var connection = mysql.createConnection({
              host     : 'localhost',
              user     : 'root',
              password : 'shri',
              database : 'FV00014',
		      debug    :  false,
	          multipleStatements: true
            });




connection.connect();

//constants
const AES = require('mysql-aes');
global.AES = require('mysql-aes');
global.db = connection;
// global.url="http://apicdb.centralindia.cloudapp.azure.com/lms/lms_willjinne/"; 
global.url=""; 

// all environments
app.use(compression());
app.set('port', process.env.PORT || 4002);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(session({secret: 'apical'}));

 app.use(session(
    { secret: "apical", maxAge: Date.now() + (30 * 86400 * 1000)
    }));


//one session
app.use(function(req, res, next) {
  if (req.session && req.session.user) {
        req.user = req.session.user;
        delete req.user.pwd; // delete the password from the session
        req.session.user = req.user;  //refresh the session value
        res.locals.user = req.user;
      next();
     } else {
    next();
  }
});

app.use(function(err, req, res, next) {  
        res.status(err.status || 500);  
        res.render('error', {  
            message: err.message,  
            error: err  
        });  
});


//common routes
var index = require('./routes/index')
var user = require('./routes/user');
var channelpartner = require('./routes/channelpartner');
var couponmgnt = require('./routes/couponmgnt');
var dashboard = require('./routes/dashboard');
var leadlist = require('./routes/leadlist');
var leadsearch = require('./routes/leadsearch');
var parameter_setup = require('./routes/parameter_setup');
var profile = require('./routes/profile');
var task_status = require('./routes/task_status');
var upandsch = require('./routes/upandsch');
var user_master = require('./routes/user_master');
var scrndata = require('./routes/scrndata');
var dynamic = require('./routes/dynamic');
var savedata = require('./routes/savedata');
var getdata = require('./routes/getdata');
var uploadfile = require('./routes/uploadfile');
var uploadingfile = require('./routes/uploadingfile');
var historydata = require('./routes/historydata');
var dropdown = require('./routes/lib/dropdown');
var taskdefinition = require('./routes/taskdefinition');
var task_overview = require('./routes/task_overview');
var userm = require('./routes/user_master_staging');
var processfile = require('./routes/processfile');
var uploaddetails = require('./routes/uploaddetails');
var updatedata = require('./routes/updatedata');
var closure = require('./routes/closure');
var changepass = require('./routes/changepass');
var calllist = require('./routes/calllist');
var leadpush = require('./routes/leadpush');
var misreport = require('./routes/misreport');
var assigntofilter = require('./routes/assigntofilter');
var allocationdata = require('./routes/allocationdata');


//Middleware
app.get('/', routes.index);//call for main index page
app.use('/v1', dropdown);//call for main index page
app.post('/login',user.login);
app.get('/logout',user.logout);
app.get('/dashboard',dashboard.list);
app.get('/leadlist',leadlist.list);
app.get('/taskstatus',task_status.list);
app.get('/taskoverview',task_overview.list);
app.get('/parametersetup',parameter_setup.list);
app.post('/saveparams',parameter_setup.save);
app.get('/taskdefinition',taskdefinition.list);
app.get('/usermaster',user_master.list);
app.get('/channelpartner',channelpartner.list);
app.get('/couponmanagement',couponmgnt.list);
app.get('/updatesch',upandsch.list);
app.post('/addldid',upandsch.add);
app.post('/leadsearch',leadsearch.list);
app.get('/leadsearchauto',leadsearch.alist);
app.get('/profile',profile.list);
app.get('/scrndata',scrndata.list);
app.post('/savedata',savedata.add);
app.post('/updatedata',updatedata.update);
app.post('/approvelead',closure.approve);
app.post('/rejectlead',closure.reject);
app.post('/updateschedule',updatedata.reschedule);
app.post('/gettaskdata',getdata.list);
app.get('/events',getdata.events);
app.post('/getleaddata',getdata.leadlist);
app.get('/uploadfile',uploadfile.list);
app.post('/uploadingfile',uploadingfile.upload);
app.post('/historydata',historydata.list);
app.post('/processfile',processfile.processdata);
app.post('/uploaddetails',uploaddetails.list);
app.post('/acceptdetails',uploaddetails.alist);
app.post('/rejectdetails',uploaddetails.rlist);
app.post('/validateCoupons',userm.list);
app.post('/updatetask',updatedata.updatetask);
app.post('/changepass',changepass.changepass);
app.post('/calllist',calllist.list);
app.post('/leadpush',leadpush.push);
app.get('/misreport',misreport.list);
app.post('/assigntofilter',assigntofilter.assigntofilter);
app.post('/allocationdata',allocationdata.allocate);



//listen to port
var server=app.listen(4002);
server.on('connection', function(socket) {
  console.log("A new connection was made by a client.");
  socket.setTimeout(30 * 86400 * 1000);
  // 30 second timeout. Change this as you see fit.
});

