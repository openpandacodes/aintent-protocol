// deepFlowExecution.test.ts

// tests/deepFlowExecution.test.ts
import { executeFlow } from '../chat-engine/mockEngine';
import { DeepFlow } from '../src/types/DeepFlow';

describe('DeepFlow Execution', () => {
  test('should execute travel booking flow', async () => {
    const mockFlow: DeepFlow = {
      id: 'flow-travel-1',
      name: 'Travel Booking Flow',
      description: 'Book flight, hotel and visa',
      goals: [
        {
          id: 'goal-1',
          objective: 'Book complete travel',
          dependencies: []
        }
      ],
      steps: [],
      requiredResources: ['flight-api', 'hotel-api', 'visa-api'],
      estimatedDuration: 3600
    };

    const result = await executeFlow(mockFlow, 'advanced');
    expect(result.success).toBe(true);
    
    expect(result.summary).toBeDefined();
    expect(result.summary?.flight).toBeDefined();
    expect(result.summary?.hotel).toBeDefined();
    expect(result.summary?.visa).toBeDefined();

    expect(result.proofChain).toBeDefined();
    expect(result.proofChain?.length).toBe(3);
    expect(result.proofChain?.[0]).toMatch(/^proof-flight-/);
    expect(result.proofChain?.[1]).toMatch(/^proof-hotel-/);
    expect(result.proofChain?.[2]).toMatch(/^proof-visa-/);
  });
});
