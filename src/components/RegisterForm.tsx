import React, { useState } from "react";
import { register } from "../api/api";

interface RegisterFormProps {
  onRegisterSuccess: () => void; // 회원가입 성공 시 호출
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegisterSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError("");
      const result = await register(email, password);
      console.log("회원가입 성공:", result);
      onRegisterSuccess(); // 회원가입 성공 시 상위 컴포넌트에 알림
    } catch (err: any) {
      setError(err.message || "회원가입에 실패했습니다.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto bg-darkGray p-6 rounded shadow-md space-y-4"
    >
      <h2 className="text-2xl font-bold text-center text-neonPink">회원가입</h2>

      <div>
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
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-neonGreen text-neonGreen"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-neonPink"
        >
          비밀번호:
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-neonGreen text-neonPink"
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-neonPink text-brandBlack font-semibold rounded-md hover:bg-pink-600 transition"
      >
        회원가입
      </button>

      {error && (
        <div className="mt-4 text-red-600 text-sm text-center">{error}</div>
      )}
    </form>
  );
};

export default RegisterForm;
