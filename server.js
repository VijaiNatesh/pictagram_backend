const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
require('dotenv').config();

app.use(express.static('public')); 
app.use('/images', express.static('images'));

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URL;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true});

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('mongo DB success');
});

const userRouter = require('./routes/users');
app.use('/users', userRouter);

const postRouter = require('./routes/posts')
app.use('/posts', postRouter)

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})