import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import BottomCTA from "../components/BottomCTA";
import { useFavorites } from "../contexts/FavoritesContext";

const defaultCarImage = '/images/default-car.png';

const getValidImageUrl = (imageUrl) => {
  if (!imageUrl) return defaultCarImage;
  if (imageUrl.startsWith('http')) return imageUrl;
  if (imageUrl.startsWith('/')) return imageUrl;
  return defaultCarImage;
};

const Favorites = () => {
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorites();
  const [activeTab, setActiveTab] = useState("favorites");
  const [recentViewed] = useState([]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-28">
      <Header title={activeTab === "favorites" ? "찜한 차" : "최근 본 차"} />
      
      {/* 탭 네비게이션 */}
      <div className="bg-white border-b border-gray-200">
        <div>
          <div className="flex">
            <button
              className={`flex-1 py-3.5 text-sm font-medium relative ${
                activeTab === "favorites" ? "text-green-500" : "text-gray-600"
              }`}
              onClick={() => setActiveTab("favorites")}
            >
              찜한 차
              {activeTab === "favorites" && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600" />
              )}
            </button>
            <button
              className={`flex-1 py-3.5 text-sm font-medium relative ${
                activeTab === "recent" ? "text-green-500" : "text-gray-600"
              }`}
              onClick={() => setActiveTab("recent")}
            >
              최근 본 차
              {activeTab === "recent" && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 매물 목록 */}
      <div className="flex-1 py-3 pb-24">
        <div className="grid gap-3">
          {(activeTab === "favorites" ? favorites : recentViewed).map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer"
              onClick={() => navigate(`/listing/${item.id}`)}
            >
              <div className="relative">
                <img
                  src={getValidImageUrl(item.images?.[0])}
                  alt={item.name || '차량 이미지'}
                  className="w-full aspect-[4/3] object-cover"
                  onError={(e) => {
                    e.target.src = defaultCarImage;
                    e.target.onerror = null;
                  }}
                />
                <button 
                  className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(item);
                  }}
                >
                  <span className="material-icons text-red-500">favorite</span>
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-medium mb-1">{item.title}</h3>
                <div className="text-sm text-gray-500 mb-2">
                  <span>{item.year}년</span>
                  <span className="mx-1">•</span>
                  <span>{Number(item.mileage).toLocaleString()}km</span>
                </div>
                <p className="text-green-600 font-medium">
                  {item.price ? `${Number(item.price).toLocaleString()}만원` : '가격문의'}
                </p>
              </div>
            </div>
          ))}
          
          {activeTab === "favorites" && (!favorites || favorites.length === 0) && (
            <div className="text-center py-16">
              <p className="text-gray-500">찜한 매물이 없습니다.</p>
            </div>
          )}
        </div>
      </div>

      <BottomCTA />
    </div>
  );
};

export default Favorites;
