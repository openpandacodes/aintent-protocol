/// <reference types="react" />
/// <reference types="node" />

import React, { Component, useState, useEffect } from 'react';
import { ClaudeClient } from '../core/clients/ClaudeClient';
import { Intent } from '../types/intent';
import { OrchestratorEngine } from '../core/OrchestratorEngine';
import { AgentExecutor } from '../core/AgentExecutor';
import { WorkflowVisualizer } from './WorkflowVisualizer';
import { DIMLGenerator } from '../core/DIMLGenerator';
import { DeepFlow } from '../types/DeepFlow';
import '../types/env';

declare global {
  interface Window {
    env: {
      REACT_APP_CLAUDE_API_KEY?: string;
      REACT_APP_CLAUDE_MODEL?: string;
      REACT_APP_CLAUDE_TEMPERATURE?: string;
      REACT_APP_CLAUDE_MAX_TOKENS?: string;
    };
  }
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

const App: React.FC = () => {
  const [intent, setIntent] = useState<string>('');
  const [intents, setIntents] = useState<Intent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [flows, setFlows] = useState<DeepFlow[]>([]);
  const [selectedFlow, setSelectedFlow] = useState<DeepFlow | null>(null);
  const [dimlYaml, setDimlYaml] = useState('');
  const [executionResult, setExecutionResult] = useState<any>(null);

  useEffect(() => {
    console.log('App component mounted');
  }, []);

  const claudeClient = new ClaudeClient({
    apiKey: window.env?.REACT_APP_CLAUDE_API_KEY || '',
    model: window.env?.REACT_APP_CLAUDE_MODEL || 'claude-3-opus-20240229'
  });

  const orchestrator = new OrchestratorEngine(claudeClient);
  const executor = new AgentExecutor(claudeClient);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      console.log('Processing intent:', intent);
      const processedIntent = await claudeClient.processIntent(intent);
      console.log('Processed intent:', processedIntent);
      setIntents([...intents, processedIntent]);
      setIntent('');
    } catch (err) {
      console.error('Error processing intent:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while processing the intent');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecute = async (intent: Intent) => {
    setError(null);
    setIsLoading(true);

    try {
      console.log('Executing intent:', intent);
      const result = await claudeClient.executeIntent(intent);
      console.log('Execution result:', result);
      // Update the intent with the result
      setIntents(intents.map((i: Intent) => 
        i.id === intent.id ? { ...i, result } : i
      ));
    } catch (err) {
      console.error('Error executing intent:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while executing the intent');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFlowExecution = async () => {
    if (!selectedFlow) return;
    
    try {
      console.log('Executing flow:', selectedFlow);
      const result = await executor.execute(selectedFlow);
      console.log('Execution result:', result);
      setExecutionResult(result);
    } catch (error) {
      console.error('Error executing workflow:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  return (
    <ErrorBoundary>
      <div className="app">
        <h1>Intent Protocol</h1>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={intent}
            onChange={(e) => setIntent(e.target.value)}
            placeholder="Enter your intent"
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Submit'}
          </button>
        </form>

        <div className="intents">
          {intents.map(intent => (
            <div key={intent.id} className="intent">
              <h3>{intent.action}</h3>
              <p>{intent.description}</p>
              <button 
                onClick={() => handleExecute(intent)}
                disabled={isLoading}
              >
                Execute
              </button>
              {intent.result && (
                <div className="result">
                  <h4>Result:</h4>
                  <pre>{JSON.stringify(intent.result, null, 2)}</pre>
                </div>
              )}
            </div>
          ))}
        </div>

        {flows.length > 0 && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Generated Workflows</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {flows.map((flow) => (
                <div
                  key={flow.id}
                  className={`border p-4 cursor-pointer ${
                    selectedFlow?.id === flow.id ? 'border-blue-500' : ''
                  }`}
                  onClick={() => {
                    setSelectedFlow(flow);
                    setDimlYaml(DIMLGenerator.generate(flow));
                  }}
                >
                  <h3 className="font-semibold">{flow.name}</h3>
                  <p className="text-sm text-gray-600">{flow.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedFlow && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Workflow Visualization</h2>
            <div className="border p-4">
              <WorkflowVisualizer flow={selectedFlow} />
            </div>
          </div>
        )}

        {dimlYaml && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">DIML YAML</h2>
            <pre className="bg-gray-100 p-4 overflow-auto">
              {dimlYaml}
            </pre>
          </div>
        )}

        {selectedFlow && (
          <button
            onClick={handleFlowExecution}
            className="bg-green-500 text-white px-4 py-2"
          >
            Execute Workflow
          </button>
        )}

        {executionResult && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Execution Result</h2>
            <pre className="bg-gray-100 p-4 overflow-auto">
              {JSON.stringify(executionResult, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default App; 