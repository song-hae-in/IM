import React, { useState } from "react";
import { login } from "../api/api";

interface LoginFormProps {
  onLoginSuccess: () => void; // 로그인 성공 시 호출
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError("");
      const result = await login(email, password);
      console.log("로그인 성공:", result);
      onLoginSuccess(); // 로그인 성공 시 상위 컴포넌트에 알림
    } catch (err: any) {
      setError(err.message || "로그인에 실패했습니다.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto bg-darkGray p-4 rounded text-neonPink"
    >
      <h2 className="text-2xl font-bold mb-4">로그인</h2>

      <label
        htmlFor="email"
        className="block text-sm font-medium text-neonPink"
      >
        이메일:
      </label>
      <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="mt-1 block w-full px-3 py-2 border border-brandBlack rounded-md shadow-sm focus:outline-none focus:ring focus:ring-neonGreen text-brandBlack"
      />

      <label
        htmlFor="password"
        className="block text-sm font-medium text-neonPink mt-4"
      >
        비밀번호:
      </label>
      <input
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="mt-1 block w-full px-3 py-2 border border-brandBlack rounded-md shadow-sm focus:outline-none focus:ring focus:ring-neonGreen text-brandBlack"
      />

      <button
        type="submit"
        className="mt-6 w-full bg-neonPink text-brandBlack py-2 px-4 rounded hover:bg-pink-600 transition"
      >
        로그인
      </button>

      {error && <div className="mt-4 text-center text-red-600">{error}</div>}
    </form>
  );
};

export default LoginForm;
