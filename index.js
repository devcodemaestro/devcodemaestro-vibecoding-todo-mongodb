require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 5000;
const MONGODB_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/vibecoding_todo";

// CORS 기본 설정
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// JSON 바디 파서
app.use(express.json());

// 라우터 연결
app.use("/todos", require("./routes/todos"));

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("몽고디비 연결 성공");
    app.listen(PORT, () => {
      console.log(`서버가 포트 ${PORT}에서 실행 중`);
    });
  })
  .catch((error) => {
    console.error("몽고디비 연결 실패:", error.message);
    process.exit(1);
  });

app.get("/", (req, res) => {
  res.send("OK");
});
