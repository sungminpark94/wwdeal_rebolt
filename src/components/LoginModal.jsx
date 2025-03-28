import React, { useState, useEffect } from 'react';
import { getAuth, signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';
import { useAuth } from '../contexts/AuthContext';


const LoginModal = ({ isOpen, onClose }) => {
  const {verifyCode} = useAuth();
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationId, setVerificationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isVerificationSent, setIsVerificationSent] = useState(false);

  // reCAPTCHA 설정
  const setupRecaptcha = () => {
    const auth = getAuth();
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = null;
    }
    
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      'size': 'invisible', // 'normal'에서 'invisible'로 변경
      'callback': (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        console.log('reCAPTCHA verified');
      },
      'expired-callback': () => {
        // Response expired. Ask user to solve reCAPTCHA again.
        console.log('reCAPTCHA expired');
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
        setupRecaptcha();
      }
    });
  };

  useEffect(() => {
    if (isOpen && !window.recaptchaVerifier) {
      setupRecaptcha();
    }
    
    // 컴포넌트 언마운트 시 reCAPTCHA 정리
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    };
  }, [isOpen]);

  const formatPhoneNumber = (phoneNumber, defaultCountryCode = "+82") => {
    // Check if the phone number matches the "01012345678" format
    const isValid = /^010\d{8}$/.test(phoneNumber);

    // If valid, prepend the default country code; otherwise, return an empty string
    return isValid ? `${defaultCountryCode}${phoneNumber}`.replace(/^\+820/, "+82") : "";
};



  const handleSendVerification = async () => {
    try {
      setLoading(true);
      setError(null);

      // 기존 reCAPTCHA 정리
      if (window.recaptchaVerifier) {
        await window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }

      const auth = getAuth();
      
      // reCAPTCHA 설정 변경
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {},
        'expired-callback': () => {
          setError('reCAPTCHA가 만료되었습니다. 다시 시도해주세요.');
        }
      }, auth);  // auth 인스턴스를 명시적으로 전달

      // 전화번호 형식 통일
      const formattedNumber = phoneNumber.startsWith('+82') 
        ? phoneNumber 
        : `+82${phoneNumber.replace(/^0/, '')}`;

      // 인증번호 발송
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedNumber,
        window.recaptchaVerifier
      );

      window.confirmationResult = confirmationResult;
      setIsVerificationSent(true);
      alert('인증번호가 발송되었습니다.');

    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
      
      // 에러 발생 시 reCAPTCHA 정리
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    } finally {
      setLoading(false);
    }
  };

  // 인증번호 확인
  const handleVerifyCode = async () => {
    if (!verificationId) return;

    try {
      setLoading(true);
      setError(null);
      
      const result = await verifyCode(verificationId, verificationCode);
      console.log('User signed in:', result.user);

      onClose(); // 성공 시 모달 닫기
    } catch (error) {
      console.error('Error:', error);
      setError('잘못된 인증번호입니다.');
    } finally {
      setLoading(false);
    }
  };

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
          {/* 이름 입력
          <div>
            <label className="block text-gray-700 mb-2">이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력해주세요"
              className="w-full p-3 border rounded-lg"
            />
          </div> */}

          {/* 전화번호 입력 */}
          <div>
            <form className="block text-gray-700 mb-2">휴대폰 번호</form>
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
          {verificationId && (
            <div>
              <form className="block text-gray-700 mb-2">인증번호</form>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="인증번호 6자리 입력"
                className="w-full p-3 border rounded-lg"
              />
              <button
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
