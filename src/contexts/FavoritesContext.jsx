import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { db } from '../firebase/config';
import { doc, setDoc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [recentViewed, setRecentViewed] = useState([]);
  const { user } = useAuth();

  // 사용자의 찜 목록 불러오기
  useEffect(() => {
    const loadFavorites = async () => {
      if (!user) {
        setFavorites([]);
        return;
      }

      try {
        // 사용자의 찜 목록 ID 가져오기
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        const favoriteIds = userDocSnap.exists() ? userDocSnap.data().favorites || [] : [];

        // 찜한 차량들의 전체 정보 가져오기
        if (favoriteIds.length > 0) {
          const listingsRef = collection(db, 'listings');
          const q = query(listingsRef, where('__name__', 'in', favoriteIds));
          const querySnapshot = await getDocs(q);
          
          const favoriteListings = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          setFavorites(favoriteListings);
        } else {
          setFavorites([]);
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    };

    loadFavorites();
  }, [user]);

  // 찜하기 토글
  const toggleFavorite = async (item) => {
    if (!user) return;

    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      const currentFavorites = userDocSnap.exists() ? userDocSnap.data().favorites || [] : [];
      
      const newFavoriteIds = currentFavorites.includes(item.id)
        ? currentFavorites.filter(id => id !== item.id)
        : [...currentFavorites, item.id];

      // Firestore 사용자 문서 업데이트
      await setDoc(userDocRef, {
        favorites: newFavoriteIds
      }, { merge: true });

      // 찜 목록 다시 불러오기
      if (newFavoriteIds.length > 0) {
        const listingsRef = collection(db, 'listings');
        const q = query(listingsRef, where('__name__', 'in', newFavoriteIds));
        const querySnapshot = await getDocs(q);
        
        const favoriteListings = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setFavorites(favoriteListings);
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  // 찜 여부 확인
  const isFavorite = (itemId) => {
    return favorites.some(item => item.id === itemId);
  };

  // 최근 본 매물 추가 함수
  const addToRecentViewed = useCallback(async (item) => {
    if (!user) return;
    
    try {
      const recentViewedRef = doc(db, `users/${user.uid}/recentViewed/items`);
      const currentTime = new Date().getTime();
      
      // 최근 본 목록에서 중복 제거 및 최신 순으로 정렬
      const updatedRecentViewed = [
        item,
        ...recentViewed.filter(i => i.id !== item.id)
      ].slice(0, 20); // 최대 20개까지만 저장
      
      await setDoc(recentViewedRef, {
        items: updatedRecentViewed,
        updatedAt: currentTime
      });
      
      setRecentViewed(updatedRecentViewed);
    } catch (error) {
      console.error('Error adding to recent viewed:', error);
    }
  }, [user, recentViewed]);

  // 최근 본 매물 목록 불러오기
  useEffect(() => {
    if (!user) {
      setRecentViewed([]);
      return;
    }

    const loadRecentViewed = async () => {
      try {
        const recentViewedRef = doc(db, `users/${user.uid}/recentViewed/items`);
        const docSnap = await getDoc(recentViewedRef);
        
        if (docSnap.exists()) {
          setRecentViewed(docSnap.data().items || []);
        }
      } catch (error) {
        console.error('Error loading recent viewed:', error);
      }
    };

    loadRecentViewed();
  }, [user]);

  return (
    <FavoritesContext.Provider value={{ 
      favorites, 
      toggleFavorite, 
      isFavorite,
      recentViewed,
      addToRecentViewed 
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  return useContext(FavoritesContext);
}; 