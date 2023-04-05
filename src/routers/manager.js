const express = require('express');
const Developer = require('../models/developer')
const auth = require('../middleware/auth').managerAuth
const sharp = require('sharp')
const router = new express.Router();
const multer = require('multer');
const teacherControllers = require('../controllers/manager.controller')

router.post("/register/manager", teacherControllers.Register)
router.post("/login/manager", teacherControllers.Login)
router.get("/manager/home", auth, teacherControllers.showHomePage)
router.post('/manager/chatRoom/uploadDocument', auth, teacherControllers.Upload.single('fileUpload'), teacherControllers.uploadDocument)
router.get('/manager/chatRoom/getDocument', auth, teacherControllers.getDocument)
router.get("/classroom/followers", auth, teacherControllers.showAllStudents)
router.get("/manager/loadHome", auth, teacherControllers.loadHome)
router.get("/manager/profile", auth, teacherControllers.Profile)
router.post("/manager/search", auth, teacherControllers.searchClassRoom)
router.get("/manager/loadSearch", auth, teacherControllers.loadSearch)
router.get("/manager/logout", auth, teacherControllers.Logout)
router.patch('/developer/manager/profile/update', auth, teacherControllers.UpdateProfile)
    // router.delete('/developer/deleteProfile', auth, teacherControllers.DeleteProfile)
    //router.post('/developer/profile/uploadAvatar', auth, teacherControllers.Upload.single('avatar'), teacherControllers.uploadAvatar)
    //router.delete('/developer/profile/deleteAvatar', auth, teacherControllers.deleteAvatar)
    //router.get('/developer/avatar', teacherControllers.getAvatar)
    //router.post('/developer/follow', auth, teacherControllers.userFollow)
    //router.post('/developer/search', auth, teacherControllers.searchUser)
    //router.get('/developer/data', auth, teacherControllers.getData)
    //router.get("/following", auth, teacherControllers.Following)
    //router.get("/search", auth, teacherControllers.Searchuser)
    //router.get("/developer/follower", auth, teacherControllers.showFollower)
    //router.post("/developer/logoutAll", auth, teacherControllers.LogoutAll)

module.exports = router;