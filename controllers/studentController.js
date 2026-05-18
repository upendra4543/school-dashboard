import Student from "../models/students.js";
import ErrorHandler from "../utils/errorhandler.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";
import { clearStudentCache } from "../utils/clearCache.js";
import redisClient from "../config/redis.js";
import { response } from "express";
// ✅ GET
export const getStudents = async (req, res,next) => {
  try {
    let query = {};
    //// search by name 
    if(req.query.name){
      query.name = {
        $regex: req.query.name,
        $options:"i"
      }
    }
    /// filter by class
    if(req.query.class){
      query.class = req.query.class
    }
          ////  filter fee
     if (req.query.feeStatus === "currentDue") {
      const currentMonth = new Date().toLocaleString("default", {
        month: "long"
      });

      query["fee.monthlyFees"] = {
        $elemMatch: {
          month: currentMonth,
          paid: false
        }
      };
    }

    /// sorting
      let sortOption = {};
      if(req.query.sort){
        const field = req.query.sort.startsWith("-")?req.query.sort.substring(1):req.query.sort;
        const order = req.query.sort.startsWith("-")?-1: 1;
        sortOption[field] = order
      }
///select field
  
   let selectFields = "";
    if (req.query.fields) {
      selectFields = req.query.fields.split(",").join(" ");
    }

   // const student = await Student.find(query);  // ✅ fetch from DB
   ///  pagination
    const page = Number(req.query.page)||1
    const limit = Number(req.query.limit)||5
    // calculate skip
    const skip = (page-1)*limit;
    /// caching 
    ///1. create unique cache  key
      const cacheKey = `students:${JSON.stringify(req.query)}`
      //2. check cache
      const cacheData = await redisClient.get(cacheKey);
      //3. apply condition for caching
      if(cacheData){
        return res.status(200).json({
          success:true,
          source:"cache",
          ...JSON.parse(cacheData)
        })
      }
    //fetch data with pagination
    const students = await Student.find()
    .sort(sortOption)
    .select(selectFields)
    .skip(skip)
    .limit(limit);
    /// total page count
    const totalCount = await Student.countDocuments();
    const totalPage = Math.ceil(totalCount/limit)
    const responseData = {
      page,
      limit,
      totalCount,
      totalPage,
      data: students,
    };
    await redisClient.set(cacheKey,JSON.stringify(responseData),{EX:60})
    res.status(200).json({
      success: true,
      source:"database",
      ...responseData
    });

  } catch (error) {
      next(error)
  }
};
// ✅ POST
export const createStudent = async (req, res,next) => {
  try {
    const {
      name,
      gender,
      dob,
      class: studentClass,
      section,
      rollNumber,
      fatherName,
      motherName,
      email,
      phone,
      address,
      fees,
      documents,
      status
    } = req.body;

    // ✅ validation (based on your schema)
    if (!name || !studentClass || !gender || !dob || !fatherName) {
      return next(new ErrorHandler("Required fields missing",404))
    }
    //// Email Validation
    if(!email.includes("@")){
      return next(new ErrorHandler("Invalid Email Formate",400))
    }
   /// Phone Number Validation
   if(phone&&phone.length !==10){
        return next(new ErrorHandler("Phone Must Be 10 Digits"))
   }
   //calss Validation
   const validClasses = ["Nursurey","P.G","L.K.G","U.K.G", "1st","2nd","3rd","4th","5th","6th","7th","8th","9th","10th"];
   if(!validClasses.includes(studentClass)){
      return next(new ErrorHandler("Invalid Class",400))
   }
   //Empty string validation
   if(!name&&name.trim()===" "){
      return next(new ErrorHandler("Name is Required",400))
   }
    //const photo = req.file ? req.file.path.replace(/\\/g, "/") : null;
    ///SAVE TO CLOUDENERY
    let photo = null;
////// clear cache
await clearStudentCache(redisClient);
    // 🔥 upload to cloudinary
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      console.log("FULL URL:", result.secure_url);
      photo = result.secure_url.trim(); // ✅ store cloud URL
    }

    const newStudent = await Student.create({
      name,
      gender,
      dob,
      class: studentClass,
      photo,
      section,
      rollNumber,
      fatherName,
      motherName,
      email,
      phone,
      address,
      fees,
      documents,
      status
    });

    res.status(201).json({
      success: true,
      message: "Admission successful",
      data: newStudent
    });

  } catch (error) {
       next(error)
  }
};

//// get single student

export const getSingleStudent = async(req,res,next) =>{
        try{
           const student = await Student.findById(req.params.id)
           if(!student){
               return next(new ErrorHandler("student not fond",404))
           }
           res.status(200).json(
                {
                  success:true,
                  data:student
                }
               )
        }catch(error){
          next(error)
        }
}

/// delete student 
export const deleteStudent = async(req,res,next) =>{
         try{
             const student = await Student.findByIdAndDelete(req.params.id)
             if(!student){
                 return next(new ErrorHandler("student not found",404))
             }
             /// clear cache
             await clearStudentCache(redisClient)
             res.status(200).json({
                 success:true,
                   message: "Student deleted successfully"
             })
         }catch(error){
              next(error)
         }
}

///// update student
export const updateStudent = async(req,res,next) => {
          try{
            const student = await Student.findByIdAndUpdate(req.params.id, req.body,{
                new:true,
                runValidator:true
            })
            if(!student){
                 return next(new ErrorHandler("student not found"),404)
            }
            /// clear cache
            await clearStudentCache(redisClient)
            res.status(200).json({
                 success:true,
                 message:"student updated successfully",
                 data:student
            })
          }catch(error){
            next(error)
          }
}