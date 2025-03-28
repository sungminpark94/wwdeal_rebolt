import { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const RecentViewContext = createContext();

export const RecentViewProvider = ({ children }) => {
  const [recentViews, setRecentViews] = useState([]);
  const { user } = useAuth();

  // 최근 본 차량 목록 불러오기
  useEffect(() => {
    const loadRecentViews = async () => {
      if (!user) {
        setRecentViews([]);
        return;
      }

      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists() && userDocSnap.data().recentViews) {
          setRecentViews(userDocSnap.data().recentViews);
        }
      } catch (error) {
        console.error('Error loading recent views:', error);
      }
    };

    loadRecentViews();
  }, [user]);

  // 최근 본 차량 추가
  const addRecentView = async (vehicle) => {
    if (!user || !vehicle) return;

    try {
      const userDocRef = doc(db, 'users', user.uid);
      
      // 중복 제거 및 최신 항목을 앞으로
      const updatedViews = [
        vehicle,
        ...recentViews.filter(item => item.id !== vehicle.id)
      ].slice(0, 10); // 최대 10개만 유지

      await setDoc(userDocRef, {
        recentViews: updatedViews
      }, { merge: true });

      setRecentViews(updatedViews);
    } catch (error) {
      console.error('Error adding recent view:', error);
    }
  };

  return (
    <RecentViewContext.Provider value={{ recentViews, addRecentView }}>
      {children}
    </RecentViewContext.Provider>
  );
};

export const useRecentViews = () => {
  return useContext(RecentViewContext);
}; 