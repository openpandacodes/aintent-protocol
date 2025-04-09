export interface ZKProof {
  id: string;
  stepId: string;
  timestamp: number;
  proofData: {
    serviceName: string;
    action: string;
    parameters: Record<string, any>;
    result: any;
    signature: string;
  };
  verificationKey: string;
} 