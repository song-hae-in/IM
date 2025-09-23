import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { generateCodeFromDescriptions } from "../api/gemini";

// structure를 나누는 함수
interface FileInfo {
  path: string;
  description: string;
}

function flattenStructure(structure: any, parentPath: string = ""): FileInfo[] {
  let result: FileInfo[] = [];
  for (const [key, value] of Object.entries(structure)) {
    const currentPath = parentPath ? `${parentPath}/${key}` : key;
    if (typeof value === "object") {
      // 폴더인 경우 재귀 호출
      result = result.concat(flattenStructure(value, currentPath));
    } else {
      // 파일인 경우 경로와 설명을 객체로 저장
      result.push({ path: currentPath, description: value as string });
    }
  }
  return result;
}

type GeneratedCode = {
  path: string;
  code: string;
};

const NextStep: React.FC = () => {
  const location = useLocation();
  const { structure } = location.state || {}; // 전달받은 structure
  const flatStructure = flattenStructure(structure); // 정해둔 규칙으로 나눔

  const [generatedCodes, setGeneratedCodes] = useState<GeneratedCode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedPaths, setSavedPaths] = useState<string[]>([]); // 서버에 저장된 path 목록

  const handleGenerateCode = async () => {
    setLoading(true);
    setError(null);
    try {
      const codes = await generateCodeFromDescriptions(flatStructure);
      setGeneratedCodes(codes);
    } catch (err) {
      setError("코드 생성 중 오류가 발생했습니다.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToServer = async () => {
    try {
      const response = await fetch("http://localhost:3000/save-codes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(generatedCodes), // generatedCodes 배열을 그대로 전송
      });
      const result = await response.json();
      if (response.ok) {
        // 저장된 path 목록 업데이트
        setSavedPaths(generatedCodes.map((code) => code.path));
        alert(`파일 저장 성공: ${result.filePath}`);
      } else {
        alert(`파일 저장 실패: ${result.message}`);
      }
    } catch (error) {
      console.error("서버 저장 중 오류:", error);
      alert("서버 저장 중 오류가 발생했습니다.");
    }
  };

  const getLEDClass = (path: string) => {
    const isGenerated = generatedCodes.some((code) => code.path === path);
    const isSaved = savedPaths.includes(path);
    if (isSaved) return "bg-green-500 shadow-lg shadow-green-500/50";
    if (isGenerated) return "bg-yellow-400 shadow-lg shadow-yellow-400/50";
    return "bg-red-500 shadow-lg shadow-red-500/50";
  };

  return (
    <>
      <button
        onClick={handleGenerateCode}
        disabled={loading}
        className="btn text-neonCyan bg-slate-500"
      >
        {loading ? "코드 생성 중..." : "코드 생성하기"}
      </button>
      <button
        onClick={handleSaveToServer}
        disabled={loading || generatedCodes.length === 0}
        className="btn text-neonRed bg-slate-200"
      >
        서버에 저장하기
      </button>

      <div className="mt-4">
        <h2 className="text-xl font-bold mb-2 text-neonYellow">
          생성된 프로젝트 구조
        </h2>
        {flatStructure.map(({ path }) => (
          <div key={path} className="flex items-center mb-1 text-neonCyan">
            <span
              className={`inline-block w-3 h-3 rounded-full mr-2 ${getLEDClass(
                path
              )}`}
            ></span>
            {path}
          </div>
        ))}
      </div>
    </>
  );
};

export default NextStep;
