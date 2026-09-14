import basicControls from './basicControls';
import validation from './validation';
import nestedObjects from './nestedObjects';
import repeatableObjects from './repeatableObjects';
import uswdsOptions from './uswdsOptions';
import permitting from './permitting';
import type { WorkbenchExample } from './types';

export type { WorkbenchExample };

export const examples: WorkbenchExample[] = [
  basicControls,
  validation,
  nestedObjects,
  repeatableObjects,
  uswdsOptions,
  permitting,
];

export function getExample(id: string): WorkbenchExample {
  return examples.find((example) => example.id === id) ?? examples[0];
}
