import React from "react";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/chat");
  };

  return (
    <div className="bg-darkGray text-white min-h-screen flex flex-col items-center justify-center p-7">
      <header className="mb-10 text-center">
        <div className="fade-in">
          <h1 className="text-4xl font-bold text-neonGreen mb-3">
            Welcome to Immserl
          </h1>
        </div>

        <div className="fade-in" style={{ animationDelay: `${1}s` }}>
          <h2 className="text-2xl">Your gateway to immersive experiences</h2>
        </div>
      </header>

      <section className="mb-10 text-center">
        <div className="fade-in" style={{ animationDelay: `${2}s` }}>
          <h3 className="text-3xl mb-5 text-neonPink">About immserl</h3>
          <p className="text-lightGray leading-relaxed">
            immserl은 사용자에게 몰입형 경험을 제공하는 혁신적인 플랫폼입니다.
            지금 바로 새로운 세상을 만나보세요!
          </p>
        </div>
      </section>

      <button
        onClick={handleButtonClick}
        className="bg-neonPink text-white py-3 px-6 rounded shadow-lg hover:bg-pink-600 transition"
      >
        Get Started
      </button>
    </div>
  );
};

export default Home;
