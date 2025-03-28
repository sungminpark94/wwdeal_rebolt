import React from 'react';
import { useNavigate } from 'react-router-dom';

const BottomCTA = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-[72px] left-0 right-0 z-40">
      <div className="mx-auto w-full max-w-[480px] px-4 pb-4">
        <button
          // onClick={() => navigate('/sell')}
          onClick={() => window.location.href = 'https://naver.me/GbDVH4DG'}
          className="w-full bg-[#333333] text-white py-4 rounded-xl font-medium shadow-lg hover:bg-[#404040] transition-colors"
        >
          내차도 직거래로 팔아보기
        </button>
      </div>
    </div>
  );
};

export default BottomCTA; 