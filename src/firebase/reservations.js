import { collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from './config';

// 예약 생성
export const createReservation = async (reservationData) => {
  try {
    const docRef = await addDoc(collection(db, 'reservations'), {
      ...reservationData,
      createdAt: new Date(),
      status: '대기중'
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating reservation:', error);
    throw error;
  }
};

// 사용자의 예약 목록 조회
export const getUserReservations = async (userId) => {
  try {
    const q = query(
      collection(db, 'reservations'), 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching user reservations:', error);
    throw error;
  }
}; 