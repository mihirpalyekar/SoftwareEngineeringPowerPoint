const express = require('express');
const authDev = require('./../middleware/auth').developerAuth
const authManager = require('./../middleware/auth').managerAuth
const router = new express.Router();
const likesController = require('../controllers/likes.controller')

router.post('/developer/post/likeDocument', authDev, likesController.likeDocumentController);
router.post('/manager/post/likeDocument', authManager, likesController.likeDocumentController);

module.exports = router;