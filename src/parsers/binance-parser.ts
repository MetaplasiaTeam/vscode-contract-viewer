import axios from 'axios'
import * as shell from 'shelljs'
import * as fs from 'fs'
import { BaseParser } from '../common/base-parser'
import { EOL } from 'os'
import { objectToMap } from '../utils/json'

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
          if (element.SourceCode.indexOf('{') === 0) {
            // SourceCode 里面一个对象
            // 我不知道为什么的他外面还有一层括号，所以我先用正则去掉了
            const codes = JSON.parse(
              element.SourceCode.replace(/^[{]{1}|[}]{1}$/g, '')
            )
            const codeMap = objectToMap(codes.sources)
            this.selectFolder((selectPath: string) => {
              shell.cd(selectPath)
              codeMap.forEach((value: any, key: string) => {
                this.save(
                  selectPath,
                  key,
                  JSON.stringify(value.content).substring(
                    1,
                    JSON.stringify(value.content).length - 1
                  )
                )
              })
              this.saveSuccess()
            })
          } else if (element.SourceCode.startsWith('// File:')) {
            // SourceCode 里面是字符串
            this.selectFolder((selectPath: string) => {
              shell.cd(selectPath)
              const code: string = element.SourceCode
              const codeArr: Array<string> = code.split('// File:')
              codeArr.forEach((element) => {
                let filePath = Date.now().toString()
                if (element.startsWith('https://')) {
                  filePath =
                    element.substring(
                      element.search('master/'),
                      element.search('.sol')
                    ) + '.sol'
                } else {
                  filePath =
                    element.substring(0, element.search('.sol')) + '.sol'
                }
                this.save(selectPath, filePath + '.sol', '//' + element)
              })
              this.saveSuccess()
            })
          } else {
            this.selectFolder((selectPath: string) => {
              shell.cd(selectPath)
              this.save(selectPath, 'contract.sol', element.SourceCode)
            })
          }
        })
      })
      .catch((err) => {
        this.onNetCatch(err)
      })
  }

  async save(selectPath: string, file: string, content: string): Promise<void> {
    shell.cd(selectPath)
    const folder: string = file.substring(0, file.lastIndexOf('/'))
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
