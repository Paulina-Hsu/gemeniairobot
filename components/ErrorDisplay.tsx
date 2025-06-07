
import React from 'react';

interface ErrorDisplayProps {
  message: string;
  onClose?: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="bg-red-700 border-l-4 border-red-500 text-red-100 p-4 m-4 rounded-md shadow-lg" role="alert">
      <div className="flex items-center">
        <div className="py-1">
          <svg className="fill-current h-6 w-6 text-red-300 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zM10 0a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0-4a1 1 0 0 1-1-1V6a1 1 0 1 1 2 0v4a1 1 0 0 1-1 1z"/>
          </svg>
        </div>
        <div>
          <p className="font-bold">发生错误</p>
          <p className="text-sm">{message}</p>
        </div>
        {onClose && (
           <button 
             onClick={onClose} 
             className="ml-auto -mx-1.5 -my-1.5 bg-red-700 text-red-200 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-600 inline-flex h-8 w-8"
             aria-label="Dismiss"
           >
            <span className="sr-only">关闭</span>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
          </button>
        )}
      </div>
    </div>
  );
};
