import { DeepFlow } from '../types/DeepFlow';
import { ExecutionResult } from '../types/ExecutionResult';
import { Step } from '../types/Step';
import { ChatClientBase } from './ChatClientBase';

export class AgentExecutor {
  private chatClient: ChatClientBase;
  private context: Map<string, any>;

  constructor(chatClient: ChatClientBase) {
    this.chatClient = chatClient;
    this.context = new Map();
  }

  async execute(flow: DeepFlow): Promise<ExecutionResult> {
    try {
      const completedSteps: Step[] = [];
      const proofChain: string[] = [];

      // Execute each step in sequence
      for (const step of flow.steps) {
        const result = await this.executeStep(step);
        completedSteps.push(step);
        proofChain.push(result.proof);
        
        // Update context with step results
        this.context.set(step.id, result.output);
      }

      return {
        success: true,
        flowId: flow.id,
        completedSteps,
        proofChain,
        summary: this.generateSummary(flow, completedSteps)
      };
    } catch (error) {
      return {
        success: false,
        flowId: flow.id,
        completedSteps: [],
        error: {
          message: error instanceof Error ? error.message : 'Unknown error occurred'
        }
      };
    }
  }

  private async executeStep(step: Step): Promise<{ output: any; proof: string }> {
    const systemPrompt = `You are an agent executing a workflow step.
    Your task is to perform the action described in the step.
    You have access to the current context and can use it to inform your decisions.
    
    Format your response as a JSON object with:
    - output: the result of the action
    - proof: a proof of execution`;

    const userPrompt = JSON.stringify({
      step: {
        name: step.name,
        description: step.description,
        action: step.action
      },
      context: Object.fromEntries(this.context)
    });

    const response = await this.chatClient.sendMessage({
      role: 'user',
      content: userPrompt
    });

    try {
      const result = JSON.parse(response.content);
      return {
        output: result.output,
        proof: result.proof
      };
    } catch (error) {
      throw new Error(`Failed to execute step ${step.id}: ${error}`);
    }
  }

  private generateSummary(flow: DeepFlow, completedSteps: Step[]): Record<string, any> {
    return {
      flowName: flow.name,
      completedSteps: completedSteps.length,
      totalSteps: flow.steps.length,
      duration: flow.estimatedDuration,
      results: Object.fromEntries(this.context)
    };
  }
} 