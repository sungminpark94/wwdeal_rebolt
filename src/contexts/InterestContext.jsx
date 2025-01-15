import React, { createContext, useContext, useState } from 'react';

const InterestContext = createContext();

export const useInterest = () => {
  return useContext(InterestContext);
};

export const InterestProvider = ({ children }) => {
  const [interests, setInterests] = useState([]);

  const addInterest = (carModel) => {
    setInterests(prev => [...prev, carModel]);
  };

  const removeInterest = (carModel) => {
    setInterests(prev => prev.filter(model => model !== carModel));
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