import React, { useState } from "react";
import {
  isServiceDevelopmentInput,
  extractRequiredFeatures,
} from "../api/gemini";

interface ChatInputProps {
  onReceiveFeatures: (description: string, features: string[]) => void; // 기능 목록을 부모에게 전달
  onReceiveMessage: (message: string) => void; // 일반 메시지를 부모에게 전달
}

const ChatInput: React.FC<ChatInputProps> = ({
  onReceiveFeatures,
  onReceiveMessage,
}) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1단계: 입력이 서비스 개발과 관련이 있는지 확인
      const isServiceDev = await isServiceDevelopmentInput(message);
      //const isServiceDev = true; // 디자인 보기 위한 더미 데이터.
      console.log(message);
      console.log(isServiceDev);

      if (isServiceDev) {
        // 2단계: 관련이 있다면 기능 목록 추출
        const { serviceDescription, features } = await extractRequiredFeatures(
          message
        );
        //const serviceDescription = "hahah";
        //const features = ["로그인 기능", "회원가입 기능", "게시판 기능"]; // 더미 데이터.
        console.log(serviceDescription);
        console.log(features);
        onReceiveFeatures(serviceDescription, features); // 부모 컴포넌트에 기능 목록 전달
      } else {
        onReceiveMessage("서비스 개발과 관련이 없는 입력입니다.");
      }
    } catch (error) {
      console.error("처리 중 오류 발생:", error);
      onReceiveMessage("처리 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="메시지를 입력하세요..."
        className="custom-input-ellipse"
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`button-send ${loading ? "loading" : ""}`}
      >
        {loading ? "..." : "전송"}
      </button>
    </div>
  );
};

export default ChatInput;
