import { BinanceParser } from "../contract/BinanceParser";
import { EthereumParser } from "../contract/EthereumParser";

export class ContractParser {
  static parse(index: number, addr: string) {
    switch (index) {
      case ContractType.ethereum:
        new EthereumParser(addr).start();
        break;
      case ContractType.binance:
        new BinanceParser(addr).start();
      default:
        break;
    }
  }
}
enum ContractType {
  ethereum = 0,
  binance = 1,
}
