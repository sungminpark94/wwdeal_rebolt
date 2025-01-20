import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, deleteDoc, updateDoc, arrayUnion, Timestamp } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase/config';

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllOptions, setShowAllOptions] = useState(false);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
              seat: { status: '', comment: '', images: [] }
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
      {listing.images.length > 0 && (
        <div className="relative aspect-square bg-gray-100">
          <img 
            src={getValidImageUrl(listing.images?.[0])}
            alt={listing.name || '차량 이미지'}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = defaultCarImage;
              e.target.onerror = null; // 무한 루프 방지
            }}
          />
          {listing.images.length > 1 && (
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
          )}
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
          {data.images && data.images.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {data.images.map((imageUrl, index) => (
                <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img 
                    src={imageUrl} 
                    alt={`${part} 이미지 ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

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
    </div>
  );
};

export default ListingDetail; 