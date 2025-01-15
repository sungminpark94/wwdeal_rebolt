import React, { useState } from "react";
import Header from "../components/Header";
import BottomCTA from "../components/BottomCTA";
import { useFavorites } from "../contexts/FavoritesContext";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useInterest } from "../contexts/InterestContext";

const Listings = () => {
  const { user, openLoginModal } = useAuth();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const { addInterest } = useInterest();
  const [listings, setListings] = useState([
    { 
      id: 1, 
      name: "e-208 GT Line",
      price: 2000, 
      year: 2021,
      mileage: "4.1만km",
      image: "https://via.placeholder.com/400x300?text=e-208",
      range: "244km",
      status: "완전무사고",
      batteryStatus: "배터리 정상"
    },
    { 
        id: 2, 
        name: "e-208 GT Line",
        price: 2000, 
        year: 2021,
        mileage: "4.1만km",
        image: "https://via.placeholder.com/400x300?text=e-208",
        range: "244km",
        status: "완전무사고",
        batteryStatus: "배터리 정상"
      },
      { 
        id: 3, 
        name: "e-208 GT Line",
        price: 2000, 
        year: 2021,
        mileage: "4.1만km",
        image: "https://via.placeholder.com/400x300?text=e-208",
        range: "244km",
        status: "완전무사고",
        batteryStatus: "배터리 정상"
      },
      { 
        id: 4, 
        name: "e-208 GT Line",
        price: 2000, 
        year: 2021,
        mileage: "4.1만km",
        image: "https://via.placeholder.com/400x300?text=e-208",
        range: "244km",
        status: "완전무사고",
        batteryStatus: "배터리 정상"
      },
      { 
        id: 5, 
        name: "e-208 GT Line",
        price: 2000, 
        year: 2021,
        mileage: "4.1만km",
        image: "https://via.placeholder.com/400x300?text=e-208",
        range: "244km",
        status: "완전무사고",
        batteryStatus: "배터리 정상"
      },
      { 
        id: 6, 
        name: "e-208 GT Line",
        price: 2000, 
        year: 2021,
        mileage: "4.1만km",
        image: "https://via.placeholder.com/400x300?text=e-208",
        range: "244km",
        status: "완전무사고",
        batteryStatus: "배터리 정상"
      },
    // ... 다른 매물들
  ]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [activeFilters, setActiveFilters] = useState(0);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortCriteria, setSortCriteria] = useState('latest');

  // 필터 관련 state 추가
  const [filters, setFilters] = useState({
    priceRange: { min: 0, max: 5000 },
    yearRange: { min: 2020, max: 2024 }
  });
  
  // 필터링된 매물 목록을 반환하는 함수
  const getFilteredListings = () => {
    return listings.filter(item => 
      item.price >= filters.priceRange.min &&
      item.price <= filters.priceRange.max &&
      item.year >= filters.yearRange.min &&
      item.year <= filters.yearRange.max
    );
  };

  // 필터 적용 함수
  const applyFilters = (newFilters) => {
    setFilters(newFilters);
    setIsFilterOpen(false);
  };

  // 정렬 함수
  const sortListings = (criteria) => {
    setSortCriteria(criteria);
    setListings((prevListings) => {
      const sorted = [...prevListings];
      if (criteria === "priceAsc") {
        sorted.sort((a, b) => a.price - b.price); // 낮은 가격순
      } else if (criteria === "priceDesc") {
        sorted.sort((a, b) => b.price - a.price); // 높은 가격순
      } else if (criteria === "year") {
        sorted.sort((a, b) => b.year - a.year); // 최신 연식순
      }
      return sorted;
    });
    setIsSortOpen(false); // 정렬 창 닫기
  };

  const handleFavorite = (item) => {
    if (!user) {
      openLoginModal();
      return;
    }
    toggleFavorite(item);
  };

  // 정렬 라벨 가져오기
  const getSortLabel = () => {
    switch (sortCriteria) {
      case 'priceAsc':
        return '낮은 가격순';
      case 'priceDesc':
        return '높은 가격순';
      case 'year':
        return '최신 연식순';
      default:
        return '최신순';
    }
  };

  const navigate = useNavigate();

  // handleSave 함수 추가
  const handleSave = () => {
    if (!user) {
      openLoginModal();
      return;
    }

    // InterestContext를 통해 관심 차종 추가
    addInterest(searchTerm);
    setSearchTerm('');
    setShowSuccessToast(true);
    
    // 3초 후 토스트 메시지 숨기기
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header title="매물 목록" />
      
      {/* 전체 콘텐츠를 감싸는 컨테이너 추가 */}
      <div className="max-w-[480px] mx-auto w-full px-4">
        {/* 검색 섹션 */}
        <div className="sticky top-0 bg-white border-b z-10">
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

          {/* 필터 섹션 - 전체 폭 */}
          <div className="w-full bg-white border-b">
            <div className="py-3 flex items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">총 {filteredListings.length}대</span>
                {activeFilters > 0 && (
                  <span className="px-2 py-1 bg-green-50 text-green-500 text-sm rounded-lg">
                    필터 {activeFilters}
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsSortOpen(true)}
                className="flex items-center gap-1 text-sm text-gray-600"
              >
                <span>{getSortLabel()}</span>
                <span className="material-icons text-base">expand_more</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 나머지 콘텐츠를 감싸는 컨테이너 */}
      <div className="max-w-[480px] mx-auto w-full px-4">
        {/* 매물 목록 */}
        <div className="flex-1 py-3 pb-36">
          <div className="grid gap-3">
            {getFilteredListings().map((item) => (
              <div 
                key={item.id} 
                onClick={() => navigate(`/listing/${item.id}`)}
                className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer"
              >
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full aspect-[4/3] object-cover"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();  // 이벤트 전파 중단
                      handleFavorite(item);
                    }}
                    className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm"
                  >
                    <span className={`material-icons ${
                      isFavorite(item.id) ? "text-red-500" : "text-gray-600"
                    }`}>
                      {isFavorite(item.id) ? "favorite" : "favorite_border"}
                    </span>
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {item.year}년식 · {item.mileage}
                  </p>
                  <p className="text-lg font-semibold text-green-500 mt-2">
                    {item.price.toLocaleString()}만원
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 정렬 Bottom Sheet */}
      {isSortOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm">
          <div className="fixed inset-x-0 bottom-0 z-50">
            <div className="mx-auto w-full max-w-[480px]">
              <div className="bg-white rounded-t-2xl">
                <div className="flex justify-between items-center p-4 border-b">
                  <h2 className="text-lg font-medium">정렬</h2>
                  <button
                    onClick={() => setIsSortOpen(false)}
                    className="material-icons text-gray-500 hover:text-gray-700"
                  >
                    close
                  </button>
                </div>
                <div className="p-2">
                  {[
                    { key: "priceAsc", label: "낮은 가격순" },
                    { key: "priceDesc", label: "높은 가격순" },
                    { key: "year", label: "최신 연식순" },
                  ].map((option) => (
                    <button
                      key={option.key}
                      onClick={() => sortListings(option.key)}
                      className={`w-full px-4 py-3 text-left rounded-lg ${
                        sortCriteria === option.key
                          ? "bg-green-50 text-green-600"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Bottom Sheet 수정 */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end justify-center">
          <div className="w-full max-w-md bg-white rounded-t-2xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-medium">필터</h2>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="material-icons text-gray-500 hover:text-gray-700"
              >
                close
              </button>
            </div>
            
            <div className="overflow-y-auto flex-1 p-4">
              {/* 가격 범위 필터 */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">가격 범위</h3>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={filters.priceRange.min}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      priceRange: { ...prev.priceRange, min: parseInt(e.target.value) || 0 }
                    }))}
                    className="flex-1 px-3 py-2 border rounded-lg"
                    placeholder="최소 가격"
                  />
                  <span className="text-gray-500">~</span>
                  <input
                    type="number"
                    value={filters.priceRange.max}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      priceRange: { ...prev.priceRange, max: parseInt(e.target.value) || 0 }
                    }))}
                    className="flex-1 px-3 py-2 border rounded-lg"
                    placeholder="최대 가격"
                  />
                </div>
              </div>

              {/* 연식 범위 필터 */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">연식</h3>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={filters.yearRange.min}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      yearRange: { ...prev.yearRange, min: parseInt(e.target.value) || 0 }
                    }))}
                    className="flex-1 px-3 py-2 border rounded-lg"
                    placeholder="최소 연식"
                  />
                  <span className="text-gray-500">~</span>
                  <input
                    type="number"
                    value={filters.yearRange.max}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      yearRange: { ...prev.yearRange, max: parseInt(e.target.value) || 0 }
                    }))}
                    className="flex-1 px-3 py-2 border rounded-lg"
                    placeholder="최대 연식"
                  />
                </div>
              </div>
            </div>

            {/* 필터 적용 버튼 - 항상 하단에 고정 */}
            <div className="p-4 border-t bg-white">
              <button
                onClick={() => applyFilters(filters)}
                className="w-full py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
              >
                필터 적용하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom CTA */}
      <BottomCTA />
    </div>
  );
};

export default Listings;
