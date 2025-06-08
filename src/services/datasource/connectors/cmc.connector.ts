import axios from 'axios';

const API_BASE_URL = '/api/cmc';

/**
 * Connector for CoinMarketCap API.
 */
export class CmcConnector {
    /**
   * Gets the fixed Binance Alpha category ID.
   * Uses the known category ID: 6762acaeb5d1b043d3342f44
   * @param apiKey The CoinMarketCap API key.
   * @param categoryName The name of the category (should be 'Binance Alpha').
   * @returns The fixed category ID.
   */
  public async findCategoryId(apiKey: string, categoryName: string): Promise<string | null> {
    if (!apiKey) throw new Error('CoinMarketCap API key is required.');

    if (categoryName === 'Binance Alpha') {
      console.log('[CMC] Using fixed Binance Alpha category ID: 6762acaeb5d1b043d3342f44');
      return '6762acaeb5d1b043d3342f44';
    }

    throw new Error(`Only 'Binance Alpha' category is supported, got: ${categoryName}`);
  }

    /**
   * Fetches all tokens belonging to the Binance Alpha category.
   * Uses the fixed category ID: 6762acaeb5d1b043d3342f44
   * @param apiKey The CoinMarketCap API key.
   * @param categoryId The ID of the category (should be 6762acaeb5d1b043d3342f44).
   * @returns The list of coins in that category.
   */
  public async getTokensByCategoryId(apiKey: string, categoryId: string): Promise<any[]> {
    if (!apiKey) throw new Error('CoinMarketCap API key is required.');

    // Ensure we're using the correct fixed category ID
    if (categoryId !== '6762acaeb5d1b043d3342f44') {
      console.warn(`[CMC] Unexpected category ID: ${categoryId}, using fixed Binance Alpha ID instead`);
      categoryId = '6762acaeb5d1b043d3342f44';
    }

    try {
      console.log(`[CMC] Fetching tokens for Binance Alpha category: ${categoryId}`);
      const response = await axios.get(`${API_BASE_URL}/v1/cryptocurrency/category`, {
        headers: { 'X-CMC_PRO_API_KEY': apiKey, 'Accept': 'application/json' },
        params: { id: categoryId, convert: 'USD', limit: 500 },
        timeout: 15000, // 15 second timeout
      });

      const coins = response.data.data.coins || [];
      console.log(`[CMC] Successfully fetched ${coins.length} Binance Alpha tokens`);
      return coins;
    } catch (error: any) {
      console.error(`[CMC] Failed to fetch Binance Alpha tokens:`, error.response?.data || error.message);
      throw new Error(`CoinMarketCap API request failed: ${error.response?.data?.status?.error_message || error.message}`);
    }
  }


}
