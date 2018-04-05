var Dropdown = {  
    getCoupons: function(callback) {  
        return db.query("SELECT txnid as id, cpnname as name FROM `tbl_coupon`", callback);  
    },  
    getUsers: function(mgr,callback) {  
        return db.query("SELECT enid as id, enname as name FROM tbl_login WHERE mgrid =? or enid =?",[mgr,mgr],callback);  
    },  
    getSource: function(callback) {  
        return db.query("SELECT cvid as id, cvvalule as name FROM `tbl_codevalue` where cvmasterid=3",callback);  
    },  
    getSubSource: function(callback) {  
        return db.query("SELECT cvid as id, cvvalule as name FROM `tbl_codevalue` where cvmasterid=3",callback);  
    },  
    getStage: function(callback) {  
        return db.query("SELECT cvid as id, cvvalule as name FROM `tbl_codevalue` where cvmasterid=4",callback);  
    },  
    getStatus: function(callback) {  
        return db.query("SELECT cvid as id, cvvalule as name FROM `tbl_codevalue` where cvmasterid=5",callback);  
    },
     getRoles: function(callback) {  
        return db.query("SELECT cvid as id, cvvalule as name FROM `tbl_codevalue` where cvmasterid=7",callback);  
    },
     getReporting: function(callback) {  
        return db.query("SELECT enid as id, enname as name FROM tbl_login",callback);  
    },
     gettasktype: function(callback) {  
        return db.query("SELECT cvid as id, cvvalule as name FROM `tbl_codevalue` where cvmasterid=5",callback);  
    },
      gettaskstatus: function(callback) {  
        return db.query("SELECT cvid as id, cvvalule as name FROM `tbl_codevalue` where cvmasterid=2",callback);  
    },
      getParamParent: function(callback) {  
        return db.query("SELECT cvid as id, cvvalule as name FROM `tbl_codevalue` WHERE EXISTS (SELECT CODE FROM tbl_codemaster AS t3 WHERE t3.code = tbl_codevalue.cvmasterid AND t3.usradd =0)",callback);  
    },
      getParamType: function(callback) {  
        return db.query("SELECT code as id, codename as name FROM `tbl_codemaster` where tbl_codemaster.usradd =0",callback);  
    },
    getUploadType: function(callback) {  
        return db.query("SELECT col1 as id, col2 as name FROM `tbl_uploadcode1`",callback);  
    },
    getProducts: function(callback) {  
        return db.query("SELECT cvid as id, cvvalule as name FROM `tbl_codevalue` where cvmasterid=11",callback);  
    },
    getCustomer: function(callback) {  
        return db.query("SELECT leadid as id, leadname as name FROM `tbl_leads` where status <> -1",callback);  
    },
    getTaskType: function(callback) {  
        return db.query("SELECT cvid as id, cvvalule as name FROM `tbl_codevalue` where cvmasterid=12",callback);  
    },
    getIntervals: function(callback) {  
        return db.query("SELECT cvid as id, cvvalule as name FROM `tbl_codevalue` where cvmasterid=15",callback);  
    },
    getLeadtype: function(callback) {  
        return db.query("SELECT cvid as id, cvvalule as name FROM `tbl_codevalue` where cvmasterid=6",callback);  
    },
    MisListData: function(callback) {  
        return db.query("SELECT enid as id, enname as name FROM tbl_login",callback);  
    }
    
};  
module.exports = Dropdown;  
