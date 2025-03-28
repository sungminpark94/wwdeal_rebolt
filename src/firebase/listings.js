import { 
  collection, 
  addDoc, 
  doc, 
  getDoc, 
  getDocs,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './config';

// 매물 목록 조회
export const getListings = async (filters = {}) => {
  try {
    let q = collection(db, 'listings');
    
    // 필터 적용
    if (filters.minPrice) {
      q = query(q, where('price', '>=', filters.minPrice));
    }
    if (filters.maxPrice) {
      q = query(q, where('price', '<=', filters.maxPrice));
    }
    // 정렬
    q = query(q, orderBy('createdAt', 'desc'));

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      // 필요한 데이터만 추출하여 반환
      return {
        id: doc.id,
        title: data.title || data.name || "제목 없음",
        price: typeof data.price === 'number' ? data.price : 0,
        year: data.year || new Date().getFullYear(),
        mileage: data.mileage || "0km",
        images: Array.isArray(data.images) ? data.images : [],
        image: Array.isArray(data.images) && data.images.length > 0 
          ? data.images[0] 
          : "https://via.placeholder.com/400x300",
        status: data.status || "정보없음",
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        // 복잡한 객체는 제외하고 필요한 정보만 문자열로 변환
        sellerName: data.seller?.name || "판매자 정보 없음",
        optionsList: Array.isArray(data.options) ? data.options.join(", ") : "옵션 정보 없음",
        location: typeof data.location === 'string' ? data.location : "위치 정보 없음"
      };
    });
  } catch (error) {
    console.error('Error fetching listings:', error);
    throw error;
  }
};

// 매물 상세 조회
export const getListing = async (id) => {
  try {
    const docRef = doc(db, 'listings', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching listing:', error);
    throw error;
  }
};

// 이미지 업로드
export const uploadListingImages = async (files) => {
  try {
    const uploadPromises = files.map(async (file) => {
      const storageRef = ref(storage, `listings/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      return getDownloadURL(snapshot.ref);
    });
    return Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading images:', error);
    throw error;
  }
};

// 매물 등록
export const createListing = async (listingData, images) => {
  try {
    const imageUrls = await uploadListingImages(images);
    
    // 저장할 데이터 구조 정제
    const cleanedData = {
      title: listingData.title || "",
      price: listingData.price || 0,
      year: listingData.year || new Date().getFullYear(),
      mileage: listingData.mileage || "0km",
      images: imageUrls,
      status: listingData.status || "판매중",
      createdAt: new Date(),
      updatedAt: new Date(),
      // location을 문자열로 저장
      location: typeof listingData.location === 'string' ? listingData.location : null,
      // 다른 필요한 필드들...
    };

    const docRef = await addDoc(collection(db, 'listings'), cleanedData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating listing:', error);
    throw error;
  }
}; 