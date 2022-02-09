import { Uri } from "vscode";
import { URLSearchParams } from "url";

export interface DownloadUriParams {
  type: string;
  addr: string;
}

export function isMyUri(uri: Uri): boolean {
  return uri.authority === "Metaplasia.contract-viewer";
}

export function getDownloadParams(uri: Uri): DownloadUriParams {
  let urlParams = new URLSearchParams(uri.query);
  let obj = Object.fromEntries(urlParams);
  return {
    type: obj.type,
    addr: obj.addr,
  };
}
