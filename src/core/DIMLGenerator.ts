import { DeepFlow } from '../types/DeepFlow';
import yaml from 'js-yaml';

export class DIMLGenerator {
  static generate(flow: DeepFlow): string {
    const dimlObject = {
      version: '1.0',
      flow: {
        id: flow.id,
        name: flow.name,
        description: flow.description,
        goals: flow.goals.map(goal => ({
          id: goal.id,
          objective: goal.objective,
          dependencies: goal.dependencies
        })),
        steps: flow.steps.map(step => ({
          id: step.id,
          name: step.name,
          description: step.description,
          action: {
            type: step.action.type,
            service: step.action.service,
            parameters: step.action.parameters
          },
          dependencies: step.dependencies
        })),
        resources: flow.requiredResources,
        estimatedDuration: flow.estimatedDuration
      }
    };

    return yaml.dump(dimlObject, {
      indent: 2,
      lineWidth: -1,
      noRefs: true
    });
  }

  static parse(dimlYaml: string): DeepFlow {
    const dimlObject = yaml.load(dimlYaml) as any;
    const flow = dimlObject.flow;

    return {
      id: flow.id,
      name: flow.name,
      description: flow.description,
      goals: flow.goals,
      steps: flow.steps,
      requiredResources: flow.resources,
      estimatedDuration: flow.estimatedDuration
    };
  }
} 