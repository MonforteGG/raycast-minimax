import { useState, useCallback, useRef } from "react";
import { getPreferenceValues } from "@raycast/api";
import { Message } from "../providers/base";
import { MiniMaxProvider } from "../providers/minimax";
import { handleError } from "../utils/errors";

interface Preferences {
  minimaxApiKey: string;
  systemPrompt?: string;
  temperature: string;
  maxTokens: string;
  streamResponses: boolean;
}

interface UseChatReturn {
  streamingContent: string;
  isLoading: boolean;
  sendMessage: (messages: Message[]) => Promise<Message | null>;
  stopGeneration: () => void;
}

export function useChat(): UseChatReturn {
  const [streamingContent, setStreamingContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef(false);

  const getProvider = useCallback(() => {
    const prefs = getPreferenceValues<Preferences>();
    return new MiniMaxProvider({
      apiKey: prefs.minimaxApiKey,
      temperature: parseFloat(prefs.temperature),
      maxTokens: parseInt(prefs.maxTokens),
      systemPrompt: prefs.systemPrompt,
    });
  }, []);

  const sendMessage = useCallback(
    async (messages: Message[]): Promise<Message | null> => {
      if (isLoading) return null;

      const prefs = getPreferenceValues<Preferences>();
      const provider = getProvider();
      abortRef.current = false;

      setIsLoading(true);
      setStreamingContent("");

      try {
        if (prefs.streamResponses) {
          return new Promise((resolve) => {
            let fullResponse = "";

            provider.chatStream(
              { messages },
              {
                onToken: (token) => {
                  if (abortRef.current) return;
                  fullResponse += token;
                  setStreamingContent(fullResponse);
                },
                onComplete: (response) => {
                  if (abortRef.current) {
                    setStreamingContent("");
                    setIsLoading(false);
                    resolve(null);
                    return;
                  }
                  const assistantMessage: Message = {
                    role: "assistant",
                    content: response,
                  };
                  setStreamingContent("");
                  setIsLoading(false);
                  resolve(assistantMessage);
                },
                onError: async (error) => {
                  setIsLoading(false);
                  setStreamingContent("");
                  await handleError(error);
                  resolve(null);
                },
              },
            );
          });
        } else {
          const response = await provider.chat({ messages });
          const assistantMessage: Message = {
            role: "assistant",
            content: response.content,
          };
          setIsLoading(false);
          return assistantMessage;
        }
      } catch (error) {
        setIsLoading(false);
        setStreamingContent("");
        await handleError(error);
        return null;
      }
    },
    [isLoading, getProvider],
  );

  const stopGeneration = useCallback(() => {
    abortRef.current = true;
    setIsLoading(false);
    setStreamingContent("");
  }, []);

  return {
    streamingContent,
    isLoading,
    sendMessage,
    stopGeneration,
  };
}
