const express = require("express");
const mongoose = require("mongoose");
const Todo = require("../models/Todo");

const router = express.Router();

// GET /todos - 모든 할 일 목록 조회 (최신순)
router.get("/", async (req, res) => {
  try {
    const todos = await Todo.find({}, null, { sort: { createdAt: -1 } });
    return res.json(todos);
  } catch (err) {
    return res.status(500).json({ message: "서버 오류", error: err.message });
  }
});

// POST /todos - 새 할 일 생성
router.post("/", async (req, res) => {
  try {
    const { title } = req.body || {};

    if (typeof title !== "string") {
      return res.status(400).json({ message: "title은 문자열이어야 합니다." });
    }

    const trimmed = title.trim();
    if (trimmed.length < 1 || trimmed.length > 200) {
      return res
        .status(400)
        .json({ message: "title 길이는 1~200자여야 합니다." });
    }

    const created = await Todo.create({ title: trimmed });
    return res.status(201).json(created);
  } catch (err) {
    return res.status(500).json({ message: "서버 오류", error: err.message });
  }
});

// PATCH /todos/:id - 할 일 부분 수정 (title, completed)
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "유효하지 않은 id입니다." });
    }

    const update = {};

    if (Object.prototype.hasOwnProperty.call(req.body, "title")) {
      if (typeof req.body.title !== "string") {
        return res
          .status(400)
          .json({ message: "title은 문자열이어야 합니다." });
      }
      const trimmed = req.body.title.trim();
      if (trimmed.length < 1 || trimmed.length > 200) {
        return res
          .status(400)
          .json({ message: "title 길이는 1~200자여야 합니다." });
      }
      update.title = trimmed;
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "completed")) {
      if (typeof req.body.completed !== "boolean") {
        return res
          .status(400)
          .json({ message: "completed는 불리언이어야 합니다." });
      }
      update.completed = req.body.completed;
    }

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ message: "업데이트할 필드가 필요합니다." });
    }

    const updated = await Todo.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "할 일을 찾을 수 없습니다." });
    }

    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ message: "서버 오류", error: err.message });
  }
});

// DELETE /todos/:id - 할 일 삭제
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "유효하지 않은 id입니다." });
    }

    const deleted = await Todo.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "할 일을 찾을 수 없습니다." });
    }

    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ message: "서버 오류", error: err.message });
  }
});

module.exports = router;
