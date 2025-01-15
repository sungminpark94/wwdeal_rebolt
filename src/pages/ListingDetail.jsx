import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllOptions, setShowAllOptions] = useState(false);

  // 임시 데이터
  const listing = {
    id: 1,
    name: "All-New Live 수소전기차",
    price: 5000,
    year: "2024",
    mileage: "2,000km",
    status: "완전무사고",
    description: "차량 상세 설명...",
    saleStatus: "판매중",
    images: [
      "https://via.placeholder.com/400x300?text=1",
      "https://via.placeholder.com/400x300?text=2",
      "https://via.placeholder.com/400x300?text=3",
    ],
    specs: {
      연료: "수소",
      변속기: "자동",
      주행거리: "2,000km",
      색상: "화이트",
    },
    options: [
      "열선시트",
      "후방카메라",
      "네비게이션",
      "블루투스",
      "스마트키",
      "크루즈컨트롤",
      "통풍시트",
      "헤드업디스플레이"
    ],
    location: {
      address: "서울 강남구",
      distance: "2.5km"
    },
    battery: {
      status: "정상",
      images: ["battery-1.jpg", "battery-2.jpg"]
    },
    inspection: {
      date: "2024.01",
      status: "양호"
    },
    inspections: {
      exterior: {
        status: "양호",
        comment: "외관 상태 좋음",
        images: []
      },
      paint: {
        status: "양호",
        comment: "도장 상태 좋음",
        images: []
      },
      interior: {
        status: "양호",
        comment: "내장 상태 좋음",
        images: []
      },
      tire: {
        status: "양호",
        comment: "타이어 상태 좋음",
        images: []
      },
      seat: {
        status: "양호",
        comment: "시트 상태 좋음",
        images: []
      }
    },
    sellerComment: "판매자 코멘트입니다.\n자세한 내용은 문의 주세요.",
    seller: {
      name: "판매자명",
      phone: "010-1234-5678"
    }
  };

  // 옵션을 6개만 보여줄지, 전체를 보여줄지 결정하는 함수
  const displayedOptions = showAllOptions 
    ? listing.options 
    : listing.options.slice(0, 6);

  const handleBack = () => {
    navigate('/listings');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <Header 
        title="" 
        left={
          <button onClick={handleBack} className="p-2">
            <span className="material-icons text-black">arrow_back_ios</span>
          </button>
        }
        className="bg-white border-b"
      />
      
      {/* 이미지 슬라이더 */}
      <div className="relative aspect-square bg-gray-100">
        <img 
          src={listing.images[currentImageIndex]} 
          alt={listing.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
          {listing.images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full ${
                currentImageIndex === index ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* 기본 정보 */}
      <div className="p-4 bg-white">
        <h1 className="text-xl font-medium">{listing.name}</h1>
        <p className="text-2xl font-bold mt-1">{listing.price.toLocaleString()}만원</p>
        
        <div className="mt-4 space-y-1 text-sm text-gray-600">
          <p>{listing.year}</p>
          <p>{listing.mileage}</p>
          <p>{listing.specs.연료} | {listing.specs.변속기}</p>
        </div>
      </div>

      {/* 옵션 섹션 */}
      <div className="mt-2 p-4 bg-white">
        <h2 className="text-lg font-medium mb-3">차량 옵션</h2>
        <div className="grid grid-cols-2 gap-2">
          {displayedOptions.map((option, index) => (
            <div 
              key={index}
              className="px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-600"
            >
              {option}
            </div>
          ))}
        </div>
        
        {/* 더보기 버튼 (옵션이 6개 초과일 때만 표시) */}
        {listing.options.length > 6 && (
          <button
            onClick={() => setShowAllOptions(!showAllOptions)}
            className="w-full mt-3 py-2 text-sm text-gray-500 flex items-center justify-center gap-1"
          >
            {showAllOptions ? (
              <>
                <span>접기</span>
                <span className="material-icons text-sm">expand_less</span>
              </>
            ) : (
              <>
                <span>더보기</span>
                <span className="material-icons text-sm">expand_more</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* 차량 위치 섹션 추가 */}
      <div className="mt-2 p-4 bg-white">
        <h2 className="text-lg font-medium mb-3">차량 위치</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-900">{listing.location.address}</p>
            {listing.location.distance && (
              <p className="text-sm text-gray-500 mt-1">현재 위치에서 {listing.location.distance}</p>
            )}
          </div>
          <button className="p-2 text-gray-400">
            <span className="material-icons">map</span>
          </button>
        </div>
      </div>

      {/* 검사 항목들 */}
      {Object.entries(listing.inspections).map(([part, data]) => (
        <div key={part} className="mt-2 p-4 bg-white">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">
              {part === 'exterior' && '외관'}
              {part === 'paint' && '도장 상태'}
              {part === 'interior' && '내장'}
              {part === 'tire' && '타이어'}
              {part === 'seat' && '시트'}
            </h3>
            <div className={`px-2 py-1 rounded-full text-sm ${
              data.status === '양호'
                ? 'bg-green-50 text-green-600'
                : data.status === '수리필요'
                ? 'bg-yellow-50 text-yellow-600'
                : 'bg-red-50 text-red-600'
            }`}>
              {data.status}
            </div>
          </div>
          {data.comment && (
            <p className="mt-2 text-sm text-gray-600">{data.comment}</p>
          )}
        </div>
      ))}

      {/* 판매자 코멘트 */}
      <div className="mt-2 p-4 bg-white">
        <h2 className="text-lg font-medium mb-3">판매자 코멘트</h2>
        <p className="text-sm text-gray-600 whitespace-pre-line">
          {listing.sellerComment}
        </p>
      </div>

      {/* 관리자 기능 */}
      {user?.role === 'admin' && (
        <div className="fixed bottom-[140px] left-1/2 -translate-x-1/2 w-full max-w-[500px] px-4">
          <div className="bg-white p-4 rounded-xl space-y-2 border">
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/listing/edit/${id}`)}
                className="flex-1 py-2 bg-gray-100 rounded-lg text-gray-600"
              >
                수정하기
              </button>
              <button
                onClick={() => {/* 삭제 처리 */}}
                className="flex-1 py-2 bg-red-50 rounded-lg text-red-600"
              >
                삭제하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 문의하기 버튼들 */}
      <div className="fixed bottom-[72px] left-1/2 -translate-x-1/2 w-full max-w-[500px] px-4 py-2 bg-white border-t">
        <div className="flex gap-2">
          <a 
            href={`tel:${listing.seller.phone}`}
            className="flex-1 bg-gray-100 text-gray-900 py-4 rounded-xl font-medium text-center"
          >
            전화로 문의하기
          </a>
          <button 
            onClick={() => window.open('https://pf.kakao.com/_xgxkExbxj')}
            className="flex-1 bg-[#FAE100] text-black py-4 rounded-xl font-medium"
          >
            카카오톡 문의하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail; 