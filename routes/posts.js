const postRouter = require('express').Router()
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
let path = require('path');
const Post = require('../model/Post')
const User = require('../model/User')

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'images');
    },
    filename: function(req, file, cb) {   
        cb(null, uuidv4() + '-' + Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if(allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

let upload = multer({ storage, fileFilter });

postRouter.route('/add').post(upload.single('image'), (req, res) => {
    const user = req.body.user;
    const content = req.body.content;
    const image = req.file.filename;

    const newPostData = {
        user,
        content,
        image
    }

    const newPost = new Post(newPostData);

    newPost.save()
           .then(() => res.json('Post Added'))
           .catch(err => res.status(400).json('Error: ' + err));
});


postRouter.get('/allposts', async(req, res) => {
    const posts = await Post.find().populate("userdetails", "name photo", User)
    res.send(posts)
})


postRouter.post('/like_dislike', async(req, res) => {
    const { userId, postId } = req.body
    try {
        const post = await Post.findById(postId)     

        if (!post) {
            return res.status(404).json({ error: 'post not found' })
        }        
       
        const index = post.likes.indexOf(userId)
        if (index !== -1) {
            post.likes.splice(index, 1)
            await post.save()   
            res.status(200).json({ message: 'removed likes' })            
            return;
        }

        post.likes.push(userId)
        await post.save()       
        res.status(200).json({ message: 'add like'})
        
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: "Something went wrong" })
    }
})

postRouter.put("/edit_post", async(req, res) => {
    const {postId, content} = req.body
    const post = await Post.findById(postId)
    if(!post){
        res.send('No Post is there for your request')
    }
    post.content = content;
    post.save()
    .then(() => res.json('Post Edited'))
           .catch(err => res.status(400).json('Error: ' + err));
})

module.exports = postRouter;