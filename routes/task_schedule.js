var utils = require('./utils.js');
var async = require('async');

var tuser;
var alldates;
var Task_Process={ 
  taskmaster: function(col1){
    tuser=col1;
    // console.log("Step 1 tuser",tuser);
    function getAllKpis() {
      alldates=[];
       if(tuser.tinterval != '' && tuser.startdate != '' && tuser.enddate != ''){
              return processtask(tuser);
         }else{
          tuser.taskstatus="3";
          alldates.push(tuser);
          return alldates;
        }
   }
   function getserv(taskdate){
    // console.log("Step 3 dates",taskdate);

    for (var i = 0; i < taskdate.length; i++) {
      var date=taskdate[i];
      // console.log("adding",date);
      var record={};
      for (var key in tuser) {
        record[key]=tuser[key];
      }
      record.taskdate=date;
      record.taskstatus="3";                    
      alldates.push(record);
    }
    // console.log("Step 4 return",alldates);
    return alldates;
  }

  function processtask(task){
    var interval=""+task.tinterval;
  //  console.log("interval",interval);
    var taskdates=[];
    var dateFrom = task.startdate;
    var dateTo = task.enddate;
//taskdates.push(task.startdate);

var d1 = dateFrom.split("/");
var d2 = dateTo.split("/");
var from = new Date(d1[2], parseInt(d1[0])-1, d1[1]);  // -1 because months are from 0 to 11
var to   = new Date(d2[2], parseInt(d2[0])-1, d2[1]);
var temp_date=from;
//var diffDays = Math.round(Math.abs((from.getTime() - to.getTime())/(oneDay)));

// console.log("Step 2 dates",interval,dateFrom,dateTo);
while(temp_date.getTime() <= to.getTime()){
  if([1, 2, 3, 4, 5].includes(temp_date.getDay())){
    var day = temp_date.getDate();
    var month = temp_date.getMonth()+1;
    var year = temp_date.getFullYear();
    var formatted=""+month+"/"+day+"/"+year
    taskdates.push(formatted);
  //  console.log("looping",formatted);
  }
  switch(interval){
    case "68":
    temp_date.setDate(temp_date.getDate() + 1); 
    break;
    case "69":
    temp_date.setDate(temp_date.getDate() + 7); 
    break;
    case "70":
    temp_date.setDate(temp_date.getDate() + 15); 
    break;
    case "71":
    temp_date.setMonth(temp_date.getMonth()+1); 
    break;
    case "72":
    temp_date.setMonth(temp_date.getMonth()+3); 
    break;
    case "73":
    temp_date.setMonth(temp_date.getMonth()+6); 
    break;
    case "74":
    temp_date.setFullYear(temp_date.getFullYear() + 1);
    break;        
    default:break;
  }
}
return getserv(taskdates);
}

return getAllKpis();
}
}

    module.exports = Task_Process; 
