import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate 훅 추가
import ChatInput from "../components/ChatInput";
import Check from "../components/Check";
import { generateProjectStructure } from "../api/gemini";
import { saveProjectStructure, saveRequirement } from "../api/api";

const ChatPage: React.FC = () => {
  const [serviceDescription, setServiceDescription] = useState(""); // 서비스 설명 상태 추가
  const [features, setFeatures] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [projectStructure, setProjectStructure] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isCheckModalOpen, setIsCheckModalOpen] = useState(false); // Check 모달 열림 상태

  const navigate = useNavigate(); // useNavigate 훅 사용

  const handleReceiveFeatures = (description: string, features: string[]) => {
    setServiceDescription(description); // 서비스 설명 저장
    setFeatures(features);
    setMessage("");
    setSelectedFeatures([]);
    setIsCheckModalOpen(true); // Check 모달 열기
    setProjectStructure(null);
  };

  const handleReceiveMessage = async (msg: string) => {
    // userId는 현재 로그인한 사용자의 ID를 사용하세요.
    //const userId = 1; // 예시로 고정값 사용
    //const { requirementId } = await saveRequirement(userId, msg);
    setMessage(msg);
    setFeatures([]);
    setSelectedFeatures([]);
    setProjectStructure(null);
  };

  const handleToggleFeature = (feature: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature]
    );
  };

  const handleGenerateProject = async () => {
    setLoading(true);
    console.log("선택된 기능");
    console.log(selectedFeatures);
    try {
      const structure = await generateProjectStructure(
        serviceDescription,
        selectedFeatures
      );
      // 페이지 전환: NextStep.tsx로 이동하면서 structure를 상태로 전달
      navigate("/next-step", { state: { structure } });
      //******************************************************************************************** */
      // API 호출 대신 더미 프로젝트 구조 사용

      `const structure = {
        projectRoot: {
          src: {
            components: {
              "ChatInput.tsx": "// 메시지 입력을 담당하는 컴포넌트",
              "FeatureList.tsx": "// 선택된 기능 목록을 표시하는 컴포넌트",
            },
            "App.tsx": "// 애플리케이션의 진입점",
          },
          "package.json": "// 프로젝트 메타데이터 및 의존성",
        },
      };`; // <- 더미 데이터.
      //******************************************************************************************** */
      // await saveProjectStructure(serviceDescription, structure);
      setProjectStructure(structure);
      setTimeout(() => {
        setIsCheckModalOpen(false);
      }, 500);
    } catch (error) {
      console.error("프로젝트 구조 생성 중 오류:", error);
      setMessage("프로젝트 구조 생성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center-container ">
      <ChatInput
        onReceiveFeatures={handleReceiveFeatures}
        onReceiveMessage={handleReceiveMessage}
      />
      {/* 메시지 */}
      {message && (
        <div className="mb-4 text-base text-neonGreen">{message}</div>
      )}

      {isCheckModalOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsCheckModalOpen(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            기능 목록 (체크하여 추가하세요):
            <Check
              features={features}
              selectedFeatures={selectedFeatures}
              onToggleFeature={handleToggleFeature}
            />
            <button
              onClick={handleGenerateProject}
              disabled={loading || selectedFeatures.length === 0}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              {loading ? "생성 중..." : "프로젝트 구조 생성"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
