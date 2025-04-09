// ChatClient.ts

export interface ChatClient {
  /**
   * The name of the chat client (e.g., 'claude', 'chatgpt', etc.)
   */
  name: string;

  /**
   * The version of the chat client
   */
  version: string;

  /**
   * Configuration for the chat client
   */
  config: ChatClientConfig;

  initialize(): Promise<void>;
  sendMessage(message: ChatMessage): Promise<ChatResponse>;
}

export interface ChatClientConfig {
  /**
   * API key or authentication token
   */
  apiKey: string;

  /**
   * Base URL for the chat client API
   */
  baseUrl?: string;

  /**
   * Model to use for chat completion
   */
  model?: string;

  /**
   * Maximum tokens for the response
   */
  maxTokens?: number;

  /**
   * Temperature for response generation
   */
  temperature?: number;
}

export interface ChatMessage {
  /**
   * Role of the message sender (user, assistant, or system)
   */
  role: 'user' | 'assistant' | 'system';

  /**
   * Content of the message
   */
  content: string;
}

export interface ChatResponse {
  /**
   * The content of the response
   */
  content: string;

  /**
   * The raw response from the chat client
   */
  rawResponse: any;

  /**
   * Any additional metadata from the response
   */
  metadata?: Record<string, any>;
} 