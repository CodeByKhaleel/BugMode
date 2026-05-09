import * as vscode from 'vscode';

let channel: vscode.OutputChannel | undefined;

function getChannel(): vscode.OutputChannel {
  if (!channel) channel = vscode.window.createOutputChannel('BugMode');
  return channel;
}

function isDebug(): boolean {
  return vscode.workspace.getConfiguration('bugmode').get<boolean>('debugMode', false);
}

export const logger = {
  info: (msg: string) => getChannel().appendLine(`[INFO] ${msg}`),
  debug: (msg: string) => { if (isDebug()) getChannel().appendLine(`[DEBUG] ${msg}`); },
  error: (msg: string, err?: unknown) => {
    getChannel().appendLine(`[ERROR] ${msg}${err ? ': ' + String(err) : ''}`);
  },
  show: () => getChannel().show(true),
  dispose: () => channel?.dispose(),
};
