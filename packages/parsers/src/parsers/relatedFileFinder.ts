import * as fs from 'fs';
import * as path from 'path';

const ENTRY_CANDIDATES = [
  'src/index.ts', 'src/main.ts', 'src/app.ts', 'src/server.ts',
  'index.ts', 'main.ts', 'app.ts', 'server.ts',
  'src/index.js', 'index.js', 'main.js',
];

export function findEntryPoints(root: string): string[] {
  return ENTRY_CANDIDATES.filter((f) => fs.existsSync(path.join(root, f)));
}

export function findRelatedModules(root: string, errorFiles: string[]): string[] {
  const related = new Set<string>();
  for (const file of errorFiles) {
    const dir = path.dirname(path.resolve(root, file));
    if (!fs.existsSync(dir)) continue;
    try {
      fs.readdirSync(dir)
        .filter((f: string) => /\.(ts|js)$/.test(f))
        .forEach((f: string) => related.add(path.relative(root, path.join(dir, f))));
    } catch {
      // skip unreadable dirs
    }
  }
  return [...related].slice(0, 10);
}

export function buildArchitectureHints(root: string, deps: Record<string, string>): string[] {
  const hints: string[] = [];
  if (fs.existsSync(path.join(root, 'src/modules'))) hints.push('NestJS module structure detected');
  if (fs.existsSync(path.join(root, 'src/components'))) hints.push('Component-based architecture');
  if (fs.existsSync(path.join(root, 'src/services'))) hints.push('Service layer present');
  if (fs.existsSync(path.join(root, 'src/controllers'))) hints.push('Controller layer present');
  if (fs.existsSync(path.join(root, 'src/hooks'))) hints.push('React hooks directory found');
  if (deps['prisma'] || deps['@prisma/client']) hints.push('Prisma ORM in use');
  if (deps['typeorm']) hints.push('TypeORM in use');
  if (deps['mongoose']) hints.push('Mongoose/MongoDB in use');
  return hints;
}
