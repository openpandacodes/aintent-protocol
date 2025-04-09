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
import Test from './Test';
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
        <div className="min-h-screen flex items-center justify-center bg-red-50">
          <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <p className="text-gray-600">{this.state.error?.message}</p>
          </div>
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
    model: window.env?.REACT_APP_CLAUDE_MODEL || 'claude-3-opus'
  });

  const orchestrator = new OrchestratorEngine(claudeClient);
  const executor = new AgentExecutor(claudeClient);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const processedIntent = await claudeClient.processIntent(intent);
      setIntents([...intents, processedIntent]);
      setIntent('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
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
      <div style={{ minHeight: '100vh', padding: '2rem', backgroundColor: '#f9fafb' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Test />
          
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '2rem' }}>
            Intent Protocol
          </h1>
          
          {error && (
            <div style={{ 
              padding: '1rem', 
              backgroundColor: '#fef2f2', 
              border: '1px solid #fee2e2',
              borderRadius: '0.5rem',
              marginBottom: '1rem'
            }}>
              <p style={{ color: '#dc2626' }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input
                type="text"
                value={intent}
                onChange={(e) => setIntent(e.target.value)}
                placeholder="Enter your intent"
                disabled={isLoading}
                style={{
                  flex: 1,
                  padding: '0.5rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  outline: 'none'
                }}
              />
              <button 
                type="submit" 
                disabled={isLoading}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  opacity: isLoading ? 0.5 : 1
                }}
              >
                {isLoading ? 'Processing...' : 'Submit'}
              </button>
            </div>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {intents.map(intent => (
              <div 
                key={intent.id} 
                style={{
                  padding: '1rem',
                  backgroundColor: 'white',
                  borderRadius: '0.5rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
              >
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  {intent.action}
                </h3>
                <p style={{ color: '#4b5563', marginBottom: '1rem' }}>
                  {intent.description}
                </p>
                <button 
                  onClick={() => handleExecute(intent)}
                  disabled={isLoading}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#15803d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    opacity: isLoading ? 0.5 : 1
                  }}
                >
                  Execute
                </button>
                {intent.result && (
                  <div style={{ marginTop: '1rem' }}>
                    <h4 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Result:</h4>
                    <pre style={{ backgroundColor: '#f3f4f6', padding: '0.5rem', borderRadius: '0.5rem' }}>
                      {JSON.stringify(intent.result, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>

          {flows.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                Generated Workflows
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
                {flows.map((flow) => (
                  <div
                    key={flow.id}
                    style={{
                      padding: '1rem',
                      backgroundColor: 'white',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      ...(selectedFlow?.id === flow.id ? { borderColor: '#2563eb' } : {})
                    }}
                    onClick={() => {
                      setSelectedFlow(flow);
                      setDimlYaml(DIMLGenerator.generate(flow));
                    }}
                  >
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                      {flow.name}
                    </h3>
                    <p style={{ color: '#4b5563' }}>
                      {flow.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedFlow && (
            <div style={{ marginTop: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>
                Workflow Visualization
              </h2>
              <div style={{ border: '1px solid #d1d5db', borderRadius: '0.5rem', padding: '1rem' }}>
                <WorkflowVisualizer flow={selectedFlow} />
              </div>
            </div>
          )}

          {dimlYaml && (
            <div style={{ marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                DIML YAML
              </h2>
              <pre style={{ backgroundColor: '#f3f4f6', padding: '0.5rem', borderRadius: '0.5rem' }}>
                {dimlYaml}
              </pre>
            </div>
          )}

          {selectedFlow && (
            <button
              onClick={handleFlowExecution}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#15803d',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                marginTop: '1rem'
              }}
            >
              Execute Workflow
            </button>
          )}

          {executionResult && (
            <div style={{ marginTop: '1rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                Execution Result
              </h2>
              <pre style={{ backgroundColor: '#f3f4f6', padding: '0.5rem', borderRadius: '0.5rem' }}>
                {JSON.stringify(executionResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default App; 