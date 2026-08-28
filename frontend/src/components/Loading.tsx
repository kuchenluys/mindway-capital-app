import React from 'react';

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export const Spinner: React.FC<LoadingProps> = ({ message = 'Cargando...', fullScreen = false }) => {
  const spinner = (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-12 h-12 mb-4">
        <div className="absolute inset-0 rounded-full border-2 border-dark-700"></div>
        <div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary-500 border-r-primary-500 animate-spin"
        ></div>
      </div>
      {message && <p className="text-dark-400 text-sm">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export const SkeletonLoader: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-dark-700 rounded-lg h-20"></div>
        </div>
      ))}
    </div>
  );
};

export const LoadingOverlay: React.FC<{ isLoading: boolean; message?: string }> = ({
  isLoading,
  message,
}) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <Spinner message={message} />
    </div>
  );
};

export default Spinner;
