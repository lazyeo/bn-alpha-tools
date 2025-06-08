import axios from 'axios';

const API_BASE_URL = '/api/cmc';

/**
 * Connector for CoinMarketCap API.
 */
export class CmcConnector {
  /**
   * Finds the ID of a specific category by its name.
   * @param apiKey The CoinMarketCap API key.
   * @param categoryName The name of the category to find.
   * @returns The category ID, or null if not found.
   */
  public async findCategoryId(apiKey: string, categoryName: string): Promise<string | null> {
    if (!apiKey) throw new Error('CoinMarketCap API key is required.');

    try {
      const response = await axios.get(`${API_BASE_URL}/v1/cryptocurrency/categories`, {
        headers: { 'X-CMC_PRO_API_KEY': apiKey, 'Accept': 'application/json' },
      });
      const categories = response.data.data;
      const found = categories.find(cat => cat.name === categoryName);
      return found ? found.id : null;
    } catch (error: any) {
      console.error(`[CMC] Error finding category ID for "${categoryName}":`, error.response?.data || error.message);
      throw new Error(`CoinMarketCap API request failed while finding category ID.`);
    }
  }

  /**
   * Fetches all tokens belonging to a specific category ID.
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
      });
      return response.data.data.coins || [];
    } catch (error: any) {
      console.error(`[CMC] Error fetching tokens for category ID "${categoryId}":`, error.response?.data || error.message);
      throw new Error(`CoinMarketCap API request failed while fetching tokens by category.`);
    }
  }
}
