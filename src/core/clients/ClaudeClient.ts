// ClaudeClient.ts

import { ChatClientBase } from '../ChatClientBase';
import { ChatMessage, ChatResponse, ChatClientConfig } from '../../types/ChatClient';
import { DeepIntent } from '../../types/DeepIntent';
import { Intent } from '../../types/intent';
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

export class ClaudeClient extends ChatClientBase {
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

  constructor(config?: Partial<ChatClientConfig>) {
    const defaultConfig: ChatClientConfig = {
      apiKey: window.env?.REACT_APP_CLAUDE_API_KEY || '',
      model: window.env?.REACT_APP_CLAUDE_MODEL || 'claude-3-opus',
      temperature: parseFloat(window.env?.REACT_APP_CLAUDE_TEMPERATURE || '0.7'),
      maxTokens: parseInt(window.env?.REACT_APP_CLAUDE_MAX_TOKENS || '4096', 10)
    };

    super('claude', '1.0', { ...defaultConfig, ...config });
  }

  async initialize(): Promise<void> {
    this.validateConfig();
    // Additional Claude-specific initialization if needed
  }

  async sendMessage(message: ChatMessage): Promise<ChatResponse> {
    // Implement Claude API call here
    const response = await this.callClaudeAPI(message);
    return this.parseClaudeResponse(response);
  }

  protected async extractIntent(response: ChatResponse): Promise<DeepIntent> {
    try {
      const intentData = JSON.parse(response.content);
      
      // Store the full response and metadata in the raw field
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

  async executeIntent(intent: Intent): Promise<any> {
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
      result: response.content
    };
  }

  private async callClaudeAPI(message: ChatMessage): Promise<any> {
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

  private parseClaudeResponse(response: any): ChatResponse {
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