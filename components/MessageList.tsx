
import React, { useEffect, useRef } from 'react';
import { Message } from '../types';
import { MessageItem } from './MessageItem';

interface MessageListProps {
  messages: Message[];
  aiName: string;
  userName: string;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, aiName, userName }) => {
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-grow overflow-y-auto p-6 space-y-6">
      {messages.map((msg) => (
        <MessageItem key={msg.id} message={msg} aiName={aiName} userName={userName} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};
