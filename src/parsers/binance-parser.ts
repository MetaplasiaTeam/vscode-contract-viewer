import axios from 'axios'
import * as shell from 'shelljs'
import * as fs from 'fs'
import { BaseParser } from '../common/base-parser'
import { EOL } from 'os'

export class BinanceParser extends BaseParser {
  constructor(addr: string) {
    super(addr)
  }

  protected initApiKey(): string {
    return 'contract-viewer.setting.api.bsc'
  }

  protected parse(api: string, addr: string): void {
    axios
      .get('https://api.bscscan.com/api', {
        params: {
          module: 'contract',
          action: 'getsourcecode',
          address: addr,
          apikey: api,
        },
      })
      .then((res) => {
        res.data.result.forEach(async (element: any) => {
          this.selectFolder((selectPath: string) => {
            shell.cd(selectPath)
            let code: string = element.SourceCode
            let codeArr: Array<string> = code.split('// File:')
            codeArr.forEach((element) => {
              let filePath = Date.now().toString()
              if (element.startsWith('https://')) {
                filePath =
                  element.substring(
                    element.search('master/'),
                    element.search('.sol')
                  ) + '.sol'
              } else {
                filePath = element.substring(0, element.search('.sol')) + '.sol'
              }
              this.save(selectPath, filePath + '.sol', '//' + element)
            })
            this.saveSuccess()
          })
        })
      })
      .catch((err) => {
        this.onNetCatch(err)
      })
  }

  async save(selectPath: string, file: string, content: string): Promise<void> {
    shell.cd(selectPath)
    let folder: string = file.substring(0, file.lastIndexOf('/'))
    shell.mkdir('-p', folder)
    shell.touch(file)
    let trueContent = content.replace(/\\n/g, EOL)
    trueContent = trueContent.replace(/\\t/g, '\t')
    trueContent = trueContent.replaceAll('\\"', '"')
    fs.writeFile(file, trueContent, (err) => {
      if (!err) {
        this.output.appendLine(`${file} save success`)
      } else {
        this.output.appendLine(`${file} save failed`)
      }
    })
  }
}
