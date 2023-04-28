const express = require('express')
const app = express()
const router = express.Router();
const port = 3001
const cors = require('cors')
const bodyParser = require('body-parser')
const {User} = require('./models/user')
const {Record} = require('./models/record')
require('dotenv').config()

app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use(bodyParser.json());

//몽고 디비
const mongoose = require('mongoose')
const { Router } = require('express')
mongoose.connect('mongodb+srv://juyeon:whoami728@capstone.6igthky.mongodb.net/?retryWrites=true&w=majority')
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err))


    
//회원 관련 모듈
const {
  createUser,
  getUsers,
  getUserById,
  deleteUser,
  updateUser
} = require('./signIn');

//회원 생성
app.post("/User", createUser);

//회원 조회
app.get("/User", getUsers);
app.get("/User/:id", getUserById);

//회원 탈퇴
app.delete("/User/:id", deleteUser);

//회원 정보 수정
app.put("/users/:id", updateUser);

//로그인 관련
const jwt = require('jsonwebtoken');
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

const {
  login,
  logout,
} = require('./login');

//로그인
app.post('/login', login);

// 로그아웃
app.post('/logout', logout);

//두피 기록
const {
  createRecord,
  deleteRecord
} = require('./record')

//두피 기록 생성
app.post('/record')

//두피 기록 삭제
app.delete('/record/:id')

app.listen(port, () => console.log(`listening on port ${port}!`))