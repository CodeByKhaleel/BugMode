PROJECT NAME: BugMode

MISSION:
Build a local-first VSCode extension that improves AI debugging workflows by automatically generating structured debugging context from errors, stack traces, logs, and selected code.

CORE IDEA:
Developers currently paste raw errors into AI tools and say “fix this,” which leads to poor results due to missing context.

BugMode acts as a Context Engineering Layer between developers and AI coding agents.

The extension should:

* analyze selected errors/logs
* infer project/framework context
* identify probable root causes
* collect nearby architectural information
* generate optimized prompts for AI coding agents

IMPORTANT:
This is NOT an AI wrapper.
This is NOT another chatbot.
This is a local-first context generation engine.

PRIMARY GOALS:

1. Improve developer-to-AI communication quality
2. Reduce debugging iterations
3. Reduce token waste
4. Increase response quality from AI agents
5. Work with ANY AI platform (Claude, Cursor, Codex, Hermes, etc.)

ARCHITECTURE PRINCIPLES:

* local-first
* lightweight
* fast
* model-agnostic
* privacy-focused
* extensible
* modular

MVP FEATURES:

1. Detect pasted/selected stack traces
2. Identify framework/language/runtime
3. Analyze nearby project structure
4. Extract useful debugging context
5. Generate optimized prompts
6. Copy generated prompt to clipboard

TECH STACK:

* TypeScript
* VSCode Extension API
* Node.js
* stacktrace-parser
* ts-morph
* tree-sitter (later)

INITIAL PROJECT STRUCTURE:
packages/
extension/
core-engine/
parsers/
prompt-builder/

FIRST PRIORITY:
Build the VSCode extension foundation and local context analysis engine.

DO NOT:

* add cloud infrastructure
* add auth systems
* add SaaS logic
* add subscriptions
* add AI API integrations initially
* over-engineer

DEVELOPMENT STYLE:

* modular architecture
* production-grade TypeScript
* clear abstractions
* scalable plugin architecture
* excellent developer experience

LONG-TERM VISION:
BugMode eventually evolves into a generalized AI Context Engineering Runtime for:

* debugging
* refactoring
* migrations
* architecture analysis
* feature planning
* multi-agent workflows
