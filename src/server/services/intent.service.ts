import { ClaudeClient } from '../../core/clients/ClaudeClient';
import { Intent, IntentExecutionResult } from '../../types/intent';
import { DeepFlow } from '../../types/DeepFlow';

export class IntentService {
  constructor(private claudeClient: ClaudeClient) {}

  async processIntent(input: string): Promise<Intent> {
    return this.claudeClient.processIntent(input);
  }

  async executeIntent(intent: Intent): Promise<IntentExecutionResult> {
    return this.claudeClient.executeIntent(intent);
  }

  async getFlows(): Promise<DeepFlow[]> {
    // This would typically fetch flows from a database
    // For now, return an empty array
    return [];
  }
} 