import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { ReservationProvider } from './contexts/ReservationContext';
import { InterestProvider } from './contexts/InterestContext';
import { RecentViewProvider } from './contexts/RecentViewContext';
import NavigationBar from './components/NavigationBar';
import Home from './pages/Home';
import Listings from './pages/Listings';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import SellRegistration from './pages/SellRegistration';
import ListingRegistration from './pages/ListingRegistration';
import ListingDetail from './pages/ListingDetail';
import ListingEdit from './pages/ListingEdit';
import Header from './components/Header';
import ScrollToTop from './components/ScrollToTop';
import SellLanding from './pages/SellLanding';
import Footer from './components/Footer';

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/Profile" />;
};

function App() {
  return (
    <AuthProvider>
      <ReservationProvider>
        <FavoritesProvider>
          <InterestProvider>
            <RecentViewProvider>
              <BrowserRouter>
                <ScrollToTop />
                <div className="flex flex-col min-h-screen bg-gray-50">
                  <div className="mx-auto w-full max-w-[480px] flex-1 mb-32">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/listings" element={<Listings />} />
                      <Route path="/listings/:id" element={<ListingDetail />} />
                      <Route path="/favorites" element={<Favorites />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/sell" element={<SellLanding />} />
                      <Route path="/sell/registration" element={<SellRegistration />} />
                      <Route path="/listing/register" element={<ListingRegistration />} />
                      <Route path="/listing/:id" element={<ListingDetail />} />
                      <Route path="/listing/edit/:id" element={<ListingEdit />} />
                    </Routes>
                  <Footer />
                  <NavigationBar />
                  </div>
                </div>
              </BrowserRouter>
            </RecentViewProvider>
          </InterestProvider>
        </FavoritesProvider>
      </ReservationProvider>
    </AuthProvider>
  );
}

export default App;
