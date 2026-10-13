import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle, FiInfo } from 'react-icons/fi';
import { useBooking } from '../../context/BookingContext';

const Toast = () => {
  const { toast } = useBooking();

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#2B151F] text-white px-5 py-3 rounded-2xl shadow-2xl border border-rose-300/30 flex items-center gap-3 text-xs sm:text-sm font-bold backdrop-blur-md max-w-sm sm:max-w-md w-max"
        >
          {toast.type === 'success' && <FiCheckCircle className="text-emerald-400 text-lg shrink-0" />}
          {toast.type === 'error' && <FiAlertCircle className="text-rose-400 text-lg shrink-0" />}
          {toast.type === 'info' && <FiInfo className="text-amber-300 text-lg shrink-0" />}
          <span>{toast.message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
