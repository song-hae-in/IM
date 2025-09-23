import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// 동적 import로 db.cjs를 가져옵니다.
const dbPromise = import("../db.cjs");

const router = express.Router();

// 회원가입
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "이메일과 비밀번호를 모두 입력하세요." });
  }

  try {
    // 동적으로 가져온 db 모듈을 await로 받아옵니다.
    const { default: db } = await dbPromise;
    console.log(db); // 여기서 db가 정의되어 있는지 확인

    // 이메일 중복 확인
    const row = await new Promise((resolve, reject) => {
      db.get("SELECT id FROM users WHERE email = ?", [email], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });

    if (row) {
      return res.status(409).json({ message: "이미 사용 중인 이메일입니다." });
    }

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 사용자 저장
    await new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO users (email, password) VALUES (?, ?)",
        [email, hashedPassword],
        (err) => {
          if (err) return reject(err);
          resolve();
        }
      );
    });

    res.status(201).json({ message: "회원가입 성공" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

// 로그인
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "이메일과 비밀번호를 모두 입력하세요." });
  }

  try {
    // 동적으로 가져온 db 모듈을 await로 받아옵니다.
    const { default: db } = await dbPromise;

    // 사용자 조회
    const user = await new Promise((resolve, reject) => {
      db.get(
        "SELECT id, password FROM users WHERE email = ?",
        [email],
        (err, row) => {
          if (err) return reject(err);
          resolve(row);
        }
      );
    });

    if (!user) {
      return res
        .status(401)
        .json({ message: "이메일 또는 비밀번호가 잘못되었습니다." });
    }

    // 비밀번호 비교
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "이메일 또는 비밀번호가 잘못되었습니다." });
    }

    // JWT 발급
    const token = jwt.sign({ userId: user.id }, "your_jwt_secret", {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "로그인 성공", token });
  } catch (error) {
    console.error("로그인 처리 중 오류:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

export default router;
