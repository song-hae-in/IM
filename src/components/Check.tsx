import React from "react";

interface CheckProps {
  features: string[]; // 기능 목록
  selectedFeatures: string[]; // 선택된 기능 목록
  onToggleFeature: (feature: string) => void; // 기능 선택/해제 시 호출
}

const Check: React.FC<CheckProps> = ({
  features,
  selectedFeatures,
  onToggleFeature,
}) => {
  return (
    <div>
      <h3>추출된 기능 목록 (체크하여 추가하세요):</h3>
      <ul>
        {features.map((feature, index) => (
          <li key={index}>
            <label>
              <input
                type="checkbox"
                checked={selectedFeatures.includes(feature)} // 선택 여부 확인
                onChange={() => onToggleFeature(feature)} // 클릭 시 호출
              />
              {feature}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Check;
