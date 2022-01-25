import axios from "axios";
import * as shell from "shelljs";
import * as fs from "fs";
import { BaseParser } from "../common/BaseParser";
import { objectToMap } from "./json";
import { showInformationMessage, clearSpinner } from "../utils/toast";
import { EOL } from "os";

export class EthereumParser extends BaseParser {
  initApiKey(): string {
    return "contract-viewer.setting.api.eth";
  }

  constructor(addr: string) {
    super(addr);
  }

  parse(api: string, addr: string): void {
    axios
      .get("https://api.etherscan.io/api", {
        params: {
          module: "contract",
          action: "getsourcecode",
          address: addr,
          apikey: api,
        },
      })
      .then((res) => {
        res.data.result.forEach(async (element: any) => {
          if (element.SourceCode.indexOf("{") === 0) {
            // SourceCode 里面一个对象
            // 我不知道为什么的他外面还有一层括号，所以我先用正则去掉了
            let codes = JSON.parse(
              element.SourceCode.replace(/^[{]{1}|[}]{1}$/g, "")
            );
            let codeMap = objectToMap(codes.sources);
            this.selectFolder((selectPath: string) => {
              shell.cd(selectPath);
              codeMap.forEach((value: any, key: string) => {
                this.save(
                  selectPath,
                  key,
                  JSON.stringify(value.content).substring(
                    1,
                    JSON.stringify(value.content).length - 1
                  )
                );
              });
              this.saveSuccess();
            });
          } else {
            // SourceCode 里面是字符串
            this.selectFolder((selectPath: string) => {
              shell.cd(selectPath);
              let code: string = element.SourceCode;
              let codeArr: Array<string> = code.split("// File:");
              codeArr.forEach((element) => {
                let filePath = Date.now().toString();
                if (element.startsWith("https://")) {
                  filePath =
                    element.substring(
                      element.search("master/"),
                      element.search(".sol")
                    ) + ".sol";
                } else {
                  filePath =
                    element.substring(0, element.search(".sol")) + ".sol";
                }
                this.save(selectPath, filePath + ".sol", "//" + element);
              });
              this.saveSuccess();
            });
          }
        });
      })
      .catch((err) => {
        this.onNetCatch(err);
      });
  }

  async save(selectPath: string, file: string, content: string): Promise<void> {
    if (content === "//") {
      return;
    }
    shell.cd(selectPath);
    let folder: string = file.substring(0, file.lastIndexOf("/"));
    shell.mkdir("-p", folder);
    shell.touch(file);
    let trueContent = content.replace(/\\n/g, EOL);
    trueContent = trueContent.replaceAll('\\"', '"');
    fs.writeFileSync(file, trueContent);
  }
}
