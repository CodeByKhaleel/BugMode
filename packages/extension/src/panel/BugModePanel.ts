import * as vscode from 'vscode';
import { GeneratedPrompt } from '@bugmode/prompt-builder';

export class BugModePanel implements vscode.WebviewViewProvider {
  public static readonly viewId = 'bugmode.panel';
  private _view?: vscode.WebviewView;

  resolveWebviewView(webviewView: vscode.WebviewView): void {
    this._view = webviewView;
    webviewView.webview.options = { enableScripts: true };
    webviewView.webview.html = this._getHtml('Select an error or stack trace, then run a BugMode command.');

    webviewView.webview.onDidReceiveMessage((msg) => {
      if (msg.command === 'copy') {
        vscode.env.clipboard.writeText(msg.text);
        vscode.window.showInformationMessage('BugMode: Prompt copied to clipboard!');
      }
    });
  }

  showPrompt(prompt: GeneratedPrompt): void {
    if (!this._view) return;
    this._view.show(true);
    this._view.webview.html = this._getHtml(prompt.content, prompt.title);
  }

  private _getHtml(content: string, title?: string): string {
    const escaped = content
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: var(--vscode-font-family); font-size: var(--vscode-font-size); color: var(--vscode-foreground); background: var(--vscode-editor-background); padding: 12px; margin: 0; }
    h2 { font-size: 13px; color: var(--vscode-textLink-foreground); margin: 0 0 10px; word-break: break-word; }
    pre { white-space: pre-wrap; word-break: break-word; background: var(--vscode-textBlockQuote-background); padding: 10px; border-radius: 4px; font-size: 12px; line-height: 1.5; overflow: auto; max-height: 70vh; }
    button { margin-top: 10px; padding: 6px 14px; background: var(--vscode-button-background); color: var(--vscode-button-foreground); border: none; border-radius: 3px; cursor: pointer; font-size: 12px; }
    button:hover { background: var(--vscode-button-hoverBackground); }
    .empty { color: var(--vscode-descriptionForeground); font-style: italic; }
  </style>
</head>
<body>
  ${title ? `<h2>${title.replace(/</g, '&lt;')}</h2>` : ''}
  ${content === escaped ? `<pre>${escaped}</pre><button onclick="copy()">Copy to Clipboard</button>` : `<p class="empty">${escaped}</p>`}
  <script>
    const vscode = acquireVsCodeApi();
    function copy() {
      vscode.postMessage({ command: 'copy', text: ${JSON.stringify(content)} });
    }
  </script>
</body>
</html>`;
  }
}
