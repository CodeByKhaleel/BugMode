export interface ProjectContext {
  projectType: string;
  packageManager: 'npm' | 'pnpm' | 'yarn' | 'unknown';
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  framework: string;
  isMonorepo: boolean;
  hasTypeScript: boolean;
  architectureHints: string[];
  probableEntryPoints: string[];
  relatedModules: string[];
  environmentContext: Record<string, string>;
}
