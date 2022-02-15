import { BinanceParser } from "../parsers/binance-parser";
import { EthereumParser } from "../parsers/ethereum-parser";

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
