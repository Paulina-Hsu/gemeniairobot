
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Message, Sender } from './types';
import { ChatInput } from './components/ChatInput';
import { MessageList } from './components/MessageList';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorDisplay } from './components/ErrorDisplay';
import { initializeChat, sendMessageStream } from './services/geminiService';
import { Chat } from '@google/genai';
import { AI_DISPLAY_NAME, USER_DISPLAY_NAME } from './constants';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const chatRef = useRef<Chat | null>(null);
  const currentAiMessageIdRef = useRef<string | null>(null);

  useEffect(() => {
    try {
      if (!process.env.API_KEY) {
        setError("API密钥未配置。请在环境变量中设置 API_KEY。");
        setIsLoading(false);
        return;
      }
      chatRef.current = initializeChat();
      // Optional: Add an initial greeting message from AI
      setMessages([
        {
          id: Date.now().toString(),
          text: '你好！我是您的AI助手，有什么可以帮助您的吗？',
          sender: Sender.AI,
          timestamp: Date.now(),
        },
      ]);
    } catch (e) {
      console.error("初始化聊天失败:", e);
      setError(e instanceof Error ? `初始化聊天失败: ${e.message}` : "初始化聊天时发生未知错误");
    }
  }, []);

  const handleSendMessage = useCallback(async () => {
    if (!currentInput.trim() || isLoading || !chatRef.current) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: currentInput.trim(),
      sender: Sender.User,
      timestamp: Date.now(),
    };
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setCurrentInput('');
    setIsLoading(true);
    setError(null);

    currentAiMessageIdRef.current = `ai-${Date.now()}`;
    const initialAiMessage: Message = {
      id: currentAiMessageIdRef.current,
      text: '',
      sender: Sender.AI,
      timestamp: Date.now(),
    };
    setMessages(prevMessages => [...prevMessages, initialAiMessage]);

    try {
      await sendMessageStream(
        chatRef.current,
        newUserMessage.text,
        (chunk) => {
          setMessages(prevMessages =>
            prevMessages.map(msg =>
              msg.id === currentAiMessageIdRef.current
                ? { ...msg, text: msg.text + chunk }
                : msg
            )
          );
        },
        () => { // onDone
          setIsLoading(false);
          currentAiMessageIdRef.current = null;
        },
        (err) => { // onError
          console.error("AI响应错误:", err);
          setError(`AI响应错误: ${err}`);
          setMessages(prevMessages => prevMessages.filter(msg => msg.id !== currentAiMessageIdRef.current)); // Remove partial AI message
          setIsLoading(false);
          currentAiMessageIdRef.current = null;
        }
      );
    } catch (e) {
      console.error("发送消息失败:", e);
      const errorMessage = e instanceof Error ? e.message : "发送消息时发生未知错误";
      setError(errorMessage);
      setMessages(prevMessages => prevMessages.filter(msg => msg.id !== currentAiMessageIdRef.current)); // Remove partial AI message
      setIsLoading(false);
      currentAiMessageIdRef.current = null;
    }
  }, [currentInput, isLoading]);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white antialiased">
      <header className="bg-gray-800 p-4 shadow-md sticky top-0 z-10">
        <h1 className="text-2xl font-semibold text-center text-sky-400">
          <i className="fas fa-robot mr-2"></i>Gemini 聊天机器人
        </h1>
      </header>

      {error && <ErrorDisplay message={error} onClose={() => setError(null)} />}

      <MessageList messages={messages} aiName={AI_DISPLAY_NAME} userName={USER_DISPLAY_NAME} />

      {isLoading && !currentAiMessageIdRef.current && <div className="p-4 flex justify-center"><LoadingSpinner /></div>}

      <ChatInput
        value={currentInput}
        onChange={setCurrentInput}
        onSend={handleSendMessage}
        isLoading={isLoading}
      />
    </div>
  );
};

export default App;
