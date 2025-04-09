// chatSession.test.ts

// tests/chatSession.test.ts
import { ChatSession } from '../chat-engine/ChatSession';
import { ChatEvent } from '../chat-engine/ChatStates';

describe('ChatSession', () => {
  let messages: string[] = [];
  let session: ChatSession;

  beforeEach(() => {
    messages = [];
    session = new ChatSession((msg) => messages.push(msg));
  });

  test('complete flow execution', async () => {
    // Submit initial query
    await session.handleInput('Book flight, hotel, and visa');
    expect(messages.some(msg => msg.includes('Understood your intent'))).toBe(true);
    expect(messages.some(msg => msg.includes('Generated'))).toBe(true);

    // Select flow
    await session.handleInput('1');
    expect(messages.some(msg => msg.includes('Selected flow'))).toBe(true);
    expect(messages.some(msg => msg.includes('Missing Resources'))).toBe(true);

    // Submit resources
    await session.handleInput('flight-api: API_KEY_123');
    await session.handleInput('hotel-api: API_KEY_456');
    expect(messages.some(msg => msg.includes('All resources available'))).toBe(true);

    // Execute flow
    await session.handleInput('execute');
    expect(messages.some(msg => msg.includes('Flow executed successfully'))).toBe(true);
    expect(messages.some(msg => msg.includes('Summary'))).toBe(true);
  });
});
