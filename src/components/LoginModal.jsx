import React, { useState, useEffect } from 'react';
import { 
  getAuth, 
  signInWithPhoneNumber, 
  PhoneAuthProvider, 
  signInWithCredential, 
  RecaptchaVerifier,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginModal = ({ isOpen, onClose }) => {
  const { verifyCode, updateUser, setUser, user } = useAuth();
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationId, setVerificationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const navigate = useNavigate();

  // 현재 인증 상태 확인을 위한 효과
  useEffect(() => {
    if (isOpen) {
      const auth = getAuth();
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        console.log('LoginModal - 현재 인증 상태:', currentUser);
        
        // 이미 로그인된 상태라면 모달 닫기
        if (currentUser) {
          console.log('이미 인증된 사용자가 있어 모달을 닫습니다', currentUser);
          onClose();
        }
      });
      
      return () => unsubscribe();
    }
  }, [isOpen, onClose]);

  // 사용자 정보 Firestore에 저장하는 함수
  const saveUserToFirestore = async (user) => {
    if (!user) return;
    
    try {
      // 기존 사용자 정보 확인
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      // 기본 사용자 데이터
      const userData = {
        phoneNumber: user.phoneNumber,
        lastLogin: serverTimestamp(),
      };
      
      if (!userDocSnap.exists()) {
        // 신규 사용자인 경우, 추가 정보 설정
        userData.name = user.displayName || '이름 없음';
        userData.role = user.phoneNumber === '+821024079314' ? 'admin' : 'user';
        userData.createdAt = serverTimestamp();
      }
      
      // Firestore에 사용자 정보 저장
      await setDoc(userDocRef, userData, { merge: true });
      console.log('사용자 정보 Firestore에 저장 성공');
      
      // 최종 사용자 정보 가져오기
      const finalUserDoc = await getDoc(userDocRef);
      if (finalUserDoc.exists()) {
        const finalUserData = finalUserDoc.data();
        
        // role 정보 포함하여 사용자 상태 설정
        return {
          ...user,
          role: finalUserData.role || 'user'
        };
      }
      
      return user;
    } catch (error) {
      console.error('Firestore 사용자 정보 저장 실패:', error);
      return user;
    }
  };

  // reCAPTCHA 설정
  const setupRecaptcha = () => {
    // 이미 recaptchaVerifier가 존재하면 초기화
    if (window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear();
      } catch (e) {
        console.error('reCAPTCHA 초기화 오류:', e);
      }
      window.recaptchaVerifier = null;
    }
  
    // recaptcha-container가 존재하는지 확인
    const container = document.getElementById('recaptcha-container');
    if (!container) {
      console.error('recaptcha-container not found');
      return false;
    }
  
    const auth = getAuth();
    
    try {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response) => {
          console.log('reCAPTCHA verified');
        },
        'expired-callback': () => {
          console.log('reCAPTCHA expired');
          try {
            window.recaptchaVerifier.clear();
          } catch (e) {
            console.error('reCAPTCHA clear error:', e);
          }
          window.recaptchaVerifier = null;
          setupRecaptcha();
        }
      });
      
      return true;
    } catch (error) {
      console.error('RecaptchaVerifier 초기화 오류:', error);
      return false;
    }
  };

  useEffect(() => {
    // 컴포넌트가 마운트되고 모달이 열린 후에 reCAPTCHA 설정
    if (isOpen) {
      // setTimeout을 사용하여 DOM이 완전히 렌더링된 후 실행
      setTimeout(() => {
        setupRecaptcha();
      }, 100);
    }
    
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    };
  }, [isOpen]);

  const formatPhoneNumber = (phoneNumber) => {
    // 전화번호 형식 로깅
    console.log('입력된 전화번호:', phoneNumber);
    
    const formattedNumber = phoneNumber.startsWith('+82') 
      ? phoneNumber 
      : `+82${phoneNumber.replace(/^0/, '')}`;
    
    console.log('변환된 전화번호:', formattedNumber);
    return formattedNumber;
  };

  const handleSendVerification = async () => {
    try {
      setLoading(true);
      setError(null);
  
      // 전화번호 입력 확인
      if (!phoneNumber || phoneNumber.trim() === '') {
        setError('전화번호를 입력해주세요.');
        setLoading(false);
        return;
      }
  
      // reCAPTCHA 확인
      if (!window.recaptchaVerifier) {
        console.log('recaptchaVerifier 재설정 시도');
        const recaptchaSetup = setupRecaptcha();
        
        // 설정 완료까지 잠시 대기
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (!recaptchaSetup || !window.recaptchaVerifier) {
          setError('reCAPTCHA 초기화에 실패했습니다. 페이지를 새로고침 후 다시 시도해주세요.');
          setLoading(false);
          return;
        }
      }
  
      const auth = getAuth();
      const formattedNumber = formatPhoneNumber(phoneNumber);
  
      console.log('전송할 번호:', formattedNumber);
  
      try {
        const confirmationResult = await signInWithPhoneNumber(
          auth,
          formattedNumber,
          window.recaptchaVerifier
        );
        
        console.log('confirmationResult:', confirmationResult);
        
        // verificationId 저장
        if (confirmationResult && confirmationResult.verificationId) {
          setVerificationId(confirmationResult.verificationId);
          setIsVerificationSent(true);
          alert('인증번호가 발송되었습니다.');
        } else {
          console.error('verificationId가 없습니다');
          setError('인증번호 발송에 실패했습니다. 다시 시도해주세요.');
        }
      } catch (phoneError) {
        console.error('전화번호 인증 오류:', phoneError);
        
        // Firebase 에러 메시지 처리
        if (phoneError.code === 'auth/too-many-requests') {
          setError('너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.');
        } else if (phoneError.code === 'auth/invalid-phone-number') {
          setError('유효하지 않은 전화번호 형식입니다.');
        } else {
          setError(`인증번호 전송 실패: ${phoneError.message}`);
        }
        
        // reCAPTCHA 재설정
        if (window.recaptchaVerifier) {
          try {
            window.recaptchaVerifier.clear();
          } catch (e) {
            console.error('reCAPTCHA clear error:', e);
          }
          window.recaptchaVerifier = null;
        }
      }
    } catch (error) {
      console.error('인증번호 전송 프로세스 오류:', error);
      setError('처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  // 인증번호 확인 - Firebase SDK 직접 사용
  const handleVerifyCode = async () => {
    try {
      console.log('인증 시작:', verificationCode);
      setLoading(true);
      setError(null);
      
      // 필수 값 확인
      if (!verificationId) {
        setError('인증 정보가 없습니다. 인증번호를 다시 요청해주세요.');
        setLoading(false);
        return;
      }
      
      if (!verificationCode || verificationCode.trim() === '') {
        setError('인증번호를 입력해주세요.');
        setLoading(false);
        return;
      }
      
      console.log('verificationId:', verificationId);
      console.log('verificationCode:', verificationCode);
      
      const auth = getAuth();
      
      // PhoneAuthProvider.credential 메서드를 사용하여 인증 정보 생성
      const credential = PhoneAuthProvider.credential(
        verificationId, 
        verificationCode
      );
      
      console.log('생성된 credential:', credential);
      
      // signInWithCredential 메서드로 인증
      const userCredential = await signInWithCredential(auth, credential);
      console.log('인증 성공:', userCredential.user);
      
      // 로그인 후 처리
      let user = userCredential.user;
      
      // Firestore에 사용자 정보 저장 및 확장된 사용자 정보 받기
      user = await saveUserToFirestore(user);
      
      // 사용자 정보 업데이트 (useAuth 컨텍스트의 함수 사용)
      if (typeof setUser === 'function') {
        setUser(user);
        console.log('setUser 함수 호출 완료, user:', user);
      }
      
      if (typeof updateUser === 'function') {
        await updateUser(user);
        console.log('updateUser 함수 호출 완료');
      }
      
      // 인증 상태가 변경될 시간을 주기 위해 약간의 지연 추가
      setTimeout(() => {
        // 상태 초기화 및 화면 전환
        setIsVerificationSent(false);
        setVerificationCode('');
        onClose();
        
        // 프로필 페이지로 이동
        navigate('/profile', { replace: true });
        console.log('프로필 페이지로 이동 완료');
      }, 500);
      
    } catch (error) {
      console.error('인증 에러:', error.code, error.message);
      
      // 에러 코드에 따른 메시지 표시
      if (error.code === 'auth/invalid-verification-code') {
        setError('유효하지 않은 인증번호입니다.');
      } else if (error.code === 'auth/code-expired') {
        setError('인증번호가 만료되었습니다. 새로운 인증번호를 요청해주세요.');
      } else {
        setError('인증번호가 올바르지 않거나 인증 기간이 만료되었습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 이미 로그인된 경우 프로필 페이지로 이동
  useEffect(() => {
    if (user && isOpen) {
      console.log('이미 로그인된 상태, 프로필 페이지로 이동합니다.', user);
      onClose();
      navigate('/profile');
    }
  }, [user, isOpen, onClose, navigate]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">로그인</h2>
          <button onClick={onClose} className="text-gray-500">
            <span className="material-icons">close</span>
          </button>
        </div>

        <div className="space-y-4">
          {/* 전화번호 입력 */}
          <div>
            <label className="block text-gray-700 mb-2">휴대폰 번호</label>
            <div className="flex gap-2">
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="휴대폰 번호 입력 (-없이)"
                className="flex-1 p-3 border rounded-lg"
              />
              <button
                onClick={handleSendVerification}
                disabled={loading}
                className="bg-[#00c73c] text-white px-4 rounded-lg hover:bg-[#00a032]"
              >
                인증번호
              </button>
            </div>
          </div>

          {/* 인증번호 입력 */}
          {isVerificationSent && (
            <div>
              <label className="block text-gray-700 mb-2">인증번호</label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="인증번호 6자리 입력"
                className="w-full p-3 border rounded-lg"
              />
              <button
                type="button"
                onClick={handleVerifyCode}
                disabled={loading}
                className="w-full mt-4 bg-[#00c73c] text-white py-3 rounded-lg font-bold hover:bg-[#00a032]"
              >
                {loading ? '처리중...' : '확인'}
              </button>
            </div>
          )}

          {error && (
            <p className="text-red-500 mt-2">{error}</p>
          )}

          {/* reCAPTCHA 컨테이너 */}
          <div id="recaptcha-container"></div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;