import * as vscode from "vscode";
import { Container } from "typedi";
import { Localize } from "../common/Localize";
import { ConfigApi } from "../command/config-api";
import { OutPut } from "../common/Output";
import {
  clearSpinner,
  showInformationMessage,
  showSpinner,
} from "../utils/toast";
import { fileDialogOptions } from "../utils/vscode-api";

export abstract class BaseParser {
  protected output = Container.get(OutPut);
  protected i18n = Container.get(Localize);

  private apiKey: string = this.initApiKey();
  private addr: string = "";

  constructor(addr: string) {
    this.addr = addr;
  }

  start() {
    this.checkApi();
  }

  checkApi() {
    let api = ConfigApi.read(this.apiKey);
    if (api === null || api === undefined || api === "") {
      showInformationMessage(this.i18n.localize("err.invalidApi"));
      return;
    }
    showSpinner(this.i18n.localize("tip.contract.getinfo"));
    this.parse(api, this.addr);
  }

  protected abstract initApiKey(): string;

  protected abstract parse(api: string, addr: string): void;

  protected async selectFolder(): Promise<vscode.Uri[] | undefined> {
    let fileUri = await vscode.window.showOpenDialog(
      fileDialogOptions(this.i18n.localize("tip.contract.selectfolder"))
    );
    if (fileUri && fileUri[0]) {
      return fileUri;
    } else {
      return undefined;
    }
  }

  protected onNetCatch(err: Error) {
    clearSpinner();
    this.output.appendLine(err.message);
    showInformationMessage(this.i18n.localize("err.contract.getinfo.failed"));
  }
}
