// ZKProofEngine.ts

import { Step } from '../types/Step';
import { ExecutionResult } from '../types/ExecutionResult';
import { ZKProof } from '../types/ZKProof';

export interface ZKProofEngine {
  generateProof(step: Step, result: ExecutionResult): Promise<ZKProof>;
  verifyProof(proof: ZKProof): Promise<boolean>;
  storeProof(proof: ZKProof): Promise<void>;
}
