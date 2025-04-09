// README.md

# �� Aintent Protocol

> A TypeScript-based protocol for mapping chat queries to Deep Intent and creating executable workflows. This project provides a framework for understanding user intents, generating appropriate workflows, and executing them with proper resource management and verification.

---

## 🏗️ Project Structure

/src # Protocol logic (parser, orchestrator, executor) ├── core # Core engines ├── types # Intent + flow types ├── widgets # CLI / UI widget modules

/chat-engine # State machine & test mocks /tests # Workflow simulation tests


---

## 🚀 Getting Started

```bash
pnpm install
pnpm test

✅ Run Tests

pnpm test
pnpm test:watch
pnpm test:coverage

📦 Features
DeepIntent parsing & execution

Modular test workflows: DeFi, Travel, Shopping, Scheduling

ZK-style proof mocks per workflow step

GitHub Actions CI integration

📡 Coming Soon
CLI (aintent parse, aintent run)

.diml + DAG file generation

Graph-based UI via FlowViewerWidget

👤 Author
openpandacodes
GitHub: @openpandacodes

🛡️ License
MIT

## Features

- **Intent Understanding**: Parse natural language queries into structured intents
- **Workflow Generation**: Convert intents into executable workflows
- **Resource Management**: Track and validate required resources
- **Execution Engine**: Execute workflows with proper error handling
- **Proof Chain**: Generate and verify execution proofs
- **Mock APIs**: Includes mock implementations for common services

## Architecture

The project is structured into several key components:

### Core Components

- **DeepIntent**: Represents user intents with main and sub-goals
- **DeepFlow**: Defines executable workflows with steps and resources
- **ExecutionResult**: Tracks workflow execution results and proofs
- **Step**: Represents individual actions in a workflow
- **ZKProof**: Provides zero-knowledge proof verification

### Engine Components

- **OrchestratorEngine**: Generates and manages workflows
- **Executor**: Executes workflow steps and manages state
- **ChatSession**: Handles user interaction and context management
- **ChatContext**: Maintains conversation state and resources

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/aintent-protocol.git
cd aintent-protocol

# Install dependencies
pnpm install

# Build the project
pnpm run build

# Run tests
pnpm test
```

## Usage

### Basic Workflow

```typescript
import { ChatSession } from './chat-engine/ChatSession';

// Create a chat session
const session = new ChatSession((message) => {
  console.log(message);
});

// Handle user input
await session.handleInput('Book a flight to Lisbon and a hotel for 3 nights');
```

### Mock APIs

The project includes mock implementations for common services:

```typescript
import { searchFlights } from './chat-engine/mock-apis/flightAPI';
import { searchHotels } from './chat-engine/mock-apis/hotelAPI';
import { applyVisa } from './chat-engine/mock-apis/visaAPI';

// Example usage
const flightResult = await searchFlights({
  from: 'DEL',
  to: 'LIS',
  date: '2025-06-10'
});
```

## Development

### Project Structure

```
aintent-protocol/
├── src/
│   ├── types/           # Type definitions
│   ├── core/            # Core engine components
│   └── utils/           # Utility functions
├── chat-engine/
│   ├── mock-apis/       # Mock API implementations
│   ├── ChatContext.ts   # Chat context management
│   └── ChatSession.ts   # Chat session handling
├── tests/               # Test suites
└── package.json         # Project configuration
```

### Testing

Run the test suite:

```bash
pnpm test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT

## Suggested Improvements

1. **Enhanced Error Handling**
   - Add more detailed error types
   - Implement retry mechanisms for failed steps
   - Add error recovery strategies

2. **Resource Management**
   - Implement resource caching
   - Add resource validation rules
   - Support resource versioning

3. **Workflow Optimization**
   - Add parallel step execution
   - Implement step prioritization
   - Add workflow optimization algorithms

4. **Security Enhancements**
   - Add authentication for API calls
   - Implement rate limiting
   - Add input validation

5. **Documentation**
   - Add API documentation
   - Create usage examples
   - Add architecture diagrams

6. **Testing**
   - Add more test cases
   - Implement integration tests
   - Add performance benchmarks

7. **Monitoring**
   - Add logging system
   - Implement metrics collection
   - Add performance monitoring

8. **Extensibility**
   - Create plugin system
   - Add custom step types
   - Support custom resource types

9. **User Experience**
   - Add interactive CLI
   - Create web interface
   - Add progress tracking

10. **Performance**
    - Optimize workflow generation
    - Add caching layer
    - Implement batch processing