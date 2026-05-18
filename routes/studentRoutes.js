import express from "express";
import upload from "../middleware/upload.js";
import { isAuthenticated ,authorizeRoles} from "../middleware/authMiddleware.js";
import {getStudents,createStudent,getSingleStudent,deleteStudent,updateStudent} from "../controllers/studentController.js";
const router = express.Router();


router
  .route("/students")
  .get(getStudents)
  .post(upload.single("photo"),createStudent);
router
  .route("/students/:id")
  .get(getSingleStudent)
  .delete(isAuthenticated,authorizeRoles("admin"),deleteStudent)
  .put(isAuthenticated,authorizeRoles("admin"),updateStudent)

export default router;