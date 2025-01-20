import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';
import Header from '../components/Header';

const Login = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationId, setVerificationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // reCAPTCHA 설정
  const setupRecaptcha = () => {
    const auth = getAuth();
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      'size': 'normal',
      'callback': (response) => {
        console.log('reCAPTCHA solved:', response);
      },
      'expired-callback': () => {
        console.log('reCAPTCHA expired');
      }
    });
    
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

  // 인증번호 확인
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!verificationId) return;

    try {
      setLoading(true);
      setError(null);
      
      const result = await verificationId.confirm(verificationCode);
      
      // 로그인 성공
      console.log('User signed in:', result.user);
      navigate('/listings'); // 로그인 후 매물 목록 페이지로 이동
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
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm p-6">
          <h1 className="text-2xl font-bold mb-6">로그인</h1>
          
          <form onSubmit={handleSendVerification} className="mb-6">
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

          {verificationId && (
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

          {/* reCAPTCHA 컨테이너 */}
          <div id="recaptcha-container" className="mt-4"></div>

          <button
            onClick={handleLogin}
            className="w-full bg-black text-white py-3 rounded-lg"
          >
            로그인하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login; 