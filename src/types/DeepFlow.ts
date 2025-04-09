// DeepFlow.ts

import { Resource } from './Resource';
import { Step } from './Step';
import { Goal } from './Goal';

export interface DeepFlow {
  id: string;
  name: string;
  description: string;
  goals: Goal[];
  steps: Step[];
  requiredResources: string[];
  estimatedDuration: number;
  proofChain?: string[];
  summary?: {
    flight?: any;
    hotel?: any;
    visa?: any;
    [key: string]: any;
  };
}

export { Goal } from './Goal';
export { DeepIntent } from './DeepIntent';
