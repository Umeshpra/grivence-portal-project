const express = require('express')
const FrontController = require("../controllers/FrontController")
const TeacherController = require("../controllers/TeacherController")
const admincontroller = require("../controllers/admin/admincontroller")
const StudentController = require('../controllers/admin/StudentController')
const ComplaintController = require('../controllers/admin/ComplaintController')
const route = express.Router()
const checkauth = require('../middlewear/auth')
const CourseController = require('../controllers/admin/CourseControlller')


//routing
route.get('/', FrontController.home)
route.get('/about', FrontController.about)
route.get('/grivancesystem', FrontController.grivancesystem)
route.get('/features',FrontController.features)
route.get('/benifits',FrontController.benifits)
route.get('/help',FrontController.help)

//teachercontroller

route.get('/teacher/display', TeacherController.displayTeacher)

//admin controller

route.get('/dashboard',checkauth,admincontroller.dashboard)
route.post('/admininsert',admincontroller.admininsert)
route.get('/displaycomplaint',checkauth,admincontroller.displaycomplaint)
// route.post('/admin/verifylogin',admincontroller.verifylogin)

// admin StudentController

route.get('/admin/addstudent',checkauth,StudentController.addstudent) 
route.get('/admin/login',checkauth,StudentController.login)
route.get('/admin/registration',checkauth,StudentController.registration)
route.post('/studentinsert',checkauth,StudentController.studentinsert)
route.get('/admin/studentview/:id',checkauth,StudentController.viewstudent)
route.get('/admin/studentedit/:id',checkauth,StudentController.editstudent)
route.post('/admin/studentupdate/:id',checkauth,StudentController.updatestudent)
route.get('/admin/studentdelete/:id',checkauth,StudentController.deletestudent)
route.get('/logout',StudentController.logoutstudent)
route.post('/verifylogin',StudentController.verifylogin)
route.get('/changepassword',checkauth,StudentController.changepassword)
route.get('/profile',checkauth,StudentController.profile)
route.post('/updateprofile',checkauth,StudentController.updateprofile)
route.post('/updatepassword',checkauth,StudentController.updatepassword)

//complaint controller

route.get('/addcomplaint',checkauth,ComplaintController.addcomplaint)
route.post('/complaintinsert',checkauth,ComplaintController.complaintinsert)
route.get('/complaint/complaintview/:id',checkauth,ComplaintController.complaintview)
route.get('/complaint/complaintedit/:id',checkauth,ComplaintController.complaintedit)
route.post('/complaintupdate/:id',checkauth,ComplaintController.complaintupdate)
route.get('/complaint/complaintdelete/:id',checkauth,ComplaintController.complaintdelete)
route.post('/updatestatus/:id',checkauth,ComplaintController.updatestatus)

//course controller
route.get('/addcourse',checkauth,CourseController.addcourse)
route.post('/courseinsert',checkauth,CourseController.courseinsert)
route.get('/course/courseview/:id',checkauth,CourseController.courseview)
route.get('/course/courseedit/:id',checkauth,CourseController.courseedit)
route.post('/course/courseupdate/:id',checkauth,CourseController.courseupdate)
route.get('/course/coursedelete/:id',checkauth,CourseController.coursedelete)




module.exports = route