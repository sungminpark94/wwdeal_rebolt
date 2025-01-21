import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase/config';
import { onAuthStateChanged, signOut, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  console.log('userauth', user)

  // 로그인 모달 관련 함수들
  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  // reCAPTCHA 설정
  const setupRecaptcha = (phoneNumber) => {
    const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
      callback: () => {
        // reCAPTCHA solved
      }
    });
    
    window.recaptchaVerifier = recaptchaVerifier;
    return recaptchaVerifier;
  };

  // 인증번호 전송
  const sendVerificationCode = async (phoneNumber) => {
    try {
      const formattedNumber = `+82${phoneNumber.replace(/^0/, '')}`;
      const recaptchaVerifier = window.recaptchaVerifier || setupRecaptcha();
      
      const confirmationResult = await signInWithPhoneNumber(
        auth, 
        formattedNumber, 
        recaptchaVerifier
      );
      
      window.confirmationResult = confirmationResult;
      return confirmationResult;
    } catch (error) {
      console.error("Error sending code:", error);
      throw error;
    }
  };

  // 인증번호 확인
  const verifyCode = async (verificationId, verificationCode) => {
    try {
      // const confirmationResult = window.confirmationResult;
      // if (!confirmationResult) {
      //   throw new Error('먼저 인증번호를 요청해주세요.');
      // }

      const result = await verificationId.confirm(verificationCode);
      setUser(result.user);
      console.log('result.user', result.user)
      return result.user;
    } catch (error) {
      console.error("Error verifying code:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.clear();
  };

  const value = {
    user,
    loading,
    isLoginModalOpen,
    setIsLoginModalOpen,
    sendVerificationCode,
    verifyCode,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 