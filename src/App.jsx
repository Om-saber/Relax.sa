import React from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { BookingProvider } from './context/BookingContext';
import { AuthProvider } from './context/AuthContext';
import { AdminProvider } from './context/AdminContext';
import AppRoutes from './routes/AppRoutes';
import './App.css';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AdminProvider>
          <BookingProvider>
            <AppRoutes />
          </BookingProvider>
        </AdminProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
