import moment from 'moment';
import axios from 'axios';
import OptionInfo from './optionInfo.js';

// functions to generate urls
export function getStockPriceUrl(stock) {
  return `https://api.nasdaq.com/api/quote/${stock}/info?assetclass=stocks`;
}

export function getOptionPriceUrl({stock, isCall=true, strikeDate, strikePrice}={}) {
  const formattedStrikeDate = moment(strikeDate).format('YYMMDD');
  // make sure it's 8 digits #####.### => ########
  const formattedStrikePrice = String(strikePrice * 100).padStart( 7, "0").padEnd(8, "0");
  // they want the stymbol to always be 6 letters apparently
  const formattedStockTicker = stock.padEnd(6, '-');
  return `https://api.nasdaq.com/api/quote/${stock}/option-chain?assetclass=stocks&recordID=${formattedStockTicker}${formattedStrikeDate}${isCall? 'C': 'P'}${formattedStrikePrice}`;
}

export async function getStockPrice(stockTicker) {
  const url = getStockPriceUrl(stockTicker);
  const result = await axios.get(url);
  const stockPrice = result.data.data.primaryData.lastSalePrice.substring(1); // removing dollar sign
  return Number(stockPrice);
}

export async function getOptionPrice({stock, isCall=true, strikeDate, strikePrice}={}) {
  const url = getOptionPriceUrl({stock, isCall, strikeDate, strikePrice});
  const result = await axios.get(url);
  const optionInfo = new OptionInfo(result.data.data);
  if (isCall) {
    return optionInfo.callPrice;
  } else {
    return optionInfo.putPrice;
  }
}

export async function getStockVolatility({stock, strikeDate, strikePrice}={}) {
  const url = getOptionPriceUrl({stock, isCall: true, strikeDate, strikePrice});
  const result = await axios.get(url);
  const optionInfo = new OptionInfo(result.data.data);
  return optionInfo.impliedVolatility;
}