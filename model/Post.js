const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const postSchema = new Schema ({
    user:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        type: String
    },
    image:{
        type: String
    },
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'      
        }
    ]
})

postSchema.virtual('userdetails', {
    ref: 'User',
    foreignField: '_id',
    localField: 'user',
  });
postSchema.set('toJSON', { virtuals: true });

const Post = mongoose.model("Post", postSchema)
module.exports = Post;