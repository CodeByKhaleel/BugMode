import * as vscode from 'vscode';
import { BugModePanel } from './panel/BugModePanel';
import { runGenerate } from './commands/generate';
import { runGenerateFromTerminal } from './commands/generateFromTerminal';
import { logger } from './utils/logger';

export function activate(context: vscode.ExtensionContext): void {
  logger.info('BugMode activated');

  const panel = new BugModePanel();

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(BugModePanel.viewId, panel),

    // Editor commands
    vscode.commands.registerCommand('bugmode.generateForClaude', () =>
      runGenerate('claude', panel)
    ),
    vscode.commands.registerCommand('bugmode.generateForCursor', () =>
      runGenerate('cursor', panel)
    ),
    vscode.commands.registerCommand('bugmode.generateGeneric', () =>
      runGenerate('generic', panel)
    ),

    // Terminal commands
    vscode.commands.registerCommand('bugmode.terminalGenerateForClaude', () =>
      runGenerateFromTerminal('claude', panel)
    ),
    vscode.commands.registerCommand('bugmode.terminalGenerateForCursor', () =>
      runGenerateFromTerminal('cursor', panel)
    ),
    vscode.commands.registerCommand('bugmode.terminalGenerateGeneric', () =>
      runGenerateFromTerminal('generic', panel)
    )
  );
}

export function deactivate(): void {
  logger.dispose();
}
