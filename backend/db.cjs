// db.cjs

// CommonJS 방식으로 sqlite3 모듈을 가져옵니다.
const sqlite3 = require("sqlite3").verbose();

// 데이터베이스 연결 설정
const db = new sqlite3.Database("./project.db");

// 테이블 초기화
db.serialize(() => {
  // 사용자 입력·요구사항 저장 테이블
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

  // AI가 도출한 기능 목록 저장 테이블
  db.run(`
    CREATE TABLE IF NOT EXISTS extracted_features (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      requirement_id INTEGER,
      feature_name TEXT NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(requirement_id) REFERENCES user_requirements(id)
    )
  `);

  // 자동 생성된 프로젝트 구조 저장 테이블
  db.run(`
    CREATE TABLE IF NOT EXISTS project_structures (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      requirement_id INTEGER,
      structure_json TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(requirement_id) REFERENCES user_requirements(id)
    )
  `);

  // 코드 스니펫 저장 테이블
  db.run(`
    CREATE TABLE IF NOT EXISTS code_snippets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      feature_id INTEGER,
      language TEXT NOT NULL,
      snippet TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(feature_id) REFERENCES extracted_features(id)
    )
  `);
});

// CommonJS 방식의 내보내기
module.exports = db;
