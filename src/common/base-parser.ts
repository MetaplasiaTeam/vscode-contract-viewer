import * as vscode from 'vscode'
import { Container } from 'typedi'
import { Localize } from './localize'
import { ConfigApi } from './config-api'
import { OutPut } from './output'
import {
  clearSpinner,
  showInformationMessage,
  showSpinner,
} from '../utils/toast'
import { fileDialogOptions, openDir } from '../utils/vscode-api'

export abstract class BaseParser {
  protected output = Container.get(OutPut)
  protected i18n = Container.get(Localize)

  private apiKey: string = this.initApiKey()
  private addr: string = ''
  private path: string = ''

  constructor(addr: string) {
    this.addr = addr
  }

  start() {
    this.checkApi()
  }

  checkApi() {
    const api = ConfigApi.read(this.apiKey)
    if (api === null || api === undefined || api === '') {
      showInformationMessage(this.i18n.localize('err.invalidApi'))
      return
    }
    showSpinner(this.i18n.localize('tip.contract.getinfo'))
    this.parse(api, this.addr)
  }

  protected abstract initApiKey(): string

  protected abstract parse(api: string, addr: string): void

  protected async selectFolder(callback: Function) {
    const fileUri = await vscode.window.showOpenDialog(
      fileDialogOptions(this.i18n.localize('tip.contract.selectfolder'))
    )
    if (fileUri && fileUri[0]) {
      this.path = fileUri[0].fsPath
      callback.call(this, fileUri[0].fsPath)
    }
  }

  protected onNetCatch(err: Error) {
    clearSpinner()
    this.output.appendLine(err.message)
    showInformationMessage(this.i18n.localize('err.contract.getinfo.failed'))
  }

  protected saveSuccess() {
    showInformationMessage(
      this.i18n.localize('tip.contract.savetofile.sucess'),
      this.i18n.localize('btn.openfolder')
    ).then((value) => {
      if (value === this.i18n.localize('btn.openfolder')) {
        openDir(this.path)
      }
    })
    clearSpinner()
  }
}
