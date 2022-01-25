import axios from "axios";
import * as shell from "shelljs";
import * as fs from "fs";
import { BaseParser } from "../common/BaseParser";
import { EOL } from "os";
import { openFile } from "../utils/vscode-api";

export class BinanceParser extends BaseParser {
  constructor(addr: string) {
    super(addr);
  }

  protected initApiKey(): string {
    return "contract-viewer.setting.api.bsc";
  }

  protected parse(api: string, addr: string): void {
    axios
      .get("https://api.bscscan.com/api", {
        params: {
          module: "contract",
          action: "getsourcecode",
          address: addr,
          apikey: api,
        },
      })
      .then((res) => {
        res.data.result.forEach(async (element: any) => {
          this.selectFolder((selectPath: string) => {
            shell.cd(selectPath);
            this.save(selectPath, "contract.sol", element.SourceCode);
            this.saveSuccess();
          });
        });
      })
      .catch((err) => {
        this.onNetCatch(err);
      });
  }

  async save(selectPath: string, file: string, content: string): Promise<void> {
    shell.cd(selectPath);
    let folder: string = file.substring(0, file.lastIndexOf("/"));
    shell.mkdir("-p", folder);
    shell.touch(file);
    let trueContent = content.replace(/\\n/g, EOL);
    trueContent = trueContent.replaceAll('\\"', '"');
    fs.writeFileSync(file, trueContent);
  }
}
