import React from 'react';

const LoadingSpinner = ({ text = 'Loading...' }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5 my-5">
      <div
        className="spinner-border text-primary"
        role="status"
        style={{
          width: '3.2rem',
          height: '3.2rem',
          color: '#8b5cf6',
          boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)',
        }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3 text-secondary small fw-medium">{text}</p>
    </div>
  );
};

export default LoadingSpinner;
