import axios from 'axios';
import alphaTokensConfig from '@/config/alpha-tokens.json';

const API_BASE_URL = '/api/cmc';

/**
 * Connector for CoinMarketCap API.
 */
export class CmcConnector {
  /**
   * Finds the ID of a specific category by its name.
   * In production (when CORS prevents direct API access), uses static config as fallback.
   * @param apiKey The CoinMarketCap API key.
   * @param categoryName The name of the category to find.
   * @returns The category ID, or null if not found.
   */
  public async findCategoryId(apiKey: string, categoryName: string): Promise<string | null> {
    if (!apiKey) throw new Error('CoinMarketCap API key is required.');

    try {
      const response = await axios.get(`${API_BASE_URL}/v1/cryptocurrency/categories`, {
        headers: { 'X-CMC_PRO_API_KEY': apiKey, 'Accept': 'application/json' },
        timeout: 10000, // 10 second timeout
      });
      const categories = response.data.data;
      const found = categories.find(cat => cat.name === categoryName);
      return found ? found.id : null;
    } catch (error: any) {
      console.warn(`[CMC] API request failed, falling back to static config:`, error.response?.data || error.message);

      // Fallback to static config in production environments (CORS blocked)
      if (categoryName === 'Binance Alpha') {
        return 'static_binance_alpha'; // Static identifier for fallback
      }

      throw new Error(`CoinMarketCap API request failed and no static fallback available for category: ${categoryName}`);
    }
  }

  /**
   * Fetches all tokens belonging to a specific category ID.
   * In production (when CORS prevents direct API access), uses static config as fallback.
   * @param apiKey The CoinMarketCap API key.
   * @param categoryId The ID of the category.
   * @returns The list of coins in that category.
   */
  public async getTokensByCategoryId(apiKey: string, categoryId: string): Promise<any[]> {
    if (!apiKey) throw new Error('CoinMarketCap API key is required.');

    try {
      const response = await axios.get(`${API_BASE_URL}/v1/cryptocurrency/category`, {
        headers: { 'X-CMC_PRO_API_KEY': apiKey, 'Accept': 'application/json' },
        params: { id: categoryId, convert: 'USD', limit: 500 },
        timeout: 10000, // 10 second timeout
      });
      return response.data.data.coins || [];
    } catch (error: any) {
      console.warn(`[CMC] API request failed, falling back to static config:`, error.response?.data || error.message);

      // Fallback to static config for Binance Alpha tokens
      if (categoryId === 'static_binance_alpha') {
        console.log('[CMC] Using static config fallback for Binance Alpha tokens');
        return this.convertStaticConfigToApiFormat(alphaTokensConfig);
      }

      throw new Error(`CoinMarketCap API request failed and no static fallback available for category ID: ${categoryId}`);
    }
  }

  /**
   * Converts static config format to CMC API format for compatibility.
   * @param config The static alpha tokens configuration.
   * @returns Array of tokens in CMC API format.
   */
  private convertStaticConfigToApiFormat(config: any): any[] {
    const tokens: any[] = [];

    if (config.tokens_by_chain) {
      Object.entries(config.tokens_by_chain).forEach(([chainName, chainTokens]: [string, any[]]) => {
        chainTokens.forEach((token, index) => {
          // Skip tokens without contract addresses (like native coins)
          if (token.contract_address && token.contract_address !== 'N/A') {
            tokens.push({
              id: token.id || (1000 + index),
              name: token.name,
              symbol: token.symbol,
              slug: token.slug || token.symbol.toLowerCase(),
              cmc_rank: index + 1,
              platform: {
                name: chainName,
                token_address: token.contract_address
              },
              quote: {
                USD: {
                  price: 1.0, // Placeholder price - will be fetched separately
                  volume_24h: 0,
                  market_cap: 0,
                  percent_change_24h: 0
                }
              }
            });
          }
        });
      });
    }

    console.log(`[CMC] Converted ${tokens.length} tokens from static config`);
    return tokens;
  }
}
