var config = {  
    "development": {  
        "db":{
            "mongodb": "mongodb://10.142.214.65/rankdev",
            "database": "rankdev",  
            "server": "10.142.214.65"
        }
    },
    "ITE": {  
        "db":{
            "mongodb": "mongodb://10.142.214.88/rankdev",
            "database": "rankdev",  
            "server": "10.142.214.88"
        }
    },
    "production": {  
        "db":{
            "mongodb": "mongodb://EmpRk_rw:fox89abc@10.134.166.108:15017/employeeRanking",
            "database": "rankdev",  
            "server": "10.134.166.108"
        }
    }    
}[process.env.NODE_ENV || 'development'];

module.exports = config;