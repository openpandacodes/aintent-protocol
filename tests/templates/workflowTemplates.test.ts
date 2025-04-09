// workflowTemplates.test.ts

import { executeFlow } from '../../chat-engine/mockEngine';
import { DeepFlow } from '../../src/types/DeepFlow';

describe('Workflow Templates', () => {
  test('DeFi swap flow', async () => {
    const defiFlow: DeepFlow = {
      id: 'flow-defi-1',
      name: 'Token Swap Flow',
      description: 'Swap tokens on DeFi platform',
      goals: [
        {
          id: 'goal-1',
          objective: 'Swap tokens',
          dependencies: []
        }
      ],
      steps: [
        {
          id: 'step-1',
          name: 'Token Approval',
          description: 'Approve token spending',
          action: {
            type: 'approve',
            service: 'defi',
            parameters: {
              token: 'ETH',
              amount: '1.0'
            }
          },
          dependencies: [],
          status: 'pending'
        }
      ],
      requiredResources: ['wallet', 'defi-api'],
      estimatedDuration: 300
    };

    const result = await executeFlow(defiFlow, 'advanced');
    expect(result.success).toBe(true);
  });

  test('Shopping checkout flow', async () => {
    const shopFlow: DeepFlow = {
      id: 'flow-shop-1',
      name: 'Shopping Checkout',
      description: 'Complete shopping cart checkout',
      goals: [
        {
          id: 'goal-1',
          objective: 'Complete purchase',
          dependencies: []
        }
      ],
      steps: [
        {
          id: 'step-1',
          name: 'Payment',
          description: 'Process payment',
          action: {
            type: 'payment',
            service: 'checkout',
            parameters: {
              amount: 100,
              currency: 'USD'
            }
          },
          dependencies: [],
          status: 'pending'
        }
      ],
      requiredResources: ['payment-api'],
      estimatedDuration: 120
    };

    const result = await executeFlow(shopFlow, 'chat');
    expect(result.success).toBe(true);
  });

  test('Travel booking flow', async () => {
    const travelFlow: DeepFlow = {
      id: 'flow-travel-1',
      name: 'Travel Booking',
      description: 'Book flight, hotel and visa',
      goals: [
        {
          id: 'goal-1',
          objective: 'Complete travel booking',
          dependencies: []
        }
      ],
      steps: [
        {
          id: 'step-1',
          name: 'Flight Booking',
          description: 'Book flight tickets',
          action: {
            type: 'booking',
            service: 'flight',
            parameters: {
              from: 'DEL',
              to: 'LIS'
            }
          },
          dependencies: [],
          status: 'pending'
        }
      ],
      requiredResources: ['flight-api', 'hotel-api', 'visa-api'],
      estimatedDuration: 3600
    };

    const result = await executeFlow(travelFlow, 'advanced');
    expect(result.success).toBe(true);
    expect(result.proofChain).toBeDefined();
    expect(result.proofChain?.length).toBe(3);
    expect(result.proofChain?.[0]).toMatch(/proof-flight-/);
    expect(result.proofChain?.[1]).toMatch(/proof-hotel-/);
    expect(result.proofChain?.[2]).toMatch(/proof-visa-/);
  });
});

