// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Header from '../components/Header';
// import { useAuth } from '../contexts/AuthContext';
// import { useReservation } from '../contexts/ReservationContext';
// import { faqData } from '../data/faqData';
// import { useInterest } from '../contexts/InterestContext';
// import LoginModal from '../components/LoginModal';
// import { collection, query, where, getDocs, orderBy, deleteDoc, doc, getDoc } from 'firebase/firestore';
// import { db } from '../firebase/config';

// const Profile = () => {
//   const { user, logout, openLoginModal } = useAuth();
//   const { reservations, removeReservation } = useReservation();
//   const { interests, removeInterest } = useInterest();
//   const navigate = useNavigate();
//   const [showPartnershipSheet, setShowPartnershipSheet] = useState(false);
//   const [showFaqModal, setShowFaqModal] = useState(false);
//   const [faqContent, setFaqContent] = useState('');
//   const [partnershipPhone, setPartnershipPhone] = useState('');
//   const [partnershipContent, setPartnershipContent] = useState('');
//   const [expandedFaqId, setExpandedFaqId] = useState(null);
//   const [showFaqSection, setShowFaqSection] = useState(false);
//   const [showReservationDetails, setShowReservationDetails] = useState(false);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [selectedReservation, setSelectedReservation] = useState(null);
//   const [notificationEnabled, setNotificationEnabled] = useState(false);
//   const [showInterests, setShowInterests] = useState(false);
//   const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
//   const [visitReservations, setVisitReservations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [userData, setUserData] = useState(null);

//   useEffect(() => {
//     const fetchReservations = async () => {
//       if (!user) return;

//       try {
//         const q = query(
//           collection(db, 'reservations'),
//           where('userId', '==', user.uid),
//           orderBy('createdAt', 'desc')
//         );

//         const querySnapshot = await getDocs(q);
//         const reservationList = querySnapshot.docs.map(doc => {
//           const data = doc.data();
//           return {
//             id: doc.id,
//             ...data,
//             // createdAt이나 visitDate가 존재할 때만 toDate() 호출
//             visitDate: data.visitDate?.toDate?.() || new Date(),
//             createdAt: data.createdAt?.toDate?.() || new Date()
//           };
//         });

//         setVisitReservations(reservationList);
//       } catch (error) {
//         console.error('예약 정보 조회 중 오류:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchReservations();
//   }, [user]);

//   // 사용자 정보 불러오기
//   useEffect(() => {
//     const fetchUserData = async () => {
//       if (!user?.uid) return;

//       try {
//         const userDocRef = doc(db, 'users', user.uid);
//         const userDocSnap = await getDoc(userDocRef);
        
//         if (userDocSnap.exists()) {
//           setUserData(userDocSnap.data());
//           console.log('userData:', userDocSnap.data());
//         }
//       } catch (error) {
//         console.error('사용자 정보 로드 실패:', error);
//       }
//     };

//     fetchUserData();
//   }, [user]);

//   // FAQ 토글 함수
//   const toggleFaq = (id) => {
//     setExpandedFaqId(expandedFaqId === id ? null : id);
//   };

//   // 날짜 포맷 함수
//   const formatDate = (date) => {
//     if (!date) return '';
//     const d = new Date(date);
//     return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
//   };

//   // 예약 삭제 확인 모달 표시
//   const handleDeleteClick = (reservation) => {
//     setSelectedReservation(reservation);
//     setShowDeleteConfirm(true);
//   };

//   // 예약 삭제 실행
//   const handleDeleteConfirm = async () => {
//     if (!selectedReservation) return;

//     try {
//       // Firestore에서 예약 문서 삭제
//       await deleteDoc(doc(db, 'reservations', selectedReservation.id));
      
//       // 로컬 상태 업데이트
//       setVisitReservations(prev => 
//         prev.filter(reservation => reservation.id !== selectedReservation.id)
//       );

//       // 모달 닫기 및 상태 초기화
//       setShowDeleteConfirm(false);
//       setSelectedReservation(null);
      
