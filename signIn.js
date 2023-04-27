const express = require('express')
const app = express()
const router = express.Router();
const port = 3001
const cors = require('cors')
const bodyParser = require('body-parser')
const {User} = require('./models/user')
require('dotenv').config()

//const {PostMessage, User} = require("./models/postMessage")

app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use(bodyParser.json());
const mongoose = require('mongoose')
const { Router } = require('express')

//회원 가입
const createUser = async (req, res) => {
    console.log(req.body);
    const newUser = new User(req.body);
    console.log("createUser");
    console.log(newUser);
    try {
      await newUser.save();
      res.status(201).json(newUser);
    } catch (error) {
      res.status(409).json({ message: error.message });
    }
};
    
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

  module.exports = {
    createUser,
    getUsers,
    getUserById,
    deleteUser,
    updateUser
  };
  