import type { StandardTransaction, PriceInfo } from '@/models/types';

/**
 * @description Interface for any blockchain data provider (e.g., BscScan, Etherscan).
 */
export interface IBlockchainConnector {
  getTransactions(address: string, startTime?: number, endTime?: number): Promise<any[]>;
  getInternalTransactions(address: string, startTime?: number, endTime?: number): Promise<any[]>;
  getTokenTransactions(address: string, startTime?: number, endTime?: number): Promise<any[]>;
}

/**
 * @description Interface for any price data provider (e.g., CoinGecko, Binance API).
 */
export interface IPriceConnector {
  getPrice(symbol: string): Promise<PriceInfo | null>;
  getMultiplePrices(symbols: string[]): Promise<Record<string, PriceInfo | null>>;
}

/**
 * Connector for interacting with the BSCScan API.
 */
export class BscScanConnector implements IBlockchainConnector {
  private static API_URL = 'https://api.bscscan.com/api';
  private apiKey: string;
  private startTimestamp: number | null = null;

  constructor(apiKey: string, startTimestamp: number | null = null) {
    this.apiKey = apiKey;
    this.startTimestamp = startTimestamp;
    if (!apiKey) {
      console.warn('BscScanConnector initialized without an API key. Requests may be rate-limited.');
    }
  }

  private async fetch(action: string, address: string): Promise<any[]> {
    let url = `${BscScanConnector.API_URL}?module=account&action=${action}&address=${address}&sort=desc&apikey=${this.apiKey}`;

    if (this.startTimestamp) {
      url += `&starttimestamp=${this.startTimestamp}`;
    }

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === '1') {
        return data.result || [];
      } else if (data.status === '0' && (data.message === 'No transactions found' || data.message === 'No records found')) {
        return [];
      } else {
        console.error(`Error fetching ${action} from BSCScan for address ${address}:`, data.message);
        // Check for rate limiting or API key issues
        if (data.message && (data.message.includes('rate limit') || data.message.includes('API rate'))) {
          throw new Error(`BSCScan API rate limited: ${data.message}. Consider configuring your own API key for higher limits.`);
        } else if (data.message && (data.message.includes('Invalid API Key') || data.message.includes('API key'))) {
          throw new Error(`BSCScan API key invalid: ${data.message}. Please check your API key configuration.`);
        } else {
          throw new Error(`BSCScan API error: ${data.message}`);
        }
      }
    } catch (error) {
      console.error(`Network or parsing error fetching ${action} from BSCScan:`, error);
      // Enhance network error messages
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(`Network error accessing BSCScan API. Please check your connection and API configuration.`);
      }
      throw error;
    }
  }

  async getTransactions(address: string): Promise<any[]> {
    return this.fetch('txlist', address);
  }

  async getInternalTransactions(address: string): Promise<any[]> {
    return this.fetch('txlistinternal', address);
  }

  async getTokenTransactions(address: string): Promise<any[]> {
    return this.fetch('tokentx', address);
  }
}

/**
 * Connector for the custom price API.
 */
export class GenericPriceConnector implements IPriceConnector {
  private static API_URL = 'https://price.lzq.dev/price';
  // Note: Caching is now handled by a dedicated CachingService, not within the connector.
  private pendingRequests = new Map<string, Promise<any>>();

  async getPrice(symbol: string): Promise<PriceInfo | null> {
    const prices = await this.getMultiplePrices([symbol]);
    return prices[symbol.toUpperCase()] || null;
  }

  async getMultiplePrices(symbols: string[]): Promise<Record<string, PriceInfo | null>> {
    const uniqueSymbols = [...new Set(symbols.map(s => s.toUpperCase()))];
    if (uniqueSymbols.length === 0) {
      return {};
    }

    const requestKey = uniqueSymbols.sort().join(',');

    // Avoids making the same concurrent request multiple times
    if (this.pendingRequests.has(requestKey)) {
      return this.pendingRequests.get(requestKey)!;
    }

    const promise = new Promise<Record<string, PriceInfo | null>>(async (resolve, reject) => {
      try {
        const url = `${GenericPriceConnector.API_URL}?symbols=${requestKey}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch prices, status: ${response.status}`);
        }
        const data = await response.json();

        const priceResults: Record<string, PriceInfo | null> = {};

        if (data.code === 200 && data.data) {
          Object.keys(data.data).forEach(key => {
            const price = parseFloat(data.data[key]);
            if (!isNaN(price)) {
              priceResults[key.toUpperCase()] = { usd: price };
            } else {
              priceResults[key.toUpperCase()] = null;
            }
          });
        }
        resolve(priceResults);
      } catch (error) {
        console.error('Error fetching prices from GenericPriceConnector:', error);
        // On error, resolve with nulls for all requested symbols to avoid breaking Promise.all
        const errorResults: Record<string, PriceInfo | null> = {};
        uniqueSymbols.forEach(s => { errorResults[s] = null; });
        resolve(errorResults);
      } finally {
        this.pendingRequests.delete(requestKey);
      }
    });

    this.pendingRequests.set(requestKey, promise);
    return promise;
  }
}
