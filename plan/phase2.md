Enhance BugMode core-engine with intelligent error analysis.

Goal:
Convert raw stack traces into structured debugging metadata.

Implement:

1. Stack trace parser
2. Runtime detector
3. Framework detector
4. Error categorizer

Support initially:

* Node.js
* TypeScript
* React
* NestJS
* Python

Input examples:

* TypeError
* Cannot read property
* module not found
* dependency injection errors
* syntax errors

Output structure:
{
runtime,
framework,
probableCause,
relatedFiles,
severity,
debuggingHints
}

Requirements:

* modular parser architecture
* easily extensible
* clean interfaces
* unit-testable

DO NOT use AI APIs.
Everything should be deterministic/local.
