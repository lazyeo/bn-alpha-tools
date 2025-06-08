import { CoinGeckoPriceConnector } from './coingecko';
import type { CachingService } from '../caching/caching.service';

/**
 * Alpha Token Data Service
 * Dedicated service for fetching Alpha token data using the fixed CoinGecko ID: 6762acaeb5d1b043d3342f44
 */
export class AlphaTokenService {
    private coinGeckoConnector: CoinGeckoPriceConnector;
    private cachingService: CachingService;

    constructor(cachingService: CachingService, coinGeckoApiKey?: string) {
        this.cachingService = cachingService;
        this.coinGeckoConnector = new CoinGeckoPriceConnector(cachingService, coinGeckoApiKey);
    }

    /**
     * Gets comprehensive alpha token information including current market data.
     * @returns Alpha token data object with price, market cap, volume, etc.
     */
    async getAlphaTokenInfo(): Promise<any | null> {
        try {
            console.log('[AlphaTokenService] Fetching comprehensive alpha token information...');
            const tokenData = await this.coinGeckoConnector.getAlphaTokenData();

            if (!tokenData) {
                console.warn('[AlphaTokenService] No alpha token data available');
                return null;
            }

            // Extract and format key information
            const formattedData = {
                id: tokenData.id,
                symbol: tokenData.symbol?.toUpperCase() || 'ALPHA',
                name: tokenData.name || 'Alpha Token',
                image: tokenData.image?.large || tokenData.image?.small,
                current_price: tokenData.market_data?.current_price?.usd,
                market_cap: tokenData.market_data?.market_cap?.usd,
                market_cap_rank: tokenData.market_cap_rank,
                total_volume: tokenData.market_data?.total_volume?.usd,
                price_change_24h: tokenData.market_data?.price_change_24h,
                price_change_percentage_24h: tokenData.market_data?.price_change_percentage_24h,
                circulating_supply: tokenData.market_data?.circulating_supply,
                total_supply: tokenData.market_data?.total_supply,
                max_supply: tokenData.market_data?.max_supply,
                ath: tokenData.market_data?.ath?.usd,
                ath_date: tokenData.market_data?.ath_date?.usd,
                atl: tokenData.market_data?.atl?.usd,
                atl_date: tokenData.market_data?.atl_date?.usd,
                last_updated: tokenData.last_updated,
                description: tokenData.description?.en
            };

            console.log(`[AlphaTokenService] Successfully retrieved alpha token info: ${formattedData.name} (${formattedData.symbol})`);
            return formattedData;
        } catch (error) {
            console.error('[AlphaTokenService] Error fetching alpha token info:', error);
            return null;
        }
    }

    /**
     * Gets current price of the alpha token.
     * @returns Current price in USD, or null if unavailable.
     */
    async getCurrentPrice(): Promise<number | null> {
        try {
            console.log('[AlphaTokenService] Fetching current alpha token price...');
            const price = await this.coinGeckoConnector.getAlphaTokenCurrentPrice();

            if (price !== null) {
                console.log(`[AlphaTokenService] Current alpha token price: $${price}`);
            } else {
                console.warn('[AlphaTokenService] Unable to fetch current alpha token price');
            }

            return price;
        } catch (error) {
            console.error('[AlphaTokenService] Error fetching current price:', error);
            return null;
        }
    }

    /**
     * Gets historical price data for the alpha token.
     * @param days Number of days of historical data (default: 30)
     * @param interval Data interval: 'minutely' | 'hourly' | 'daily' (default: 'daily')
     * @returns Array of [timestamp, price] pairs, or null if unavailable.
     */
    async getPriceHistory(days: number = 30, interval: string = 'daily'): Promise<[number, number][] | null> {
        try {
            console.log(`[AlphaTokenService] Fetching ${days} days of price history (${interval} interval)...`);
            const priceHistory = await this.coinGeckoConnector.getAlphaTokenPriceHistory(days, interval);

            if (priceHistory && priceHistory.length > 0) {
                console.log(`[AlphaTokenService] Retrieved ${priceHistory.length} price data points`);
            } else {
                console.warn('[AlphaTokenService] No price history data available');
            }

            return priceHistory;
        } catch (error) {
            console.error('[AlphaTokenService] Error fetching price history:', error);
            return null;
        }
    }

