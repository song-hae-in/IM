import express from "express";

const dbPromise = import("../db.cjs");

const { default: db } = await dbPromise;
console.log(db);
const router = express.Router();

// 프로젝트 구조 저장 API
router.post("/saveProjectStructure", (req, res) => {
  const { requirementId, structureJson } = req.body;

  if (!requirementId || !structureJson) {
    return res
      .status(400)
      .json({ message: "requirementId와 structureJson이 필요합니다." });
  }

  const query = `
    INSERT INTO project_structures (requirement_id, structure_json)
    VALUES (?, ?)
  `;

  db.run(query, [requirementId, JSON.stringify(structureJson)], function (err) {
    if (err) {
      console.error("프로젝트 구조 저장 중 오류:", err);
      return res
        .status(500)
        .json({ message: "프로젝트 구조 저장 중 오류가 발생했습니다." });
    }

    res
      .status(201)
      .json({ message: "프로젝트 구조 저장 성공", id: this.lastID });
  });
});

export default router;
