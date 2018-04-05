var express = require('express');  
var router = express.Router();  
var Dropdown = require('./dropdownmodel');  
router.get('/getcoupons', function(req, res, next) {  
        Dropdown.getCoupons(function(err, rows) {  
            if (err) {  
                res.send(err);  
            } else {  
               res.send(rows); 
            }  
        });      
}); 

router.get('/getassignto', function(req, res, next) {  
        Dropdown.getUsers(req.session.user.enid,function(err, rows) {  
            if (err) {  
                res.send(err);  
                console.log("Error dropdown");
            } else {  
                res.send(rows);  
            }  
        });      
}); 
router.get('/getstage', function(req, res, next) {  
        Dropdown.getStage(function(err, rows) {  
            if (err) {  
                res.send(err);  
                console.log("Error dropdown");
            } else {  
                res.send(rows);  
            }  
        });      
}); 
router.get('/getsource', function(req, res, next) {  
        Dropdown.getSource(function(err, rows) {  
            if (err) {  
                res.send(err);  
                console.log("Error dropdown");
            } else {  
                res.send(rows);  
            }  
        });      
}); 
router.get('/getsubsource', function(req, res, next) {  
        Dropdown.getSubSource(function(err, rows) {  
            if (err) {  
                res.send(err);  
                console.log("Error dropdown");
            } else {  
                res.send(rows);  
            }  
        });      
}); 
router.get('/getstatus', function(req, res, next) {  
        Dropdown.getStatus(function(err, rows) {  
            if (err) {  
                res.send(err);  
                console.log("Error dropdown");
            } else {  
                res.send(rows);  
            }  
        });      
}); 
router.get('/getroles', function(req, res, next) {  
        Dropdown.getRoles(function(err, rows) {  
            if (err) {  
                res.send(err);  
                console.log("Error dropdown");
            } else {  
                res.send(rows);  
            }  
        });      
}); 
router.get('/getreporting', function(req, res, next) {  
        Dropdown.getReporting(function(err, rows) {  
            if (err) {  
                res.send(err);  
                console.log("Error dropdown");
            } else {  
                res.send(rows);  
            }  
        });      
});  

router.get('/gettaskstatus', function(req, res, next) {  
        Dropdown.gettaskstatus(function(err, rows) {  
            if (err) {  
                res.send(err);  
                console.log("Error dropdown");
            } else {  
                res.send(rows);  
            }  
        });      
}); 

router.get('/getParamParent', function(req, res, next) {  
        Dropdown.getParamParent(function(err, rows) {  
            if (err) {  
                res.send(err);  
                console.log("Error dropdown");
            } else {  
                res.send(rows);  
            }  
        });      
});  

router.get('/getParamType', function(req, res, next) {  
        Dropdown.getParamType(function(err, rows) {  
            if (err) {  
                res.send(err);  
                console.log("Error dropdown");
            } else {  
                res.send(rows);  
            }  
        });      
}); 

router.get('/getUploadType', function(req, res, next) {  
        Dropdown.getUploadType(function(err, rows) {  
            if (err) {  
                res.send(err);  
                console.log("Error dropdown");
            } else {  
                res.send(rows);  
            }  
        });      
}); 

router.get('/getproducts', function(req, res, next) {  
        Dropdown.getProducts(function(err, rows) {  
            if (err) {  
                res.send(err);  
                console.log("Error dropdown");
            } else {  
                res.send(rows);  
            }  
        });      
}); 

router.get('/getcustomer', function(req, res, next) {  
        Dropdown.getCustomer(function(err, rows) {  
            if (err) {  
                res.send(err);  
                console.log("Error dropdown");
            } else {  
                res.send(rows);  
            }  
        });      
}); 
router.get('/gettasktype', function(req, res, next) {  
        Dropdown.getTaskType(function(err, rows) {  
            if (err) {  
                res.send(err);  
                console.log("Error dropdown");
            } else {  
                res.send(rows);  
            }  
        });      
}); 

router.get('/getinterval', function(req, res, next) {  
        Dropdown.getIntervals(function(err, rows) {  
            if (err) {  
                res.send(err);  
                console.log("Error dropdown");
            } else {  
                res.send(rows);  
            }  
        });      
}); 


router.get('/getleadtype', function(req, res, next) {  
        Dropdown.getLeadtype(function(err, rows) {  
            if (err) {  
                res.send(err);  
                console.log("Error dropdown");
            } else {  
                res.send(rows);  
            }  
        });      
});

router.get('/getmisdrop', function(req, res, next){
        Dropdown.MisListData(function(err, rows){
            if (err) {
                res.send(err);
                console.log("Error dropdown", err);
            }
            else{
                res.send(rows);
                //console.log('inside'+JSON.stringify(rows));
            }
        });
});

router.get('/assigntofilter', function(req, res, next){
    var id = req.body.id;
        Dropdown.assigntodata(id, function(err, rows){
            if (err) {
                res.send(err);
                console.log("Error dropdown", err);
            }
            else{
                res.send('misreport', { data : rows});
                console.log('ok not working'+rows);
            }
        });
});

module.exports = router;  
