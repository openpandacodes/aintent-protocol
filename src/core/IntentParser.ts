// IntentParser.ts

import { DeepIntent } from '../types/DeepIntent';

export class IntentParser {
  static parse(raw: string): DeepIntent {
    return {
      id: 'intent-' + Math.random().toString(36).slice(2),
      raw,
      mainGoal: { id: 'goal-1', objective: 'Parse user intent', dependencies: [] },
      subGoals: []
    };
  }
}
