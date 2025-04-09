// ClaudeClient.ts

import { ChatClientBase } from '../ChatClientBase';
import { ChatMessage, ChatResponse, ChatClientConfig } from '../../types/ChatClient';
import { DeepIntent } from '../../types/DeepIntent';
import { Intent, IntentExecutionResult } from '../../types/intent';
import '../../types/env';

declare global {
  interface Window {
    env: {
      REACT_APP_CLAUDE_API_KEY?: string;
      REACT_APP_CLAUDE_MODEL?: string;
      REACT_APP_CLAUDE_TEMPERATURE?: string;
      REACT_APP_CLAUDE_MAX_TOKENS?: string;
    };
  }
}

/**
 * Response structure from the Claude API
 * @interface ClaudeAPIResponse
 */
interface ClaudeAPIResponse {
  /**
   * The content wrapper containing the response text
   */
  content: {
    /**
     * The actual text response from Claude
     */
    text: string;
  };
  /**
   * Optional metadata from the API response
   */
  metadata?: Record<string, unknown>;
}

/**
 * Client implementation for interacting with Anthropic's Claude AI model
 * Extends the base chat client with Claude-specific functionality
 * @class ClaudeClient
 * @extends ChatClientBase
 */
export class ClaudeClient extends ChatClientBase {
  /**
   * System prompt that guides Claude's behavior for intent extraction
   * @private
   */
  private systemPrompt = `You are an intent extraction assistant. Your task is to analyze user messages and extract their intent in a structured format.
  
  The intent should be clear, concise, and actionable. Consider the following:
  1. Main objective
  2. Sub-tasks or dependencies
  3. Required resources
  4. Constraints or preferences
  
  Format your response as a JSON object with the following structure:
  {
    "intent": "clear description of the main intent",
    "confidence": number between 0 and 1,
    "subTasks": ["list of sub-tasks"],
    "resources": ["list of required resources"],
    "constraints": ["list of constraints"]
  }`;

  /**
   * Creates a new instance of the Claude client
   * @param config - Optional configuration overrides
   */
  constructor(config?: Partial<ChatClientConfig>) {
    const defaultConfig: ChatClientConfig = {
      apiKey: window.env?.REACT_APP_CLAUDE_API_KEY || '',
      model: window.env?.REACT_APP_CLAUDE_MODEL || 'claude-3-opus',
      temperature: parseFloat(window.env?.REACT_APP_CLAUDE_TEMPERATURE || '0.7'),
      maxTokens: parseInt(window.env?.REACT_APP_CLAUDE_MAX_TOKENS || '4096', 10)
    };

    super('claude', '1.0', { ...defaultConfig, ...config });
  }

  /**
   * Initializes the Claude client
   * Validates the configuration and performs any necessary setup
   * @throws {Error} If the API key is missing or invalid
   */
  async initialize(): Promise<void> {
    this.validateConfig();
    // Additional Claude-specific initialization if needed
  }

  /**
   * Sends a message to Claude and receives a response
   * @param message - The message to send
   * @returns The response from Claude
   * @throws {Error} If the API call fails
   */
  async sendMessage(message: ChatMessage): Promise<ChatResponse> {
    const response = await this.callClaudeAPI(message);
    return this.parseClaudeResponse(response);
  }

  /**
   * Extracts structured intent information from Claude's response
   * @param response - The raw response from Claude
   * @returns A structured DeepIntent object
   * @throws {Error} If the response cannot be parsed
   * @protected
   */
  protected async extractIntent(response: ChatResponse): Promise<DeepIntent> {
    try {
      const intentData = JSON.parse(response.content);
      
      const rawData = {
        originalResponse: response.rawResponse,
        confidence: intentData.confidence,
        resources: intentData.resources,
        constraints: intentData.constraints,
        metadata: response.metadata
      };
      
      return {
        id: `intent-${Date.now()}`,
        raw: JSON.stringify(rawData),
        mainGoal: {
          id: 'goal-1',
          objective: intentData.intent,
          dependencies: []
        },
        subGoals: intentData.subTasks.map((task: string, index: number) => ({
          id: `goal-${index + 2}`,
          objective: task,
          dependencies: []
        }))
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to extract intent from Claude response: ${errorMessage}`);
    }
  }

  /**
   * Processes user input to extract intent
   * @param userInput - The raw user input to process
   * @returns A structured Intent object
   * @throws {Error} If intent extraction fails
   */
  async processIntent(userInput: string): Promise<Intent> {
    const message: ChatMessage = {
      role: 'user',
      content: userInput
    };

    const response = await this.sendMessage(message);
    const deepIntent = await this.extractIntent(response);

    return {
      id: deepIntent.id,
      action: deepIntent.mainGoal.objective,
      description: deepIntent.subGoals.map(goal => goal.objective).join(', '),
      parameters: JSON.parse(deepIntent.raw)
    };
  }

  /**
   * Executes a processed intent
   * @param intent - The intent to execute
   * @returns The result of the execution
   * @throws {Error} If execution fails
   */
  async executeIntent(intent: Intent): Promise<IntentExecutionResult> {
    const message: ChatMessage = {
      role: 'user',
      content: `Execute the following intent:
Action: ${intent.action}
Description: ${intent.description}
Parameters: ${JSON.stringify(intent.parameters, null, 2)}`
    };

    const response = await this.sendMessage(message);
    return {
      status: 'completed',
      result: response.content,
      metadata: response.metadata
    };
  }

  /**
   * Makes the actual API call to Claude
   * @param message - The message to send
   * @returns The raw API response
   * @throws {Error} If the API call fails
   * @private
   */
  private async callClaudeAPI(message: ChatMessage): Promise<ClaudeAPIResponse> {
    // Implement actual Claude API call
    // This is a placeholder implementation
    return {
      content: {
        text: JSON.stringify({
          intent: "Book a trip",
          confidence: 0.95,
          subTasks: ["Book flight", "Book hotel"],
          resources: ["flight-api", "hotel-api"],
          constraints: ["budget: $2000", "dates: flexible"]
        })
      }
    };
  }

  /**
   * Parses the raw Claude API response into our standard format
   * @param response - The raw API response
   * @returns A standardized ChatResponse object
   * @private
   */
  private parseClaudeResponse(response: ClaudeAPIResponse): ChatResponse {
    return {
      content: response.content.text,
      rawResponse: response,
      metadata: {
        model: this.config.model,
        timestamp: new Date().toISOString()
      }
    };
  }
}