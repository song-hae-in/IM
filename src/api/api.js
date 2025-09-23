const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

// 회원가입 API 호출
export async function register(email, password) {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "회원가입 실패");
  }

  return response.json();
}

// 로그인 API 호출
export async function login(email, password) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "로그인 실패");
  }

  return response.json();
}
// 파일구조 저장 api
export async function saveProjectStructure(requirementId, structureJson) {
  const response = await fetch("/api/saveProjectStructure", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ requirementId, structureJson }),
  });

  response
    .status(201)
    .json({ message: "프로젝트 구조 저장 성공", id: this.lastID });

  // 응답이 성공(200~299)이 아닌 경우
  if (!response.ok) {
    let errorMessage = "프로젝트 구조 저장 실패";
    try {
      // 오류 응답 본문을 JSON으로 파싱 시도
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      // JSON 파싱 실패 시 (빈 응답 등)
      console.error("응답 본문이 JSON 형식이 아닙니다:", e);
    }
    throw new Error(errorMessage);
  }

  // 성공 시 JSON 파싱
  return response.json();
}

// 요구 사항.
export async function saveRequirement(userId, inputText) {
  const response = await fetch("/api/saveRequirement", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, inputText }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "요구사항 저장 실패");
  }

  return response.json();
}
