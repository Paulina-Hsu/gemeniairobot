
import React from 'react';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ value, onChange, onSend, isLoading }) => {
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !isLoading && value.trim()) {
      onSend();
    }
  };

  return (
    <div className="bg-gray-800 p-4 border-t border-gray-700 sticky bottom-0">
      <div className="flex items-center space-x-3 max-w-3xl mx-auto">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="输入消息..."
          className="flex-grow p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors placeholder-gray-400 text-white"
          disabled={isLoading}
        />
        <button
          onClick={onSend}
          disabled={isLoading || !value.trim()}
          className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <>
              <i className="fas fa-paper-plane mr-2"></i>
              发送
            </>
          )}
        </button>
      </div>
    </div>
  );
};
