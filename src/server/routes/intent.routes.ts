import { Router } from 'express';
import { IntentController } from '../controllers/intent.controller';

const router = Router();
const intentController = new IntentController();

// Routes for intent processing
router.post('/process', intentController.processIntent);
router.post('/execute', intentController.executeIntent);
router.get('/flows', intentController.getFlows);

export { router as intentRouter }; 