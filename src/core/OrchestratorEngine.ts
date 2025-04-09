// OrchestratorEngine.ts

import { DeepFlow } from '../types/DeepFlow';
import { DeepIntent } from '../types/DeepIntent';
import { Step } from '../types/Step';
import { ChatClientBase } from './ChatClientBase';

export class OrchestratorEngine {
  private chatClient: ChatClientBase;

  constructor(chatClient: ChatClientBase) {
    this.chatClient = chatClient;
  }

  async generateWorkflows(intent: DeepIntent): Promise<DeepFlow[]> {
    const systemPrompt = `You are a workflow generation assistant. Given a user's intent, generate multiple possible workflow variations.
    Each workflow should be a valid sequence of steps that achieves the intent's goals.
    Consider different approaches, optimizations, and trade-offs.
    
    Format your response as a JSON array of workflows, where each workflow has:
    - name: descriptive name
    - description: detailed explanation
    - steps: array of steps with dependencies
    - requiredResources: array of required resources
    - estimatedDuration: estimated time in seconds`;

    const userPrompt = JSON.stringify({
      intent: intent.mainGoal.objective,
      subGoals: intent.subGoals.map(g => g.objective)
    });

    const response = await this.chatClient.sendMessage({
      role: 'user',
      content: userPrompt
    });

    try {
      const workflows = JSON.parse(response.content);
      return workflows.map((w: any) => ({
        id: `flow-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name: w.name,
        description: w.description,
        goals: [intent.mainGoal, ...intent.subGoals],
        steps: w.steps,
        requiredResources: w.requiredResources,
        estimatedDuration: w.estimatedDuration
      }));
    } catch (error) {
      console.error('Failed to parse workflow variations:', error);
      return [this.createDefaultWorkflow(intent)];
    }
  }

  private createDefaultWorkflow(intent: DeepIntent): DeepFlow {
    return {
      id: `flow-${Date.now()}`,
      name: 'Standard Flow',
      description: 'Standard workflow for the intent',
      goals: [intent.mainGoal, ...intent.subGoals],
      steps: [],
      requiredResources: [],
      estimatedDuration: 3600
    };
  }

  async createDAG(flow: DeepFlow): Promise<string> {
    return `
      digraph {
        ${flow.steps.map(step => `"${step.id}"`).join('\n')}
        ${flow.steps
          .filter(step => step.dependencies.length > 0)
          .map(step => 
            step.dependencies.map(dep => `"${dep}" -> "${step.id}"`)
          )
          .flat()
          .join('\n')
        }
      }
    `;
  }

  async generateDIML(flow: DeepFlow): Promise<string> {
    // Mock implementation - returns a DIML format
    return `
      <deepflow id="${flow.id}">
        <metadata>
          <name>${flow.name}</name>
          <description>${flow.description}</description>
        </metadata>
        <goals>
          ${flow.goals.map(goal => `
            <goal id="${goal.id}">
              <objective>${goal.objective}</objective>
            </goal>
          `).join('')}
        </goals>
        <steps>
          ${flow.steps.map(step => `
            <step id="${step.id}">
              <name>${step.name}</name>
              <description>${step.description}</description>
              <action>
                <type>${step.action.type}</type>
                <service>${step.action.service}</service>
              </action>
            </step>
          `).join('')}
        </steps>
      </deepflow>
    `;
  }
}
