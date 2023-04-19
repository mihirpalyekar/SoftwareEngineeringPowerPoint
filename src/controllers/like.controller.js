const Like = require('../models/likes')
const UploadDocuments = require('../models/documents')

const likeDocument = async function(req, res) {
    try {
        const like = await Like.findOne({ postId: req.body.id, UserId: req.user._id })
        if (!like) {
            const like = new Like({
                ...req.body,
                UserId: req.user._id,
                postId: req.body.id
            })
            try {
                const uploadedDocument = await UploadDocuments.findOne({ _id: req.body.id })
                uploadedDocument.likeCount = uploadedDocument.likeCount + 1
                await uploadedDocument.save()
                await like.save()
                res.status(201).send({ like, UploadDocuments })
            } catch (e) {
                res.status(400).send(e)
            }
        } else {
            const uploadedDocument = await UploadDocuments.findOne({ _id: req.body.id })
            uploadedDocument.likeCount = uploadedDocument.likeCount - '1'
            await uploadedDocument.save()
            await like.remove()
            res.status(200).send()
        }
    } catch (e) {
        res.status(500).send()
    }
}


module.exports = {
    likeDocument,
}