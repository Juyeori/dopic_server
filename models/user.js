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

const userSchema = mongoose.Schema({
    _id: {type: String, required: true},
    password: {type: String, required: true},
    nickName : {type: String, required: true},
    createdAt:{ // 글을 생성한 날짜 
        type : Date,
        default : getCurrentDate(),
    }
}, {timestamps:true})

const User = mongoose.model('userList', userSchema);
module.exports = {User}