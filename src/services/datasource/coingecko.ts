import type { IPriceConnector, PriceInfo } from './connectors';
import type { CachingService } from '../caching/caching.service';

const COIN_ID_CACHE_TTL = 24 * 3600; // 24 hours
const PRICE_CACHE_TTL = 15 * 24 * 3600;    // 15 days for historical prices (history doesn't change)
const CURRENT_PRICE_CACHE_TTL = 5 * 60;    // 5 minutes for current prices (real-time data)
const ALPHA_TOKEN_CACHE_TTL = 6 * 3600; // 6 hours for alpha token data

// Fixed alpha token ID from CoinGecko
const ALPHA_TOKEN_FIXED_ID = '6762acaeb5d1b043d3342f44';

/**
 * Implements the IPriceConnector interface for fetching price data from the CoinGecko API.
 * Handles fetching both current and historical token prices.
 */
export class CoinGeckoPriceConnector implements IPriceConnector {
    private static FREE_API_BASE_URL = '/api/coingecko/api/v3';
    private static PRO_API_BASE_URL = '/api/coingecko-pro/api/v3';
    private static ASSET_PLATFORM = 'binance-smart-chain';
    private cachingService: CachingService;
    private apiKey: string | null;

    constructor(cachingService: CachingService, apiKey: string | null = null) {
        this.cachingService = cachingService;
        this.apiKey = apiKey;
    }

    /**
     * Gets the appropriate API base URL based on the type of API key
     */
    private getApiBaseUrl(): string {
        if (!this.apiKey) {
            return CoinGeckoPriceConnector.FREE_API_BASE_URL;
        }

        // Check if it's a Demo API key (Demo keys typically start with 'CG-' and are shorter)
        // or contain 'demo' in the key name
        const isDemoKey = this.apiKey.toLowerCase().includes('demo') ||
                         (this.apiKey.startsWith('CG-') && this.apiKey.length < 50);

        return isDemoKey ? CoinGeckoPriceConnector.FREE_API_BASE_URL : CoinGeckoPriceConnector.PRO_API_BASE_URL;
    }

