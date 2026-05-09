Build the BugMode project context extraction engine.

Goal:
Automatically gather relevant architectural context from the local project.

Features:

1. Detect package manager
2. Detect framework
3. Parse package.json
4. Detect tsconfig
5. Detect project type
6. Identify nearby related files
7. Extract imports/dependencies
8. Detect monorepo/workspace structure

Given an error file:

* find sibling modules
* detect related services/controllers/hooks
* identify architectural patterns

Output:
{
projectType,
dependencies,
architectureHints,
probableEntryPoints,
relatedModules,
environmentContext
}

Requirements:

* filesystem traversal
* AST-based analysis where useful
* avoid unnecessary complexity
* prioritize speed

DO NOT add cloud services or embeddings.
