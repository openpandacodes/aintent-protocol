// ChatClientBase.ts

import { ChatClient, ChatClientConfig, ChatMessage, ChatResponse } from '../types/ChatClient';
import { DeepIntent } from '../types/DeepIntent';

export abstract class ChatClientBase implements ChatClient {
  name: string;
  version: string;
  config: ChatClientConfig;

  constructor(name: string, version: string, config: ChatClientConfig) {
    this.name = name;
    this.version = version;
    this.config = config;
  }

  /**
   * Initialize the chat client
   */
  abstract initialize(): Promise<void>;

  /**
   * Send a message to the chat client and get a response
   */
  abstract sendMessage(message: ChatMessage): Promise<ChatResponse>;

  /**
   * Extract intent from a chat response
   */
  protected abstract extractIntent(response: ChatResponse): Promise<DeepIntent>;

  /**
   * Process a user message and return a DeepIntent
   */
  async processMessage(message: string): Promise<DeepIntent> {
    const chatMessage: ChatMessage = {
      role: 'user',
      content: message
    };

    const response = await this.sendMessage(chatMessage);
    return this.extractIntent(response);
  }

  /**
   * Validate the chat client configuration
   */
  protected validateConfig(): void {
    if (!this.config.apiKey) {
      throw new Error('API key is required for chat client');
    }
  }
} 