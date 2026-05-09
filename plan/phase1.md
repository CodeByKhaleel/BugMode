Create the initial monorepo architecture for BugMode.

Requirements:

* use pnpm workspace
* TypeScript everywhere
* clean scalable structure
* prepare for VSCode extension + shared core engine

Required structure:
packages/
extension/
core-engine/
parsers/
prompt-builder/

Requirements:

* ESLint
* Prettier
* tsconfig base
* shared types package if necessary
* production-ready scripts

Inside extension package:

* initialize VSCode extension
* add command registration
* add command:
  "BugMode: Generate AI Debug Context"

The command should:

* detect selected text from editor
* send selected text to core-engine
* temporarily log parsed result

Inside core-engine:

* create analyzeError() service
* detect:

  * language
  * framework
  * error category

Keep implementation minimal but architecture clean.

Generate complete codebase.
