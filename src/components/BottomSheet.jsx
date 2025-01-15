import React from "react";

const BottomSheet = ({ isOpen, onClose, children }) => {
  return (
    <>
      {/* 배경 오버레이 */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40"
          onClick={onClose}
        />
      )}
      
      {/* BottomSheet 내용 */}
      <div 
        className={`
          fixed left-1/2 -translate-x-1/2 w-full max-w-[500px] bg-white rounded-t-2xl z-50 transition-all duration-300
          ${isOpen ? 'bottom-0' : '-bottom-full'}
        `}
      >
        {children}
      </div>
    </>
  );
};

export default BottomSheet;
