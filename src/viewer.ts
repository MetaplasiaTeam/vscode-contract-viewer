import * as vscode from 'vscode'
import { registerCommand } from './utils/vscode-api'
import { ConfigApi } from './common/config-api'
import Container from 'typedi'
import { Localize } from './common/localize'
import { Config } from './core/config'
import { ContractParser } from './common/contract-parser'
import { getDownloadParams, isMyUri } from './uri'
import { clearSpinner, statusInfo } from './utils/toast'

export class ViewerService {
  private static instance: ViewerService
  private context: vscode.ExtensionContext
  private i18n = Container.get(Localize)
  private config = Container.get(Config)

  private constructor(context: vscode.ExtensionContext) {
    this.context = context
  }

  private static create(context: vscode.ExtensionContext) {
    if (!ViewerService.instance) {
      ViewerService.instance = new ViewerService(context)
    }
    return ViewerService.instance
  }

  public static init(context: vscode.ExtensionContext) {
    ViewerService.create(context)
    ViewerService.instance.initUri()
    ViewerService.instance.initViewer()
    ViewerService.instance.initCommands()
  }

  private initViewer() {
    try {
    } catch (err) {}
  }

  private initUri() {
    vscode.window.registerUriHandler({
      handleUri(uri: vscode.Uri) {
        if (isMyUri(uri)) {
          statusInfo(Container.get(Localize).localize('tip.link.getinfo'))
          if (uri.path === '/download') {
            const params = getDownloadParams(uri)
            if (params.type === 'eth') {
              ContractParser.parse(0, params.addr)
            }
            if (params.type === 'bsc') {
              ContractParser.parse(1, params.addr)
            }
          }
          clearSpinner()
        }
      },
    })
  }

  /**
   * 注册命令
   */
  private initCommands() {
    registerCommand(
      this.context,
      'contract-viewer.configApi',
      this.configApi.bind(this)
    )
    registerCommand(
      this.context,
      'contract-viewer.getContract',
      this.getContract.bind(this)
    )
  }

  /**
   * 配置 api
   */
  private configApi() {
    ConfigApi.open()
  }

  /**
   * 获取合约
   */
  private getContract() {
    this.selectType()
  }

  /**
   * 选择链类型并且输入地址
   */
  private selectType() {
    vscode.window.showQuickPick(this.config.contractType).then((item) => {
      if (item !== undefined) {
        vscode.window
          .showInputBox({
            prompt: this.i18n.localize('ext.input.hint.address'),
            value: '',
            valueSelection: [0, 0],
          })
          .then((address) => {
            if (address !== undefined && address !== '') {
              ContractParser.parse(item.index, address)
            }
          })
      }
    })
  }
}
