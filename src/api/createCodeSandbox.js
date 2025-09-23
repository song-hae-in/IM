export async function createCodeSandbox(structure, apiToken) {
  const apiToken = process.env.VIE_APP_CODESANDBOX_API_TOKEN;

  if (!apiToken) {
    throw new Error("API 토큰이 설정되어 있지 않습니다.");
  }

  const files = {
    "package.json": {
      content: {
        name: "my-sandbox",
        version: "1.0.0",
        main: "src/index.js",
        dependencies: {},
      },
    },
    "src/index.js": {
      content:
        '// 여기에 프로젝트 구조를 반영한 코드를 작성하세요\nconsole.log("Hello, CodeSandbox!");',
    },
    // 필요한 파일을 추가로 정의하세요
  };

  // 예시로 structure를 src/data/projectstruct.json에 저장
  files["src/data/projectstruct.json"] = {
    content: JSON.stringify(structure, null, 2),
  };

  const response = await fetch(
    "https://codesandbox.io/api/v1/sandboxes/define?json=1",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiToken}`, // 발급받은 API 토큰을 여기에 넣습니다.
      },
      body: JSON.stringify({ files }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "CodeSandbox 생성 실패");
  }

  const data = await response.json();
  return `https://codesandbox.io/s/${data.sandbox_id}`;
}
