import type { IPriceConnector, PriceInfo } from './connectors';
import type { CachingService } from '../caching/caching.service';

const COIN_ID_CACHE_TTL = 24 * 3600; // 24 hours
const PRICE_CACHE_TTL = 1 * 3600;    // 1 hour

/**
 * Implements the IPriceConnector interface for fetching price data from the CoinGecko API.
 * Handles fetching both current and historical token prices.
 */
export class CoinGeckoPriceConnector implements IPriceConnector {
    private static API_BASE_URL = '/api/coingecko/api/v3';
    private static ASSET_PLATFORM = 'binance-smart-chain';
    private cachingService: CachingService;
    private apiKey: string | null;

    constructor(cachingService: CachingService, apiKey: string | null = null) {
        this.cachingService = cachingService;
        this.apiKey = apiKey;
    }

    /**
     * Makes a request with optional API key authentication and better error handling.
     * @param url The URL to fetch.
     * @returns The fetch response.
     */
    private async fetchWithApiKey(url: string): Promise<Response> {
        const headers: Record<string, string> = {};
        if (this.apiKey) {
            headers['x-cg-pro-api-key'] = this.apiKey;
        }

        try {
            const response = await fetch(url, {
                headers,
                signal: AbortSignal.timeout(15000) // 15 second timeout
            });
            return response;
        } catch (error: any) {
            // Handle CORS and network errors gracefully
            if (error.name === 'TypeError' && error.message.includes('CORS')) {
                console.warn('[CoinGecko] CORS error detected - API proxy may not be available in production');
            } else if (error.name === 'TimeoutError') {
                console.warn('[CoinGecko] Request timeout - API may be slow or unavailable');
            } else {
                console.warn('[CoinGecko] Network error:', error.message);
            }
            throw error;
        }
    }

    // This method is for compatibility with the IPriceConnector interface for current prices.
    // It is not the primary method for this application's needs.
    async getPrice(symbol: string): Promise<PriceInfo | null> {
        console.warn(`getPrice for symbol ${symbol} is not robustly implemented in CoinGeckoPriceConnector.`);
        return null;
    }

    // This method is for compatibility with the IPriceConnector interface for current prices.
    async getMultiplePrices(symbols: string[]): Promise<Record<string, PriceInfo | null>> {
        console.warn(`getMultiplePrices is not robustly implemented in CoinGeckoPriceConnector.`);
        return {};
    }

    /**
     * Fetches the full market chart for a token for a given day (UTC).
     * @param contractAddress The contract address of the token on BSC.
     * @param date The specific day for which to fetch the chart.
     * @returns An array of [timestamp, price] pairs, or null if not found.
     */
    async getDailyMarketChart(contractAddress: string, date: Date): Promise<[number, number][] | null> {
        const dateString = date.toISOString().split('T')[0];
        const cacheKey = `chart_${contractAddress}_${dateString}`;
        const coinIdCacheKey = `coinid_${contractAddress}`;

        const cachedChart = this.cachingService.get<[number, number][]>(cacheKey);
        if (cachedChart) {
            return cachedChart;
        }

        try {
            let coinId = this.cachingService.get<string>(coinIdCacheKey);
            if (!coinId) {
                const coinInfoUrl = `${CoinGeckoPriceConnector.API_BASE_URL}/coins/${CoinGeckoPriceConnector.ASSET_PLATFORM}/contract/${contractAddress.toLowerCase()}`;
                const coinInfoResponse = await this.fetchWithApiKey(coinInfoUrl);
                if (coinInfoResponse.status === 404) {
                    this.cachingService.set(coinIdCacheKey, 'not_found', COIN_ID_CACHE_TTL);
                    return null;
                }
                if (!coinInfoResponse.ok) return null;

                const coinInfo = await coinInfoResponse.json();
                coinId = coinInfo.id;
                this.cachingService.set(coinIdCacheKey, coinId, COIN_ID_CACHE_TTL);
            }

            if (coinId === 'not_found') return null;

            // Define the 24-hour range for the given date in UTC
            const startOfDay = new Date(dateString);
            startOfDay.setUTCHours(0, 0, 0, 0);
            const endOfDay = new Date(startOfDay);
            endOfDay.setUTCHours(23, 59, 59, 999);

            const fromTimestamp = Math.floor(startOfDay.getTime() / 1000);
            const toTimestamp = Math.floor(endOfDay.getTime() / 1000);

            const chartUrl = `${CoinGeckoPriceConnector.API_BASE_URL}/coins/${coinId}/market_chart/range?vs_currency=usd&from=${fromTimestamp}&to=${toTimestamp}`;
            const chartResponse = await this.fetchWithApiKey(chartUrl);
            if (!chartResponse.ok) {
                this.cachingService.set(cacheKey, null, PRICE_CACHE_TTL);
                return null;
            }

            const chartData = await chartResponse.json();
            const prices = chartData?.prices;

            if (prices && prices.length > 0) {
                this.cachingService.set(cacheKey, prices, PRICE_CACHE_TTL);
                return prices;
            } else {
                this.cachingService.set(cacheKey, null, PRICE_CACHE_TTL);
                return null;
            }

        } catch (error) {
            console.error(`[CoinGecko] A network or other unexpected error occurred for ${contractAddress}:`, error);
            return null;
        }
    }
}
