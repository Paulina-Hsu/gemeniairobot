
import { GoogleGenAI, Chat } from '@google/genai';
import { GEMINI_MODEL_NAME, SYSTEM_INSTRUCTION } from '../constants';

let ai: GoogleGenAI | null = null;

const getAiInstance = (): GoogleGenAI => {
  if (!ai) {
    if (!process.env.API_KEY) {
      throw new Error("API密钥未在环境变量中配置。");
    }
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

export const initializeChat = (): Chat => {
  const genAI = getAiInstance();
  return genAI.chats.create({
    model: GEMINI_MODEL_NAME,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
       // For general chat, omit thinkingConfig or set to null to use default (enabled)
      // thinkingConfig: { thinkingBudget: 0 } // Example: disable thinking for low latency
    },
  });
};

export const sendMessageStream = async (
  chat: Chat,
  message: string,
  onChunk: (chunk: string) => void,
  onDone: () => void,
  onError: (error: string) => void
): Promise<void> => {
  try {
    const result = await chat.sendMessageStream({ message });
    for await (const chunk of result) {
      if (chunk.text) {
        onChunk(chunk.text);
      }
    }
    onDone();
  } catch (error) {
    console.error('Gemini API Error:', error);
    if (error instanceof Error) {
      onError(error.message);
    } else {
      onError('与AI通信时发生未知错误');
    }
  }
};
