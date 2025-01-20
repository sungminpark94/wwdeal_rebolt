import React, { useState, useEffect } from 'react';
import Header from "../components/Header";
import Container from "../components/Container";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { 
  getAuth, 
  RecaptchaVerifier, 
  signInWithPhoneNumber 
} from 'firebase/auth';

const SellRegistration = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [carName, setCarName] = useState(''); // 차량 이름
  const [carYear, setCarYear] = useState(''); // 연식
  
  // 달력 관련 상태
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const currentDate = new Date();

  const timeSlots = [
    '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'
  ];

  // 달력 네비게이션
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  // 달력 날짜 생성
  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    // 이전 달의 날짜들
    for (let i = 0; i < firstDay; i++) {
      days.push({ date: null, disabled: true });
    }
    // 현재 달의 날짜들
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push({
        date,
        disabled: date < currentDate
      });
    }
    return days;
  };

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { user } = useAuth();
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);
  const [isVerified, setIsVerified] = useState(false);
  const [originalPhone, setOriginalPhone] = useState('');

  const auth = getAuth();

  // reCAPTCHA 설정
  useEffect(() => {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      'size': 'invisible'
    });
  }, [auth]);

  // 사용자 번호 자동 입력
  useEffect(() => {
    if (user?.phoneNumber) {
      setPhone(user.phoneNumber);
      setOriginalPhone(user.phoneNumber);
      setIsVerified(true);  // 기존 번호는 이미 인증된 상태
    }
  }, [user]);

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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // 번호가 변경되었는지 확인
  const isPhoneChanged = phone !== originalPhone;

  // 인증번호 발송
  const handleSendVerification = async () => {
    try {
      const phoneNumber = '+82' + phone.replace(/-/g, '').slice(1);
      const appVerifier = window.recaptchaVerifier;
      
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      window.confirmationResult = confirmationResult;
      
      setIsVerificationSent(true);
      setTimeLeft(180);
    } catch (error) {
      console.error('Error sending verification:', error);
      alert('인증번호 전송에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 인증번호 확인
  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6) {
      alert('인증번호 6자리를 입력해주세요.');
      return;
    }

    try {
      const result = await window.confirmationResult.confirm(verificationCode);
      if (result.user) {
        setIsVerified(true);
        setIsVerificationSent(false);
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      alert('잘못된 인증번호입니다. 다시 시도해주세요.');
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (!carName || !carYear || !selectedDate || !selectedTime || !address || !phone || !isVerified) {
      alert('모든 정보를 입력해주세요.');
      return;
    }

    try {
      // Firestore에 예약 정보 저장
      const reservationData = {
        userId: user.uid,
        carName,
        carYear,
        visitDate: selectedDate,
        visitTime: selectedTime,
        address,
        phone,
        status: '예약 완료',  // 예약 상태
        createdAt: new Date(),
      };

      await addDoc(collection(db, 'reservations'), reservationData);

      alert('예약이 완료되었습니다.');
      navigate('/profile');  // 예약 완료 후 프로필 페이지로 이동
    } catch (error) {
      console.error('예약 저장 중 오류:', error);
      alert('예약 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div id="recaptcha-container"></div>
      <div className="mx-auto w-full max-w-[480px] relative flex flex-col flex-1">
        <Header 
          title="방문 일정 예약" 
          leftButton={
            <button 
              onClick={() => navigate(-1)} 
              className="material-icons text-gray-600"
            >
              arrow_back
            </button>
          }
        />
        
        <Container className="flex-1 pt-4 px-4 pb-[calc(72px+24px)]">
          <div className="bg-white rounded-xl p-4 mb-6">
            <p className="text-gray-600">
              전문가가 방문하여 차량 상태를 확인하고 예상판매가를 알려드려요 ⚡️
            </p>
          </div>

          {/* 차량 정보 */}
          <section className="mb-8">
            <h2 className="text-lg font-medium mb-4">차량 정보</h2>
            <div className="bg-white rounded-xl p-4 space-y-4">
              <input
                type="text"
                value={carName}
                onChange={(e) => setCarName(e.target.value)}
                placeholder="차량 이름 (예: 그랜저 IG)"
                className="w-full p-3 border border-gray-200 rounded-lg"
              />
              <input
                type="text"
                value={carYear}
                onChange={(e) => setCarYear(e.target.value)}
                placeholder="연식 (예: 2019)"
                className="w-full p-3 border border-gray-200 rounded-lg"
              />
            </div>
          </section>

          {/* 날짜 선택 */}
          <section className="mb-8">
            <h2 className="text-lg font-medium mb-4">날짜 선택</h2>
            <div className="bg-white rounded-xl p-4">
              <div className="flex justify-between items-center mb-4">
                <button onClick={prevMonth} className="material-icons">chevron_left</button>
                <h3 className="text-lg font-medium">
                  {currentMonth.getFullYear()}년 {currentMonth.getMonth() + 1}월
                </h3>
                <button onClick={nextMonth} className="material-icons">chevron_right</button>
              </div>
              
              <div className="grid grid-cols-7 gap-1 text-center mb-4">
                <div className="text-sm text-red-500">일</div>
                <div className="text-sm">월</div>
                <div className="text-sm">화</div>
                <div className="text-sm">수</div>
                <div className="text-sm">목</div>
                <div className="text-sm">금</div>
                <div className="text-sm text-blue-500">토</div>
              </div>

              <div className="grid grid-cols-7 gap-1">
                {getDaysInMonth().map((day, index) => (
                  <button
                    key={index}
                    disabled={day.disabled}
                    onClick={() => day.date && setSelectedDate(day.date)}
                    className={`
                      aspect-square p-1 rounded-lg
                      ${!day.date ? 'invisible' : ''}
                      ${day.disabled ? 'text-gray-300' : 
                        selectedDate && day.date && selectedDate.toDateString() === day.date.toDateString()
                          ? 'bg-[#333333] text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    {day.date ? day.date.getDate() : ''}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* 시간 선택 */}
          <section className="mb-8">
            <h2 className="text-lg font-medium mb-4">시간 선택</h2>
            <div className="grid grid-cols-3 gap-3">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`py-3 rounded-xl text-center ${
                    selectedTime === time
                      ? 'bg-[#333333] text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </section>

          {/* 방문 위치 */}
          <section className="mb-8">
            <h2 className="text-lg font-medium mb-4">방문 위치</h2>
            <div className="bg-white rounded-xl p-4">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="예) 서울시 강남구 삼성동 123-45"
                className="w-full p-3 border border-gray-200 rounded-lg"
              />
            </div>
          </section>

          {/* 휴대폰 번호 */}
          <section className="mb-12">
            <h2 className="text-lg font-medium mb-4">휴대폰 번호</h2>
            <div className="bg-white rounded-xl p-4 space-y-3">
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (isVerified) setIsVerified(false);
                  }}
                  placeholder="010-0000-0000"
                  className="w-full p-3 border border-gray-200 rounded-lg"
                />
                {isPhoneChanged && !isVerified && (
                  <button
                    onClick={handleSendVerification}
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
                    className="w-full p-3 border border-gray-200 rounded-lg"
                    maxLength={6}
                  />
                  <button
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
          </section>
        </Container>

        {/* 성공 모달 */}
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div className="relative bg-white w-full max-w-sm rounded-2xl p-6 text-center">
              <div className="mb-4">
                <span className="material-icons text-5xl text-green-500">
                  check_circle
                </span>
              </div>
              <h3 className="text-lg font-medium mb-2">
                예약이 완료되었어요
              </h3>
              <p className="text-gray-600 mb-6">
                확인 후 전문가가 연락드릴 예정이에요
              </p>
              <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#333333] transition-all duration-3000 ease-linear"
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* 다음 버튼 */}
        <div className="fixed bottom-[72px] left-0 right-0 z-10">
          <div className="mx-auto w-full max-w-[480px] px-4 pb-6 pt-4 bg-gradient-to-t from-gray-50">
            <button
              onClick={handleSubmit}
              className="w-full bg-[#333333] text-white py-4 rounded-xl font-medium"
            >
              다음
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellRegistration; 