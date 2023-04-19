const express = require('express')
const auth = require('../middleware/auth')
const router = new express.Router()
const Reply = require('../models/reply')
const UploadDocuments = require('../models/documents')
const replyController = require('../controllers/reply.controller')

router.post('/tweet/reply', auth, replyController.createReply)
router.delete('/tweet/reply/delete', auth, replyController.deleteReply)
router.post("/tweet/reply/like", auth, replyController.likeReply)

module.exports = router