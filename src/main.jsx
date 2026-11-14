
// تحويل الـ alert القديم إلى إشعارات Toasts جميلة
window.alert = (message) => {
  const msgStr = String(message);
  const isError = /فشل|خطأ|يرجى|ممنوع|error|fail|please|غير|لا يمكن/i.test(msgStr);
  
  if (isError) {
    toast.error(message, { 
      style: { fontFamily: 'Tajawal, sans-serif', fontWeight: 'bold', direction: 'rtl', fontSize: '14px' },
      duration: 4000 
    });
  } else {
    toast.success(message, { 
      style: { fontFamily: 'Tajawal, sans-serif', fontWeight: 'bold', direction: 'rtl', fontSize: '14px' },
      duration: 4000 
    });
  }
};

import { Toaster, toast } from 'react-hot-toast';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <>
      <Toaster position="top-center" />
      <App />
    </>
  </StrictMode>,
)
