import express from "express";

const dbPromise = import("../db.cjs");

const { default: db } = await dbPromise;

const router = express.Router();

// 요구사항 저장 API
router.post("/saveRequirement", async (req, res) => {
  const { userId, inputText } = req.body;

  if (!userId || !inputText) {
    return res
      .status(400)
      .json({ message: "userId와 inputText가 필요합니다." });
  }

  const query = `
    INSERT INTO user_requirements (user_id, input_text)
    VALUES (?, ?)
  `;

  db.run(query, [userId, inputText], function (err) {
    if (err) {
      console.error("요구사항 저장 중 오류:", err);
      return res
        .status(500)
        .json({ message: "요구사항 저장 중 오류가 발생했습니다." });
    }

    // 성공 시 새로 생성된 requirement_id 반환
    res
      .status(201)
      .json({ message: "요구사항 저장 성공", requirementId: this.lastID });
  });
});

export default router;
