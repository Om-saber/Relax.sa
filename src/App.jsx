import React from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { BookingProvider } from './context/BookingContext';
import AppRoutes from './routes/AppRoutes';
import './App.css';

function App() {
  return (
    <LanguageProvider>
      <BookingProvider>
        <AppRoutes />
      </BookingProvider>
    </LanguageProvider>
  );
}

export default App;
