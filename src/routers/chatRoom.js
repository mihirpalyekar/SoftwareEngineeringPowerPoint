const express = require('express');
const auth = require('../middleware/auth').managerAuth;
const router = new express.Router();
const chatRoomController = require('../controllers/chatRoom.controller')


router.post('/chatRoom/create', auth, chatRoomController.createChatRoom)
router.get('/chatRoom/readAll', auth, chatRoomController.readAllChatRoom)
router.post('/chatRoom/read', auth, chatRoomController.readChatRoomById)

//router.post('/chatRoom/read1', auth, classRoomController.readTweetById1)
//router.delete('/chatRoom/delete', auth, classRoomController.deleteTweet)
//router.get('/chatRoom', auth, classRoomController.showHomePage)

module.exports = router