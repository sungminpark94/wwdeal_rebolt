import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NavigationBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#f8f9fa]">
      <div className="mx-auto max-w-[480px] bg-white border-t border-gray-200">
        <div className="flex justify-around">
          <button
            onClick={() => navigate('/')}
            className={`flex flex-col items-center py-3 flex-1 ${
              location.pathname === '/' ? 'text-green-500' : 'text-gray-600'
            }`}
          >
            <span className="material-icons">home</span>
            <span className="text-xs mt-1">홈</span>
          </button>
          <button
            onClick={() => navigate('/listings')}
            className={`flex flex-col items-center py-3 flex-1 ${
              location.pathname === '/listings' ? 'text-green-500' : 'text-gray-600'
            }`}
          >
            <span className="material-icons">directions_car</span>
            <span className="text-xs mt-1">매물</span>
          </button>
          <button
            onClick={() => navigate('/favorites')}
            className={`flex flex-col items-center py-3 flex-1 ${
              location.pathname === '/favorites' ? 'text-green-500' : 'text-gray-600'
            }`}
          >
            <span className="material-icons">favorite_border</span>
            <span className="text-xs mt-1">관심</span>
          </button>
          <button
            onClick={() => navigate('/profile')}
            className={`flex flex-col items-center py-3 flex-1 ${
              location.pathname === '/profile' ? 'text-green-500' : 'text-gray-600'
            }`}
          >
            <span className="material-icons">person_outline</span>
            <span className="text-xs mt-1">MY</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavigationBar;