    /**
     * Gets price at a specific timestamp (or closest available).
     * @param timestamp Unix timestamp (in seconds)
     * @returns Price at the specified time, or null if unavailable.
     */
    async getPriceAtTimestamp(timestamp: number): Promise<number | null> {
        try {
            // Convert timestamp to date for easier handling
            const targetDate = new Date(timestamp * 1000);
            const today = new Date();
            const daysAgo = Math.ceil((today.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24));

            // Fetch sufficient price history to cover the target date
            const days = Math.max(daysAgo + 1, 1);
            const priceHistory = await this.getPriceHistory(days, 'hourly');

            if (!priceHistory || priceHistory.length === 0) {
                console.warn(`[AlphaTokenService] No price history available for timestamp ${timestamp}`);
                return null;
            }

            // Find the closest price point to the target timestamp
            const targetTimestampMs = timestamp * 1000;
            let closestPrice = null;
            let minDifference = Infinity;

            for (const [priceTimestamp, price] of priceHistory) {
                const difference = Math.abs(priceTimestamp - targetTimestampMs);
                if (difference < minDifference) {
                    minDifference = difference;
                    closestPrice = price;
                }
            }

            // Only return the price if it's within 2 hours of the target time
            if (minDifference <= 2 * 60 * 60 * 1000) { // 2 hours in milliseconds
                console.log(`[AlphaTokenService] Found price $${closestPrice} at timestamp ${timestamp} (difference: ${Math.round(minDifference / 60000)} minutes)`);
                return closestPrice;
            } else {
                console.warn(`[AlphaTokenService] No price data within 2 hours of timestamp ${timestamp}`);
                return null;
            }
        } catch (error) {
            console.error('[AlphaTokenService] Error getting price at timestamp:', error);
            return null;
        }
    }

    /**
     * Gets aggregated market statistics for the alpha token.
     * @returns Market statistics object with key metrics.
     */
    async getMarketStatistics(): Promise<any | null> {
        try {
            console.log('[AlphaTokenService] Calculating market statistics...');

            const [tokenInfo, priceHistory7d, priceHistory30d] = await Promise.all([
                this.getAlphaTokenInfo(),
                this.getPriceHistory(7, 'daily'),
                this.getPriceHistory(30, 'daily')
            ]);

            if (!tokenInfo) {
                console.warn('[AlphaTokenService] Cannot calculate statistics without token info');
                return null;
            }

            const statistics = {
                basic_info: {
                    name: tokenInfo.name,
                    symbol: tokenInfo.symbol,
                    current_price: tokenInfo.current_price,
                    market_cap: tokenInfo.market_cap,
                    market_cap_rank: tokenInfo.market_cap_rank
                },
                price_performance: {
                    price_change_24h: tokenInfo.price_change_24h,
                    price_change_percentage_24h: tokenInfo.price_change_percentage_24h
                },
                supply_info: {
                    circulating_supply: tokenInfo.circulating_supply,
                    total_supply: tokenInfo.total_supply,
                    max_supply: tokenInfo.max_supply
                },
                extremes: {
                    all_time_high: tokenInfo.ath,
                    all_time_high_date: tokenInfo.ath_date,
                    all_time_low: tokenInfo.atl,
                    all_time_low_date: tokenInfo.atl_date
                }
            };

            // Calculate additional statistics from price history
            if (priceHistory7d && priceHistory7d.length > 0) {
                const prices7d = priceHistory7d.map(([, price]) => price);
                statistics.price_performance.week_high = Math.max(...prices7d);
                statistics.price_performance.week_low = Math.min(...prices7d);

                if (prices7d.length >= 2) {
                    const weekAgoPrice = prices7d[0];
                    const currentPrice = prices7d[prices7d.length - 1];
                    statistics.price_performance.price_change_7d = currentPrice - weekAgoPrice;
                    statistics.price_performance.price_change_percentage_7d =
                        ((currentPrice - weekAgoPrice) / weekAgoPrice) * 100;
                }
            }

            if (priceHistory30d && priceHistory30d.length > 0) {
                const prices30d = priceHistory30d.map(([, price]) => price);
                statistics.price_performance.month_high = Math.max(...prices30d);
                statistics.price_performance.month_low = Math.min(...prices30d);

                if (prices30d.length >= 2) {
                    const monthAgoPrice = prices30d[0];
                    const currentPrice = prices30d[prices30d.length - 1];
                    statistics.price_performance.price_change_30d = currentPrice - monthAgoPrice;
                    statistics.price_performance.price_change_percentage_30d =
                        ((currentPrice - monthAgoPrice) / monthAgoPrice) * 100;
                }
            }

            console.log('[AlphaTokenService] Market statistics calculated successfully');
            return statistics;
        } catch (error) {
            console.error('[AlphaTokenService] Error calculating market statistics:', error);
            return null;
        }
    }

    /**
     * Gets the fixed alpha token ID being used.
     * @returns The fixed CoinGecko ID for the alpha token.
     */
    getAlphaTokenId(): string {
        return CoinGeckoPriceConnector.getAlphaTokenId();
    }

    /**
     * Clears all cached alpha token data.
     * Useful for forcing fresh data fetch.
     */
    clearCache(): void {
        try {
            const alphaTokenId = this.getAlphaTokenId();
            const cacheKeys = [
                `alpha_token_${alphaTokenId}`,
                `alpha_current_price_${alphaTokenId}`,
                `alpha_price_history_${alphaTokenId}_7_daily`,
                `alpha_price_history_${alphaTokenId}_30_daily`,
                `alpha_price_history_${alphaTokenId}_7_hourly`,
                `alpha_price_history_${alphaTokenId}_30_hourly`
            ];

            cacheKeys.forEach(key => {
                this.cachingService.remove(key);
            });

            console.log('[AlphaTokenService] Alpha token cache cleared successfully');
        } catch (error) {
            console.error('[AlphaTokenService] Error clearing cache:', error);
        }
    }
}
