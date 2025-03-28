import React, { useState, useEffect, useRef, useCallback } from "react";
import { collection, getDocs, query, orderBy, limit, startAfter, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import Header from "../components/Header";
import BottomCTA from "../components/BottomCTA";
import { useFavorites } from "../contexts/FavoritesContext";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useInterest } from "../contexts/InterestContext";
import LoginModal from '../components/LoginModal';

// 기본 이미지 URL 정의
const defaultCarImage = 'https://via.placeholder.com/400x300?text=No+Image';  // 또는 실제 기본 이미지 URL

const Listings = () => {
  const navigate = useNavigate();
  const { user, openLoginModal } = useAuth();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { addInterest } = useInterest();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);
  const observer = useRef();
  const ITEMS_PER_PAGE = 10;

  const handleDeleteListing = async (e, listingId) => {
    e.stopPropagation();  // 이벤트 버블링 방지
    
    if (!window.confirm('정말로 이 매물을 삭제하시겠습니까?')) {
      return;
    }

    try {
      // Firestore에서 매물 문서 삭제
      await deleteDoc(doc(db, 'listings', listingId));
      
      // 로컬 상태 업데이트
      setListings(prevListings => 
        prevListings.filter(listing => listing.id !== listingId)
      );
      
      alert('매물이 삭제되었습니다.');
    } catch (error) {
      console.error('매물 삭제 중 오류:', error);
      alert('매물 삭제 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        console.log('No user');
        return;
      }
      
      const isAdminUser = user.phoneNumber === '+821024079314';
      console.log('Is admin?', isAdminUser);
      setIsAdmin(isAdminUser);
    };

    checkAdmin();
  }, [user]);

  const lastElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        fetchMoreListings();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const q = query(
          collection(db, "listings"), 
          orderBy("createdAt", "desc"),
          limit(ITEMS_PER_PAGE)
        );
        const querySnapshot = await getDocs(q);
        const listingsData = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          listingsData.push({
            id: doc.id,
            title: data.title || data.name || "제목 없음",
            price: data.price || data.priceValue || 0,
            year: data.year || new Date().getFullYear(),
            mileage: data.mileage || "0",
            images: data.images?.[0] || data.image || [],
            status: data.status || "정보없음",
            updatedAt: data.updatedAt?.toDate?.() || new Date(),
          });
        });

        setListings(listingsData);
        setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setHasMore(querySnapshot.docs.length === ITEMS_PER_PAGE);
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const fetchMoreListings = async () => {
    if (!lastDoc || loading) return;
    
    setLoading(true);
    try {
      const q = query(
        collection(db, "listings"),
        orderBy("createdAt", "desc"),
        startAfter(lastDoc),
        limit(ITEMS_PER_PAGE)
      );
      const querySnapshot = await getDocs(q);
      const newListings = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        newListings.push({
          id: doc.id,
          title: data.title || data.name || "제목 없음",
          price: typeof data.price === 'number' ? data.price : 0,
          year: data.year || new Date().getFullYear(),
          mileage: data.mileage || "0km",
          images: data.images || [],
          status: data.status || "정보없음",
          updatedAt: data.updatedAt?.toDate?.() || new Date(),
        });
      });
      
      setListings(prev => [...prev, ...newListings]);
      setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setHasMore(querySnapshot.docs.length === ITEMS_PER_PAGE);
    } catch (error) {
      console.error("Error fetching more listings:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredListings = listings.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFavorite = (item) => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }
    toggleFavorite(item);
  };

  const handleSave = () => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }
    if (searchTerm) {
      addInterest(searchTerm);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header title="매물 목록" />
      <div className="max-w-[480px] mx-auto w-full px-4">
        <div className="sticky top-0 z-10 py-4">
          <div className="relative">
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
        </div>

        <div className="py-4 mb-36">
          {loading && listings.length === 0 ? (
            <div className="text-center py-10">로딩 중...</div>
          ) : filteredListings.length > 0 ? (
            <div className="grid gap-4">
              {filteredListings.map((item, index) => (
                <div
                  key={item.id}
                  ref={index === filteredListings.length - 1 ? lastElementRef : null}
                  onClick={() => navigate(`/listings/${item.id}`)}
                  className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer"
                >
                  <div className="relative">
                    <img
                      src={item.images }
                      alt={item.title}
                      className="w-full aspect-[4/3] object-cover"
                      onError={(e) => {
                        e.target.src = null;
                        e.target.onerror = null;
                      }}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
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
                    <h3 className="font-medium text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {item.year}년 · {item.mileage}km
                    </p>
                    <p className="text-lg font-semibold text-green-500 mt-2">
                      {item.price > 0 
                        ? `${item.price.toLocaleString()}만원`
                        : '가격 문의'}
                    </p>
                    {item.sellerName && (
                      <p className="text-sm text-gray-500 mt-1">판매자: {item.sellerName}</p>
                    )}
                    {item.optionsList && (
                      <p className="text-sm text-gray-500 mt-1">옵션: {item.optionsList}</p>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="text-center py-4">
                  더 불러오는 중...
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-10">
              검색 결과가 없습니다.
            </div>
          )}
        </div>
      </div>
      
      {showSuccessToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg text-sm">
            성공적으로 저장되었어요!
          </div>
        </div>
      )}
      
      <BottomCTA />
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </div>
  );
};

export default Listings;