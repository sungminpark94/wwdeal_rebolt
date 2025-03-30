import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

// Firebase 구성
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// 개발 환경에서 App Check 디버그 토큰 활성화
if (process.env.NODE_ENV === 'development') {
  window.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}

const recaptchaSiteKey = process.env.NODE_ENV === 'development'
  ? process.env.REACT_APP_RECAPTCHA_SITE_KEY_DEV
  : process.env.REACT_APP_RECAPTCHA_SITE_KEY_PROD;

// App Check 초기화 
const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider(recaptchaSiteKey),
  isTokenAutoRefreshEnabled: true
});

// Firebase 서비스 가져오기
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export { app, appCheck };