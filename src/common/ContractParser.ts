import { EthereumParser } from "../contract/EthereumParser";
import { EthereumParser2 } from "../contract/EthereumParser2";

export class ContractParser {
  static parse(index: number, addr: string) {
    switch (index) {
      case ContractType.ethereum:
        new EthereumParser2(addr).start();
        break;
      default:
        break;
    }
  }
}
enum ContractType {
  ethereum = 0,
}