//       alert('예약이 취소되었습니다.');
//     } catch (error) {
//       console.error('예약 취소 중 오류:', error);
//       alert('예약 취소 중 오류가 발생했습니다.');
//     }
//   };

//   // 기존의 openLoginModal을 handleLoginClick으로 변경
//   const handleLoginClick = () => {
//     setIsLoginModalOpen(true);
//   };

//   // 예약 삭제 함수
//   const handleDeleteReservation = async (reservationId) => {
//     if (!window.confirm('예약을 취소하시겠습니까?')) return;

//     try {
//       // Firestore에서 예약 문서 삭제
//       await deleteDoc(doc(db, 'reservations', reservationId));
      
//       // 로컬 상태 업데이트
//       setVisitReservations(prev => 
//         prev.filter(reservation => reservation.id !== reservationId)
//       );

//       alert('예약이 취소되었습니다.');
//     } catch (error) {
//       console.error('예약 취소 중 오류:', error);
//       alert('예약 취소 중 오류가 발생했습니다.');
//     }
//   };
  
//   return (
//     <div className="flex flex-col min-h-screen bg-gray-50">
//       <Header title="프로필" />
      
//       <div className="flex-1 p-4 pb-20 overflow-auto">
//         {user ? (
//           <>
//             <div className="bg-white rounded-xl p-4 mb-4">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-4">
//                   <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
//                     <span className="material-icons text-3xl text-gray-400">person</span>
//                   </div>
//                   <div>
//                     <h2 className="font-medium text-lg">
//                       {userData?.name || '이름 없음'}
//                     </h2>
//                     <p className="text-gray-500">
//                       {userData?.phoneNumber || user?.phoneNumber || '전화번호 없음'}
//                     </p>
//                   </div>
//                 </div>
//                 <button 
//                   onClick={logout}
//                   className="px-4 py-2 text-gray-500 hover:bg-gray-50 rounded-lg"
//                 >
//                   로그아웃
//                 </button>
//               </div>
//             </div>

//             <div className="bg-white rounded-xl overflow-hidden mb-4">
//               <button 
//                 onClick={() => navigate('/favorites')}
//                 className="w-full px-4 py-4 text-left text-gray-600 hover:bg-gray-50 flex justify-between items-center border-b"
//               >
//                 <span>찜한차</span>
//                 <span className="material-icons text-gray-400">chevron_right</span>
//               </button>

//               <button 
//                 onClick={() => setShowReservationDetails(!showReservationDetails)}
//                 className="w-full px-4 py-4 text-left text-gray-600 hover:bg-gray-50 flex justify-between items-center border-b"
//               >
//                 <span>예약 정보</span>
//                 <div className="flex items-center gap-2">
//                   {visitReservations?.length > 0 && (
//                     <span className="text-green-500">{visitReservations.length}건</span>
//                   )}
//                   <span className="material-icons text-gray-400">
//                     {showReservationDetails ? 'expand_less' : 'expand_more'}
//                   </span>
//                 </div>
//               </button>
//               {showReservationDetails && visitReservations?.length > 0 && (
//                 <div className="border-t px-4 py-2">
//                   {visitReservations.map((reservation) => (
//                     <div key={reservation.id} className="py-3 border-b last:border-0">
//                       <div className="flex justify-between items-start mb-2">
//                         <div>
//                           <h3 className="font-medium">{reservation.carName}</h3>
//                           <p className="text-sm text-gray-500">
//                             {formatDate(reservation.visitDate)} {reservation.time}
//                           </p>
//                         </div>
//                         <button
//                           onClick={() => handleDeleteClick(reservation)}
//                           className="p-1 text-gray-400 hover:text-red-500"
//                         >
//                           <span className="material-icons text-sm">close</span>
//                         </button>
//                       </div>
//                       <p className="text-sm text-gray-600">{reservation.address}</p>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               <button 
//                 onClick={() => setShowInterests(!showInterests)}
//                 className="w-full px-4 py-4 text-left text-gray-600 hover:bg-gray-50 flex justify-between items-center"
//               >
//                 <span>관심 차종</span>
//                 <div className="flex items-center gap-2">
//                   {interests?.length > 0 && (
//                     <span className="text-green-500">{interests.length}개</span>
//                   )}
//                   <span className="material-icons text-gray-400">
//                     {showInterests ? 'expand_less' : 'expand_more'}
//                   </span>
//                 </div>
//               </button>
//               {interests?.length > 0 && showInterests && (
//                 <div className="border-t px-4 py-2">
//                   {interests.map((interest, index) => (
//                     <div key={index} className="py-2 flex justify-between items-center">
//                       <span className="text-sm">{interest}</span>
//                       <button
//                         onClick={() => removeInterest(interest)}
//                         className="p-1 text-gray-400 hover:text-red-500"
//                       >
//                         <span className="material-icons text-sm">close</span>
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             <div className="bg-white rounded-xl overflow-hidden mb-4">
//               <div className="px-4 py-4 flex justify-between items-center border-b">
//                 <div>
//                   <h3 className="font-medium mb-1">알림 설정</h3>
//                   <p className="text-sm text-gray-500">
//                     관심 차종이 등록되면 알림을 받아보세요😀
//                   </p>
//                 </div>
//                 <button 
//                   onClick={() => setNotificationEnabled(!notificationEnabled)}
//                   className={`relative w-12 h-6 rounded-full transition-colors duration-200 ease-in-out
//                     ${notificationEnabled ? 'bg-green-500' : 'bg-gray-200'}`}
//                 >
//                   <span 
//                     className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out
//                       ${notificationEnabled ? 'translate-x-6' : 'translate-x-0'}`}
//                   />
//                 </button>
//               </div>

