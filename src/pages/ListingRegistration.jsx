import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const ListingRegistration = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    year: '',
    mileage: '',
    status: '완전무사고',
    images: [],
    description: '',
    // 추가된 필드들
    fuel: '',
    transmission: '자동',
    location: {
      address: '',
      distance: ''
    },
    battery: {
      status: '정상',
      images: []
    },
    inspection: {
      date: '',
      status: '양호'
    },
    options: [],
    sellerComment: '',
    inspections: {
      exterior: {
        status: '양호',
        comment: '',
        images: []
      },
      paint: {
        status: '양호',
        comment: '',
        images: []
      },
      interior: {
        status: '양호',
        comment: '',
        images: []
      },
      tire: {
        status: '양호',
        comment: '',
        images: []
      },
      seat: {
        status: '양호',
        comment: '',
        images: []
      }
    }
  });

  // 이미지 미리보기 상태
  const [imagePreview, setImagePreview] = useState([]);
  const [batteryImagePreview, setBatteryImagePreview] = useState([]);
  const [imagePreviewMap, setImagePreviewMap] = useState({
    exterior: [],
    paint: [],
    interior: [],
    tire: [],
    seat: []
  });

  // 기본 옵션 목록
  const defaultOptions = [
    '열선시트', '후방카메라', '네비게이션', '블루투스', '스마트키',
    '크루즈컨트롤', '통풍시트', '헤드업디스플레이'
  ];

  // 사용자 정의 옵션을 포함한 전체 옵션 목록
  const [availableOptions, setAvailableOptions] = useState(defaultOptions);
  const [isAddingOption, setIsAddingOption] = useState(false);
  const [newOption, setNewOption] = useState('');

  // 새 옵션 추가 핸들러
  const handleAddOption = () => {
    if (newOption.trim()) {
      setAvailableOptions(prev => [...prev, newOption.trim()]);
      setNewOption('');
      setIsAddingOption(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [name]: value
      }
    }));
  };

  const handleOptionToggle = (option) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.includes(option)
        ? prev.options.filter(item => item !== option)
        : [...prev.options, option]
    }));
  };

  // 차량 이미지 업로드 핸들러
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreview(prev => [...prev, ...previews]);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  // 배터리 이미지 업로드 핸들러
  const handleBatteryImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map(file => URL.createObjectURL(file));
    setBatteryImagePreview(prev => [...prev, ...previews]);
    setFormData(prev => ({
      ...prev,
      battery: {
        ...prev.battery,
        images: [...prev.battery.images, ...files]
      }
    }));
  };

  const handleInspectionChange = (part, field, value) => {
    setFormData(prev => ({
      ...prev,
      inspections: {
        ...prev.inspections,
        [part]: {
          ...prev.inspections[part],
          [field]: value
        }
      }
    }));
  };

  const handleInspectionImageUpload = (part, e) => {
    const files = Array.from(e.target.files);
    const previews = files.map(file => URL.createObjectURL(file));
    
    setImagePreviewMap(prev => ({
      ...prev,
      [part]: [...prev[part], ...previews]
    }));

    setFormData(prev => ({
      ...prev,
      inspections: {
        ...prev.inspections,
        [part]: {
          ...prev.inspections[part],
          images: [...prev.inspections[part].images, ...files]
        }
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // TODO: Firebase에 데이터 저장 로직 구현
      console.log('Form submitted:', formData);
      navigate('/listings');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="매물 등록" className="border-b" />
      
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {/* 기본 정보 섹션 */}
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
              placeholder="예) 테슬라 모델 3"
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
              placeholder="예) 5000"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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
                placeholder="예) 2023"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                주행거리 (km) *
              </label>
              <input
                type="number"
                name="mileage"
                value={formData.mileage}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                placeholder="예) 10000"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                연료 *
              </label>
              <select
                name="fuel"
                value={formData.fuel}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                required
              >
                <option value="">선택</option>
                <option value="가솔린">가솔린</option>
                <option value="디젤">디젤</option>
                <option value="하이브리드">하이브리드</option>
                <option value="수소">수소</option>
                <option value="전기">전기</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                변속기 *
              </label>
              <select
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                required
              >
                <option value="자동">자동</option>
                <option value="수동">수동</option>
              </select>
            </div>
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

        {/* 차량 옵션 */}
        <div className="bg-white p-4 rounded-xl space-y-4">
          <h2 className="text-lg font-medium">주요 옵션</h2>
          <div className="grid grid-cols-2 gap-2">
            {availableOptions.map(option => (
              <button
                key={option}
                type="button"
                onClick={() => handleOptionToggle(option)}
                className={`p-2 rounded-lg border text-sm ${
                  formData.options.includes(option)
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-700 border-gray-200'
                }`}
              >
                {option}
              </button>
            ))}
            
            {/* 옵션 추가 버튼 */}
            <button
              type="button"
              onClick={() => setIsAddingOption(true)}
              className="p-2 rounded-lg border border-dashed border-gray-300 text-sm text-gray-500 flex items-center justify-center gap-1"
            >
              <span className="material-icons text-gray-400">add</span>
              옵션 추가
            </button>
          </div>

          {/* 옵션 추가 모달 */}
          {isAddingOption && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-4 w-[90%] max-w-[400px] space-y-4">
                <h3 className="text-lg font-medium">옵션 추가</h3>
                <input
                  type="text"
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  placeholder="새로운 옵션을 입력하세요"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingOption(false)}
                    className="flex-1 py-3 rounded-lg border border-gray-200"
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    onClick={handleAddOption}
                    className="flex-1 py-3 rounded-lg bg-black text-white"
                  >
                    추가
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 차량 위치 */}
        <div className="bg-white p-4 rounded-xl space-y-4">
          <h2 className="text-lg font-medium">차량 위치</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              주소 *
            </label>
            <input
              type="text"
              name="address"
              value={formData.location.address}
              onChange={handleLocationChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg"
              placeholder="예) 서울시 강남구"
              required
            />
          </div>
        </div>

        {/* 이미지 업로드 */}
        <div className="bg-white p-4 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">차량 이미지</h2>
            <span className="text-sm text-gray-400">
              {imagePreview.length}/10장
            </span>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {/* 이미지 업로드 버튼 */}
            <label className="aspect-square bg-gray-50 rounded-lg flex flex-col items-center justify-center cursor-pointer">
              <span className="material-icons text-gray-400 mb-1">photo_camera</span>
              <span className="text-sm text-gray-400">촬영</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                required
              />
            </label>

            {/* 이미지 미리보기 */}
            {imagePreview.map((url, index) => (
              <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 배터리 상태 - 전기차일 때만 표시 */}
        {formData.fuel === '전기' && (
          <div className="bg-white p-4 rounded-xl space-y-4">
            <h2 className="text-lg font-medium">배터리 상태</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                상태 *
              </label>
              <select
                name="batteryStatus"
                value={formData.battery.status}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  battery: { ...prev.battery, status: e.target.value }
                }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                required
              >
                <option value="정상">정상</option>
                <option value="주의">주의</option>
                <option value="경고">경고</option>
              </select>
            </div>
            {/* 배터리 이미지 업로드 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                배터리 이미지
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleBatteryImageUpload}
                className="w-full"
              />
            </div>
            {/* 배터리 이미지 미리보기 */}
            {batteryImagePreview.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {batteryImagePreview.map((url, index) => (
                  <div key={index} className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={url}
                      alt={`Battery ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 차량 점검 */}
        <div className="bg-white p-4 rounded-xl space-y-4">
          <h2 className="text-lg font-medium">차량 점검일</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              점검일 *
            </label>
            <input
              type="date"
              name="inspectionDate"
              value={formData.inspection.date}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                inspection: { ...prev.inspection, date: e.target.value }
              }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg"
              required
            />
          </div>
        </div>

        {/* 판매자 코멘트 */}
        <div className="bg-white p-4 rounded-xl space-y-4 mb-[500px]">
          <h2 className="text-lg font-medium">판매자 코멘트</h2>
          <div>
            <textarea
              name="sellerComment"
              value={formData.sellerComment}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg h-32 resize-none"
              placeholder="차량에 대한 상세한 설명을 입력해주세요"
            />
          </div>
        </div>

        {/* 검사 항목들 */}
        <div className="bg-white p-4 rounded-xl space-y-6">
          {Object.entries(formData.inspections).map(([part, data]) => (
            <div key={part} className="space-y-4">
              {/* 파트 제목과 상태 표시 */}
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

              {/* 상태 선택 버튼 */}
              <div className="grid grid-cols-3 gap-2">
                {['양호', '수리필요', '교체필요'].map(status => (
                  <button
                    type="button"
                    key={status}
                    onClick={() => handleInspectionChange(part, 'status', status)}
                    className={`py-3 rounded-xl text-sm border ${
                      data.status === status
                        ? status === '양호'
                          ? 'bg-green-50 border-green-200 text-green-600'
                          : status === '수리필요'
                          ? 'bg-yellow-50 border-yellow-200 text-yellow-600'
                          : 'bg-red-50 border-red-200 text-red-600'
                        : 'bg-gray-50 border-gray-200 text-gray-600'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              {/* 이미지 업로드 섹션 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">{part} 사진</span>
                  <span className="text-sm text-gray-400">
                    {imagePreviewMap[part].length}/10장
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <label className="aspect-square bg-gray-50 rounded-lg flex flex-col items-center justify-center cursor-pointer">
                    <span className="material-icons text-gray-400 mb-1">photo_camera</span>
                    <span className="text-sm text-gray-400">촬영</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleInspectionImageUpload(part, e)}
                      className="hidden"
                    />
                  </label>
                  {imagePreviewMap[part].map((url, index) => (
                    <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={url}
                        alt={`${part} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* 코멘트 입력 */}
              <textarea
                value={data.comment}
                onChange={(e) => handleInspectionChange(part, 'comment', e.target.value)}
                placeholder="문제 상황을 자세히 설명해주세요"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg resize-none"
              />
            </div>
          ))}
        </div>

        {/* 추가 여백 div */}
        <div className="h-[120px]"></div>

        {/* 등록 버튼 */}
        <div className="fixed bottom-[72px] left-1/2 -translate-x-1/2 w-full max-w-[500px] px-4 py-2 bg-white border-t">
          <button
            type="submit"
            className="w-full bg-black text-white py-4 rounded-xl font-medium"
          >
            매물 등록하기
          </button>
        </div>
      </form>
    </div>
  );
};

export default ListingRegistration; 