const express = require('express');
const auth = require('../middleware/auth').teacherAuth;
const router = new express.Router();
const classRoomController = require('../controllers/classRoom.controller')


router.post('/classRoom/create', auth, classRoomController.createClassRoom)
router.get('/classRoom/readAll', auth, classRoomController.readAllClassRoom)
router.post('/classRoom/read', auth, classRoomController.readClassRoomById)

//router.post('/classRoom/read1', auth, classRoomController.readTweetById1)
//router.delete('/classRoom/delete', auth, classRoomController.deleteTweet)
//router.get('/classRoom', auth, classRoomController.showHomePage)

module.exports = router