//               <button 
//                 onClick={() => setShowFaqSection(!showFaqSection)}
//                 className="w-full px-4 py-4 text-left text-gray-600 hover:bg-gray-50 flex justify-between items-center border-b"
//               >
//                 <span>자주 묻는 질문</span>
//                 <span className="material-icons text-gray-400">
//                   {showFaqSection ? 'expand_less' : 'expand_more'}
//                 </span>
//               </button>

//               {showFaqSection && (
//                 <div className="border-t px-4 py-2">
//                   {faqData.map((faq, index) => (
//                     <div key={index} className="py-2">
//                       <button
//                         onClick={() => toggleFaq(faq.id)}
//                         className="w-full flex justify-between items-center py-2"
//                       >
//                         <span className="text-sm font-medium">{faq.question}</span>
//                         <span className="material-icons text-gray-400">
//                           {expandedFaqId === faq.id ? 'expand_less' : 'expand_more'}
//                         </span>
//                       </button>
//                       {expandedFaqId === faq.id && (
//                         <p className="text-sm text-gray-600 mt-2 pb-2 border-b">
//                           {faq.answer}
//                         </p>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               )}

//               <button 
//                 onClick={() => setShowPartnershipSheet(true)}
//                 className="w-full px-4 py-4 text-left text-gray-600 hover:bg-gray-50 flex justify-between items-center"
//               >
//                 <span>제휴 제안</span>
//                 <span className="material-icons text-gray-400">chevron_right</span>
//               </button>
//             </div>

