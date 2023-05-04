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

//몽고 디비
const mongoose = require('mongoose')
const { Router } = require('express')

//로그인 구현해야함
const jwt = require('jsonwebtoken');

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

const login = async (req, res) => {
  const { _id, password } = req.body;

  try {
    // DB에서 유저 정보를 조회하고, 인증을 수행합니다.
    const user = await findUser(_id, password);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // JWT를 발급하고, 토큰을 클라이언트에게 반환합니다.
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY);
    res.json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

async function findUser(_id, password) {
  try {
    // 유저 정보 조회
    const user = await User.findOne({ _id }).exec();

    // 유저가 존재하지 않거나, 비밀번호가 일치하지 않으면 null을 반환합니다.
    if (!user || !comparePassword(password, user.password)) {
      return null;
    }

    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

function comparePassword(inputPassword, savedPassword) {
  // 입력된 비밀번호와 저장된 비밀번호를 비교합니다.
  return inputPassword === savedPassword;
}

// 토큰 검증 함수
const verifyToken = (token) => {
  if (!token) {
    console.error("No token provided");
    return null;
  }
  try {
    console.log(token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY, { algorithms: ['HS256'] });
    console.log(decoded);
    return decoded;
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      console.error("Token expired");
    } else if (err instanceof jwt.JsonWebTokenError) {
      console.error("JWT verification error: ", err.message);
    } else {
      console.error(err);
    }
    return null;
  }
};

// 토큰 블랙리스트 확인 함수
const isTokenBlacklisted = (decodedToken) => {
  // decodedToken에서 필요한 정보를 추출하여 블랙리스트 확인
  // 블랙리스트에 있으면 true, 없으면 false 반환
  // 여기서는 블랙리스트에 있는 토큰이 없다고 가정하여 항상 false 반환
  return false;
};

// 로그아웃 API
const logout = (req, res) => {
  const token = req.headers.authorization.trim().split(' ')[1];
  const decoded = verifyToken(token);
  if (decoded) {
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      // 만료된 토큰
      res.status(401).json({ message: '토큰이 만료되어 로그아웃 처리되었습니다.' });
    } else {
      // 유효한 토큰
      // 이미 로그아웃된 토큰인 경우 처리
      if (decoded.isLoggedOut) {
        res.status(401).json({ message: '이미 로그아웃된 토큰입니다.' });
      } else {
        // 로그아웃 처리
        decoded.isLoggedOut = true;
        const newToken = jwt.sign(decoded, process.env.JWT_SECRET_KEY);
        res.json({ message: '로그아웃되었습니다.' });
      }
    }
  } else {
    res.status(401).json({ message: '인증되지 않은 사용자입니다.' });
  }
};


module.exports = {
    login,
    logout,
    isTokenBlacklisted,
    verifyToken,
    comparePassword,
    findUser
  };