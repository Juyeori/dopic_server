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

const {verifyToken} = require('./login')

//기록 생성
const createRecord = async (req, res) => {
  //토큰 검증
  const token = req.body.token; // token이 query string으로 전달되는 경우
  const decoded = verifyToken(token);

  if (!decoded) { // 유효하지 않은 토큰인 경우
    res.status(401).json({ message: 'Invalid token. You are not authorized to create a new record.' });
    return;
  }

  const newRecord = new Record(req.body);
  newRecord._id = newRecord.id + "&" + newRecord.createdAt;
  console.log(newRecord._id);
  newRecord._id = newRecord._id.substr(0, newRecord.id.length+16);
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
  const getRecordById = async (req, res) => {
    //토큰 검증
    const token = req.query.token; // token이 query string으로 전달되는 경우
    const decoded = verifyToken(token);

    if (!decoded) { // 유효하지 않은 토큰인 경우
      res.status(401).json({ message: 'Invalid token. You are not authorized to inquire records.' });
      return;
    }
    try {
      const newRecord = await Record.findById(req.params.id);
      res.status(200).json(newRecord);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };
  
  //유저 기록 조회
  const getAllRecordById = async (req, res) => {
    //토큰 검증
    const token = req.query.token; // token이 query string으로 전달되는 경우
    const decoded = verifyToken(token);

    if (!decoded) { // 유효하지 않은 토큰인 경우
      res.status(401).json({ message: 'Invalid token. You are not authorized to inquire records.' });
      return;
    }

    try {
      const records = await Record.find({ id: req.params.id });
      res.status(200).json(records);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };


  //기록 수정
  const updateRecord = async (req, res) => {
    //토큰 검증
    const token = req.body.token; // token이 query string으로 전달되는 경우
    const decoded = verifyToken(token);

    if (!decoded) { // 유효하지 않은 토큰인 경우
      res.status(401).json({ message: 'Invalid token. You are not authorized to modify records.' });
      return;
    }

    const { id } = req.params;
    const { memo } = req.body;
  
    try {
      const updatedRecord = await Record.findByIdAndUpdate(
        id,
        {  memo },
        { new: true }
      );
  
      if (!updatedRecord) {
        return res.status(404).json({ message: "Record not found" });
      }
  
      res.status(200).json(updatedRecord);
      console.log("success");
    } catch (error) {
      res.status(409).json({ message: error.message });
    }
  };
  
  //기록 삭제
  const deleteRecord = async (req, res) => {
    //토큰 검증
    const token = req.body.token; // token이 query string으로 전달되는 경우
    const decoded = verifyToken(token);

    if (!decoded) { // 유효하지 않은 토큰인 경우
      res.status(401).json({ message: 'Invalid token. You are not authorized to delete records.' });
      return;
    }

    console.info(req.params.id);
    try {
      await Record.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Record deleted successfully." });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };
  

  module.exports = {
    createRecord,
    getRecordById,
    getAllRecordById,
    updateRecord,
    deleteRecord
  };
  