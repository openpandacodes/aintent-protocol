// DeepIntent.ts

import { Goal } from './Goal';

export interface DeepIntent {
    id: string;
    raw: string;
    mainGoal: Goal;
    subGoals: Goal[];
  }
  