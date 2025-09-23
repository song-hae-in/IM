import express from "express";
import bodyParser from "body-parser";
import authRoutes from "./routes/authRoutes.js"; // .js 확장자 명시
import projectRoutes from "./routes/projectRoutes.js";
import requirementRoutes from "./routes/requirementRoutes.js";
import cors from "cors"; // cors 가져오기
import fs from "fs/promises"; // Promise 기반 fs 모듈
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// CORS 미들웨어 등록
app.use(
  cors({
    origin: "http://localhost:5173", // 프론트엔드가 실행되는 주소
    credentials: true, // 필요한 경우 쿠키·인증 정보도 포함
  })
);

// 요청 본문을 JSON으로 파싱
app.use(bodyParser.json());

// 인증 라우트 등록
app.use("/api", authRoutes);
// 프로젝트 구조 저장.
app.use("/api", projectRoutes);
// 요구 저장.
app.use("/api", requirementRoutes);

/// ES 모듈 환경에서 __dirname 대체
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

// 파일 저장 API
app.post("/save-codes", async (req, res) => {
  const generatedCodes = req.body;

  // 저장할 디렉터리와 파일 경로
  const saveDir = path.join(__dirname, "data");
  const filePath = path.join(saveDir, "generatedCodes.json");

  try {
    // 디렉터리가 없으면 생성
    try {
      await fs.access(saveDir);
    } catch {
      await fs.mkdir(saveDir, { recursive: true });
    }

    // JSON 파일로 저장
    await fs.writeFile(
      filePath,
      JSON.stringify(generatedCodes, null, 2),
      "utf8"
    );
    res.json({ message: "파일 저장 성공", filePath });
  } catch (err) {
    console.error("파일 저장 중 오류:", err);
    res.status(500).json({ message: "파일 저장 실패", error: err.message });
  }
});

// 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
});
