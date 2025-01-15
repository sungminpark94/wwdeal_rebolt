import React, { useState } from "react";
import Header from "../components/Header";
import BottomCTA from "../components/BottomCTA";
import Container from "../components/Container";
import { useAuth } from '../contexts/AuthContext';
import { faqData } from "../data/faqData";
import { useNavigate } from 'react-router-dom';
import { useInterest } from '../contexts/InterestContext';

const BannerContent = ({ bannerId, setShowBannerSheet }) => {
  const { user, openLoginModal } = useAuth();
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  const handleSubscribe = () => {
    if (!user) {
      openLoginModal();
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
              <img src="car_image1.jpg" className="w-48 h-48 rounded-lg object-cover flex-shrink-0" />
              <img src="car_image2.jpg" className="w-48 h-48 rounded-lg object-cover flex-shrink-0" />
              <img src="car_image2.jpg" className="w-48 h-48 rounded-lg object-cover flex-shrink-0" />
              <img src="car_image2.jpg" className="w-48 h-48 rounded-lg object-cover flex-shrink-0" />
              <img src="car_image2.jpg" className="w-48 h-48 rounded-lg object-cover flex-shrink-0" />      
              <img src="car_image2.jpg" className="w-48 h-48 rounded-lg object-cover flex-shrink-0" />
              <img src="car_image2.jpg" className="w-48 h-48 rounded-lg object-cover flex-shrink-0" />
              <img src="car_image2.jpg" className="w-48 h-48 rounded-lg object-cover flex-shrink-0" />
              <img src="car_image2.jpg" className="w-48 h-48 rounded-lg object-cover flex-shrink-0" />
              <img src="car_image2.jpg" className="w-48 h-48 rounded-lg object-cover flex-shrink-0" />
              <img src="car_image2.jpg" className="w-48 h-48 rounded-lg object-cover flex-shrink-0" />``
            </div>

            {/* 기본 정보 */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">E89 Z4</h2>
              <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                <span>2009년형</span>
                <span>•</span>
                <span>205,000km</span>
                <span>•</span>
                <span className="text-green-600 font-medium">가격 미정</span>
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
              </div>
              <button className="w-full mt-3 text-center text-sm text-gray-500">
                더보기
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
          <div className="space-y-4">
            <h3 className="font-bold">WW:D 서비스 소개</h3>
            
            <div className="bg-white border rounded-xl p-5">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="material-icons text-blue-600">directions_car</span>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-3">전문가의 차량 상태 점검</h4>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li className="flex items-center gap-2">
                      <span className="material-icons text-green-500 text-sm">check_circle</span>
                      정확한 차량 상태 확인
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-icons text-green-500 text-sm">check_circle</span>
                      투명한 정보 공개
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-xl p-5">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="material-icons text-green-600">verified</span>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-3">안전한 거래 보장</h4>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li className="flex items-center gap-2">
                      <span className="material-icons text-green-500 text-sm">check_circle</span>
                      실거래 데이터 기반 시세 확인
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-icons text-green-500 text-sm">check_circle</span>
                      안전 거래 시스템
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
              onClick={handleSubscribe}
              className="w-full bg-black text-white py-4 rounded-xl font-medium hover:bg-gray-800 transition-colors duration-200"
            >
              판매 시 알림받기
            </button>
          </div>
        </div>
      );

    case 2:
      return (
        <div className="px-4 py-6 space-y-8 pb-24">
          <div className="bg-gray-900 text-white p-6 rounded-xl">
            <h2 className="text-xl font-bold mb-3">
              "직거래로 더 받고 싶은데,<br/>
              너무 어려울 것 같아요."
            </h2>
            <p className="text-gray-300">
              이제는 전문가가 도와드립니다.<br/>
              여러분의 시간과 노력은 아끼고, 더 높은 가격에 판매하세요
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl space-y-4">
            <h3 className="font-bold text-lg">직거래 이런게 걱정된다고요?</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="material-icons text-green-600 text-sm">check</span>
                </div>
                <span>"차량 상태 어떤가요?" 끝없는 문의 전화</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="material-icons text-green-600 text-sm">check</span>
                </div>
                <span>"이 부분은 수리했나요?" 답하기 어려운 질문</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="material-icons text-green-600 text-sm">check</span>
                </div>
                <span>"내고 가능하시나요?" 흥정의 스트레스</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-lg">이젠, 걱정마세요</h3>
            
            <div className="bg-white border rounded-xl p-5">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="material-icons text-blue-600">directions_car</span>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-3">전문가가 차량 상태를 대신 설명</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <span className="material-icons text-green-500 text-sm">check_circle</span>
                      정확한 차량 상태 점검
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-icons text-green-500 text-sm">check_circle</span>
                      모든 문의 응대 대행
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-icons text-green-500 text-sm">check_circle</span>
                      투명한 정보 공개로 신뢰도 확보
                    </li>
                  </ul>
                </div>
              </div>
              {/* 하단 고정 버튼 */}
            <div className="fixed bottom-0 left-0 right-0 px-4 py-4 bg-white border-t">
            <button 
              onClick={() => {
                setShowBannerSheet(false);
                navigate('/sell');
              }}
              className="w-full bg-black text-white py-4 rounded-xl font-medium hover:bg-gray-800 transition-colors duration-200"
            >
              직거래 최적가 확인하기
            </button>
          </div>
            </div>

            <div className="bg-white border rounded-xl p-5">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="material-icons text-green-600">payments</span>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-3">실거래 데이터 기반 최적가 제안</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <span className="material-icons text-green-500 text-sm">check_circle</span>
                      비슷한 차량의 실제 거래가 분석
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-icons text-green-500 text-sm">check_circle</span>
                      최단기간 판매를 위한 가격 전략
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-icons text-green-500 text-sm">check_circle</span>
                      협상 과정은 전문가가 대행
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-xl p-5">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="material-icons text-purple-600">verified_user</span>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-3">판매 완료까지 원스톱 케어</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <span className="material-icons text-green-500 text-sm">check_circle</span>
                      방문 일정 조율
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-icons text-green-500 text-sm">check_circle</span>
                      서류 처리 안내
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-icons text-green-500 text-sm">check_circle</span>
                      대금 거래 안전 보장
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case 3:
      return (
        <div className="px-4 py-6 space-y-8 pb-24">
          {/* 메인 타이틀 섹션 */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">
              "그런데<br/>
              직거래를 믿을 수 있나요?"
            </h2>
            <p className="text-gray-600">
              전문가가 확인하고 상담까지!<br/>
              투명한 정보, 합리적인 가격으로 믿고 거래해요
            </p>
          </div>

          {/* 전문가의 객관적 차량 평가 */}
          <div className="bg-white rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="material-icons text-blue-600">shield</span>
              </div>
              <h3 className="font-bold text-lg">전문가의 객관적 차량 평가</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <span className="material-icons text-green-500 text-sm">check_circle</span>
                <span>150가지 체크리스트 진단</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-icons text-green-500 text-sm">check_circle</span>
                <span>실제 주행 테스트 결과</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-icons text-green-500 text-sm">check_circle</span>
                <span>하부, 누유 등 상세한 사진</span>
              </li>
            </ul>
          </div>

          {/* 숨김없는 차량 정보 */}
          <div className="bg-white rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="material-icons text-blue-600">description</span>
              </div>
              <h3 className="font-bold text-lg">숨김없는 차량 정보</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <span className="material-icons text-green-500 text-sm">check_circle</span>
                <span>사고이력 상세 리포트</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-icons text-green-500 text-sm">check_circle</span>
                <span>주요 수리 내역 공개</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-icons text-green-500 text-sm">check_circle</span>
                <span>핵심 부품 상태 평가</span>
              </li>
            </ul>
          </div>

          {/* 믿을 수 있는 가격 */}
          <div className="bg-white rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="material-icons text-blue-600">payments</span>
              </div>
              <h3 className="font-bold text-lg">믿을 수 있는 가격</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <span className="material-icons text-green-500 text-sm">check_circle</span>
                <span>실거래가 기반 정찰제</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-icons text-green-500 text-sm">check_circle</span>
                <span>허위매물 ZERO</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-icons text-green-500 text-sm">check_circle</span>
                <span>가격 산정 근거 공개</span>
              </li>
            </ul>
          </div>

          {/* 추가 혜택 */}
          <div className="bg-white rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="material-icons text-blue-600">card_giftcard</span>
              </div>
              <h3 className="font-bold text-lg">추가 혜택</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <span className="material-icons text-green-500 text-sm">check_circle</span>
                <span>전문가의 상세한 차량 상태 설명</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-icons text-green-500 text-sm">check_circle</span>
                <span>계약 전 2차 점검 가능</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-icons text-green-500 text-sm">check_circle</span>
                <span>매매 관련 모든 서류 안내</span>
              </li>
            </ul>
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

  const handleBannerClick = (bannerNumber) => {
    setSelectedBanner(bannerNumber);
    setShowBannerSheet(true);
  };

  const handleSave = () => {
    if (!user) {
      openLoginModal();
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

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-36">
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
          <div className="flex gap-4 overflow-x-auto pb-2">
            <div className="flex-shrink-0 w-40">
              <div className="bg-white rounded-lg p-3">
                <img className="w-full h-24 object-cover rounded mb-2" />
                <p className="font-medium text-sm">K-258</p>
                <p className="text-sm text-gray-500">GT Line</p>
                <p className="text-sm text-green-500 mt-1">2,000만원</p>
              </div>
            </div>
            <div className="flex-shrink-0 w-40">
              <div className="bg-white rounded-lg p-3">
                <img className="w-full h-24 object-cover rounded mb-2" />
                <p className="font-medium text-sm">Cybertruck</p>
                <p className="text-sm text-gray-500">All Wheel Drive 듀...</p>
                <p className="text-sm text-green-500 mt-1">7777만원</p>
              </div>
            </div>
          </div>
        </section>

        {/* 배너 섹션들 */}
        <section className="space-y-4 mb-8">
          <div className="bg-white rounded-xl relative overflow-hidden">
            <img 
              src="wwd_banner1.png" 
              alt="Banner 1" 
              className="w-full object-cover"
            />
            <button
              onClick={() => handleBannerClick(1)}
              className="absolute bottom-4 right-4 px-4 py-2 bg-white rounded-lg text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-50"
            >
              알림 신청
            </button>
          </div>

          <div className="bg-white rounded-xl relative overflow-hidden">
            <img 
              src="wwd_banner2.png" 
              alt="Banner 2" 
              className="w-full object-cover"
            />
            <button
              onClick={() => handleBannerClick(2)}
              className="absolute bottom-12 right-4 px-4 py-2 bg-white rounded-lg text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-50"
            >
              판매자 사용법 알아보기
            </button>
          </div>

          <div className="bg-white rounded-xl relative overflow-hidden">
            <img 
              src="wwd_banner3.png" 
              alt="Banner 3" 
              className="w-full object-cover"
            />
            <button
              onClick={() => handleBannerClick(3)}
              className="absolute bottom-8 right-4 px-4 py-2 bg-black rounded-lg text-sm font-medium text-white shadow-sm hover:bg-gray-800"
            >
              구매자 사용법 알아보기
            </button>
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
                <BannerContent bannerId={selectedBanner} setShowBannerSheet={setShowBannerSheet} />
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
    </div>
  );
};

export default Home;
