// ChatClient.ts

/**
 * Interface for chat-based AI clients (e.g., Claude, ChatGPT)
 * Provides a standard way to interact with different AI models
 * @interface ChatClient
 */
export interface ChatClient {
  /**
   * The name of the chat client (e.g., 'claude', 'chatgpt', etc.)
   * Used for identification and logging
   * @example "claude"
   */
  name: string;

  /**
   * The version of the chat client
   * Follows semantic versioning (major.minor.patch)
   * @example "1.0.0"
   */
  version: string;

  /**
   * Configuration for the chat client
   * Contains API keys, model settings, and other parameters
   */
  config: ChatClientConfig;

  /**
   * Initializes the chat client
   * Should be called before using any other methods
   * @throws {Error} If initialization fails (e.g., invalid API key)
   */
  initialize(): Promise<void>;

  /**
   * Sends a message to the AI model and receives a response
   * @param message - The message to send to the AI
   * @returns A promise that resolves to the AI's response
   * @throws {Error} If the API call fails
   */
  sendMessage(message: ChatMessage): Promise<ChatResponse>;
}

/**
 * Configuration options for chat clients
 * @interface ChatClientConfig
 */
export interface ChatClientConfig {
  /**
   * API key or authentication token for the service
   * Should be kept secure and not exposed in client-side code
   * @example "sk-1234567890abcdef"
   */
  apiKey: string;

  /**
   * Base URL for the chat client API
   * Optional - defaults to the standard API endpoint
   * @example "https://api.anthropic.com/v1"
   */
  baseUrl?: string;

  /**
   * Model to use for chat completion
   * @example "claude-3-opus" for Claude
   * @example "gpt-4" for ChatGPT
   */
  model?: string;

  /**
   * Maximum tokens for the response
   * Helps control response length and API costs
   * @example 4096
   */
  maxTokens?: number;

  /**
   * Temperature for response generation
   * Controls randomness: 0.0 = deterministic, 1.0 = creative
   * @example 0.7 for balanced responses
   */
  temperature?: number;
}

/**
 * Represents a message in the chat conversation
 * @interface ChatMessage
 */
export interface ChatMessage {
  /**
   * Role of the message sender
   * - 'user': Messages from the end user
   * - 'assistant': Messages from the AI
   * - 'system': System instructions or context
   */
  role: 'user' | 'assistant' | 'system';

  /**
   * Content of the message
   * For user messages, this is the input text
   * For assistant messages, this is the AI's response
   * For system messages, these are instructions
   * @example "What's the weather like today?"
   */
  content: string;
}

/**
 * Metadata associated with a chat response
 * @interface ChatResponseMetadata
 */
export interface ChatResponseMetadata {
  /**
   * The model used to generate the response
   * @example "claude-3-opus"
   */
  model?: string;

  /**
   * ISO timestamp of when the response was generated
   * @example "2024-03-20T15:30:00Z"
   */
  timestamp?: string;

  /**
   * Number of tokens used in the response
   * Useful for tracking API usage
   * @example 150
   */
  tokens?: number;

  /**
   * Additional model-specific metadata
   */
  [key: string]: unknown;
}

/**
 * Represents a response from the chat client
 * @interface ChatResponse
 */
export interface ChatResponse {
  /**
   * The processed content of the response
   * This is typically the main text response from the AI
   * @example "The weather today will be sunny with a high of 75°F"
   */
  content: string;

  /**
   * The raw response from the chat client
   * Useful for debugging and accessing model-specific features
   */
  rawResponse: {
    content: {
      text: string;
    };
    metadata?: Record<string, unknown>;
  };

  /**
   * Additional metadata about the response
   * Includes model info, timestamps, and usage statistics
   */
  metadata?: ChatResponseMetadata;
} 