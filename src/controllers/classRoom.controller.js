const ClassRoom = require("../models/classRoom")
require('express-fileupload')


const createClassRoom = async function(req, res) {
    const classRoom = new ClassRoom({
        ...req.body,
        owner: req.teacher._id
    })
    try {

        await classRoom.save()
        req.teacher.classRooms[classRoom._id] = classRoom._id
        req.teacher.classRoomCreatedCount = req.teacher.classRoomCreatedCount + 1
        req.teacher.markModified('classRooms')
        req.teacher.markModified('classRoomCreatedCount')

        await req.teacher.save()
        res.status(201).send(classRoom)
    } catch (e) {
        res.status(400).send(e)
    }
}

const readAllClassRoom = async function(req, res) {

    var allClass = []
    try {

        allClass = await ClassRoom.find({ owner: req.teacher._id })

        res.send(allClass)
    } catch (e) {
        res.status(500).send(e)
    }
}



const readClassRoomById = async function(req, res) {
    try {
        const classRoom = await ClassRoom.findOne({ _id: req.body.id })

        if (!classRoom) {
            return res.status(404).send()
        }
        res.send(classRoom)
    } catch (e) {
        res.status(500).send()
    }
}


module.exports = {
    createClassRoom,
    readAllClassRoom,
    readClassRoomById,

}