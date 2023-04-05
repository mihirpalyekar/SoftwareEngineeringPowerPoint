const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    developerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Developer'
    },
    managerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Manager'
    },
    chatRoomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ClassRoom'
    },
    name: {
        type: String,
        required: true
    },
    fileUpload: {
        
    },
    description: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const UploadDocuments = mongoose.model('UploadDocuments', documentSchema)
module.exports = UploadDocuments;