import {getStockPriceUrl, getOptionPriceUrl, getStockPrice, getOptionPrice, getStockVolatility} from './index';
import moment from 'moment';

test('getStockPriceUrl returns the correct url', () => {
  const functionResult = getStockPriceUrl('AAPL');
  const expectedResult = 'https://api.nasdaq.com/api/quote/AAPL/info?assetclass=stocks';
  expect(functionResult).toBe(expectedResult);
});

test('getOptionPriceUrl returns the correct url', () => {
  const functioResult = getOptionPriceUrl({
    stock: 'AAPL',
    isCall: true,
    strikeDate: new Date("06/25/2021"),
    strikePrice: 122
  });
  const expectedResult = 'https://api.nasdaq.com/api/quote/AAPL/option-chain?assetclass=stocks&recordID=AAPL--210625C00122000';
  expect(functioResult).toBe(expectedResult);
});

test('getStockPrice returns data', async () => {
  const result = await getStockPrice('AAPL');
  // assuming apple will never be zero in my life time 🤔
  expect(result).toBeGreaterThan(0);
});

test('getOptionPrice is working as expected', async () => {
  const strikeDate = moment().startOf('week').add(5, 'day'); // first coming Friday
  const stock = 'AAPL';
  const stockPrice = await getStockPrice(stock);
  const strikePrice = Math.ceil(stockPrice/10)*10;
  const callResult = await getOptionPrice({
    stock,
    strikeDate,
    strikePrice,
  });
  expect(callResult).toBeGreaterThan(0);
  const putResult = await getOptionPrice({
    stock,
    strikeDate,
    strikePrice,
    isCall: false,
  });
  expect(putResult).toBeGreaterThan(0);
  // put should be higher becaue we rounded up
  expect(putResult).toBeGreaterThan(callResult);
});

test('getStockVolatility is working as expected', async () => {
  const strikeDate = moment().startOf('week').add(5, 'day');
  const stock = 'CCL';
  const strikePrice = 25;
  const volitality = await getStockVolatility({stock, strikeDate, strikePrice});
  expect(volitality).toBeGreaterThan(0);
});