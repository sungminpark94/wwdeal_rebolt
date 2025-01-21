import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);  // 경로가 변경될 때마다 실행

  return null;  // 이 컴포넌트는 UI를 렌더링하지 않음
};

export default ScrollToTop; 