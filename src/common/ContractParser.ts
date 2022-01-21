import { EthereumParser } from "../contract/EthereumParser";

export class ContractParser {
  static parse(index: number, addr: string) {
    switch (index) {
      case ContractType.ethereum:
        new EthereumParser().parse(addr);
        break;
      default:
        break;
    }
  }
}
enum ContractType {
  ethereum = 0,
}
