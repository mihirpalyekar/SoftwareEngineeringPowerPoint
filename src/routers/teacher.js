const express = require('express');
const User = require('../models/user')
const auth = require('../middleware/auth').teacherAuth
const sharp = require('sharp')
const router = new express.Router();
const multer = require('multer');
const teacherControllers = require('../controllers/teacher.controller')

router.post("/register/teacher", teacherControllers.Register)
router.post("/login/teacher", teacherControllers.Login)
router.get("/teacher/home", auth, teacherControllers.showHomePage)
router.post('/teacher/classRoom/uploadDocument', auth, teacherControllers.Upload.single('fileUpload'), teacherControllers.uploadDocument)
router.get('/teacher/classRoom/getDocument', auth, teacherControllers.getDocument)
router.get("/classroom/followers", auth, teacherControllers.showAllStudents)
router.get("/teacher/loadHome", auth, teacherControllers.loadHome)
router.get("/teacher/profile", auth, teacherControllers.Profile)
router.post("/teacher/search", auth, teacherControllers.searchClassRoom)
router.get("/teacher/loadSearch", auth, teacherControllers.loadSearch)
router.get("/teacher/logout", auth, teacherControllers.Logout)
router.patch('/user/teacher/profile/update', auth, teacherControllers.UpdateProfile)
    // router.delete('/user/deleteProfile', auth, teacherControllers.DeleteProfile)
    //router.post('/user/profile/uploadAvatar', auth, teacherControllers.Upload.single('avatar'), teacherControllers.uploadAvatar)
    //router.delete('/user/profile/deleteAvatar', auth, teacherControllers.deleteAvatar)
    //router.get('/user/avatar', teacherControllers.getAvatar)
    //router.post('/user/follow', auth, teacherControllers.userFollow)
    //router.post('/user/search', auth, teacherControllers.searchUser)
    //router.get('/user/data', auth, teacherControllers.getData)
    //router.get("/following", auth, teacherControllers.Following)
    //router.get("/search", auth, teacherControllers.Searchuser)
    //router.get("/user/follower", auth, teacherControllers.showFollower)
    //router.post("/user/logoutAll", auth, teacherControllers.LogoutAll)

module.exports = router;