// ChatSession.ts

// chat-engine/ChatSession.ts
import { ChatContext } from './ChatContext';
import { parseIntent, generateFlows, validateResources, executeFlow } from './mockEngine';
import { ExecutionResult } from '../src/types/ExecutionResult';

export class ChatSession {
  private context: ChatContext;
  private onMessage: (message: string) => void;

  constructor(onMessage: (message: string) => void) {
    this.context = new ChatContext();
    this.onMessage = onMessage;
  }

  private send(message: string) {
    this.onMessage(message);
  }

  async handleInput(input: string) {
    if (!this.context.intent) {
      // Parse intent if not already set
      const intent = await parseIntent(input);
      this.context.setIntent(intent);
      this.send(`Understood your intent: ${intent.mainGoal.objective}`);

      // Generate flows
      const flows = await generateFlows(intent);
      this.context.setFlows(flows);
      this.send(`Generated ${flows.length} DeepFlows. Choose one.`);
      flows.forEach((flow, i) => {
        this.send(`${i + 1}. ${flow.name}: ${flow.description}`);
      });
      return;
    }

    if (!this.context.selectedFlow) {
      // Select flow based on user choice
      const flowIndex = parseInt(input) - 1;
      if (this.context.flows && flowIndex >= 0 && flowIndex < this.context.flows.length) {
        const selectedFlow = this.context.flows[flowIndex];
        this.context.selectFlow(selectedFlow.id);
        this.send(`Selected flow: ${selectedFlow.name}`);

        // Check resources
        const missing = this.context.getMissingResources();
        if (missing.length > 0) {
          this.send(`Missing Resources: ${missing.join(', ')}. Please submit.`);
        } else {
          this.send('All resources available. Type "execute" to start.');
        }
      } else {
        this.send('Invalid flow selection. Please try again.');
      }
      return;
    }

    if (input.toLowerCase() === 'execute') {
      const result = await executeFlow(this.context.selectedFlow, 'advanced');
      if (result.success) {
        this.send('Flow executed successfully!');
        if (result.summary) {
          this.send('Summary:');
          Object.entries(result.summary).forEach(([key, value]) => {
            this.send(`${key}: ${JSON.stringify(value)}`);
          });
        }
      } else {
        this.send(`Execution failed: ${result.error?.message}`);
      }
      return;
    }

    // Handle resource submission
    const [resourceId, ...valueParts] = input.split(':');
    if (valueParts.length > 0) {
      const value = valueParts.join(':').trim();
      this.context.addResource(resourceId.trim(), value);
      this.send(`Resource ${resourceId} added.`);

      const missing = this.context.getMissingResources();
      if (missing.length === 0) {
        this.send('All resources available. Type "execute" to start.');
      } else {
        this.send(`Still missing: ${missing.join(', ')}`);
      }
    }
  }
}
