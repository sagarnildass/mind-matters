// Modal.js
import React from 'react';

const Modal = ({ isOpen, children, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-80" onClick={onClose}></div>
      <div className="z-10 w-3/4 h-2/4 p-4 rounded-lg shadow-lg my-card-bg">
        {children}
      </div>
    </div>
  );
};

export default Modal;
