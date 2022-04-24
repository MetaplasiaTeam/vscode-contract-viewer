import * as vscode from 'vscode'

export class ConfigApi {
  static open() {
    vscode.commands.executeCommand(
      'workbench.action.openSettings',
      '@ext:MetaPlasia.contract-viewer'
    )
  }

  static read(key: string): string {
    return vscode.workspace.getConfiguration().get(key) || ''
  }
}
