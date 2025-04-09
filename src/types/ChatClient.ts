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
   * Role of the message sender (user or assistant)
   */
  role: 'user' | 'assistant';

  /**
   * Content of the message
   */
  content: string;

  /**
   * Optional metadata about the message
   */
  metadata?: Record<string, any>;
}

export interface ChatResponse {
  /**
   * The raw response from the chat client
   */
  rawResponse: any;

  /**
   * The extracted intent from the response
   */
  intent: string;

  /**
   * Confidence score of the intent extraction
   */
  confidence: number;

  /**
   * Any additional metadata from the response
   */
  metadata?: Record<string, any>;
} 