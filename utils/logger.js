import winston from "winston";

const logger = winston.createLogger({
    // 1- level :- difine minimun level of logs error(highest),warn,info,http,verbouse,debug(lowest)
    level:"info",      //  it means log everything from info-  info , warn, error
    format: winston.format.combine(   /// define format how log looks
        winston.format.timestamp(), /// add time to every log
        winston.format.json()   /// show in json format
    ),
    transports:[                               /// where log are stored
        // save error log (store only error)
        new winston.transports.File({filename:"logs/error.log",level:"error"}),
        //// save all logs
        new winston.transports.File({filename:"logs/combined.log"  }),
        ///console error
        new winston.transports.Console({format: winston.format.simple()})
    ]
})
export default logger;