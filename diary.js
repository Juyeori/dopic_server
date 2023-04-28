const express = require('express')
const app = express()
const router = express.Router();
const port = 3001
const cors = require('cors')
const bodyParser = require('body-parser')
const {Record} = require('./models/record')
require('dotenv').config()

app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use(bodyParser.json());
const mongoose = require('mongoose')
const { Router } = require('express')

//기록 생성
const createRecord = async (req, res) => {
    console.log(req.body);
    
    const newRecord = new Record(req.body);
    newRecord._id = newRecord.id+"&"+newRecord.createdAt;
    newRecord._id = newRecord._id.substr(0, newRecord.id.length+16)
    console.log("create record");
    console.log(newRecord);
    try {
      await newRecord.save();
      res.status(201).json(newRecord);
    } catch (error) {
      res.status(409).json({ message: error.message });
    }
};
    
  //기록 조회
//   const geRecordById = async (req, res) => {
//     try {
//       const user = await User.findById(req.params.id);
//       res.status(200).json(user);
//     } catch (error) {
//       res.status(404).json({ message: error.message });
//     }
//   };
  
  
  //기록 삭제
  const deleteRecord = async (req, res) => {
    console.info(req.params.id);
    try {
      await Record.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Record deleted successfully." });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };
  
  //회원 정보 수정
//   const updateRecord = async (req, res) => {
//     try {
//       const updatedUser = await User.findByIdAndUpdate(
//         req.params.id,
//         req.body,
//         { new: true }
//       );
//       res.status(200).json(updatedUser);
//     } catch (error) {
//       res.status(404).json({ message: error.message });
//     }
//   };

  module.exports = {
    createRecord,
    deleteRecord
  };
  