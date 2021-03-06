import { Service } from 'typedi'
import * as vscode from 'vscode'

const output = vscode.window.createOutputChannel('contract-viewer')

@Service()
export class OutPut implements vscode.OutputChannel {
  replace(value: string): void {
    throw new Error('Method not implemented.')
  }
  get name(): string {
    return output.name
  }
  public show(): void {
    output.show()
  }
  public hide(): void {
    output.hide()
  }
  public append(data: string): void {
    output.append(data)
  }
  public write(data?: string): void {
    if (data !== undefined) {
      output.append(data)
    }
  }
  public appendLine(data: string): void {
    output.appendLine(data)
  }
  public writeln(data?: string): void {
    if (data !== undefined) {
      output.appendLine(data)
    }
  }
  public clear(): void {
    output.clear()
  }
  public dispose(): void {
    output.dispose()
  }
}