//             <button 
//               onClick={() => navigate('/listing/register')}
//               className="w-full px-4 py-4 text-left text-gray-600 hover:bg-gray-50 flex justify-between items-center"
//             >
//               <span>매물 등록</span>
//               <span className="material-icons text-gray-400">chevron_right</span>
//             </button>
//           </>
//         ) : (
//           <div className="text-center py-16 px-4">
//             <div className="mb-6">
//               <span className="material-icons text-4xl text-gray-300 mb-2">
//                 notifications_none
//               </span>
//               <h3 className="text-lg font-medium text-gray-800 mb-2">
//                 알림 설정하고 차량 찾기
//               </h3>
//               <p className="text-gray-500 leading-relaxed">
//                 원하는 차종이 등록되면<br/>
//                 가장 먼저 알림을 받아보세요!
//               </p>
//             </div>
//             <div className="flex justify-center">
//               <button
//                 onClick={handleLoginClick}
//                 className="w-full max-w-[200px] px-6 py-3 bg-[#333333] text-white rounded-xl font-medium hover:bg-black transition-colors duration-200 flex items-center justify-center gap-2"
//               >
//                 <span className="material-icons text-sm">login</span>
//                 로그인하기
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {showFaqModal && (
//         <div className="fixed inset-0 z-50 bg-white">
//           <div className="flex flex-col h-full">
//             <div className="flex items-center p-4 border-b">
//               <button
//                 onClick={() => setShowFaqModal(false)}
//                 className="material-icons text-gray-500"
//               >
//                 close
//               </button>
//               <h2 className="text-lg font-medium ml-4">리볼트에서의 경험은 어떠셨나요?</h2>
//             </div>
//             <div className="flex-1 p-4">
//               <p className="text-gray-600 mb-4">작성 내용은 리볼트 내부에만 공개됩니다.</p>
//               <textarea
//                 value={faqContent}
//                 onChange={(e) => setFaqContent(e.target.value)}
//                 placeholder="솔직한 이야기를 들려주세요"
//                 className="w-full h-40 p-4 border border-gray-200 rounded-xl resize-none"
//               />
//             </div>
//             <div className="p-4">
//               <button 
//                 className="w-full py-4 bg-gray-100 text-gray-400 rounded-xl font-medium"
//                 onClick={() => {
//                   // 의견 제출 로직
//                   setShowFaqModal(false);
//                 }}
//               >
//                 의견 남기기
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {showPartnershipSheet && (
//         <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm">
//           <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[500px] bg-white rounded-t-2xl">
//             <div className="flex justify-between items-center p-4 border-b">
//               <h2 className="text-lg font-medium">제휴 제안</h2>
//               <button
//                 onClick={() => setShowPartnershipSheet(false)}
//                 className="material-icons text-gray-500"
//               >
//                 close
//               </button>
//             </div>
//             <div className="p-4">
//               <p className="text-gray-600 mb-4">
//                 제휴 및 광고 문의 내용을 남겨주시면 확인 후 연락드리겠습니다.
//               </p>
//               <div className="space-y-4">
//                 <input
//                   type="tel"
//                   value={partnershipPhone}
//                   onChange={(e) => setPartnershipPhone(e.target.value)}
//                   placeholder="휴대폰 번호를 입력해주세요"
//                   className="w-full p-4 border border-gray-200 rounded-xl"
//                 />
//                 <textarea
//                   value={partnershipContent}
//                   onChange={(e) => setPartnershipContent(e.target.value)}
//                   placeholder="문의하실 내용을 입력해주세요"
//                   className="w-full h-40 p-4 border border-gray-200 rounded-xl resize-none"
//                 />
//               </div>
//               <button 
//                 className="w-full py-4 bg-[#333333] text-white rounded-xl font-medium mt-4"
//                 onClick={() => {
//                   // 제휴 제안 제출 로직
//                   setShowPartnershipSheet(false);
//                 }}
//               >
//                 문의하기
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {showDeleteConfirm && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
//           <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)} />
//           <div className="relative bg-white w-full max-w-sm rounded-2xl p-6">
//             <h3 className="text-lg font-medium mb-2">예약을 삭제하시겠습니까?</h3>
//             <p className="text-gray-600 mb-6">삭제된 예약은 복구할 수 없습니다.</p>
//             <div className="flex gap-3">
//               <button
//                 onClick={() => setShowDeleteConfirm(false)}
//                 className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-500"
//               >
//                 취소
//               </button>
//               <button
//                 onClick={handleDeleteConfirm}
//                 className="flex-1 py-3 bg-red-500 text-white rounded-xl"
//               >
//                 삭제
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <LoginModal 
//         isOpen={isLoginModalOpen} 
//         onClose={() => setIsLoginModalOpen(false)} 
//       />
//     </div>
//   );
// };

// export default Profile;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import { useReservation } from '../contexts/ReservationContext';
import { faqData } from '../data/faqData';
import { useInterest } from '../contexts/InterestContext';
import LoginModal from '../components/LoginModal';
import { collection, query, where, getDocs, orderBy, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const Profile = () => {
  const { user, logout, openLoginModal } = useAuth();
  const { reservations, removeReservation } = useReservation();
  const { interests, removeInterest } = useInterest();
  const navigate = useNavigate();
  const [showPartnershipSheet, setShowPartnershipSheet] = useState(false);
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [faqContent, setFaqContent] = useState('');
  const [partnershipPhone, setPartnershipPhone] = useState('');
  const [partnershipContent, setPartnershipContent] = useState('');
  const [expandedFaqId, setExpandedFaqId] = useState(null);
  const [showFaqSection, setShowFaqSection] = useState(false);
  const [showReservationDetails, setShowReservationDetails] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [showInterests, setShowInterests] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [visitReservations, setVisitReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      if (!user) return;

      try {
        const q = query(
          collection(db, 'reservations'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const reservationList = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            // createdAt이나 visitDate가 존재할 때만 toDate() 호출
            visitDate: data.visitDate?.toDate?.() || new Date(),
            createdAt: data.createdAt?.toDate?.() || new Date()
          };
        });

        setVisitReservations(reservationList);
      } catch (error) {
        console.error('예약 정보 조회 중 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [user]);

  // 사용자 정보 불러오기
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.uid) return;

      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data());
          console.log('userData:', userDocSnap.data());
        }
      } catch (error) {
        console.error('사용자 정보 로드 실패:', error);
      }
    };

    fetchUserData();
  }, [user]);

  // FAQ 토글 함수
  const toggleFaq = (id) => {
    setExpandedFaqId(expandedFaqId === id ? null : id);
  };

  // 날짜 포맷 함수
  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
  };

  // 예약 삭제 확인 모달 표시
  const handleDeleteClick = (reservation) => {
    setSelectedReservation(reservation);
    setShowDeleteConfirm(true);
  };

  // 예약 삭제 실행
  const handleDeleteConfirm = async () => {
    if (!selectedReservation) return;

    try {
      // Firestore에서 예약 문서 삭제
      await deleteDoc(doc(db, 'reservations', selectedReservation.id));
      
      // 로컬 상태 업데이트
      setVisitReservations(prev => 
        prev.filter(reservation => reservation.id !== selectedReservation.id)
      );

      // 모달 닫기 및 상태 초기화
      setShowDeleteConfirm(false);
      setSelectedReservation(null);
      
      alert('예약이 취소되었습니다.');
    } catch (error) {
      console.error('예약 취소 중 오류:', error);
      alert('예약 취소 중 오류가 발생했습니다.');
    }
  };

  // 기존의 openLoginModal을 handleLoginClick으로 변경
  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  // 예약 삭제 함수
  const handleDeleteReservation = async (reservationId) => {
    if (!window.confirm('예약을 취소하시겠습니까?')) return;

    try {
      // Firestore에서 예약 문서 삭제
      await deleteDoc(doc(db, 'reservations', reservationId));
      
      // 로컬 상태 업데이트
      setVisitReservations(prev => 
        prev.filter(reservation => reservation.id !== reservationId)
      );

      alert('예약이 취소되었습니다.');
    } catch (error) {
      console.error('예약 취소 중 오류:', error);
      alert('예약 취소 중 오류가 발생했습니다.');
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header title="프로필" />
      
      <div className="flex-1 p-4 pb-20 overflow-auto">
        {user ? (
          <>
            <div className="bg-white rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="material-icons text-3xl text-gray-400">person</span>
                  </div>
                  <div>
                    <h2 className="font-medium text-lg">
                      {userData?.name || '이름 없음'}
                    </h2>
                    <p className="text-gray-500">
                      {userData?.phoneNumber || user?.phoneNumber || '전화번호 없음'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={logout}
                  className="px-4 py-2 text-gray-500 hover:bg-gray-50 rounded-lg"
                >
                  로그아웃
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl overflow-hidden mb-4">
              <button 
                onClick={() => navigate('/favorites')}
                className="w-full px-4 py-4 text-left text-gray-600 hover:bg-gray-50 flex justify-between items-center border-b"
              >
                <span>찜한차</span>
                <span className="material-icons text-gray-400">chevron_right</span>
              </button>

              <button 
                onClick={() => setShowReservationDetails(!showReservationDetails)}
                className="w-full px-4 py-4 text-left text-gray-600 hover:bg-gray-50 flex justify-between items-center border-b"
              >
                <span>예약 정보</span>
                <div className="flex items-center gap-2">
                  {visitReservations?.length > 0 && (
                    <span className="text-green-500">{visitReservations.length}건</span>
                  )}
                  <span className="material-icons text-gray-400">
                    {showReservationDetails ? 'expand_less' : 'expand_more'}
                  </span>
                </div>
              </button>
              {showReservationDetails && visitReservations?.length > 0 && (
                <div className="border-t px-4 py-2">
                  {visitReservations.map((reservation) => (
                    <div key={reservation.id} className="py-3 border-b last:border-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">{reservation.carName}</h3>
                          <p className="text-sm text-gray-500">
                            {formatDate(reservation.visitDate)} {reservation.time}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteClick(reservation)}
                          className="p-1 text-gray-400 hover:text-red-500"
                        >
                          <span className="material-icons text-sm">close</span>
                        </button>
                      </div>
                      <p className="text-sm text-gray-600">{reservation.address}</p>
                    </div>
                  ))}
                </div>
              )}

              <button 
                onClick={() => setShowInterests(!showInterests)}
                className="w-full px-4 py-4 text-left text-gray-600 hover:bg-gray-50 flex justify-between items-center"
              >
                <span>관심 차종</span>
                <div className="flex items-center gap-2">
                  {interests?.length > 0 && (
                    <span className="text-green-500">{interests.length}개</span>
                  )}
                  <span className="material-icons text-gray-400">
                    {showInterests ? 'expand_less' : 'expand_more'}
                  </span>
                </div>
              </button>
              {interests?.length > 0 && showInterests && (
                <div className="border-t px-4 py-2">
                  {interests.map((interest, index) => (
                    <div key={index} className="py-2 flex justify-between items-center">
                      <span className="text-sm">{interest}</span>
                      <button
                        onClick={() => removeInterest(interest)}
                        className="p-1 text-gray-400 hover:text-red-500"
                      >
                        <span className="material-icons text-sm">close</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl overflow-hidden mb-4">
              <div className="px-4 py-4 flex justify-between items-center border-b">
                <div>
                  <h3 className="font-medium mb-1">알림 설정</h3>
                  <p className="text-sm text-gray-500">
                    관심 차종이 등록되면 알림을 받아보세요😀
                  </p>
                </div>
                <button 
                  onClick={() => setNotificationEnabled(!notificationEnabled)}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-200 ease-in-out
                    ${notificationEnabled ? 'bg-green-500' : 'bg-gray-200'}`}
                >
                  <span 
                    className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out
                      ${notificationEnabled ? 'translate-x-6' : 'translate-x-0'}`}
                  />
                </button>
              </div>

              <button 
                onClick={() => setShowFaqSection(!showFaqSection)}
                className="w-full px-4 py-4 text-left text-gray-600 hover:bg-gray-50 flex justify-between items-center border-b"
              >
                <span>자주 묻는 질문</span>
                <span className="material-icons text-gray-400">
                  {showFaqSection ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {showFaqSection && (
                <div className="border-t px-4 py-2">
                  {faqData.map((faq, index) => (
                    <div key={index} className="py-2">
                      <button
                        onClick={() => toggleFaq(faq.id)}
                        className="w-full flex justify-between items-center py-2"
                      >
                        <span className="text-sm font-medium">{faq.question}</span>
                        <span className="material-icons text-gray-400">
                          {expandedFaqId === faq.id ? 'expand_less' : 'expand_more'}
                        </span>
                      </button>
                      {expandedFaqId === faq.id && (
                        <p className="text-sm text-gray-600 mt-2 pb-2 border-b">
                          {faq.answer}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <button 
                onClick={() => setShowPartnershipSheet(true)}
                className="w-full px-4 py-4 text-left text-gray-600 hover:bg-gray-50 flex justify-between items-center"
              >
                <span>제휴 제안</span>
                <span className="material-icons text-gray-400">chevron_right</span>
              </button>
            </div>

            <button 
              onClick={() => navigate('/listing/register')}
              className="w-full px-4 py-4 text-left text-gray-600 hover:bg-gray-50 flex justify-between items-center"
            >
              <span>매물 등록</span>
              <span className="material-icons text-gray-400">chevron_right</span>
            </button>
          </>
        ) : (
          <div className="text-center py-16 px-4">
            <div className="mb-6">
              <span className="material-icons text-4xl text-gray-300 mb-2">
                notifications_none
              </span>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                알림 설정하고 차량 찾기
              </h3>
              <p className="text-gray-500 leading-relaxed">
                원하는 차종이 등록되면<br/>
                가장 먼저 알림을 받아보세요!
              </p>
            </div>
            <div className="flex justify-center">
              <button
                onClick={handleLoginClick}
                className="w-full max-w-[200px] px-6 py-3 bg-[#333333] text-white rounded-xl font-medium hover:bg-black transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <span className="material-icons text-sm">login</span>
                로그인하기
              </button>
            </div>
          </div>
        )}
      </div>

      {showFaqModal && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="flex flex-col h-full">
            <div className="flex items-center p-4 border-b">
              <button
                onClick={() => setShowFaqModal(false)}
                className="material-icons text-gray-500"
              >
                close
              </button>
              <h2 className="text-lg font-medium ml-4">리볼트에서의 경험은 어떠셨나요?</h2>
            </div>
            <div className="flex-1 p-4">
              <p className="text-gray-600 mb-4">작성 내용은 리볼트 내부에만 공개됩니다.</p>
              <textarea
                value={faqContent}
                onChange={(e) => setFaqContent(e.target.value)}
                placeholder="솔직한 이야기를 들려주세요"
                className="w-full h-40 p-4 border border-gray-200 rounded-xl resize-none"
              />
            </div>
            <div className="p-4">
              <button 
                className="w-full py-4 bg-gray-100 text-gray-400 rounded-xl font-medium"
                onClick={() => {
                  // 의견 제출 로직
                  setShowFaqModal(false);
                }}
              >
                의견 남기기
              </button>
            </div>
          </div>
        </div>
      )}

      {showPartnershipSheet && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[500px] bg-white rounded-t-2xl">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-medium">제휴 제안</h2>
              <button
                onClick={() => setShowPartnershipSheet(false)}
                className="material-icons text-gray-500"
              >
                close
              </button>
            </div>
            <div className="p-4">
              <p className="text-gray-600 mb-4">
                제휴 및 광고 문의 내용을 남겨주시면 확인 후 연락드리겠습니다.
              </p>
              <div className="space-y-4">
                <input
                  type="tel"
                  value={partnershipPhone}
                  onChange={(e) => setPartnershipPhone(e.target.value)}
                  placeholder="휴대폰 번호를 입력해주세요"
                  className="w-full p-4 border border-gray-200 rounded-xl"
                />
                <textarea
                  value={partnershipContent}
                  onChange={(e) => setPartnershipContent(e.target.value)}
                  placeholder="문의하실 내용을 입력해주세요"
                  className="w-full h-40 p-4 border border-gray-200 rounded-xl resize-none"
                />
              </div>
              <button 
                className="w-full py-4 bg-[#333333] text-white rounded-xl font-medium mt-4"
                onClick={() => {
                  // 제휴 제안 제출 로직
                  setShowPartnershipSheet(false);
                }}
              >
                문의하기
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)} />
          <div className="relative bg-white w-full max-w-sm rounded-2xl p-6">
            <h3 className="text-lg font-medium mb-2">예약을 삭제하시겠습니까?</h3>
            <p className="text-gray-600 mb-6">삭제된 예약은 복구할 수 없습니다.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-500"
              >
                취소
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </div>
  );
};

export default Profile;