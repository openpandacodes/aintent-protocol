// Step.ts

import { Action } from './Action';

export interface Step {
  id: string;
  name: string;
  description: string;
  action: {
    type: string;
    service: string;
    parameters: Record<string, any>;
  };
  dependencies: string[];
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  result?: any;
  proof?: string;
}
