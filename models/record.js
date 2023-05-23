const mongoose = require('mongoose');
const express = require('express');

function getCurrentDate() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth();
    var today = date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    return new Date(Date.UTC(year, month, today, hours, minutes, seconds));
}

const recordSchema = mongoose.Schema({
    id: {type: String, required: true},
    //진단 값
    result: {type: [Number]},
    //진단 결과
    comment : {type: String},
    //생활 습관 기록
    memo : [{ type: String }],
    createdAt:{ // 글을 생성한 날짜 
        type : Date,
        default : getCurrentDate(),
    },
    _id: {type: String, required: true} //id+createdAt
}, {timestamps:true})

const Record = mongoose.model('recordList', recordSchema);
module.exports = {Record}