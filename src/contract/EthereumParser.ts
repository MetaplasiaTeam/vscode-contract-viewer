import * as vscode from "vscode";
import * as shell from "shelljs";
import * as fs from "fs";
import axios from "axios";
import Container from "typedi";
import { ConfigApi } from "../command/config-api";
import { Localize } from "../common/Localize";
import { OutPut } from "../common/Output";
import {
  clearSpinner,
  showInformationMessage,
  showSpinner,
} from "../utils/toast";
import { objectToMap } from "./json";
import { fileDialogOptions } from "../utils/vscode-api";
import { EOL } from "os";

export class EthereumParser implements IParser {
  private output = Container.get(OutPut);
  private i18n = Container.get(Localize);

  parse(addr: string): void {
    let api = ConfigApi.read("contract-viewer.setting.api.eth");
    if (api === null || api === undefined || api === "") {
      showInformationMessage(this.i18n.localize("err.invalidApi"));
      return;
    }
    this.output.append("当前 api: " + api);
    this.output.append("当前地址: " + addr);
    showSpinner(this.i18n.localize("tip.contract.getinfo"));
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
        res.data.result.forEach((element: any) => {
          // 我不知道为什么的他外面还有一层括号，所以我先用正则去掉了
          let codes = JSON.parse(
            element.SourceCode.replace(/^[{]{1}|[}]{1}$/g, "")
          );
          let codeMap = objectToMap(codes.sources);
          // 选择一个目录
          vscode.window
            .showOpenDialog(
              fileDialogOptions(this.i18n.localize("tip.contract.selectfolder"))
            )
            .then((fileUri) => {
              showSpinner(this.i18n.localize("tip.contract.savetofile"));
              if (fileUri && fileUri[0]) {
                // 获取要创建的目录
                let path = fileUri[0].fsPath;
                shell.cd(path);
                codeMap.forEach((value: any, key: string) => {
                  this.save(
                    path,
                    key,
                    JSON.stringify(value.content).substring(
                      1,
                      JSON.stringify(value.content).length - 1
                    )
                  );
                });
                showInformationMessage(
                  this.i18n.localize("tip.contract.savetofile.sucess")
                );
                clearSpinner();
              }
            });
        });
      })
      .catch((err) => {
        clearSpinner();
        showInformationMessage(
          this.i18n.localize("err.contract.getinfo.failed")
        );
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
