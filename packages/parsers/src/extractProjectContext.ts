import * as fs from 'fs';
import * as path from 'path';
import { ProjectContext } from './types';
import { detectPackageManager } from './detectors/packageManagerDetector';
import {
  parsePackageJson,
  isMonorepo,
  inferFramework,
  inferProjectType,
} from './parsers/packageJsonParser';
import {
  findEntryPoints,
  findRelatedModules,
  buildArchitectureHints,
} from './parsers/relatedFileFinder';

export function extractProjectContext(
  workspaceRoot: string,
  errorFiles: string[] = []
): ProjectContext {
  const pkg = parsePackageJson(workspaceRoot);
  const deps = pkg.dependencies ?? {};
  const devDeps = pkg.devDependencies ?? {};
  const allDeps = { ...deps, ...devDeps };

  const hasTypeScript =
    !!allDeps['typescript'] || fs.existsSync(path.join(workspaceRoot, 'tsconfig.json'));

  return {
    projectType: inferProjectType(deps, devDeps),
    packageManager: detectPackageManager(workspaceRoot),
    dependencies: deps,
    devDependencies: devDeps,
    framework: inferFramework(allDeps),
    isMonorepo: isMonorepo(pkg, workspaceRoot),
    hasTypeScript,
    architectureHints: buildArchitectureHints(workspaceRoot, allDeps),
    probableEntryPoints: findEntryPoints(workspaceRoot),
    relatedModules: findRelatedModules(workspaceRoot, errorFiles),
    environmentContext: {
      nodeVersion: process.version,
      platform: process.platform,
    },
  };
}
