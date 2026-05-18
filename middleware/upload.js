import multer from "multer";
/// storage congiguration
// const storage = multer.diskStorage({
//     destination: function(req,file,cb){
//         cb(null,"uploads/")
//     },
//     filename: function(req,file,cb){
//         const uniqueName = Date.now()+ "-"+ file.originalname;
//         cb(null,uniqueName)
//     }
// })
// const upload = multer({storage})
// export default upload;

const storage = multer.memoryStorage();
const upload = multer({storage});
export default upload;