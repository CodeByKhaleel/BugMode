import * as fs from 'fs';
import * as path from 'path';

interface PackageJson {
  name?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  workspaces?: string[] | { packages: string[] };
  main?: string;
  scripts?: Record<string, string>;
}

export function parsePackageJson(root: string): PackageJson {
  const pkgPath = path.join(root, 'package.json');
  if (!fs.existsSync(pkgPath)) return {};
  try {
    return JSON.parse(fs.readFileSync(pkgPath, 'utf-8')) as PackageJson;
  } catch {
    return {};
  }
}

export function isMonorepo(pkg: PackageJson, root: string): boolean {
  if (pkg.workspaces) return true;
  return (
    fs.existsSync(path.join(root, 'pnpm-workspace.yaml')) ||
    fs.existsSync(path.join(root, 'lerna.json'))
  );
}

export function inferFramework(deps: Record<string, string>): string {
  const all = Object.keys(deps);
  if (all.includes('@nestjs/core')) return 'nestjs';
  if (all.includes('next')) return 'nextjs';
  if (all.includes('react')) return 'react';
  if (all.includes('express')) return 'express';
  if (all.includes('fastify')) return 'fastify';
  if (all.includes('vue')) return 'vue';
  if (all.includes('svelte')) return 'svelte';
  return 'unknown';
}

export function inferProjectType(deps: Record<string, string>, devDeps: Record<string, string>): string {
  const all = { ...deps, ...devDeps };
  if (all['@nestjs/core']) return 'nestjs-api';
  if (all['next']) return 'nextjs-app';
  if (all['react']) return 'react-app';
  if (all['express']) return 'express-api';
  if (all['vscode']) return 'vscode-extension';
  return 'node-app';
}
