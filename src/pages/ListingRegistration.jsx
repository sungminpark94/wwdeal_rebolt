import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/config';

const INSPECTION_ITEMS = [
  { id: 'exterior', label: '외관' },
  { id: 'paint', label: '도장 상태' },
  { id: 'interior', label: '내장' },
  { id: 'tire', label: '타이어' },
  { id: 'seat', label: '시트' },
  { id: 'undercarriage', label: '하부' },
  { id: 'leakage', label: '누유·누수' },
  { id: 'consumables', label: '소모품 상태' }
];

const initialInspections = INSPECTION_ITEMS.reduce((acc, item) => {
  acc[item.id] = {
    images: [],
    status: '',
    comment: ''
  };
  return acc;
}, {});

// 파일 유효성 검사 함수
const validateFile = (file) => {
  // 파일 크기 제한 (예: 10MB)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error(`파일 크기가 너무 큽니다: ${file.name} (최대 10MB)`);
  }
  
  // 이미지 타입 확인
  if (!file.type.startsWith('image/')) {
    throw new Error(`이미지 파일만 업로드 가능합니다: ${file.name}`);
  }
  
  return true;
};

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
    inspections: initialInspections
  });

  const [imageFiles, setImageFiles] = useState({
    main: [], // 주 이미지 파일
    battery: [], // 배터리 이미지 파일
    // 검사 항목별 이미지 파일들은 동적으로 추가
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // 이미지 미리보기 상태
  const [imagePreview, setImagePreview] = useState([]);
  const [batteryImagePreview, setBatteryImagePreview] = useState([]);
  const [inspectionImagePreviews, setInspectionImagePreviews] = useState(
    INSPECTION_ITEMS.reduce((acc, item) => {
      acc[item.id] = [];
      return acc;
    }, {})
  );

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
    try {
      const files = Array.from(e.target.files);
      
      // 최대 업로드 이미지 개수 제한 (10개)
      if (imagePreview.length + files.length > 10) {
        alert('최대 10개의 이미지만 업로드할 수 있습니다.');
        return;
      }

      // 각 파일 유효성 검사
      files.forEach(file => validateFile(file));
      
      const previews = files.map(file => URL.createObjectURL(file));
      setImagePreview(prev => [...prev, ...previews]);
      
      // imageFiles 상태 업데이트
      setImageFiles(prev => ({
        ...prev,
        main: [...(prev.main || []), ...files]
      }));
    } catch (error) {
      console.error("이미지 업로드 오류:", error);
      alert(error.message || '이미지 업로드 중 오류가 발생했습니다.');
    }
  };

  // 배터리 이미지 업로드 핸들러
  const handleBatteryImageUpload = (e) => {
    try {
      const files = Array.from(e.target.files);
      
      // 최대 업로드 이미지 개수 제한 (5개)
      if (batteryImagePreview.length + files.length > 5) {
        alert('배터리 이미지는 최대 5개까지 업로드할 수 있습니다.');
        return;
      }

      // 각 파일 유효성 검사
      files.forEach(file => validateFile(file));
      
      const previews = files.map(file => URL.createObjectURL(file));
      setBatteryImagePreview(prev => [...prev, ...previews]);
      
      // imageFiles 상태 업데이트
      setImageFiles(prev => ({
        ...prev,
        battery: [...(prev.battery || []), ...files]
      }));
    } catch (error) {
      console.error("배터리 이미지 업로드 오류:", error);
      alert(error.message || '배터리 이미지 업로드 중 오류가 발생했습니다.');
    }
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

  const handleInspectionImageUpload = async (e, itemId) => {
    try {
      const files = Array.from(e.target.files);
      if (!files.length) return;

      // 최대 업로드 이미지 개수 제한 (10개)
      const currentPreviews = inspectionImagePreviews[itemId] || [];
      if (currentPreviews.length + files.length > 10) {
        alert(`${INSPECTION_ITEMS.find(item => item.id === itemId)?.label} 이미지는 최대 10개까지 업로드할 수 있습니다.`);
        return;
      }

      // 각 파일 유효성 검사
      files.forEach(file => validateFile(file));

      const newPreviews = files.map(file => URL.createObjectURL(file));
      
      // 미리보기 업데이트
      setInspectionImagePreviews(prev => ({
        ...prev,
        [itemId]: [...(prev[itemId] || []), ...newPreviews]
      }));

      // 파일 객체 저장
      setImageFiles(prev => ({
        ...prev,
        [itemId]: [...(prev[itemId] || []), ...files]
      }));
    } catch (error) {
      console.error("검사 이미지 업로드 오류:", error);
      alert(error.message || '이미지 업로드 중 오류가 발생했습니다.');
    }
  };

  const handleImageDelete = (itemId, index) => {
    try {
      // 미리보기 URL 해제
      const previewToRemove = inspectionImagePreviews[itemId][index];
      if (previewToRemove && previewToRemove.startsWith('blob:')) {
        URL.revokeObjectURL(previewToRemove);
      }

      // 미리보기 업데이트
      setInspectionImagePreviews(prev => ({
        ...prev,
        [itemId]: prev[itemId].filter((_, i) => i !== index)
      }));

      // 파일 객체 업데이트
      setImageFiles(prev => ({
        ...prev,
        [itemId]: (prev[itemId] || []).filter((_, i) => i !== index)
      }));
    } catch (error) {
      console.error("이미지 삭제 오류:", error);
      alert('이미지 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleMainImageDelete = (index) => {
    try {
      // 미리보기 URL 해제
      if (imagePreview[index] && imagePreview[index].startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview[index]);
      }

      // 미리보기 업데이트
      setImagePreview(prev => prev.filter((_, i) => i !== index));

      // 파일 객체 업데이트
      setImageFiles(prev => ({
        ...prev,
        main: (prev.main || []).filter((_, i) => i !== index)
      }));
    } catch (error) {
      console.error("메인 이미지 삭제 오류:", error);
      alert('이미지 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleBatteryImageDelete = (index) => {
    try {
      // 미리보기 URL 해제
      if (batteryImagePreview[index] && batteryImagePreview[index].startsWith('blob:')) {
        URL.revokeObjectURL(batteryImagePreview[index]);
      }

      // 미리보기 업데이트
      setBatteryImagePreview(prev => prev.filter((_, i) => i !== index));

      // 파일 객체 업데이트
      setImageFiles(prev => ({
        ...prev,
        battery: (prev.battery || []).filter((_, i) => i !== index)
      }));
    } catch (error) {
      console.error("배터리 이미지 삭제 오류:", error);
      alert('이미지 삭제 중 오류가 발생했습니다.');
    }
  };

  const uploadFileWithProgress = async (file, path) => {
    try {
      const storageRef = ref(storage, path);
      
      // 업로드 작업 생성
      const uploadTask = uploadBytes(storageRef, file);
      
      // 업로드 완료 대기
      const snapshot = await uploadTask;
      
      // 다운로드 URL 반환
      return await getDownloadURL(snapshot.ref);
    } catch (error) {
      console.error(`파일 업로드 오류 (${path}):`, error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 필수 필드 검증
    if (!imageFiles.main || imageFiles.main.length === 0) {
      alert('최소 한 개 이상의 차량 이미지를 업로드해주세요.');
      return;
    }

    try {
      setIsLoading(true);
      setUploadProgress(0);
      
      // 1. 메인 이미지 업로드
      console.log('메인 이미지 업로드 시작...');
      const mainImageUrls = await Promise.all(
        imageFiles.main.map(async (file, index) => {
          const url = await uploadFileWithProgress(
            file, 
            `listings/${Date.now()}-${index}-${file.name}`
          );
          setUploadProgress(prev => prev + (30 / imageFiles.main.length));
          return url;
        })
      );
      console.log('메인 이미지 업로드 완료:', mainImageUrls);

      // 2. 배터리 이미지 업로드 (전기차인 경우)
      let batteryImageUrls = [];
      if (formData.fuel === '전기' && imageFiles.battery && imageFiles.battery.length > 0) {
        console.log('배터리 이미지 업로드 시작...');
        batteryImageUrls = await Promise.all(
          imageFiles.battery.map(async (file, index) => {
            const url = await uploadFileWithProgress(
              file, 
              `batteries/${Date.now()}-${index}-${file.name}`
            );
            setUploadProgress(prev => prev + (10 / imageFiles.battery.length));
            return url;
          })
        );
        console.log('배터리 이미지 업로드 완료:', batteryImageUrls);
      }

      // 3. 점검 이미지 업로드
      console.log('검사 이미지 업로드 시작...');
      const inspectionItems = INSPECTION_ITEMS.map(item => item.id);
      const inspectionImagesPromises = inspectionItems.map(async (part) => {
        const files = imageFiles[part] || [];
        if (files.length > 0) {
          const urls = await Promise.all(
            files.map(async (file, index) => {
              const url = await uploadFileWithProgress(
                file, 
                `inspections/${part}/${Date.now()}-${index}-${file.name}`
              );
              // 모든 검사 항목 이미지 업로드를 합쳐서 60%로 계산
              const totalInspectionFiles = inspectionItems.reduce(
                (sum, itemId) => sum + (imageFiles[itemId]?.length || 0), 
                0
              );
              if (totalInspectionFiles > 0) {
                setUploadProgress(prev => prev + (60 / totalInspectionFiles));
              }
              return url;
            })
          );
          return [part, urls];
        }
        return [part, []];
      });
      
      const inspectionImagesResults = await Promise.all(inspectionImagesPromises);
      const inspectionImages = Object.fromEntries(inspectionImagesResults);
      console.log('검사 이미지 업로드 완료:', inspectionImages);

      // 4. Firestore에 데이터 저장
      console.log('Firestore에 데이터 저장 시작...');
      const listingData = {
        name: formData.name,
        price: Number(formData.price),
        year: formData.year,
        mileage: formData.mileage,
        status: formData.status,
        fuel: formData.fuel,
        transmission: formData.transmission,
        options: formData.options,
        description: formData.description,
        images: mainImageUrls,
        location: formData.location,
        battery: {
          status: formData.battery.status,
          images: batteryImageUrls
        },
        inspection: {
          date: formData.inspection.date,
          status: formData.inspection.status
        },
        sellerComment: formData.sellerComment,
        // 검사 데이터 구조화
        inspections: Object.entries(formData.inspections).reduce((acc, [part, data]) => ({
          ...acc,
          [part]: {
            status: data.status,
            comment: data.comment,
            images: inspectionImages[part] || []
          }
        }), {}),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Firestore에 문서 추가
      const docRef = await addDoc(collection(db, 'listings'), listingData);
      console.log('Document written with ID: ', docRef.id);
      setUploadProgress(100);
      
      // 성공 메시지 및 리디렉션
      alert('매물이 성공적으로 등록되었습니다!');
      navigate(`/listing/${docRef.id}`);
    } catch (error) {
      console.error('Error details:', error.code, error.message);
      console.error('Error submitting form:', error);
      alert(`매물 등록 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`);
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
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
            <h2 className="text-lg font-medium">차량 이미지 *</h2>
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
              />
            </label>

            {/* 썸네일 미리보기 */}
            {imagePreview.map((url, index) => (
              <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleMainImageDelete(index)}
                  className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-colors"
                >
                  <span className="material-icons text-white text-lg">close</span>
                </button>
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
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  배터리 이미지
                </label>
                <span className="text-sm text-gray-400">
                  {batteryImagePreview.length}/5장
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
                    onChange={handleBatteryImageUpload}
                    className="hidden"
                  />
                </label>
                
                {/* 배터리 이미지 미리보기 */}
                {batteryImagePreview.map((url, index) => (
                  <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={url}
                      alt={`Battery ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleBatteryImageDelete(index)}
                      className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-colors"
                    >
                      <span className="material-icons text-white text-lg">close</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
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
        <div className="bg-white p-4 rounded-xl space-y-4">
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
          <h2 className="text-lg font-medium">차량 점검 상태</h2>
          
          {INSPECTION_ITEMS.map(({ id, label }) => (
            <div key={id} className="space-y-4 border-b pb-6 last:border-b-0">
              {/* 파트 제목과 상태 표시 */}
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{label}</h3>
                <div className={`px-2 py-1 rounded-full text-sm ${
                  formData.inspections[id].status === '양호'
                    ? 'bg-green-50 text-green-600'
                    : formData.inspections[id].status === '확인필요'
                    ? 'bg-yellow-50 text-yellow-600'
                    : formData.inspections[id].status === '이상있음'
                    ? 'bg-red-50 text-red-600'
                    : 'bg-gray-50 text-gray-600'
                }`}>
                  {formData.inspections[id].status || '상태 선택'}
                </div>
              </div>

              {/* 상태 선택 버튼 */}
              <div className="grid grid-cols-3 gap-2">
                {['양호', '확인필요', '이상있음'].map(status => (
                  <button
                    type="button"
                    key={status}
                    onClick={() => handleInspectionChange(id, 'status', status)}
                    className={`py-3 rounded-xl text-sm border ${
                      formData.inspections[id].status === status
                        ? status === '양호'
                          ? 'bg-green-50 border-green-200 text-green-600'
                          : status === '확인필요'
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
                  <span className="text-sm text-gray-600">{label} 사진</span>
                  <span className="text-sm text-gray-400">
                    {inspectionImagePreviews[id]?.length || 0}/10장
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
                      onChange={(e) => handleInspectionImageUpload(e, id)}
                      className="hidden"
                    />
                  </label>
                  {inspectionImagePreviews[id]?.map((url, index) => (
                    <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={url}
                        alt={`${label} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleImageDelete(id, index)}
                        className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-colors"
                      >
                        <span className="material-icons text-white text-lg">close</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 코멘트 입력 */}
              <textarea
                value={formData.inspections[id].comment}
                onChange={(e) => handleInspectionChange(id, 'comment', e.target.value)}
                placeholder={`${label} 상태를 자세히 설명해주세요`}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg resize-none h-24"
              />
            </div>
          ))}
        </div>

        {/* 업로드 진행 상태 표시 */}
        {isLoading && (
          <div className="bg-white p-4 rounded-xl">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">업로드 진행 중...</span>
                <span className="text-sm">{Math.round(uploadProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* 추가 여백 div */}
        <div className="h-[120px]"></div>

        {/* 등록 버튼 */}
        <div className="fixed bottom-[72px] left-1/2 -translate-x-1/2 w-full max-w-[500px] px-4 py-2 bg-white border-t">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 rounded-xl font-medium ${
              isLoading 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-black text-white'
            }`}
          >
            {isLoading ? '등록 중...' : '매물 등록하기'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ListingRegistration;