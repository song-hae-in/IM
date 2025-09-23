import axios from "axios";
import type { AxiosInstance, AxiosResponse } from "axios"; // 타입만 가져올 때는 import type 사용

/**
 * Gemini API와 통신하기 위한 Axios 인스턴스입니다.
 * 기본 URL과 헤더를 설정합니다.
 */
const geminiApi: AxiosInstance = axios.create({
  baseURL: "https://generativelanguage.googleapis.com/v1beta/models",
  headers: {
    "Content-Type": "application/json",
  },
});

// 응답 인터셉터를 설정하여 오류를 콘솔에 기록합니다.
geminiApi.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    console.error("API 요청 실패:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * 사용자가 입력한 메시지를 기반으로 Gemini API를 호출하여 콘텐츠를 생성합니다.
 *
 * @param message - 사용자가 입력한 메시지 문자열
 * @returns 생성된 콘텐츠 문자열
 * @throws API 요청 실패 시 오류를 발생시킵니다.
 */
export const generateContent = async (message: string): Promise<string> => {
  // Vite 환경 변수에서 API 키를 가져옵니다.
  const apiKey: string = import.meta.env.VITE_GEMINI_API_KEY;
  const model: string = "gemini-2.5-flash"; // 사용할 모델 이름

  try {
    const response: AxiosResponse = await geminiApi.post(
      `/${model}:generateContent?key=${apiKey}`,
      {
        contents: [
          {
            parts: [
              {
                text: message,
              },
            ],
          },
        ],
      }
    );

    // API 응답에서 생성된 콘텐츠를 추출합니다.
    const result: string = response.data.candidates[0].content.parts[0].text;
    return result;
  } catch (error) {
    // 오류가 발생하면 상위 호출자에게 오류를 전달합니다.
    throw new Error("콘텐츠 생성 실패: " + (error as Error).message);
  }
};

/**
 * [1]
 * 사용자의 입력이 서비스 개발과 관련이 있는지 판단합니다.
 *
 * @param input - 사용자의 입력 문자열
 * @returns 서비스 개발 관련 여부 (true/false)
 */
export const isServiceDevelopmentInput = async (
  input: string
): Promise<boolean> => {
  const apiKey: string = import.meta.env.VITE_GEMINI_API_KEY; // 환경 변수에서 API 키를 가져옵니다.

  try {
    const response = await geminiApi.post(
      `/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        contents: [
          {
            parts: [
              {
                text: `
                sys: {사용자의 입력을} 을 보고 서비스 개발과 관련이 있는지 판단하세요.\n\n
                예시:
                - 항공권 예매 사이트를 만들고 싶어 → true
                - 오늘 볼 영화 추천해줘 → false
                - 사용자의 체형에 맞는 옷을 추천해주는 쇼핑물 사이트를 만들어줘 -> true
                - 갈비찜 레시피 알려줘 -> false

                결과는 오직 소문자 "true" 또는 "false"만 제공하세요.
                사용자 입력: ${input}`,
              },
            ],
          },
        ],
      }
    );

    // API가 TRUE/FALSE를 반환한다고 가정
    const result: string = response.data.candidates[0].content.parts[0].text;
    return result === "true";
  } catch (error) {
    console.error("입력 분류 중 error");
    throw new Error("입력 분류 중 오류가 발생했습니다.");
  }
};

/**
 * [2]
 * 사용자가 원하는 서비스에 필요한 기능 목록을 추출합니다.
 *
 * @param input - 사용자의 입력 문자열
 * @returns 기능 목록 (문자열 배열)
 * @throws API 요청 실패 시 오류를 발생시킵니다.
 */
type ExtractedFeatures = {
  serviceDescription: string;
  features: string[];
};

export const extractRequiredFeatures = async (
  input: string
): Promise<ExtractedFeatures> => {
  const apiKey: string = import.meta.env.VITE_GEMINI_API_KEY; // 환경 변수에서 API 키를 가져옵니다.

  try {
    const response: AxiosResponse = await geminiApi.post(
      `/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        contents: [
          {
            parts: [
              {
                text: `
sys: {사용자의 입력} 을 보고 그 서비스의 간단한 설명과 그 서비스의 MVP 구현을 위해 최소한의 기능세트를 다음과 같이 구분하여 나열해.
간결하고 구체적이게 기능을 작성 할것.

[출력 형식]
serviceDescription : {서비스의 간단한 설명}
features : [기능1, 기능2, 기능3, ...]

[예시]
serviceDescription: "사용자의 체형에 맞는 옷을 추천해주는 쇼핑몰 사이트를 만들어줘"
출력:
serviceDescription : 사용자 맞춤 옷 추천 쇼핑몰
features : [회원가입 및 로그인, 사용자 신체 정보 입력, 상품 카테고리 분류, 상품 상세 정보 조회, 장바구니 기능, 주문 및 결제]
                사용자 입력: ${input}`,
              },
            ],
          },
        ],
      }
    );

    // API 응답에서 생성된 콘텐츠를 추출합니다.
    const generatedText: string =
      response.data.candidates[0].content.parts[0].text;
    // 정규식으로 추출.
    const serviceDescriptionMatch = generatedText.match(
      /serviceDescription\s*:\s*(.+)/
    );
    const featuresMatch = generatedText.match(/features\s*:\s*\[(.+)\]/);

    let serviceDescription = "";
    let features: string[] = [];

    if (serviceDescriptionMatch && serviceDescriptionMatch[1]) {
      serviceDescription = serviceDescriptionMatch[1].trim();
    }

    // features 추출
    if (featuresMatch && featuresMatch[1]) {
      features = featuresMatch[1].split(",").map((feature) => feature.trim()); // 각 기능을 배열로 변환
    }

    // 결과 반환
    return {
      serviceDescription,
      features,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("기능 추출 실패:", error.response?.data || error.message);
    } else if (error instanceof Error) {
      console.error("기능 추출 실패:", error.message);
    } else {
      console.error("기능 추출 실패: 알 수 없는 오류가 발생했습니다.");
    }
    throw new Error("기능 추출 중 오류가 발생했습니다.");
  }
};

