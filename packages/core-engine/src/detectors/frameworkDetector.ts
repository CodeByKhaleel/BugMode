import { Framework, ParsedError } from '../types';

const FRAMEWORK_PATTERNS: Array<{ framework: Framework; signals: string[] }> = [
  { framework: 'nestjs', signals: ['NestFactory', 'NestApplication', '@nestjs/', 'Nest'] },
  { framework: 'nextjs', signals: ['next/dist', '_next/', 'NextServer', 'getServerSideProps'] },
  { framework: 'react', signals: ['react-dom', 'ReactDOM', 'at React.', 'react/cjs'] },
  { framework: 'express', signals: ['express/lib', 'router/layer', 'Router.handle'] },
  { framework: 'django', signals: ['django/', 'django.core', 'django.db'] },
  { framework: 'fastapi', signals: ['fastapi', 'starlette', 'uvicorn'] },
];

export function detectFramework(parsed: ParsedError): Framework {
  const text = parsed.raw;
  for (const { framework, signals } of FRAMEWORK_PATTERNS) {
    if (signals.some((s) => text.includes(s))) return framework;
  }
  return 'unknown';
}
