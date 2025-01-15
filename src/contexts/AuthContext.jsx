import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // 초기화 시 로컬 스토리지에서 사용자 정보 불러오기
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const login = (userData) => {
    setUser(userData);
    // 로그인 시 로컬 스토리지에 사용자 정보 저장
    localStorage.setItem('user', JSON.stringify(userData));
    setIsLoginModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    // 로그아웃 시 로컬 스토리지에서 사용자 정보 제거
    localStorage.removeItem('user');
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoginModalOpen,
      login, 
      logout, 
      openLoginModal,
      setIsLoginModalOpen 
    }}>
      {children}
      {isLoginModalOpen && <LoginModal />}
    </AuthContext.Provider>
  );
};

const LoginModal = () => {
  const { login, setIsLoginModalOpen } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180); // 3분
  const [isVerified, setIsVerified] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  // 타이머 관리
  useEffect(() => {
    let timer;
    if (isVerificationSent && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsVerificationSent(false);
      setTimeLeft(180);
    }
    return () => clearInterval(timer);
  }, [isVerificationSent, timeLeft]);

  // 인증번호 요청 처리
  const handleRequestVerification = () => {
    if (phoneNumber.length < 10) {
      alert('올바른 휴대폰 번호를 입력해주세요.');
      return;
    }
    setIsVerificationSent(true);
    setTimeLeft(180);
    // Firebase 연동 시 실제 인증번호 요청 로직 추가
  };

  // 인증번호 확인
  const handleVerifyCode = () => {
    if (verificationCode.length !== 6) {
      alert('인증번호 6자리를 입력해주세요.');
      return;
    }
    setIsVerified(true);
    // Firebase 연동 시 실제 인증번호 확인 로직 추가
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && phoneNumber && isVerified) {
      login({ name, phoneNumber });
      setShowWelcome(true);
      setTimeout(() => {
        setShowWelcome(false);
        setIsLoginModalOpen(false);
      }, 3000);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <div className="w-full max-w-md mx-4 bg-white rounded-2xl">
        {showWelcome ? (
          <div className="p-6 text-center">
            <p className="text-xl font-medium mb-2">
              반갑습니다! {name}님 ✨
            </p>
            <p className="text-gray-600">
              중고차 직거래를 편리하게 바꿔드릴게요!
            </p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-medium">회원가입/로그인</h2>
              <button
                onClick={() => setIsLoginModalOpen(false)}
                className="material-icons text-gray-500"
              >
                close
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div className="space-y-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="이름을 입력해주세요"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <div className="relative">
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="휴대폰 번호를 입력해주세요"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={isVerified}
                  />
                  {!isVerified && (
                    <button
                      type="button"
                      onClick={handleRequestVerification}
                      disabled={isVerificationSent && timeLeft > 0}
                      className={`absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg text-sm font-medium
                        ${isVerificationSent && timeLeft > 0 
                          ? 'bg-gray-100 text-gray-400' 
                          : 'bg-green-500 text-white hover:bg-green-600'}`}
                    >
                      {isVerificationSent && timeLeft > 0 ? formatTime(timeLeft) : '인증번호 받기'}
                    </button>
                  )}
                </div>
                {isVerificationSent && !isVerified && (
                  <div className="relative">
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="인증번호 6자리를 입력해주세요"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      maxLength={6}
                    />
                    <button
                      type="button"
                      onClick={handleVerifyCode}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800"
                    >
                      확인
                    </button>
                  </div>
                )}
                {isVerified && (
                  <p className="text-green-500 text-sm">
                    ✓ 인증이 완료되었습니다
                  </p>
                )}
              </div>
              <button 
                type="submit"
                disabled={!isVerified}
                className={`w-full py-3 rounded-xl font-medium transition-colors
                  ${isVerified 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-gray-100 text-gray-400'}`}
              >
                시작하기
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 