import Container, { Service } from "typedi";
import { Localize } from "../common/Localize";

@Service()
export class Config {
  private i18n = Container.get(Localize);

  contractType = [
    {
      index: 0,
      label: "Ethereum Contract",
      detail: this.i18n.localize("ext.contract.eth.title"),
    },
    {
      index: 1,
      label: "Binance Contract",
      detail: this.i18n.localize("ext.contract.bsc.title"),
    },
  ];
}
