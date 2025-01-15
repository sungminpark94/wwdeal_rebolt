import React from 'react';

const Header = ({ title, left, right, className = '' }) => {
  return (
    <header className={`sticky top-0 z-50 bg-white border-b max-w-[488px]`}>
      <div className=" mx-auto relative">
        <div className="h-[56px] flex items-center justify-between relative px-4">
          <div className="absolute left-0">{left}</div>
          <h1 className="flex-1 text-center text-lg font-medium">{title}</h1>
          <div className="absolute right-0">{right}</div>
        </div>
      </div>
    </header>
  );
};

export default Header;
