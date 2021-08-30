export default class OptionInfo {
  #callPrice;
  #putPrice;
  #greeksInfo;
  constructor(optionInfo) {
    this.#putPrice = Number(optionInfo.optionChainPutData.optionChainListData.LastSale.value);
    this.#callPrice = Number(optionInfo.optionChainCallData.optionChainListData.LastSale.value);
    this.#greeksInfo = optionInfo.optionChainCallData.optionChainGreeksList;
  }

  get callPrice() {
    return this.#callPrice;
  }

  get putPrice() {
    return this.#putPrice;
  }

  get impliedVolatility() {
    return Number(this.#greeksInfo.Impvol.value);
  }
}