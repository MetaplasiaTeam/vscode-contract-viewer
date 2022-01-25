import * as vscode from "vscode";

/**
 * 从 VS Code 设置里面获取配置
 */
export function getVSCodeSetting<T>(
  key: string,
  section?: string,
  defaultValue?: T
): T {
  return vscode.workspace
    .getConfiguration(section)
    .get<T>(key, defaultValue as T);
}

/**
 * Gets the `editor.formatOnSave` setting from settings JSON.
 */
export function getJSONFormatOnSaveSetting(
  settingsJSON: any
): boolean | undefined {
  let result: boolean | undefined;
  const key = "editor.formatOnSave";
  if (settingsJSON) {
    result = settingsJSON["[json]"] && settingsJSON["[json]"][key];
    if (result === null) {
      result = settingsJSON["[jsonc]"] && settingsJSON["[jsonc]"][key];
    }

    if (result === null) {
      result = settingsJSON[key];
    }
  }
  return result;
}

/**
 * 获取 VS Code 区域码字符串
 */
export function getVSCodeLocale(): string | undefined {
  try {
    return JSON.parse(process.env.VSCODE_NLS_CONFIG || "{}").locale;
  } catch (err) {
    return;
  }
}

/**
 * 用 VS Code 打开一个文件
 *
 * @param filepath 文件路径
 */
export function openFile(filepath: string) {
  vscode.commands.executeCommand("vscode.open", vscode.Uri.file(filepath));
}

/**
 * 用 VS Code 打开一个文件夹
 * 
 * @param dir 
 */
export function openDir(dir: string) {
  vscode.commands.executeCommand("vscode.openFolder", vscode.Uri.file(dir));
}

/**
 * 重载 VS Code 窗口
 */
export function reloadWindow() {
  vscode.commands.executeCommand("workbench.action.reloadWindow");
}

/**
 * 注册命令
 */
export function registerCommand(
  context: vscode.ExtensionContext,
  command: string,
  callback: () => void
) {
  context.subscriptions.push(
    vscode.commands.registerCommand(command, callback)
  );
}

/**
 * 选择文件夹对话框配置
 * @param label 文本提示
 * @returns
 */
export function fileDialogOptions(label: string): vscode.OpenDialogOptions {
  return {
    canSelectMany: false,
    openLabel: label,
    canSelectFiles: false,
    canSelectFolders: true,
  };
}
