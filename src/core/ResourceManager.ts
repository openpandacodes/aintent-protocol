// ResourceManager.ts

import { Resource } from '../types/Resource';

export class ResourceManager {
  static validate(resources: Resource[]): string[] {
    return resources.filter(r => r.provider === '').map(r => r.id);
  }
}
