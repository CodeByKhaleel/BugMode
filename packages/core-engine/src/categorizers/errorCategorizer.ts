import { ErrorCategory, ParsedError, Severity } from '../types';

interface Categorization {
  category: ErrorCategory;
  severity: Severity;
  probableCause: string;
  hints: string[];
}

const RULES: Array<{
  match: (p: ParsedError) => boolean;
  result: Categorization;
}> = [
  {
    match: (p) =>
      p.type === 'TypeError' &&
      (p.message.includes('Cannot read') || p.message.includes('is not a function')),
    result: {
      category: 'null_reference',
      severity: 'high',
      probableCause: 'Accessing property on null or undefined value',
      hints: [
        'Add null/undefined guard before accessing the property',
        'Check if the variable is initialized before use',
        'Use optional chaining (?.) operator',
      ],
    },
  },
  {
    match: (p) => p.type === 'TypeError',
    result: {
      category: 'type_error',
      severity: 'high',
      probableCause: 'Type mismatch or invalid operation on a value',
      hints: ['Verify the type of the value at runtime', 'Check function argument types'],
    },
  },
  {
    match: (p) =>
      p.message.includes('Cannot find module') || p.message.includes('Module not found'),
    result: {
      category: 'module_not_found',
      severity: 'critical',
      probableCause: 'Missing or incorrectly referenced module',
      hints: [
        'Run npm/pnpm install to restore dependencies',
        'Check import path spelling and casing',
        'Verify tsconfig paths configuration',
      ],
    },
  },
  {
    match: (p) => p.type === 'SyntaxError',
    result: {
      category: 'syntax_error',
      severity: 'critical',
      probableCause: 'Invalid syntax in source code',
      hints: ['Check for missing brackets, commas, or semicolons', 'Validate JSON/config files'],
    },
  },
  {
    match: (p) =>
      p.message.toLowerCase().includes('inject') ||
      p.message.toLowerCase().includes('provider') ||
      p.message.toLowerCase().includes('dependency'),
    result: {
      category: 'dependency_injection',
      severity: 'high',
      probableCause: 'DI container failed to resolve a dependency',
      hints: [
        'Ensure the provider is registered in the module',
        'Check for circular dependencies',
        'Verify @Injectable() decorator is present',
      ],
    },
  },
  {
    match: (p) =>
      p.message.toLowerCase().includes('econnrefused') ||
      p.message.toLowerCase().includes('network') ||
      p.message.toLowerCase().includes('fetch'),
    result: {
      category: 'network',
      severity: 'medium',
      probableCause: 'Network request failed or service unreachable',
      hints: ['Check if the target service is running', 'Verify host/port configuration'],
    },
  },
  {
    match: (p) =>
      p.message.toLowerCase().includes('permission') ||
      p.message.toLowerCase().includes('eacces') ||
      p.message.toLowerCase().includes('access denied'),
    result: {
      category: 'permission',
      severity: 'medium',
      probableCause: 'Insufficient permissions to access resource',
      hints: ['Check file/directory permissions', 'Verify user roles and access policies'],
    },
  },
];

export function categorizeError(parsed: ParsedError): Categorization {
  for (const rule of RULES) {
    if (rule.match(parsed)) return rule.result;
  }
  return {
    category: 'unknown',
    severity: 'low',
    probableCause: 'Unable to determine root cause automatically',
    hints: ['Review the full stack trace manually', 'Add logging around the error site'],
  };
}
