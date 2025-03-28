import { useState, useEffect } from 'react';

const ImageViewer = ({ images, initialIndex = 0, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [touchStart, setTouchStart] = useState(null);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // 배경 클릭으로 모달 닫기
  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // 모바일 스와이프 처리
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!touchStart) return;

    const currentTouch = e.touches[0].clientX;
    const diff = touchStart - currentTouch;

    // 스와이프 거리가 50px 이상일 때만 처리
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // 왼쪽으로 스와이프
        handleNext();
      } else {
        // 오른쪽으로 스와이프
        handlePrevious();
      }
      setTouchStart(null);
    }
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
  };

  const handlePrevious = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center touch-none"
      onClick={handleBackgroundClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 닫기 버튼 */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 z-50 text-white p-2 w-10 h-10 flex items-center justify-center"
      >
        <span className="material-icons text-3xl">close</span>
      </button>

      {/* 이미지 영역 */}
      <div className="relative w-full h-full flex items-center justify-center">
        <img
          src={images[currentIndex]}
          alt={`이미지 ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain select-none"
          draggable="false"
        />

        {/* 이전/다음 버튼 (모바일에서는 숨김) */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-2 hidden md:block"
            >
              <span className="material-icons text-3xl">chevron_left</span>
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-2 hidden md:block"
            >
              <span className="material-icons text-3xl">chevron_right</span>
            </button>
          </>
        )}

        {/* 이미지 카운터 */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
};

export default ImageViewer; 