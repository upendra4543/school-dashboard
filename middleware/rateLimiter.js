import rateLimit from "express-rate-limit";
export const apiLimiter = rateLimit({
      windowMs:15*60*1000,       // 15 minutes
      max:100,   //// max 100 request in 15 minutes
      message:{
        success:false,
        message: "Too many request please try again latter"
        
      },
      standardHeaders:true,
      legacyHeaders:false
})
///login limiter 

export const loginLimiter =rateLimit({
      windowMs:10*60*100,    /// 10 minute
      max:5 , ////   max 5 attempt in 10 minutes
      message:{
        success:false,
        message:"Too many login attempt please try again latter"
      }
})