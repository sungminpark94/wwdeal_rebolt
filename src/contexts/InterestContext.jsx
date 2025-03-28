import { createContext, useContext, useState, useEffect } from 'react';

const InterestContext = createContext();

export const InterestProvider = ({ children }) => {
  const [interests, setInterests] = useState(() => {
    // localStorage에서 관심 차종 데이터 불러오기
    const savedInterests = localStorage.getItem('interests');
    return savedInterests ? JSON.parse(savedInterests) : [];
  });

  // interests가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('interests', JSON.stringify(interests));
  }, [interests]);

  const addInterest = (interest) => {
    if (!interests.includes(interest)) {
      setInterests(prev => [...prev, interest]);
    }
  };

  const removeInterest = (interest) => {
    setInterests(prev => prev.filter(item => item !== interest));
  };

  const value = {
    interests,
    addInterest,
    removeInterest
  };

  return (
    <InterestContext.Provider value={value}>
      {children}
    </InterestContext.Provider>
  );
};

export const useInterest = () => {
  const context = useContext(InterestContext);
  if (!context) {
    throw new Error('useInterest must be used within an InterestProvider');
  }
  return context;
}; 