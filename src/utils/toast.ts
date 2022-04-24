import * as vscode from 'vscode'

export function statusInfo(message: string): void {
  status(message, 4000)
}

export function status(message: string, hideAfterTimeout?: number): void {
  clearSpinner()

  if (hideAfterTimeout) {
    vscode.window.setStatusBarMessage('')
    vscode.window.setStatusBarMessage(message, hideAfterTimeout)
  } else {
    vscode.window.setStatusBarMessage(message)
  }
}

let spinnerTimer: NodeJS.Timer | null
const spinner = {
  frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
  interval: 100,
}

export function clearSpinner(message: string = ''): void {
  if (spinnerTimer) {
    clearInterval(spinnerTimer)
    spinnerTimer = null
  }

  vscode.window.setStatusBarMessage(message)
}

export function showInformationMessage(message: string, ...buttons: string[]) {
  return vscode.window.showInformationMessage(message, ...buttons)
}

export function showSpinner(
  message: string,
  progress?: number,
  total?: number
): void {
  clearSpinner()

  let text = ''
  if (progress !== undefined && total !== undefined) {
    text = `[${progress}/${total}]`
  }

  if (message !== null) {
    text = text ? `${text} ${message}` : `${message}`
  }

  if (text) {
    text = ` ${text.trim()}`
  }

  let step: number = 0
  const frames: string[] = spinner.frames
  const length: number = frames.length
  spinnerTimer = setInterval(() => {
    vscode.window.setStatusBarMessage(`${frames[step]}${text}`)
    step = (step + 1) % length
  }, spinner.interval)
}
