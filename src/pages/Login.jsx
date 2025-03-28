import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';
import Header from '../components/Header';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const Login = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [ , setName] = useState('');
  const [verificationId, setVerificationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // reCAPTCHA 설정
  const setupRecaptcha = () => {
    const auth = getAuth();
    window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
      'size': 'normal',
      'callback': (response) => {
        console.log('reCAPTCHA solved:', response);
      },
      'expired-callback': () => {
        console.log('reCAPTCHA expired');
      }
    }, auth);
    
    // reCAPTCHA 렌더링
    window.recaptchaVerifier.render().then((widgetId) => {
      window.recaptchaWidgetId = widgetId;
    });
  };

  // 인증번호 발송
  const handleSendVerification = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      const auth = getAuth();
      
      // window.recaptchaVerifier 사용
      const formattedPhoneNumber = `+82${phoneNumber.replace(/^0/, '')}`;
      
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedPhoneNumber,
        window.recaptchaVerifier
      );
      
      setVerificationId(confirmationResult);
      alert('인증번호가 발송되었습니다.');
    } catch (error) {
      console.error("Error during phone number verification:", error);
      setError('인증번호 발송에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 인증번호 확인
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!verificationId) return;

    try {
      setLoading(true);
      setError(null);
      
      // 사용자 문서에 이름 저장
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      await setDoc(userDocRef, {
        name: name,
        phoneNumber: phoneNumber,
        createdAt: serverTimestamp()
      }, { merge: true });

      navigate('/');
    } catch (error) {
      console.error('Error:', error);
      setError('잘못된 인증번호입니다.');
    } finally {
      setLoading(false);
    }
  };

  // 로그인 버튼 클릭 핸들러
  const handleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!window.recaptchaVerifier) {
        setupRecaptcha();
      }

      const auth = getAuth();
      const formattedPhoneNumber = `+82${phoneNumber.replace(/^0/, '')}`;
      
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedPhoneNumber,
        window.recaptchaVerifier
      );
      
      setVerificationId(confirmationResult);
      alert('인증번호가 발송되었습니다.');
    } catch (error) {
      console.error('Error:', error);
      setError('인증번호 발송에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl p-8 shadow-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">로그인</h2>
        
        {/* reCAPTCHA를 위한 div 추가 */}
        <div id="recaptcha-container"></div>
        
        {!showVerification ? (
          <form onSubmit={handleSendVerification} className="mb-6">
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">이름</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름을 입력하세요"
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">휴대폰 번호</label>
              <div className="flex gap-2">
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="휴대폰 번호 입력"
                  className="flex-1 p-3 border rounded-lg"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 rounded-lg"
                >
                  인증번호 받기
                </button>
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">인증번호</label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="인증번호 6자리 입력"
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold"
            >
              {loading ? '처리중...' : '확인'}
            </button>
          </form>
        )}

        {error && (
          <p className="text-red-500 mt-4">{error}</p>
        )}

        <button
          onClick={handleLogin}
          className="w-full bg-black text-white py-3 rounded-lg"
        >
          로그인하기
        </button>
      </div>
    </div>
  );
};

export default Login; 