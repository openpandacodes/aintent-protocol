import React, { useCallback } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { DeepFlow } from '../types/DeepFlow';

interface WorkflowVisualizerProps {
  flow: DeepFlow;
}

export const WorkflowVisualizer: React.FC<WorkflowVisualizerProps> = ({ flow }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Convert DeepFlow to ReactFlow nodes and edges
  React.useEffect(() => {
    const newNodes: Node[] = flow.steps.map((step, index) => ({
      id: step.id,
      type: 'default',
      position: { x: index * 200, y: 0 },
      data: { label: step.name },
    }));

    const newEdges: Edge[] = flow.steps
      .filter(step => step.dependencies.length > 0)
      .flatMap(step =>
        step.dependencies.map(depId => ({
          id: `${depId}-${step.id}`,
          source: depId,
          target: step.id,
        }))
      );

    setNodes(newNodes);
    setEdges(newEdges);
  }, [flow, setNodes, setEdges]);

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}; 