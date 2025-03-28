import React, { useState } from 'react';
import { getAuth, signInWithCredential, OAuthProvider } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const KakaoLoginModal = ({ isOpen, onClose }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleKakaoLogin = async () => {
    try {
      setLoading(true);
      setError(null);

      // 카카오톡 SDK 초기화
      window.Kakao.init('YOUR_KAKAO_APP_KEY'); // 카카오 앱 키 입력

      // 카카오톡 로그인
      window.Kakao.Auth.login({
        success: async (authObj) => {
          const token = authObj.access_token;

          // 사용자 정보 요청
          const userInfo = await window.Kakao.API.request({
            url: '/v2/user/me',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          // Firebase에 카카오톡 사용자 등록
          const credential = OAuthProvider.credential(token);
          const auth = getAuth();
          const userCredential = await signInWithCredential(auth, credential);

          // Firebase 사용자 정보 업데이트
          const user = userCredential.user;
          await user.updateProfile({
            displayName: userInfo.properties.nickname,
            photoURL: userInfo.properties.profile_image,
          });

          // Firestore에 사용자 정보 저장
          const db = getFirestore();
          const userRef = doc(db, 'users', user.uid);
          await setDoc(userRef, {
            name: userInfo.properties.nickname,
            email: userInfo.kakao_account.email,
            profilePicture: userInfo.properties.profile_image,
            createdAt: new Date(),
          });

          alert('로그인 성공');
          onClose();
        },
        fail: (err) => {
          console.error('Kakao login failed:', err);
          setError('카카오톡 로그인에 실패했습니다.');
        },
      });
    } catch (error) {
      console.error('Error during Kakao login:', error);
      setError('로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">카카오톡 로그인</h2>
          <button onClick={onClose} className="text-gray-500">
            <span className="material-icons">close</span>
          </button>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleKakaoLogin}
            className="w-full mt-4 bg-yellow-500 text-white py-3 rounded-lg font-bold hover:bg-yellow-400"
            disabled={loading}
          >
            {loading ? '로그인 중...' : '카카오톡으로 로그인'}
          </button>

          {error && (
            <p className="text-red-500 mt-2">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default KakaoLoginModal; 