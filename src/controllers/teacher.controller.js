const Teacher = require('../models/teacher')
const UploadDocuments = require('../models/documents')
const multer = require('multer');

const ClassRoom = require('../models/classRoom')
const Documents = require('../models/documents')

const path = require('path')

const Register = async function(req, res) {
    const teacher = new Teacher(req.body);
    try {
        await teacher.save();
        const token = await teacher.generateAuthToken();
        res.cookie('access_token', token)
        res.send({ teacher, redirect: '/teacher/home' })
    } catch (e) {
        res.status(400).send(e);
    }
}

const Login = async function(req, res) {
    try {
        const teacher = await Teacher.findByCredentials(req.body.email, req.body.password);
        const token = await teacher.generateAuthToken();
        res.cookie('access_token', token)
        res.send({ teacher, redirect: '/teacher/home' })
    } catch (e) {
        res.status(400).send(e)
    }
}

const Logout = async function(req, res) {
    try {
        req.teacher.tokens = req.teacher.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.teacher.save();

        res.render('login')
    } catch (e) {
        res.status(500).send()
    }
}

const UpdateProfile = async function(req, res) {
    const updates = Object.keys(req.body);
    const updatesAllowed = ['name', 'age', 'email', 'password'];
    const isValidOperation = updates.every((update) => updatesAllowed.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid Update!' })
    }

    try {
        updates.forEach((update) => req.teacher[update] = req.body[update])
        await req.teacher.save();

        const user = req.teacher
        res.send({ redirect: '/teacher/profile', user });
    } catch (e) {
        res.status(400).send(e)
    }
}


var storage = multer.diskStorage({
    destination: './public/images/',
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
    }
})

const Upload = multer({ storage: storage })

const uploadDocument = async function(req, res) {
    //if want to restrict the size and dimentions uncomment below line and replace  uploadDocument.fileUpload = file with uploadDocument.fileUpload = buffer
    //const buffer = await sharp(req.file).resize({ width: 250, height: 250 }).png()
    const file = req.file
    try {
        const classRoom = await ClassRoom.findOne({ name: req.body.name })
        if (classRoom.owner.toString() === req.teacher._id.toString()) {
            const uploadDocument = new UploadDocuments({
                teacherId: req.teacher._id,
                classRoomId: classRoom.id,
                name: req.body.name,
                description: req.body.description
            })
            uploadDocument.fileUpload = file
            await uploadDocument.save()
            await uploadDocument.populate('teacherId', 'name email age').populate('studentId', 'name email age').execPopulate()
            res.send(uploadDocument);
        } else {
            throw new error()
        }
    } catch (e) {
        if (e) {
            res.status(500).send(e);
        } else {
            res.status(500).send("Class not found");
        }

    }
}

const getDocument = async function(req, res) {
    try {
        var id = req.teacher._id.toString()
        classRoom = await UploadDocuments.find({ teacherId: id })
        res.send(classRoom)
    } catch (e) {
        res.status(500).send("Something went wrong while getting document");
    }
}

const showAllStudents = async function(req, res) {
    var students = []
    try {
        students = await ClassRoom.findOne({ name: req.body.name })
        res.send(students.students)
    } catch (e) {
        res.status(500).send("somthing went wrong")
    }
}

const searchClassRoom = async function(req, res) {
    try {
        const classRoom = await ClassRoom.findOne({ name: req.body.name }).populate('owner', 'name email age')
        if (!classRoom) {
            return alert('Class room not found')
        }
        res.send(classRoom)
    } catch (e) {
        res.status(500).send("somthing went wrong")
    }
}

const loadSearch = async function(req, res) {
    try {
        const user = req.teacher
        res.render('TeacherSearch', { user })
    } catch (e) {
        res.status(500).send("Something went wrong while loading page")
    }
}

const showHomePage = async function(req, res) {
    try {
        const user = req.teacher
        res.render('TeacherHome', {
            user
        })
    } catch (e) {
        res.status(500).send();
    }
}

const Profile = async function(req, res) {
    const user = req.teacher
    res.render('TeacherProfile', {
        user
    })
}



const loadHome = async function(req, res) {
    var classRooms = Object.keys(req.teacher.classRooms)

    const documents = await Documents.find({ classRoomId: { $in: classRooms } }).populate('teacherId', 'name email age').populate('studentId', 'name email age')
    res.send(documents)
}



module.exports = {
    Register: Register,
    Login: Login,
    Profile: Profile,
    Logout: Logout,
    UpdateProfile: UpdateProfile,
    uploadDocument,
    Upload,
    showAllStudents,
    showHomePage,
    getDocument,
    searchClassRoom,
    loadSearch,
    loadHome,
}