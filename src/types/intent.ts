export interface Intent {
  id: string;
  action: string;
  description: string;
  parameters?: Record<string, any>;
  result?: any;
} 