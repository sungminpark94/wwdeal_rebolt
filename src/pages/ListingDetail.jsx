import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, deleteDoc, updateDoc, arrayUnion, Timestamp, setDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import ImageViewer from '../components/ImageViewer';

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllOptions, setShowAllOptions] = useState(false);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedImages, setSelectedImages] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Firebase에서 데이터 가져오기
  useEffect(() => {
    const fetchListing = async () => {
      try {
        console.log('Fetching listing with ID:', id); // 디버깅용
        const docRef = doc(db, 'listings', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log('Fetched data:', data); // 디버깅용
          
          // 데이터 구조 확인 및 기본값 설정
          setListing({
            id: docSnap.id,
            name: data.name || '',
            price: data.price || 0,
            year: data.year || '',
            mileage: data.mileage || '',
            status: data.status || '',
            images: data.images || [],
            description: data.description || '',
            specs: {
              연료: data.fuel || '',
              변속기: data.transmission || '',
              주행거리: data.mileage || '',
              색상: data.color || ''
            },
            options: data.options || [],
            location: data.location || { address: '', distance: '' },
            battery: data.battery || { status: '', images: [] },
            inspection: data.inspection || { date: '', status: '' },
            inspections: data.inspections || {
              exterior: { status: '', comment: '', images: [] },
              paint: { status: '', comment: '', images: [] },
              interior: { status: '', comment: '', images: [] },
              tire: { status: '', comment: '', images: [] },
              seat: { status: '', comment: '', images: [] },
              undercarriage: { status: '', comment: '', images: [] },
              leakage: { status: '', comment: '', images: [] },
              consumables: { status: '', comment: '', images: [] }
            },
            sellerComment: data.sellerComment || '',
            seller: data.seller || { name: '', phone: '' }
          });
        } else {
          console.log("No such document!");
          navigate('/listings');
        }
      } catch (error) {
        console.error("Error fetching listing:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchListing();
    }
  }, [id, navigate]);

  // 차량 삭제
  const handleDelete = async () => {
    try {
      // 이미지 삭제
      for (const imageUrl of listing.images) {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
      }

      // Firestore 문서 삭제
      await deleteDoc(doc(db, 'listings', id));
      
      navigate('/listings');
    } catch (error) {
      console.error("Error deleting listing:", error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const handleBack = () => {
    navigate('/listings');
  };

  // 이미지 관련 오류 처리
  const defaultCarImage = '/images/default-car.png'; // 또는 실제 로컬 이미지 경로

  // 이미지 URL 유효성 검사 함수
  const getValidImageUrl = (imageUrl) => {
    if (!imageUrl) return defaultCarImage;
    if (imageUrl.startsWith('http')) return imageUrl;
    if (imageUrl.startsWith('/')) return imageUrl;
    return defaultCarImage;
  };

  const saveToRecentViews = async (carData) => {
    if (!user?.uid || !carData) {
      console.log('No user or car data');
      return;
    }

    try {
      const userDocRef = doc(db, 'users', user.uid);
      
      // 저장할 데이터 구조를 listing 데이터 그대로 사용
      const recentViewData = {
        id: id,
        viewedAt: Timestamp.now(),
        ...listing  // 전체 listing 데이터를 그대로 포함
      };

      // 기존 데이터 가져오기
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        // 사용자 문서가 없으면 새로 생성
        await setDoc(userDocRef, {
          recentViews: [recentViewData]
        });
        console.log('Created new user document with recent view');
        return;
      }

      const userData = userDoc.data();
      let currentViews = userData.recentViews || [];

      // 중복 제거 및 최신 데이터 추가
      currentViews = currentViews.filter(item => item.id !== id);
      currentViews.unshift(recentViewData);

      // 최대 10개로 제한
      currentViews = currentViews.slice(0, 10);

      // Firebase 업데이트
      await updateDoc(userDocRef, {
        recentViews: currentViews
      });

      console.log('Successfully saved recent view:', recentViewData);
      console.log('Updated recent views:', currentViews);

    } catch (error) {
      console.error('Error saving recent view:', error);
    }
  };

  // useEffect에서 호출
  useEffect(() => {
    console.log('Listing changed:', listing); // 디버깅용
    if (listing && user) {
      saveToRecentViews(listing);
    }
  }, [listing, user]);

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      Loading...
    </div>;
  }

  // listing이 없거나 필수 데이터가 없는 경우 처리
  if (!listing || !listing.images || !listing.specs || !listing.options) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      데이터를 불러올 수 없습니다.
    </div>;
  }

  // 옵션을 6개만 보여줄지, 전체를 보여줄지 결정하는 함수
  const displayedOptions = showAllOptions 
    ? listing.options 
    : listing.options.slice(0, 6);

  // 순서 수정
  const INSPECTION_ITEMS = [
    { id: 'exterior', label: '외관' },
    { id: 'interior', label: '내부·기능' },
    { id: 'undercarriage', label: '하부' },
    { id: 'seat', label: '시트' },
    { id: 'tire', label: '타이어' },
    { id: 'leakage', label: '누유·누수' },
    { id: 'paint', label: '도장 상태' },
    { id: 'consumables', label: '소모품 상태' }
  ];

  const renderInspectionSections = () => {
    return INSPECTION_ITEMS.map(({ id, label }) => {
      const inspection = listing?.inspections?.[id];
      
      return (
        <div key={id} className="bg-white p-4 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">{label}</h2>
            <span className={`px-2 py-1 rounded-full text-sm ${
              inspection?.status === '양호' ? 'bg-green-100 text-green-800' : 
              inspection?.status === '확인필요' ? 'bg-red-100 text-red-800' : 
              'bg-gray-100 text-gray-800'
            }`}>
              {inspection?.status || '상태 미입력'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {inspection?.images?.map((url, index) => (
              <div 
                key={index} 
                className="aspect-square rounded-lg overflow-hidden"
                onClick={() => {
                  setSelectedImages(inspection.images);
                  setSelectedImageIndex(index);
                }}
              >
                <img
                  src={url}
                  alt={`${label} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          <p className="text-gray-600 text-sm">
            {inspection?.comment || '설명이 없습니다.'}
          </p>
        </div>
      );
    });
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
      {listing?.images && listing.images.length > 0 && (
        <div className="relative w-full aspect-square bg-gray-100">
          <div className="w-full h-full flex overflow-hidden">
            <div 
              className="flex transition-transform duration-300 ease-out"
              style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
            >
              {listing.images.map((url, index) => (
                <div 
                  key={index} 
                  className="w-full h-full flex-shrink-0"
                >
                  <img 
                    src={url}
                    alt={listing.name || '차량 이미지'}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 좌우 버튼 */}
          {listing.images.length > 1 && (
            <>
              <button
                onClick={() => setCurrentImageIndex(prev => Math.max(0, prev - 1))}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                style={{ display: currentImageIndex === 0 ? 'none' : 'block' }}
              >
                <span className="material-icons">chevron_left</span>
              </button>
              <button
                onClick={() => setCurrentImageIndex(prev => Math.min(listing.images.length - 1, prev + 1))}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                style={{ display: currentImageIndex === listing.images.length - 1 ? 'none' : 'block' }}
              >
                <span className="material-icons">chevron_right</span>
              </button>
            </>
          )}

          {/* 인디케이터 */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {listing.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentImageIndex 
                    ? 'bg-white' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>
      )}

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

      {/* 차량 위치 섹션 */}
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

      {/* 판매자 코멘트 */}
      <div className="mt-2 p-4 bg-white">
        <h2 className="text-lg font-medium mb-3">전문가 총평</h2>
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 whitespace-pre-line">
            {listing.sellerComment}
          </p>
        </div>
      </div>

      {/* 검사 항목들 */}
      {renderInspectionSections()}

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
                onClick={() => setShowDeleteModal(true)}
                className="flex-1 py-2 bg-red-50 rounded-lg text-red-600"
              >
                삭제하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 삭제 확인 모달 */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative bg-white w-full max-w-sm rounded-2xl p-6">
            <h3 className="text-lg font-medium mb-2">
              정말 삭제하시겠습니까?
            </h3>
            <p className="text-gray-600 mb-6">
              삭제된 데이터는 복구할 수 없습니다.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 bg-gray-100 rounded-xl text-gray-600"
              >
                취소
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 bg-red-600 rounded-xl text-white"
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

      {selectedImages && (
        <ImageViewer
          images={selectedImages}
          initialIndex={selectedImageIndex}
          onClose={() => setSelectedImages(null)}
        />
      )}
    </div>
  );
};

export default ListingDetail; 