/**
 * [3]
 * 기능 목록을 기반으로 프로젝트 구조를 생성합니다.
 *
 * @param features - 기능 목록 (문자열 배열)
 * @returns 프로젝트 구조 (JSON 형태)
 * @throws API 요청 실패 시 오류를 발생시킵니다.
 */
export const generateProjectStructure = async (
  service: string,
  features: string[]
): Promise<any> => {
  const apiKey: string = import.meta.env.VITE_GEMINI_API_KEY;
  const model: string = "gemini-2.5-flash"; // 사용할 모델 이름

  try {
    // 기능 목록을 JSON 문자열로 변환하여 전송
    const input = JSON.stringify({ features });

    // 프롬프트 문자열 구성
    const prompt = `
다음은 사용자가 원하는 기능 목록입니다:

${input}

위 기능들을 효율적으로 구현하기 위한 MVP 프로젝트(${service})의 구조(디렉토리 및 파일 구조)와 함께 \n
 파일의 역할과 디렉토리에서 어느 위치에 있는 지 간단히 설명하는 주석도 포함해 주세요.

응답은 반드시 아래 형식을 따라 json 형식으로 주세요:

{
    "src": {
      "components": {
        "ChatInput.tsx": "// components 폴더 밑에 있는 메시지 입력을 담당하는 컴포넌트",
        ...
      },
      ..
    }
}

`;

    const response: AxiosResponse = await geminiApi.post(
      `/${model}:generateContent?key=${apiKey}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt.trim(), // 불필요한 공백 제거
              },
            ],
          },
        ],
      }
    );

    // API 응답에서 생성된 콘텐츠를 가져옵니다.
    let generatedText: string =
      response.data.candidates[0].content.parts[0].text;

    // 마크다운 구문(예: ```json ... ```) 제거
    generatedText = generatedText.replace(/```json|```/g, "").trim();
    console.log(generatedText);
    // JSON으로 파싱
    const projectStructure = JSON.parse(generatedText);

    return projectStructure;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "프로젝트 구조 생성 실패:",
        error.response?.data || error.message
      );
    } else if (error instanceof Error) {
      console.error("프로젝트 구조 생성 실패:", error.message);
    } else {
      console.error("프로젝트 구조 생성 실패: 알 수 없는 오류가 발생했습니다.");
    }
    throw new Error("프로젝트 구조 생성 중 오류가 발생했습니다.");
  }
};

type FileInfo = {
  path: string;
  description: string;
};

/**
 * [5]
 * Takes a flatStructure array and sends all file descriptions to the Gemini API at once to generate code.
 *
 * @param flatStructure - An array of objects [{ path: string, description: string }]
 * @returns A JSON array of objects [{ path: string, code: string }]
 * @throws Throws an error if the API request fails.
 */
type GeneratedCode = {
  path: string;
  code: string;
};

export const generateCodeFromDescriptions = async (
  flatStructure: any[]
): Promise<GeneratedCode[]> => {
  const apiKey: string = import.meta.env.VITE_GEMINI_API_KEY;
  const model: string = "gemini-2.5-flash"; // 사용할 모델 이름

  const Prompt = `
You are an expert programmer. Based on the following project structure provided as a JSON array, generate the full code for every file.
Project Structure:
${JSON.stringify(flatStructure, null, 2)}
Your response MUST be a single JSON array with the following format, and nothing else. Do not include any explanatory text or markdown formatting.
[
  {
    "path": "file/path/string",
    "code": "full code content for the file"
  }
]
  `;

  try {
    const response: AxiosResponse = await geminiApi.post(
      `/${model}:generateContent?key=${apiKey}`,
      {
        contents: [
          {
            parts: [
              {
                text: Prompt, // 불필요한 공백 제거
              },
            ],
          },
        ],
      }
    );

    const generatedText: string =
      response.data.candidates[0].content.parts[0].text;

    function extractJson(raw: string): string {
      return raw
        .replace(/^.*?```json\s*/s, "") // 맨 앞 ```json까지 제거
        .replace(/```.*$/s, ""); // 맨 뒤 ``` 제거
    }
    const hand: string = extractJson(generatedText);
    console.log("Raw response text:", generatedText);
    const generatedCodeArray: GeneratedCode[] = JSON.parse(hand);
    console.log(generatedCodeArray);
    return generatedCodeArray;
  } catch (error) {
    console.error("Error generating code from descriptions:", error);
    throw new Error("Failed to generate code.");
  }
};
