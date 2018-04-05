var allfiltermodel = require('./allfiltermodel.js');
var async = require('async');

exports.assigntofilter = function(req, res, next){
	console.log("Selected assignies : ",req.body);

	allfiltermodel.assigntofilter(req.body, function(error, result){
		// console.log('assigntofilter result',error, result);
		if (error) {
			res.send(error);
		}
		else{
			res.send(JSON.parse(JSON.stringify({"data":result})));
		}
	});
}