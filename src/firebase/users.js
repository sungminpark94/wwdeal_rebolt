import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './config';

// 사용자 프로필 생성/업데이트
export const updateUserProfile = async (uid, userData) => {
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, {
      ...userData,
      updatedAt: new Date()
    }, { merge: true });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// 관심 매물 토글
export const toggleFavoriteListing = async (uid, listingId) => {
  try {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    const favorites = userDoc.data()?.favorites || [];
    
    const newFavorites = favorites.includes(listingId)
      ? favorites.filter(id => id !== listingId)
      : [...favorites, listingId];
    
    await updateDoc(userRef, { favorites: newFavorites });
    return newFavorites;
  } catch (error) {
    console.error('Error toggling favorite:', error);
    throw error;
  }
}; 