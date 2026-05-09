Build the BugMode prompt generation engine.

Goal:
Generate high-quality debugging prompts automatically.

Input:

* parsed error analysis
* project context
* selected logs/errors/code

Output:
A structured AI-ready debugging prompt.

The generated prompt should include:

1. project/framework context
2. error details
3. probable root cause
4. related files/modules
5. debugging objectives
6. safety constraints
7. expected output format

The prompts must:

* work well for Claude
* work well for Cursor
* work well for Codex
* be concise but context-rich
* reduce ambiguity
* improve debugging precision

Add support for:

* “Generate for Claude”
* “Generate for Cursor”
* “Generate for Generic AI”

Requirements:

* template-based architecture
* extensible prompt strategies
* clean formatting
* copy-to-clipboard support
