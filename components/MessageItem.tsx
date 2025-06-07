
import React from 'react';
import { Message, Sender } from '../types';

interface MessageItemProps {
  message: Message;
  aiName: string;
  userName: string;
}

const formatTimestamp = (timestamp: number): string => {
  return new Date(timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
};

export const MessageItem: React.FC<MessageItemProps> = ({ message, aiName, userName }) => {
  const isUser = message.sender === Sender.User;

  // Modified regex to use s{0,1} for optional 's'
  const renderTextWithLinks = (text: string): React.ReactNode => {
    const urlRegex = /(https{0,1}:\/\/[^\s]+)/g; // Changed s? to s{0,1}
    const parts = text.split(urlRegex);
    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={`${message.id}-link-${index}`} // More unique key
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-400 hover:text-sky-300 underline break-all"
          >
            {part}
          </a>
        );
      }
      // Preserve newlines and whitespace
      return part.split(/(\n)/).map((linePart, lineIndex) => 
        linePart === '\n' ? <br key={`${message.id}-br-${index}-${lineIndex}`} /> : linePart // More unique key
      );
    });
  };


  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xl lg:max-w-2xl px-5 py-3 rounded-xl shadow-md ${isUser ? 'bg-sky-600 text-white' : 'bg-gray-700 text-gray-100'}`}>
        <div className="flex items-center mb-1">
          <span className="font-semibold text-sm">
            {isUser ? userName : aiName}
          </span>
          <span className={`ml-2 text-xs ${isUser ? 'text-sky-200' : 'text-gray-400'}`}>
            {formatTimestamp(message.timestamp)}
          </span>
        </div>
        {message.text ? (
           <div className="prose prose-sm prose-invert max-w-none whitespace-pre-wrap break-words">
             {renderTextWithLinks(message.text)}
           </div>
        ) : (
          <div className="flex items-center justify-center p-2">
            <div className="animate-pulse flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <div 
                className="w-2 h-2 bg-gray-400 rounded-full" 
                style={{ animationDelay: '0.2s' }}
              ></div>
              <div 
                className="w-2 h-2 bg-gray-400 rounded-full" 
                style={{ animationDelay: '0.4s' }}
              ></div>
            </div>
            {/* <style jsx> block removed */}
          </div>
        )}
      </div>
    </div>
  );
};
