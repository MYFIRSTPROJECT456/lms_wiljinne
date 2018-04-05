var utils = require('./utils.js');
var async = require('async');
exports.list = function(req, res) {
    var txn = req.session.ecryt_key;
    var coid = req.session.coid;
    var lid = req.session.lid;
    var calldate = req.session.user.calldate;
    var calltype = req.session.user.calltype;
    var scrno = 575;
    function getserv(callback) {
        async.parallel([
            async.apply(utils.getscrndtl,coid,parseInt(scrno),txn),
            async.apply(utils.getleaddetails,lid,parseInt(scrno),txn)
        ], function(err, done) {
            if(err) console.log(err);
            /*return getserv(done,callback); */ 
            return callback(err,done);
        });
    }

    

    getserv(function(err, result) {

        if (err) {
            console.log(err);
        }
         console.log("Update schedule result: ", result);
        res.render('updatesch.ejs', {
            fieldstsk_d: result[0],
            fields:result[0],
            leaddtl:result[1],
            lid:lid,
            calltype:calltype,
            calldate:calldate
        });
        /* res.render('parameter_setup',{fields:done[0],groups:done[1]}); */
        // res.send({scrndtl:result[0]});  

    });
}

exports.add = function(req, res) {
    var txnid = req.body.lid;
    console.log("add lid ", txnid);
    req.session.lid = txnid;
    res.send({
        scrndtl: txnid
    });
}
