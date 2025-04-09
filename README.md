// README.md

# 🤖 Aintent Protocol

> A TypeScript-based protocol for intelligent intent parsing and workflow orchestration. This project provides a robust framework for understanding user intents through various chat clients (like Claude, ChatGPT), generating appropriate workflows, and executing them with proper resource management and verification.

[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Tests](https://github.com/openpandacodes/aintent-protocol/actions/workflows/test.yml/badge.svg)](https://github.com/openpandacodes/aintent-protocol/actions/workflows/test.yml)

## 🌟 Features

- **Multi-LLM Support**: Integrate with multiple chat clients (Claude, ChatGPT, etc.)
- **Intent Understanding**: Parse natural language queries into structured intents
- **Workflow Generation**: Convert intents into executable workflows
- **Resource Management**: Track and validate required resources
- **Execution Engine**: Execute workflows with proper error handling
- **Proof Chain**: Generate and verify execution proofs
- **Mock APIs**: Includes mock implementations for common services

## 🏗️ Architecture

The project is structured into several key components:

### Core Components

```
src/
├── core/               # Core engine components
│   ├── ChatClientBase.ts     # Base chat client interface
│   ├── clients/             # LLM client implementations
│   ├── Executor.ts         # Workflow execution engine
│   ├── IntentParser.ts     # Intent parsing logic
│   ├── OrchestratorEngine.ts # Workflow orchestration
│   └── ResourceManager.ts   # Resource management
├── types/              # Type definitions
└── widgets/            # UI components
```

### Chat Engine

```
chat-engine/
├── ChatContext.ts     # Chat state management
├── ChatSession.ts     # Chat session handling
├── ChatStates.ts      # Chat state definitions
└── mock-apis/         # Mock API implementations
```

## 🚀 Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/openpandacodes/aintent-protocol.git
cd aintent-protocol

# Install dependencies
pnpm install

# Build the project
pnpm run build

# Run tests
pnpm test
```

### Basic Usage

```typescript
import { ClaudeClient } from './src/core/clients/ClaudeClient';

// Initialize chat client
const client = new ClaudeClient({
  apiKey: 'your-api-key',
  model: 'claude-3-opus',
  temperature: 0.7
});

// Process user message
const intent = await client.processMessage(
  'Book a flight to Lisbon and a hotel for 3 nights'
);

// The intent will be structured as:
{
  id: 'intent-123',
  raw: '...',
  mainGoal: {
    id: 'goal-1',
    objective: 'Book a trip to Lisbon',
    dependencies: []
  },
  subGoals: [
    {
      id: 'goal-2',
      objective: 'Book flight to Lisbon',
      dependencies: []
    },
    {
      id: 'goal-3',
      objective: 'Book hotel for 3 nights',
      dependencies: ['goal-2']
    }
  ]
}
```

## 🔧 Configuration

### Chat Client Configuration

```typescript
interface ChatClientConfig {
  apiKey: string;
  baseUrl?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}
```

### Environment Variables

Create a `.env` file in the root directory:

```env
CLAUDE_API_KEY=your-claude-api-key
OPENAI_API_KEY=your-openai-api-key
```

## 🧪 Testing

The project includes comprehensive tests:

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

## 📚 Documentation

### Intent Structure

The `DeepIntent` interface represents parsed user intents:

```typescript
interface DeepIntent {
  id: string;
  raw: string;
  mainGoal: Goal;
  subGoals: Goal[];
}
```

### Workflow Structure

The `DeepFlow` interface represents executable workflows:

```typescript
interface DeepFlow {
  id: string;
  name: string;
  description: string;
  goals: Goal[];
  steps: Step[];
  requiredResources: string[];
  estimatedDuration: number;
  proofChain?: string[];
}
```

## 🛣️ Roadmap

- [ ] Add support for more LLM providers
- [ ] Implement parallel workflow execution
- [ ] Add workflow visualization tools
- [ ] Create plugin system for custom actions
- [ ] Add support for workflow templates
- [ ] Implement resource caching
- [ ] Add performance monitoring
- [ ] Create web interface

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

OpenPanda
- GitHub: [@openpandacodes](https://github.com/openpandacodes)

## 🙏 Acknowledgments

- Thanks to all contributors who have helped shape this project
- Special thanks to the TypeScript and Node.js communities