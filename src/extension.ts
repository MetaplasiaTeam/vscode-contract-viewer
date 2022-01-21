import "reflect-metadata";
import * as vscode from "vscode";
import { ViewerService } from "./viewer";
import { Container } from "typedi";

export function activate(context: vscode.ExtensionContext) {
  Container.set("context", context);
  ViewerService.init(context);
}

export function deactivate() {}
