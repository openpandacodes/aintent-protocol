// Goal.ts

export interface Goal {
    id: string;
    objective: string;
    dependencies: string[];
    constraints?: string[];
  }
  