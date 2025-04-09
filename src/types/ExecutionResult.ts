// ExecutionResult.ts

import { Step } from './Step';

export interface ExecutionResult {
    success: boolean;
    flowId?: string;
    completedSteps: Step[];
    proofChain?: string[];
    summary?: {
      flight?: any;
      hotel?: any;
      visa?: any;
      [key: string]: any;
    };
    error?: {
      message: string;
      step?: Step;
    };
  }
  