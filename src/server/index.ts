import express, { Request, Response } from 'express';
import cors from 'cors';
import { intentRouter } from './routes/intent.routes';

const app = express();
const port = process.env.PORT || 3001;

// Enable CORS for all routes
app.use(cors());  // TypeScript will infer the correct type
app.use(express.json());

// Routes
app.get('/health', (_req: Request, res: Response) => {
  res.send('OK');
});

app.use('/api/intent', intentRouter);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 