    /**
     * Makes a request with optional API key authentication and better error handling.
     * @param url The URL to fetch.
     * @returns The fetch response.
     */
        private async fetchWithApiKey(url: string): Promise<Response> {
        const headers: Record<string, string> = {};

        if (this.apiKey) {
            // Detect API key type and use correct header
            const isDemoKey = this.apiKey.toLowerCase().includes('demo') ||
                             (this.apiKey.startsWith('CG-') && this.apiKey.length < 50);

            if (isDemoKey) {
                headers['x-cg-demo-api-key'] = this.apiKey;
                console.log(`[CoinGecko] Using Demo API key: ${this.apiKey.substring(0, 8)}... -> ${this.getApiBaseUrl()}`);
            } else {
                headers['x-cg-pro-api-key'] = this.apiKey;
                console.log(`[CoinGecko] Using Pro API key: ${this.apiKey.substring(0, 8)}... -> ${this.getApiBaseUrl()}`);
            }
        } else {
            console.log('[CoinGecko] Using free API (no key provided)');
        }

        console.log(`[CoinGecko] Fetching: ${url}`);

        try {
            const response = await fetch(url, {
                headers,
                signal: AbortSignal.timeout(15000) // 15 second timeout
            });
            console.log(`[CoinGecko] Response status: ${response.status}`);
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
     * Fetches alpha token data using the fixed alpha token ID.
     * @returns Alpha token data from CoinGecko, or null if not found.
     */
    async getAlphaTokenData(): Promise<any | null> {
        const cacheKey = `alpha_token_${ALPHA_TOKEN_FIXED_ID}`;

        // Check cache first
        const cachedData = this.cachingService.get<any>(cacheKey);
        if (cachedData) {
            console.log('[CoinGecko] Using cached alpha token data');
            return cachedData;
        }

        try {
            console.log(`[CoinGecko] Fetching alpha token data using fixed ID: ${ALPHA_TOKEN_FIXED_ID}`);
            const url = `${this.getApiBaseUrl()}/coins/${ALPHA_TOKEN_FIXED_ID}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`;
            const response = await this.fetchWithApiKey(url);

            if (response.status === 404) {
                console.warn(`[CoinGecko] Alpha token with ID ${ALPHA_TOKEN_FIXED_ID} not found`);
                this.cachingService.set(cacheKey, null, ALPHA_TOKEN_CACHE_TTL);
                return null;
            }

            if (!response.ok) {
                console.error(`[CoinGecko] Failed to fetch alpha token data, status: ${response.status}`);
                return null;
            }

            const tokenData = await response.json();

            // Cache the result
            this.cachingService.set(cacheKey, tokenData, ALPHA_TOKEN_CACHE_TTL);
            console.log(`[CoinGecko] Successfully fetched and cached alpha token data for ID: ${ALPHA_TOKEN_FIXED_ID}`);

            return tokenData;
        } catch (error) {
            console.error(`[CoinGecko] Error fetching alpha token data for ID ${ALPHA_TOKEN_FIXED_ID}:`, error);
            return null;
        }
    }

    /**
     * Fetches alpha token price history using the fixed alpha token ID.
     * @param days Number of days of price history to fetch (default: 30)
     * @param interval Data interval: 'minutely' | 'hourly' | 'daily' (default: 'daily')
     * @returns Array of [timestamp, price] pairs, or null if not found.
     */
    async getAlphaTokenPriceHistory(days: number = 30, interval: string = 'daily'): Promise<[number, number][] | null> {
        const cacheKey = `alpha_price_history_${ALPHA_TOKEN_FIXED_ID}_${days}_${interval}`;

        // Check cache first
        const cachedData = this.cachingService.get<[number, number][]>(cacheKey);
        if (cachedData) {
            console.log('[CoinGecko] Using cached alpha token price history');
            return cachedData;
        }

        try {
            console.log(`[CoinGecko] Fetching ${days} days of price history for alpha token ID: ${ALPHA_TOKEN_FIXED_ID}`);
            const url = `${this.getApiBaseUrl()}/coins/${ALPHA_TOKEN_FIXED_ID}/market_chart?vs_currency=usd&days=${days}&interval=${interval}`;
            const response = await this.fetchWithApiKey(url);

            if (response.status === 404) {
                console.warn(`[CoinGecko] Alpha token price history with ID ${ALPHA_TOKEN_FIXED_ID} not found`);
                this.cachingService.set(cacheKey, null, ALPHA_TOKEN_CACHE_TTL);
                return null;
            }

            if (!response.ok) {
                console.error(`[CoinGecko] Failed to fetch alpha token price history, status: ${response.status}`);
                return null;
            }

            const chartData = await response.json();
            const prices = chartData?.prices;

            if (prices && prices.length > 0) {
                this.cachingService.set(cacheKey, prices, ALPHA_TOKEN_CACHE_TTL);
                console.log(`[CoinGecko] Successfully fetched and cached ${prices.length} price points for alpha token`);
                return prices;
            } else {
                this.cachingService.set(cacheKey, null, ALPHA_TOKEN_CACHE_TTL);
                console.warn('[CoinGecko] No price data available for alpha token');
                return null;
            }
        } catch (error) {
            console.error(`[CoinGecko] Error fetching alpha token price history for ID ${ALPHA_TOKEN_FIXED_ID}:`, error);
            return null;
        }
    }

    /**
     * Gets current price for the alpha token using the fixed ID.
     * @returns Current price in USD, or null if not available.
     */
    async getAlphaTokenCurrentPrice(): Promise<number | null> {
        const cacheKey = `alpha_current_price_${ALPHA_TOKEN_FIXED_ID}`;

        // Check cache first (shorter TTL for current price)
        const cachedPrice = this.cachingService.get<number>(cacheKey);
        if (cachedPrice !== null) {
            console.log('[CoinGecko] Using cached alpha token current price');
            return cachedPrice;
        }

        try {
            console.log(`[CoinGecko] Fetching current price for alpha token ID: ${ALPHA_TOKEN_FIXED_ID}`);
            const url = `${this.getApiBaseUrl()}/simple/price?ids=${ALPHA_TOKEN_FIXED_ID}&vs_currencies=usd&include_24hr_change=true`;
            const response = await this.fetchWithApiKey(url);

            if (!response.ok) {
                console.error(`[CoinGecko] Failed to fetch alpha token current price, status: ${response.status}`);
                return null;
            }

            const priceData = await response.json();
            const price = priceData[ALPHA_TOKEN_FIXED_ID]?.usd;

            if (price !== undefined && price !== null) {
                // Cache for 5 minutes for current prices
                this.cachingService.set(cacheKey, price, CURRENT_PRICE_CACHE_TTL);
                console.log(`[CoinGecko] Successfully fetched current price for alpha token: $${price}`);
                return price;
            } else {
                console.warn('[CoinGecko] No current price data available for alpha token');
                return null;
            }
        } catch (error) {
            console.error(`[CoinGecko] Error fetching alpha token current price for ID ${ALPHA_TOKEN_FIXED_ID}:`, error);
            return null;
        }
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
                const coinInfoUrl = `${this.getApiBaseUrl()}/coins/${CoinGeckoPriceConnector.ASSET_PLATFORM}/contract/${contractAddress.toLowerCase()}`;
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
            const startOfDay = new Date(dateString + 'T00:00:00.000Z');
            const endOfDay = new Date(dateString + 'T23:59:59.999Z');

            const fromTimestamp = Math.floor(startOfDay.getTime() / 1000);
            const toTimestamp = Math.floor(endOfDay.getTime() / 1000);

            // For dates that are too recent (within last 24 hours), adjust to avoid API issues
            const now = Math.floor(Date.now() / 1000);
            const oneDayAgo = now - (24 * 60 * 60);

            if (fromTimestamp > oneDayAgo) {
                console.warn(`[CoinGecko] Date ${dateString} is too recent for historical data, using yesterday's data instead`);
                const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
                const yesterdayString = yesterday.toISOString().split('T')[0];
                const yesterdayStart = new Date(yesterdayString + 'T00:00:00.000Z');
                const yesterdayEnd = new Date(yesterdayString + 'T23:59:59.999Z');

                const adjustedFrom = Math.floor(yesterdayStart.getTime() / 1000);
                const adjustedTo = Math.floor(yesterdayEnd.getTime() / 1000);

                const chartUrl = `${this.getApiBaseUrl()}/coins/${coinId}/market_chart/range?vs_currency=usd&from=${adjustedFrom}&to=${adjustedTo}`;
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
            }

            const chartUrl = `${this.getApiBaseUrl()}/coins/${coinId}/market_chart/range?vs_currency=usd&from=${fromTimestamp}&to=${toTimestamp}`;
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

    /**
     * Fetches current prices for multiple tokens in a single API call.
     * This is much more efficient than individual calls.
     * @param contractAddresses Array of contract addresses to fetch prices for
     * @returns Map of contract address to current price
     */
    async getBatchCurrentPrices(contractAddresses: string[]): Promise<Map<string, number | null>> {
        const result = new Map<string, number | null>();

        if (contractAddresses.length === 0) {
            return result;
        }

        // Remove duplicates and normalize addresses
        const uniqueAddresses = [...new Set(contractAddresses.map(addr => addr.toLowerCase()))];
        console.log(`[CoinGecko] Batch fetching current prices for ${uniqueAddresses.length} tokens`);

        try {
            // Build the contract addresses parameter for CoinGecko API
            const contractsParam = uniqueAddresses.join(',');
            const url = `${this.getApiBaseUrl()}/simple/token_price/${CoinGeckoPriceConnector.ASSET_PLATFORM}?contract_addresses=${contractsParam}&vs_currencies=usd&include_24hr_change=false`;

            const response = await this.fetchWithApiKey(url);

            if (!response.ok) {
                console.error(`[CoinGecko] Failed to fetch batch prices, status: ${response.status}`);
                // Return null for all addresses
                uniqueAddresses.forEach(addr => result.set(addr, null));
                return result;
            }

            const priceData = await response.json();

            // Map the results back to the original addresses
            uniqueAddresses.forEach(address => {
                const price = priceData[address]?.usd;
                result.set(address, price !== undefined ? price : null);
            });

            console.log(`[CoinGecko] Successfully fetched batch prices for ${result.size} tokens`);
            return result;

        } catch (error) {
            console.error('[CoinGecko] Error in batch price fetch:', error);
            // Return null for all addresses
            uniqueAddresses.forEach(addr => result.set(addr, null));
            return result;
        }
    }

    /**
     * Fetches historical prices for multiple tokens on a specific date.
     * Uses batch API calls where possible to reduce rate limiting.
     * @param tokenDatePairs Array of {contractAddress, date} pairs
     * @returns Map of "contractAddress-date" to price
     */
    async getBatchHistoricalPrices(tokenDatePairs: Array<{contractAddress: string, date: string}>): Promise<Map<string, number | null>> {
        const result = new Map<string, number | null>();

        if (tokenDatePairs.length === 0) {
            return result;
        }

        // Group by date to minimize API calls
        const dateGroups = new Map<string, string[]>();
        tokenDatePairs.forEach(({contractAddress, date}) => {
            const normalizedAddress = contractAddress.toLowerCase();
            if (!dateGroups.has(date)) {
                dateGroups.set(date, []);
            }
            if (!dateGroups.get(date)!.includes(normalizedAddress)) {
                dateGroups.get(date)!.push(normalizedAddress);
            }
        });

        console.log(`[CoinGecko] Batch fetching historical prices for ${tokenDatePairs.length} token-date pairs across ${dateGroups.size} dates`);

        // Process each date group
        for (const [date, addresses] of dateGroups.entries()) {
            console.log(`[CoinGecko] Processing ${addresses.length} tokens for date ${date}`);

            // For each address in this date group, get the price
            for (const address of addresses) {
                const cacheKey = `price_${address}_${date}`;

                // Check cache first
                let price = this.cachingService.get<number>(cacheKey);
                if (price !== null && price !== undefined) {
                    result.set(`${address}-${date}`, price);
                    continue;
                }

                // Fetch from API
                try {
                    const targetDate = new Date(date + 'T12:00:00.000Z'); // Use noon UTC
                    const chart = await this.getDailyMarketChart(address, targetDate);

                    if (chart && chart.length > 0) {
                        // Find the price closest to the target date
                        const targetTimestamp = targetDate.getTime();
                        let closestPrice = null;
                        let minDifference = Infinity;

                        for (const [timestamp, priceValue] of chart) {
                            const difference = Math.abs(timestamp - targetTimestamp);
                            if (difference < minDifference) {
                                minDifference = difference;
                                closestPrice = priceValue;
                            }
                        }

                        price = closestPrice;

                        // Cache the result for 15 days (historical prices don't change)
                        if (price !== null) {
                            this.cachingService.set(cacheKey, price, PRICE_CACHE_TTL);
                        }
                    } else {
                        price = null;
                    }

                    result.set(`${address}-${date}`, price);

                    // Add delay between API calls to respect rate limits
                    await new Promise(resolve => setTimeout(resolve, 1200)); // 1.2 second delay

                } catch (error) {
                    console.error(`[CoinGecko] Error fetching price for ${address} on ${date}:`, error);
                    result.set(`${address}-${date}`, null);
                }
            }
        }

        console.log(`[CoinGecko] Completed batch historical price fetch: ${result.size} results`);
        return result;
    }

    /**
     * Gets the fixed alpha token ID.
     * @returns The fixed alpha token ID string.
     */
    static getAlphaTokenId(): string {
        return ALPHA_TOKEN_FIXED_ID;
    }
}
