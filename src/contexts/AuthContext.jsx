import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase/config';
import { onAuthStateChanged, signOut, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

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
  const verifyCode = async (verificationId, verificationCode, name) => {
    try {
      const result = await verificationId.confirm(verificationCode);
      const user = result.user;
      
      // 사용자 문서 참조
      const userDocRef = doc(db, 'users', user.uid);
      
      // 현재 사용자 문서 가져오기
      const userDocSnap = await getDoc(userDocRef);
      
      if (!userDocSnap.exists()) {
        // 새 사용자인 경우
        const userData = {
          phoneNumber: user.phoneNumber,
          name: name,
          role: user.phoneNumber === '+821024079314' ? 'admin' : 'user',
          createdAt: serverTimestamp(),
        };
        await setDoc(userDocRef, userData);
        console.log('Created new user with role:', userData.role);
      }

      const finalUserDoc = await getDoc(userDocRef);
      console.log('User role:', finalUserDoc.data().role);
      
      setUser({
        ...user,
        role: finalUserDoc.data().role // user 객체에 role 추가
      });
      
      return user;
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