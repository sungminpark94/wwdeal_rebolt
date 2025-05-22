import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase/config';
import { 
  onAuthStateChanged, 
  signOut, 
  RecaptchaVerifier, 
  signInWithPhoneNumber,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  // Firebase 인증 상태 감시 설정
  useEffect(() => {
    console.log('AuthContext - 인증 상태 감시 설정 중...');
    
    // 브라우저 영구 세션에 인증 상태 저장 설정
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        console.log('인증 지속성 설정 완료: LOCAL');
      })
      .catch((error) => {
        console.error('인증 지속성 설정 오류:', error);
      });
    
    // 인증 상태 변경 리스너
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log('AuthContext - 인증 상태 변경:', currentUser);
      
      if (currentUser) {
        // 사용자 정보 Firestore에서 조회
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            
            // 마지막 로그인 시간 업데이트
            await setDoc(userDocRef, { 
              lastLogin: serverTimestamp() 
            }, { merge: true });
            
            // user 객체에 role 추가
            setUser({
              ...currentUser,
              role: userData.role || 'user'
            });
            
            console.log('사용자 로그인 시간 업데이트 완료, 역할:', userData.role);
          } else {
            // 기본 역할 설정
            const defaultRole = currentUser.phoneNumber === '+821024079314' ? 'admin' : 'user';
            
            // 신규 사용자 정보 저장
            await setDoc(userDocRef, {
              uid: currentUser.uid,
              phoneNumber: currentUser.phoneNumber,
              role: defaultRole,
              createdAt: serverTimestamp(),
              lastLogin: serverTimestamp()
            });
            
            setUser({
              ...currentUser,
              role: defaultRole
            });
            
            console.log('신규 사용자 정보 저장 완료, 역할:', defaultRole);
          }
        } catch (error) {
          console.error('사용자 정보 처리 오류:', error);
          // 오류가 있어도 기본 사용자 정보는 설정
          setUser(currentUser);
        }
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });
    
    // 컴포넌트 언마운트 시 리스너 해제
    return () => unsubscribe();
  }, []);

  console.log('userauth', user);

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
          lastLogin: serverTimestamp()
        };
        await setDoc(userDocRef, userData);
        console.log('Created new user with role:', userData.role);
      } else {
        // 기존 사용자인 경우 마지막 로그인 시간 업데이트
        await setDoc(userDocRef, { 
          lastLogin: serverTimestamp() 
        }, { merge: true });
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

  // 사용자 정보 업데이트 함수
  const updateUser = async (userData) => {
    if (!user?.uid) return;
    
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        ...userData,
        updatedAt: serverTimestamp()
      }, { merge: true });
      
      console.log('사용자 정보 업데이트 완료');
      
      // 변경된 정보를 현재 상태에도 반영
      setUser(prevUser => ({
        ...prevUser,
        ...userData
      }));
    } catch (error) {
      console.error('사용자 정보 업데이트 오류:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      localStorage.clear();
      console.log('로그아웃 성공');
    } catch (error) {
      console.error('로그아웃 오류:', error);
      throw error;
    }
  };

  const value = {
    user,
    setUser,
    loading,
    isLoginModalOpen,
    setIsLoginModalOpen,
    openLoginModal,
    closeLoginModal,
    sendVerificationCode,
    verifyCode,
    updateUser,
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