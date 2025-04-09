// ChatStates.ts

// chat-engine/ChatStates.ts
export enum ChatState {
    USER_INPUT = 'USER_INPUT',
    INTENT_PARSED = 'INTENT_PARSED',
    FLOW_GENERATED = 'FLOW_GENERATED',
    EXECUTION_MODE_SELECTED = 'EXECUTION_MODE_SELECTED',
    RESOURCE_VALIDATION = 'RESOURCE_VALIDATION',
    WORKFLOW_EXECUTION = 'WORKFLOW_EXECUTION',
    RESULT_DELIVERED = 'RESULT_DELIVERED'
  }
  
  export type ChatEvent =
    | { type: 'SUBMIT_INPUT'; payload: string }
    | { type: 'CONFIRM_INTENT' }
    | { type: 'SELECT_FLOW'; payload: string }
    | { type: 'SELECT_MODE'; payload: 'chat' | 'advanced' }
    | { type: 'SUBMIT_RESOURCE_DATA'; payload: Record<string, any> }
    | { type: 'EXECUTE_WORKFLOW' };
  