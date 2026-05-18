import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/errorhandler.js";
 import User from "../models/user.js"
 
 export const isAuthenticated = async(req,res,next) =>{
     try{
        let token; //// initiate token
        /////  get token form header
        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
            token = req.headers.authorization.split(" ")[1];
        }
        // if no token 
        if(!token){
            return next(new ErrorHandler("Not authorized,token missing",401))
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        // GET USER FROM DB
        const user = await User.findById(decoded.id)
        if(!user){
            return next(new ErrorHandler("user not found",404))
        }
        //// attached user to request
        req.user = user;
        next()
     }catch(error){
        return next(new ErrorHandler("Invalid token",401))
     }
     
 }

 export const authorizeRoles = (...roles) =>{
      /// check user role 
      return (req,res,next)=>{
              /// check user role
              if(!roles.includes(req.user.role)){
                return next(new ErrorHandler(`Access denied : ${req.user.role} not allowed`,403))
              }
              next()
      }
 }