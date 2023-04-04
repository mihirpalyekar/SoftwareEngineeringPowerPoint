const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher'
    },
    classRoomId: {
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