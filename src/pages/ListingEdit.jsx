import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const ListingEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // 폼 상태 관리
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    year: '',
    mileage: '',
    status: '완전무사고',
    description: '',
    images: [],
    saleStatus: '판매중'
  });

  // 이미지 미리보기 상태
  const [imagePreview, setImagePreview] = useState([]);

  // 기존 데이터 불러오기
  useEffect(() => {
    // TODO: Firebase에서 데이터 불러오기
    // 임시 데이터
    const listing = {
      id: 1,
      name: "e-208 GT Line",
      price: 2000,
      year: 2021,
      mileage: "4.1만km",
      status: "완전무사고",
      description: "차량 상세 설명...",
      saleStatus: "판매중",
      images: [
        "https://via.placeholder.com/400x300?text=e-208-1",
        "https://via.placeholder.com/400x300?text=e-208-2",
      ]
    };

    setFormData(listing);
    setImagePreview(listing.images);
  }, [id]);

  // 입력 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 이미지 업로드 핸들러
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // 이미지 미리보기 생성
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreview(prev => [...prev, ...previews]);
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  // 이미지 삭제 핸들러
  const handleImageDelete = (index) => {
    setImagePreview(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // TODO: Firebase 데이터 업데이트
      console.log('Updated data:', formData);
      navigate(`/listing/${id}`);
    } catch (error) {
      console.error('Error updating listing:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <Header title="매물 수정" />
      
      <div className="max-w-[500px] mx-auto p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 기본 정보 */}
          <div className="bg-white p-4 rounded-xl space-y-4">
            <h2 className="text-lg font-medium">기본 정보</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                차량명 *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                가격 (만원) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                연식 *
              </label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                주행거리 *
              </label>
              <input
                type="text"
                name="mileage"
                value={formData.mileage}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                required
              />
            </div>
          </div>

          {/* 차량 상태 */}
          <div className="bg-white p-4 rounded-xl space-y-4">
            <h2 className="text-lg font-medium">차량 상태</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                사고 여부 *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                required
              >
                <option value="완전무사고">완전무사고</option>
                <option value="단순교환">단순교환</option>
                <option value="사고이력">사고이력</option>
              </select>
            </div>
          </div>

          {/* 이미지 */}
          <div className="bg-white p-4 rounded-xl space-y-4">
            <h2 className="text-lg font-medium">차량 이미지</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이미지 추가
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="w-full"
              />
            </div>

            {/* 이미지 미리보기 */}
            {imagePreview.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {imagePreview.map((url, index) => (
                  <div key={index} className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleImageDelete(index)}
                      className="absolute top-2 right-2 p-1 bg-black/60 text-white rounded-full"
                    >
                      <span className="material-icons text-sm">close</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 추가 정보 */}
          <div className="bg-white p-4 rounded-xl space-y-4 mb-28">
            <h2 className="text-lg font-medium">추가 정보</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                상세 설명
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg h-32 resize-none"
                placeholder="차량에 대한 상세한 설명을 입력해주세요"
              />
            </div>
          </div>

          {/* 수정하기 버튼 */}
          <div className="fixed bottom-[72px] left-1/2 -translate-x-1/2 w-full max-w-[500px] px-4 py-2 bg-white border-t">
            <button
              type="submit"
              className="w-full bg-black text-white py-4 rounded-xl font-medium"
            >
              수정완료
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ListingEdit; 