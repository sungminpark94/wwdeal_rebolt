import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import BottomCTA from "../components/BottomCTA";
import Container from "../components/Container";
import { useAuth } from '../contexts/AuthContext';
import { faqData } from "../data/faqData";
import { useNavigate } from 'react-router-dom';
import { useInterest } from '../contexts/InterestContext';
import { useRecentViews } from "../contexts/RecentViewContext";
import { doc, getDoc, setDoc, collection, addDoc, serverTimestamp, updateDoc, arrayUnion, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import LoginModal from '../components/LoginModal';

const defaultCarImage = '/images/default-car.png';

const getValidImageUrl = (imageUrl) => {
  if (!imageUrl) return defaultCarImage;
  if (imageUrl.startsWith('http')) return imageUrl;
  if (imageUrl.startsWith('/')) return imageUrl;
  return defaultCarImage;
};

const BannerContent = ({ bannerId, setShowBannerSheet }) => {
  const { user, openLoginModal } = useAuth();
  const [showAlert, setShowAlert] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubscribe = () => {
    if (!user) {
      console.log('user not found');
      setIsLoginModalOpen(true);
      return;
    }

    // 알림 신청 로직 추가
    setShowAlert(true);
    
    // 3초 후 알럿 숨기고 시트 닫기
    setTimeout(() => {
      setShowAlert(false);
      setShowBannerSheet(false);
    }, 3000);
  };

  switch (bannerId) {
    case 1:
      return (
        <div className="px-4 py-6 space-y-8 pb-24">
          {/* 차량 기본 정보 섹션 */}
          <div className="space-y-6">
            {/* 이미지 갤러리 */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              <img src="car_image1.jpg" className="w-48 h-48 rounded-lg object-cover flex-shrink-0" alt="차량 이미지" />
              <img src="car_image2.jpg" className="w-48 h-48 rounded-lg object-cover flex-shrink-0" alt="차량 이미지" />
              <img src="car_image3.jpg" className="w-48 h-48 rounded-lg object-cover flex-shrink-0" alt="차량 이미지" />
              <img src="car_image4.jpg" className="w-48 h-48 rounded-lg object-cover flex-shrink-0" alt="차량 이미지" />
              <img src="car_image5.jpg" className="w-48 h-48 rounded-lg object-cover flex-shrink-0" alt="차량 이미지" />      
              <img src="car_image6.jpg" className="w-48 h-48 rounded-lg object-cover flex-shrink-0" alt="차량 이미지" />
              <img src="car_image7.jpg" className="w-48 h-48 rounded-lg object-cover flex-shrink-0" alt="차량 이미지" />
              <img src="car_image8.jpg" className="w-48 h-48 rounded-lg object-cover flex-shrink-0" alt="차량 이미지" />
              <img src="car_image9.jpg" className="w-48 h-48 rounded-lg object-cover flex-shrink-0" alt="차량 이미지" />
              <img src="car_image10.jpg" className="w-48 h-48 rounded-lg object-cover flex-shrink-0" alt="차량 이미지" />
              <img src="car_image11.jpg" className="w-48 h-48 rounded-lg object-cover flex-shrink-0" alt="차량 이미지" />
            </div>

            {/* 기본 정보 */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">E89 Z4</h2>
              <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                <span>2009년형</span>
                <span>•</span>
                <span>206,000km</span>
                <span>•</span>
                <span className="text-green-600 font-medium">미정(복원 후 결정)</span>
              </div>
            </div>
          </div>

          {/* 차량 상태 섹션 */}
          <div className="bg-gray-50 p-4 rounded-xl">
            <h3 className="font-bold mb-2">차량 상태</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              현재 유튜브 채널 아짓트에서 복원 중인 차량입니다.<br/>
              복원 완료 후 판매 예정으로 구매하시는 시점에는 좋은 상태를 유지할 것으로 예상됩니다.
            </p>
          </div>

          {/* 옵션 정보 섹션 */}
          <div>
            <h3 className="font-bold mb-3">옵션 정보</h3>
            <div className="bg-white border rounded-xl p-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="material-icons text-green-500 text-sm">check_circle</span>
                  <span>안드로이드 오토 적용</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-icons text-green-500 text-sm">check_circle</span>
                  <span>헤드램프(HID)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-icons text-green-500 text-sm">check_circle</span>
                  <span>전동접이 사이드미러</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-icons text-green-500 text-sm">check_circle</span>
                  <span>알루미늄휠</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-icons text-green-500 text-sm">check_circle</span>
                  <span>패들 시프트</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-icons text-green-500 text-sm">check_circle</span>
                  <span>스티어링 휠 리모콘</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-icons text-green-500 text-sm">check_circle</span>
                  <span>ECM 룸미러</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-icons text-green-500 text-sm">check_circle</span>
                  <span>파워스티어링 휠</span>
                </div>
                {showMoreOptions && (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="material-icons text-green-500 text-sm">check_circle</span>
                      <span>후방 카메라</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-icons text-green-500 text-sm">check_circle</span>
                      <span>블루투스</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-icons text-green-500 text-sm">check_circle</span>
                      <span>크루즈 컨트롤</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-icons text-green-500 text-sm">check_circle</span>
                      <span>열선시트</span>
                    </div>
                  </>
                )}
              </div>
              <button 
                onClick={() => setShowMoreOptions(!showMoreOptions)}
                className="w-full mt-3 text-center text-sm text-gray-500 hover:text-gray-700"
              >
                {showMoreOptions ? '접기' : '더보기'}
              </button>
            </div>
          </div>

          {/* 위치 정보 */}
          <div>
            <h3 className="font-bold mb-3">차량 위치 안내</h3>
            <div className="bg-white border rounded-xl p-4">
              <p className="text-gray-600">경기도 일산서구 덕이동 인근 보관 중</p>
            </div>
          </div>

          {/* 윈윈딜 서비스 안내 */}
          <div className="space-y-6">
            <h3 className="font-bold text-lg">믿을 수 있는 중고차 직거래, 윈윈딜</h3>
            
            {/* 전문가 검증 서비스 */}
            <div className="bg-white border rounded-xl p-5">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="material-icons text-blue-600">verified</span>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-3">전문가의 꼼꼼한 차량 검증</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <span className="material-icons text-green-500 text-sm">check_circle</span>
                      경력 평가사(정비사)의 150가지 체크리스트 검수
                    </li>
                    
                    <li className="flex items-center gap-2">
                      <span className="material-icons text-green-500 text-sm">check_circle</span>
                      전문가의 상세한 차량 상태 리포트 제공
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-icons text-green-500 text-sm">check_circle</span>
                      허위매물 ZERO, 실제 존재하는 매물만 소개
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 투명한 직거래 가격 */}
            <div className="bg-white border rounded-xl p-5">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="material-icons text-green-600">payments</span>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-3">투명한 직거래 가격</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <span className="material-icons text-green-500 text-sm">check_circle</span>
                      구매자 수수료 0원, 숨겨진 비용 없음
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-icons text-green-500 text-sm">check_circle</span>
                      실거래가 데이터 기반의 합리적인 가격 책정
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-icons text-green-500 text-sm">check_circle</span>
                      딜러 수수료 절감으로 평균 50~500만원 저렴
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-icons text-green-500 text-sm">check_circle</span>
                      가격 흥정 없이 명확한 가격 제시
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-icons text-green-500 text-sm">check_circle</span>
                      에스크로 방식으로 안전한 거래 진행
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 안심 구매 프로세스 */}
            <div className="bg-white border rounded-xl p-5">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="material-icons text-purple-600">support_agent</span>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-3">전문가와 함께하는 안심 구매</h4>
                  <ul className="space-y-2 text-gray-600">
                    
                    <li className="flex items-center gap-2">
                      <span className="material-icons text-green-500 text-sm">check_circle</span>
                      전담 매니저의 신속한 응대
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-icons text-green-500 text-sm">check_circle</span>
                      전담 매니저의 차량 상태와 옵션 상세 설명
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-icons text-green-500 text-sm">check_circle</span>
                      등록부터 보험까지 모든 서류 업무 대행
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-icons text-green-500 text-sm">check_circle</span>
                      구매 후 2주간 차량 이상 시 수리 지원
                      <br/>(설명과 다른 경우 무상 지원)
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* 알림 완료 알럿 */}
          {showAlert && (
            <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50">
              <div className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg text-sm">
                알림 신청이 완료되었어요!
              </div>
            </div>
          )}

          {/* 하단 고정 버튼 */}
          <div className="fixed bottom-0 left-0 right-0 px-4 py-4 bg-white border-t">
            <button 
              // onClick={handleSubscribe} 로그인 모달 활성화 시 사용
              onClick={() => window.location.href = 'https://naver.me/GJToP6nI'}

              className="w-full bg-black text-white py-4 rounded-xl font-medium hover:bg-gray-800 transition-colors duration-200"
            >
              판매 시 알림받기
            </button>

            {/* 로그인 모달 */}
            {/* <LoginModal 
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
            /> */}
          </div>
        </div>
      );

    case 2:
      return (
        <div className="px-4 py-6 space-y-8 pb-24">
          {/* 메인 타이틀 섹션 */}
          <div className="bg-gray-900 text-white p-6 rounded-xl space-y-4">
            <h2 className="text-xl font-bold">차 팔 때 겪는 그 찝찝함, 아시나요?</h2>
            <p className="text-lg">
              "어제 딜러한테 판 매물이 <br/>오늘은 400만원 더 비싸게 올라와있더라고요."<br/>
              <span className="text-xl font-bold flex justify-center">
                <br/>"내 차도 더 받을 수 있었던 거 아닐까?"
              </span>
            </p>
          </div>

          {/* 경험 공유 섹션 */}
          <div className="bg-gray-50 p-6 rounded-xl space-y-4">
            <h3 className="font-bold text-lg">중고차 팔 때 한 번쯤 이런 경험 있으시죠?</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="material-icons text-red-600 text-sm">error</span>
                </div>
                <span>매입 딜러의 현장 내고 경험</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="material-icons text-red-600 text-sm">error</span>
                </div>
                <span>직거래하려다가 반복되는 문의에 시달린 경험</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="material-icons text-red-600 text-sm">error</span>
                </div>
                <span>며칠 후 올라온 내차 가격이 너무 비싸게 올라온 경험</span>
              </li>
            </ul>
          </div>

          {/* 스토리 섹션 */}
          <div className="bg-white border rounded-xl p-6 space-y-4">
            <h3 className="font-bold text-lg">그래서 윈윈딜을 시작하게 되었어요.</h3>
            <p className="text-gray-600">
              내가 열심히 관리하던 차량을<br/>
              헐값으로 넘겨야 할 땐 너무 아깝더라고요.<br/>
            </p>
            <p className="text-gray-600">
              그게 아까워서 직거래를 시도했지만,
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>• 밤낮없이 오는 문의 전화</li>
              <li>• 보자마자 네고 들어오는 발품 구매자들</li>
              <li>• 서류는 또 얼마나 복잡했던지...</li>
            </ul>
          </div>

          {/* 솔루션 섹션 */}
          <div className="bg-blue-50 p-6 rounded-xl">
            <h3 className="font-bold text-lg text-center mb-6">
              "이제는 이런 귀찮은 일,<br/>윈윈딜이 다 해결해드릴게요"
            </h3>
            
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-5">
                <h4 className="font-bold text-lg mb-4">👨‍🔧 믿을 수 있는 전문가가 직접 나섭니다</h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="material-icons text-green-500 text-sm">check_circle</span>
                    150가지 체크리스트로 꼼꼼하게 점검
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-icons text-green-500 text-sm">check_circle</span>
                    직접 시운전하고 상태 확인
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-icons text-green-500 text-sm">check_circle</span>
                    정직하게 차량 가치 평가
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-5">
                <h4 className="font-bold text-lg mb-4">🚫 귀찮은 일 제로!</h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="material-icons text-green-500 text-sm">check_circle</span>
                    예쁘게 사진 찍어서 판매글도 올리고
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-icons text-green-500 text-sm">check_circle</span>
                    문의전화? 가격흥정? 저희가 다 할게요
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-icons text-green-500 text-sm">check_circle</span>
                    서류 준비부터 계약까지 원스톱으로
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-5">
                <h4 className="font-bold text-lg mb-4">💰 실제로 더 받을 수 있어요</h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="material-icons text-green-500 text-sm">check_circle</span>
                    실거래가 기준으로 최적가 찾아드려요
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-icons text-green-500 text-sm">check_circle</span>
                    딜러보다 평균 180만원 더 받으세요
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-icons text-green-500 text-sm">check_circle</span>
                    시장 상황에 맞춘 가격 조정으로 빠른 판매
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 비용 안내 섹션 */}
          <div className="bg-white border rounded-xl p-6 space-y-6">
            <h3 className="font-bold text-lg">비용은 어떻게 될까요?</h3>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold mb-2">1. 처음 시작할 때</h4>
                <ul className="space-y-2">
                  <li>• 예약 시 99,000원 (판매 시 수수료에서 제외)</li>
                  <li>• 안 팔리면 100% 환불</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold mb-2">2. 차 팔 때</h4>
                <p className="mb-2">판매 시에만 수수료가 발생해요.</p>
                <ul className="space-y-2">
                  <li>• 3,000만원 이하: 299,000원</li>
                  <li>• 3,001만원 ~ 4,000만원: 399,000원</li>
                  <li>• 4,001만원 ~ 5,000만원: 499,000원</li>
                  <li>• 5,001만원 ~ 6,000만원: 599,000원</li>
                  <li>• 6,001만원 ~ 7,000만원: 699,000원</li>
                  <li>• 7,001만원 ~ 8,000만원: 799,000원</li>
                  <li>• 8,001만원 ~ 9,000만원: 899,000원</li>
                  <li>• 9,001만원 ~ 1억원 미만: 999,000원</li>
                  <li>• 1억원 이상: 1,499,000원</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 진행 과정 */}
          <div className="bg-white border rounded-xl p-6">
            <h3 className="font-bold text-lg mb-4">이렇게 진행됩니다</h3>
            <ol className="space-y-2">
              <li>1. 일단 무료로 상담이 진행돼요</li>
              <li>2. 전문가가 찾아가서 판매가를 제안해요</li>
              <li>3. 괜찮은 가격이면 시작해 주세요</li>
              <li>4. 이후 절차는 저희가 다 할게요</li>
              <li>5. 편하게 대금 받으세요</li>
            </ol>
          </div>

          {/* 실제 후기 */}
          <div className="bg-gray-50 p-6 rounded-xl space-y-4">
            <h3 className="font-bold text-lg">실제로 이렇게 팔렸어요</h3>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg">
                <p className="text-lg mb-2">"딜러가 부른 값보다 훨씬 더 받았어요!"</p>
                <p className="text-gray-600">2024년 2월에 투싼 파신 K님</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-lg mb-2">"전문가님이 다 알아서 해주셔서 너무 편했어요"</p>
                <p className="text-gray-600">2024년 3월에 아반떼 파신 L님</p>
              </div>
            </div>
          </div>

          {/* 체크리스트 */}
          <div className="bg-white border rounded-xl p-6">
            <h3 className="font-bold text-lg mb-4">잠깐, 체크해보세요</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="material-icons text-blue-500">radio_button_unchecked</span>
                중고차 견적 받아보셨나요?
              </li>
              <li className="flex items-center gap-2">
                <span className="material-icons text-blue-500">radio_button_unchecked</span>
                그 가격에 만족하시나요?
              </li>
              <li className="flex items-center gap-2">
                <span className="material-icons text-blue-500">radio_button_unchecked</span>
                더 받을 수 있다면 한 번 알아보고 싶으신가요?
              </li>
            </ul>
          </div>

          {/* 마지막 CTA */}
          <div className="bg-yellow-50 p-6 rounded-xl space-y-4">
            <h3 className="font-bold text-lg">⚠️ 잠깐!</h3>
            <p>이미 딜러에게 견적 받으셨다구요?<br/>
            그럼 더더욱 연락주세요!</p>
            <p>그 견적을 기준으로<br/>
            서비스 이용 여부를 결정할 수 있어요.</p>
          </div>

          {/* 하단 고정 버튼 */}
          <div className="fixed bottom-0 left-0 right-0 px-4 py-4 bg-white border-t">
            <button 
              onClick={() => {
                setShowBannerSheet(false);
                // navigate('/sell');
                window.location.href = 'https://naver.me/GbDVH4DG'
              }}
              className="w-full bg-black text-white py-4 rounded-xl font-medium hover:bg-gray-800 transition-colors duration-200"
            >
              내 차 최적가 무료상담
            </button>
          </div>
        </div>
      );

    case 3:
      return (
        <div className="px-4 py-6 space-y-8 pb-24">
          {/* 메인 타이틀 섹션 */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold mb-4">
              중고차 구매할 때 <br/>
              이런 경험 있으신가요?
            </h1>
          </div>

          {/* 문제 제기 섹션 */}
          <div className="bg-white rounded-xl p-6">
            <div className="space-y-6">
              {/* 첫 번째 메시지 */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-lg leading-relaxed">
                <h2 className="text-xl font-bold">
                  "차량 상태는 괜찮은데, <br/>
                  딜러 거래는 수수료 및 기타 비용이 <br/>
                  너무 비싸서 고민이에요."
                </h2>
                </p>
              </div>
              
              {/* 두 번째 메시지 */}
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-lg leading-relaxed text-blue-800">
                
                  이제 중고차 구매를 조금 더<br/>
                  합리적으로 할 수 있도록 도와드릴게요.
                </p>
              </div>
              
              {/* 강조 메시지 */}
              <div className="bg-black text-white rounded-lg p-4">
                <p className="text-lg font-bold leading-relaxed text-center">
                  중고차를 가장 합리적으로 <br/>
                  <span className="text-xl text-yellow-400"> 구매할 수 있는 방법은 직거래</span>입니다.
                </p>
              </div>
            </div>
          </div>

          {/* 기존 직거래의 문제점 */}
          <div className="bg-white rounded-xl p-6 space-y-4">
            <h3 className="font-bold text-lg">단, 기존 중고차 직거래 방식은<br/>이러한 문제가 있었어요.</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <span className="material-icons text-red-500 text-sm">cancel</span>
                <span>판매자의 전문성 부족</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-icons text-red-500 text-sm">cancel</span>
                <span>구매 과정에서 절차의 복잡함</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-icons text-red-500 text-sm">cancel</span>
                <span>구매 후 문제 발생 시 처리의 어려움</span>
              </li>
            </ul>
          </div>

          {/* 윈윈딜 소개 */}
          <div className="bg-white rounded-xl p-6 space-y-4">
            <h3 className="font-bold text-lg text-center">
              하지만,<br/>
              윈윈딜과 함께하면 다릅니다
            </h3>
          </div>

          {/* 전문가 검증 섹션 */}
          <div className="bg-white rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="material-icons text-blue-600">verified</span>
              </div>
              <h3 className="font-bold text-lg"> 전문가가 검증한 진짜 매물</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <span className="material-icons text-green-500 text-sm">check_circle</span>
                <span>150가지 체크리스트로 꼼꼼한 차량 검수</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-icons text-green-500 text-sm">check_circle</span>
                <span>실제 주행 테스트 완료</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-icons text-green-500 text-sm">check_circle</span>
                <span>전문가의 객관적인 상태 평가</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-icons text-green-500 text-sm">check_circle</span>
                <span>정확한 사고이력 및 수리 내역 제공</span>
              </li>
            </ul>
          </div>

          {/* 합리적인 가격 섹션 */}
          <div className="bg-white rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="material-icons text-blue-600">payments</span>
              </div>
              <h3 className="font-bold text-lg"> 합리적인 직거래 가격</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <span className="material-icons text-green-500 text-sm">check_circle</span>
                <span>구매자 수수료 없음</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-icons text-green-500 text-sm">check_circle</span>
                <span>딜러 수수료 없는 직거래 가격</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-icons text-green-500 text-sm">check_circle</span>
                <span>실거래가 데이터 기반의 정직한 가격</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-icons text-green-500 text-sm">check_circle</span>
                <span>시장 평균 대비 50~500만원까지 저렴</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-icons text-green-500 text-sm">check_circle</span>
                <span>불필요한 가격 흥정 NO</span>
              </li>
            </ul>
          </div>

          {/* 편안한 구매 프로세스 섹션 */}
          <div className="bg-white rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="material-icons text-purple-600">support_agent</span>
              </div>
              <h3 className="font-bold text-lg"> 편안한 구매 절차</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <span className="material-icons text-green-500 text-sm">check_circle</span>
                <span>매물 확인부터 계약까지 전문가 동행</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-icons text-green-500 text-sm">check_circle</span>
                <span>차량 상태 상세 설명</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-icons text-green-500 text-sm">check_circle</span>
                <span>모든 서류 준비 대행</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-icons text-green-500 text-sm">check_circle</span>
                <span>명의이전 및 보험가입 지원</span>
              </li>
            </ul>
          </div>

          {/* 실제 사례 섹션 */}
          <div className="bg-white rounded-xl p-6 space-y-4">
            <h3 className="font-bold text-lg mb-4">실제 사례를 들려드릴게요</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold mb-2">직접 거래하려다 힘들었던 A님의 이야기</h4>
              <p className="text-gray-600">
                "직거래로 차를 알아보면서 정말 고생했어요. 매물은 많은데 실제로 가보면 상태가 달랐고, 차량 상태를 잘 몰라서 불안했죠. 윈윈딜을 만나고 나서야 편하게 구매할 수 있었어요. 전문가님이 차량 상태를 미리 꼼꼼히 설명해주시고, 가격도 합리적이었습니다."
              </p>
            </div>
          </div>

          {/* 이용 방법 섹션 */}
          <div className="bg-white rounded-xl p-6 space-y-4">
            <h3 className="font-bold text-lg mb-4">이용 방법</h3>
            <ol className="space-y-3">
              {['원하는 차량 검색', '무료 상담 신청', '전문가의 차량 설명', 
                '판매자와 만나서 최종 체크', '계약 및 명의이전(대행 가능)', '새 차의 주인되기'].map((step, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-bold">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* 윈윈딜의 약속 섹션 */}
          <div className="bg-white rounded-xl p-6 space-y-6">
            <h3 className="font-bold text-lg text-center">윈윈딜의 특별한 약속</h3>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold mb-2">1. 허위매물 ZERO</h4>
                <ul className="space-y-2">
                  <li>• 모든 매물 직접 확인</li>
                  <li>• 정확한 차량 정보 제공</li>
                  <li>• 상태 점검 결과 기반 상담 가능</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold mb-2">2. 안전한 거래 보장</h4>
                <ul className="space-y-2">
                  <li>• 에스크로 기반 안전 결제</li>
                  <li>• 명의이전 완료까지 대금 보호</li>
                  <li>• 윈윈딜이 중간에서 거래 진행</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold mb-2">3. 투명한 가격</h4>
                <ul className="space-y-2">
                  <li>• 구매자 수수료 완전 무료</li>
                  <li>• 불필요한 마진 없는 직거래 가격</li>
                  <li>• 숨겨진 비용 ZERO</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 고객 후기 섹션 */}
          <div className="bg-white rounded-xl p-6 space-y-4">
            <h3 className="font-bold text-lg mb-4">고객 후기</h3>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 mb-2">➡️ "차량 상태를 정확히 설명해주셔서 안심하고 구매했어요"</p>
                <p className="text-sm text-gray-500">2024년 2월 구매 / SM6 고객 P님</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 mb-2">➡️ "직거래라 가격도 저렴하고, 전문가가 함께해 믿을 수 있었어요"</p>
                <p className="text-sm text-gray-500">2024년 3월 구매 / 투싼 고객 M님</p>
              </div>
            </div>
          </div>

          {/* 마무리 섹션 */}
          <div className="bg-white rounded-xl p-6 text-center space-y-4">
            <h3 className="font-bold text-lg">윈윈딜이 특별한 이유</h3>
            <div className="flex flex-wrap justify-center gap-2">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">✓ 전문가 검증 매물</span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">✓ 실거래가 기반 합리적 가격</span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">✓ 거래 완료까지 안전 보장</span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">✓ 고객 만족도 98%</span>
            </div>
            <p className="font-bold mt-6">
              지금 바로 시작하세요!<br/>
              원하는 차량을 검색하고 무료 상담을 신청해보세요.
            </p>
            <p className="text-lg font-bold text-blue-600">
              믿을 수 있는 중고차 직거래,<br/>
              윈윈딜이 함께합니다.
            </p>
          </div>

          {/* 하단 고정 버튼 */}
          <div className="fixed bottom-0 left-0 right-0 px-4 py-4 bg-white border-t">
            <button 
              onClick={() => {
                setShowBannerSheet(false);
                navigate('/listings');
              }}
              className="w-full bg-black text-white py-4 rounded-xl font-medium hover:bg-gray-800 transition-colors duration-200"
            >
              매물 보러가기
            </button>
          </div>
          
        </div>
      );

    default:
      return null;
  }
};

const Home = () => {
  const { user, openLoginModal } = useAuth();
  const { addInterest } = useInterest();
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [showFeeDetails, setShowFeeDetails] = useState(false);
  const [showBannerSheet, setShowBannerSheet] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const navigate = useNavigate();
  const [recentViews, setRecentViews] = useState([]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;

    const userDocRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userDocRef, (doc) => {
      if (doc.exists()) {
        const userData = doc.data();
        if (userData.recentViews) {
          console.log('Found recent views:', userData.recentViews);
          setRecentViews(userData.recentViews);
        }
      }
    });

    return () => unsubscribe();
  }, [user]);

  const saveNotificationRequest = async (carModel) => {
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        interestedCars: arrayUnion({
          model: carModel,
          createdAt: new Date().toISOString(),
          status: 'active'
        })
      });
      
      alert('알림 신청이 완료되었습니다.');
    } catch (error) {
      console.error("Error saving notification request:", error);
      alert('알림 신청 중 오류가 발생했습니다.');
    }
  };

  const handleBannerClick = (index) => {
    setSelectedBanner(index);
    setShowBannerSheet(true);
  };

  const handleSave = async () => {
    // alert('서비스 준비 중입니다.\n빠른 시일 내에 찾으시는 매물 저장 기능을 제공하도록 하겠습니다.');

     if (!user) {
      setIsLoginModalOpen(true);
      return;
    }

    // InterestContext를 통해 관심 차종 추가
    addInterest(searchTerm);
    setSearchTerm('');
    setShowSuccessToast(true);
    
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 3000);
  };

  const handleSubscribe = () => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header title="WW:D" />
      
      <Container className="flex-1">
        {/* 검색바 */}
        <div className="relative mb-6 mt-4">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-icons text-gray-400">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="관심 차종 저장하고 알림 받아보세요!"
            className="w-full pl-10 pr-20 py-3 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
          />
          {searchTerm && (
            <button
              onClick={handleSave}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600"
            >
              저장
            </button>
          )}
        </div>

        {/* 성공 토스트 메시지 */}
        {showSuccessToast && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50">
            <div className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg text-sm">
              성공적으로 저장되었어요!
            </div>
          </div>
        )}

        {/* 최근 본 차 */}
        <section className="mb-6">
          <h2 className="text-lg font-bold mb-4">최근 본 차</h2>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {recentViews && recentViews.length > 0 ? (
              <>
                {recentViews.slice(0, 10).map((item, index) => (
                  <div key={`${item.id}-${index}`} className="flex-shrink-0 w-40">
                    <div 
                      className="bg-white rounded-lg p-3 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                      onClick={() => navigate(`/listing/${item.id}`)}
                    >
                      <img
                        src={item.images?.[0]}
                        alt={item.name}
                        className="w-full h-24 object-cover rounded mb-2"
                        onError={(e) => {
                          e.target.src = defaultCarImage;
                          e.target.onerror = null;
                        }}
                      />
                      <p className="font-medium text-sm truncate">{item.name}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <span>{item.year}년</span>
                        <span>•</span>
                        <span>{Number(item.mileage).toLocaleString()}km</span>
                      </div>
                      <p className="text-sm font-medium text-green-600 mt-1">
                        {Number(item.price).toLocaleString()}만원
                      </p>
                    </div>
                  </div>
                ))}
                {recentViews.length >= 10 && (
                  <div className="flex-shrink-0 w-40">
                    <div 
                      className="bg-white rounded-lg p-3 cursor-pointer h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors"
                      onClick={() => navigate('/favorites')}
                    >
                      <span className="material-icons text-gray-400 text-2xl mb-2">
                        add_circle_outline
                      </span>
                      <p className="text-sm text-gray-500">더보기</p>
                      <p className="text-xs text-gray-400 mt-1">
                        관심탭으로 이동
                      </p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full text-center text-gray-500 py-4">
                최근 본 차량이 없습니다.
              </div>
            )}
          </div>
        </section>

        {/* 배너 섹션들 */}
        <section className="space-y-4 mb-8">
          <div 
            className="bg-white rounded-xl relative overflow-hidden h-64 cursor-pointer" 
            onClick={() => window.location.href = 'https://insurance.pay.naver.com/car?inflow=pc_brand_search_text'}
          >
            <img 
              src="wwd_banner1.png" 
              alt="Banner 1" 
              className="w-full h-full object-cover"
            />
            {/* <button
              onClick={() => handleBannerClick(1)}
              className="absolute bottom-8 right-8 px-8 py-2 bg-white rounded-lg text-sm font-bold text-gray-900 shadow-sm hover:bg-gray-50"
            >
              알림 신청
            </button> */}
          </div>

          <div 
            className="bg-white rounded-xl relative overflow-hidden h-64 cursor-pointer" 
            onClick={() => navigate('/sell')}
          >
            <img 
              src="wwd_banner2.png" 
              alt="Banner 2" 
              className="w-full h-full object-cover"
            />
            {/* <button
              onClick={() => handleBannerClick(2)}
              className="absolute bottom-12 right-8 px-4 py-4 bg-white rounded-lg text-l font-bold text-gray-900 shadow-sm hover:bg-gray-50"
            >
              판매자 사용법 알아보기
            </button> */}
          </div>

          <div 
            className="bg-white rounded-xl relative overflow-hidden h-64 cursor-pointer"
            onClick={()=>navigate('/listings')}>
            <img 
              src="wwd_banner3.png" 
              alt="Banner 3" 
              className="w-full object-cover"
            />
            {/* <button
              onClick={() => handleBannerClick(3)}
              className="absolute bottom-12 right-4 px-4 py-4 bg-black rounded-lg text-l font-bold text-white shadow-sm hover:bg-gray-800"
            >
              구매자 사용법 알아보기
            </button> */}
          </div>
        </section>

        {/* 배너 Bottom Sheet */}
        {showBannerSheet && (
          <div className="fixed inset-0 bg-black/25 z-[60]">
            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[500px] bg-white rounded-t-xl max-h-[85vh] flex flex-col">
              <div className="sticky top-0 bg-white border-b z-10">
                <div className="flex justify-between items-center p-4">
                  <h2 className="text-lg font-medium">
                    {selectedBanner === 1 && "E89 Z4 판매 알림 신청"}
                    {selectedBanner === 2 && "판매자 사용법"}
                    {selectedBanner === 3 && "구매자 사용법"}
                  </h2>
                  <button
                    onClick={() => setShowBannerSheet(false)}
                    className="material-icons text-gray-500"
                  >
                    close
                  </button>
                </div>
              </div>
              <div className="overflow-y-auto flex-1">
                <BannerContent 
                  bannerId={selectedBanner} 
                  setShowBannerSheet={setShowBannerSheet}
                />
              </div>
            </div>
          </div>
        )}

        {/* FAQ 섹션 */}
        <section className="mb-12">
          <h2 className="text-lg font-bold mb-4">자주 묻는 질문</h2>
          <div className="space-y-4">
            {faqData.slice(0, 4).map((faq) => (
              <div 
                key={faq.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                <button
                  className="w-full text-left p-4 flex justify-between items-start"
                  onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                >
                  <span className="text-base font-medium">{faq.question}</span>
                  <span className={`material-icons transition-transform ${
                    expandedFaq === faq.id ? 'rotate-180' : ''
                  }`}>expand_more</span>
                </button>
                {expandedFaq === faq.id && (
                  <div className="px-4 pb-4">
                    <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                      <p className="whitespace-pre-line">{faq.answer}</p>
                    </div>
                    {faq.hasDetails && (
                      <div className="mt-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowFeeDetails(!showFeeDetails);
                          }}
                          className="text-green-500 font-medium"
                        >
                          [수수료 안내]
                        </button>
                        {showFeeDetails && (
                          <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                            {faq.details.map((detail, index) => (
                              <p key={index} className="mb-1">{detail}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </Container>

      <BottomCTA />

      {/* 로그인 모달 */}
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
};

export default Home;
