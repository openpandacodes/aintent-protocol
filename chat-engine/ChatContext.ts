// ChatContext.ts

// chat-engine/ChatContext.ts
import { DeepIntent } from '../src/types/DeepIntent';
import { DeepFlow } from '../src/types/DeepFlow';

export class ChatContext {
  intent?: DeepIntent;
  flows?: DeepFlow[];
  selectedFlow?: DeepFlow;
  resources: Map<string, any>;

  constructor() {
    this.resources = new Map();
  }

  setIntent(intent: DeepIntent) {
    this.intent = intent;
  }

  setFlows(flows: DeepFlow[]) {
    this.flows = flows;
  }

  selectFlow(flowId: string) {
    this.selectedFlow = this.flows?.find(f => f.id === flowId);
  }

  addResource(id: string, resource: any) {
    this.resources.set(id, resource);
  }

  getResource(id: string) {
    return this.resources.get(id);
  }

  getMissingResources(): string[] {
    if (!this.selectedFlow) return [];
    return this.selectedFlow.requiredResources.filter(
      id => !this.resources.has(id)
    );
  }
}
