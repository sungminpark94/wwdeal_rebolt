import React, { createContext, useContext, useState } from 'react';

const ReservationContext = createContext();

export const useReservation = () => {
  return useContext(ReservationContext);
};

export const ReservationProvider = ({ children }) => {
  const [reservations, setReservations] = useState([]);

  const addReservation = (reservation) => {
    setReservations(prev => [...prev, reservation]);
  };

  const removeReservation = (reservationToRemove) => {
    setReservations(prev => 
      prev.filter(reservation => 
        reservation.date !== reservationToRemove.date || 
        reservation.time !== reservationToRemove.time
      )
    );
  };

  const value = {
    reservations,
    addReservation,
    removeReservation
  };

  return (
    <ReservationContext.Provider value={value}>
      {children}
    </ReservationContext.Provider>
  );
}; 