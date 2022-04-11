const userRouter = require('express').Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
let path = require('path');
let User = require('../model/User');
const bcrypt = require('bcryptjs')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images');
    },
    filename: function (req, file, cb) {
        cb(null, uuidv4() + '-' + Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

let upload = multer({ storage, fileFilter });

userRouter.route('/add').post(upload.single('photo'), (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const birthdate = req.body.birthdate;
    const photo = req.file.filename;

    const newUserData = {
        name,
        email,
        password,
        birthdate,
        photo
    }

    const newUser = new User(newUserData);

    newUser.save()
        .then(() => res.json('User Added'))
        .catch(err => res.status(400).json('Error: ' + err));
});


userRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email })
        if (!user) {
            res.send("User does not exists")
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.send("Invalid Credentials")
        }

        res.send(user)
    }
    catch (err) {
        res.send(err)
    }

})


module.exports = userRouter;