const express = require('express')
const app = express()
const router = express.Router();
const port = 3001
const cors = require('cors')
const bodyParser = require('body-parser')
const {User} = require('./models/user')
//const {PostMessage, User} = require("./models/postMessage")

app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use(bodyParser.json());

//몽고 디비
const mongoose = require('mongoose')
const { Router } = require('express')
mongoose.connect('mongodb+srv://juyeon:whoami728@capstone.6igthky.mongodb.net/?retryWrites=true&w=majority')
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err))


//회원 가입
const createUser = async (req, res) => {
  const newUser = new User(req.body);
  try {
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
app.post("/User", createUser);
  
//회원 조회
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

app.get("/User", getUsers);
app.get("/User/:id", getUserById);

//회원 탈퇴
const deleteUser = async (req, res) => {
  console.info(req.params.id);
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

app.delete("/User/:id", deleteUser);

//회원 정보 수정
const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

app.put("/users/:id", updateUser);



// const updatePost = async (req, res) => {
//   const { id: _id } = req.params;
//   const post = req.body;

//   if (!mongoose.Types.ObjectId.isValid(_id)) {
//     res.status(404).send("해당 id는 없습니다!");
//   } else {
//     const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, {
//       new: true,
//     });
//     res.json(updatedPost);
//   }
// };

// const updateLike = async (req, res) => {
//   const { id } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     res.status(404).send("해당 값이 없습니다.");
//   } else {
//     const post = await PostMessage.findById(id);
//     const updatedPost = await PostMessage.findByIdAndUpdate(
//       id,
//       {
//         likeCount: post.likeCount + 1,
//       },
//       { new: true }
//     );

//     res.json(updatedPost);
//   }
// };



// app.get("/community", getPosts);
// app.post("/writecontent", createPost);

// app.get("/search", searchPost);


// router.patch("/:id", updatePost);
// router.patch("/:id/like", updateLike);

app.listen(port, () => console.log(`listening on port ${port}!`))