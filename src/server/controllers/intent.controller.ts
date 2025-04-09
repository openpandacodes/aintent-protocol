import { Request, Response } from 'express';
import { IntentService } from '../services/intent.service';
import { Intent, IntentExecutionResult } from '../../types/intent';

export class IntentController {
  constructor(private intentService: IntentService) {}

  async processIntent(req: Request, res: Response): Promise<void> {
    try {
      const { input } = req.body;
      const intent = await this.intentService.processIntent(input);
      res.json(intent);
    } catch (error) {
      console.error('Error processing intent:', error);
      res.status(500).json({ error: 'Failed to process intent' });
    }
  }

  async executeIntent(req: Request, res: Response): Promise<void> {
    try {
      const intent = req.body as Intent;
      const result: IntentExecutionResult = await this.intentService.executeIntent(intent);
      res.json(result);
    } catch (error) {
      console.error('Error executing intent:', error);
      res.status(500).json({ error: 'Failed to execute intent' });
    }
  }

  async getFlows(req: Request, res: Response): Promise<void> {
    try {
      const flows = await this.intentService.getFlows();
      res.json(flows);
    } catch (error) {
      console.error('Error getting flows:', error);
      res.status(500).json({ error: 'Failed to get flows' });
    }
  }
} 