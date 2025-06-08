import { defineStore } from 'pinia'

// --- Import New Services ---
import { BscScanConnector } from '@/services/datasource/connectors'
import { CmcConnector } from '@/services/datasource/connectors/cmc.connector'
import { DataProcessingService } from '@/services/processing/processing.service'
import { AlphaAnalyzerPlugin } from '@/services/analysis/analysis.plugin'
// Since Vite supports importing JSON, we can get the config directly.
import alphaTokensConfig from '@/config/alpha-tokens.json'
// import { TransactionUtils } from '@/utils/transaction' // No longer needed
import { CachingService } from '@/services/caching/caching.service'
import { CoinGeckoPriceConnector } from '@/services/datasource/coingecko'

const settingsCache = new CachingService('localStorage')
const alphaTokensCache = new CachingService('localStorage'); // Cache for alpha tokens
const transactionCache = new CachingService('localStorage'); // Cache for transactions
const priceCache = new CachingService('localStorage'); // New dedicated cache for prices
const statisticsCache = new CachingService('localStorage'); // Cache for daily statistics
const API_KEYS_CACHE_KEY = 'bn_alpha_api_keys'
const ALPHA_TOKENS_CACHE_KEY = 'bn_alpha_tokens_data'
const ALPHA_TOKENS_CACHE_TTL = 3600 * 1000 // 1 hour
const TRANSACTIONS_CACHE_PREFIX = 'bn_alpha_tx_'
const TRANSACTIONS_CACHE_TTL = 3600 * 24 * 3; // 3 days
const STATISTICS_CACHE_PREFIX = 'bn_alpha_stats_'
const STATISTICS_CACHE_TTL = 3600 * 24 * 7; // 7 days

// Helper function moved from the old TransactionUtils
const _groupTransactionsByDay = (transactions) => {
  console.log('[GROUPING] Starting to group', transactions.length, 'transactions by day.');
  const dayMap = new Map();

  transactions.forEach((tx) => {
    // Basic validation for the transaction object and its timestamp
    if (!tx || (tx.timeStamp === undefined && tx.timestamp === undefined)) {
        console.warn('Skipping transaction with empty timestamp:', tx);
        return;
    }

    const ts = tx?.timeStamp || tx?.timestamp;
    if (ts === undefined || ts === null || ts === '') {
        console.warn('Skipping transaction with empty timestamp:', tx);
        return;
    }

    const timestampMs = parseInt(ts) * 1000;
    if (isNaN(timestampMs)) {
        console.warn('Skipping transaction with invalid timestamp after parsing:', tx);
        return;
    }

    const date = new Date(timestampMs);
    // No need to check date validity again, as isNaN on timestampMs covers it.

    const utcDate = date.toISOString().split('T')[0];
    if (!dayMap.has(utcDate)) {
      dayMap.set(utcDate, {
        date: utcDate,
        transactions: [],
        tokenStats: {}, // Initialize tokenStats for the new day
        // The detailed stats are now stored in a nested object
        statistics: null, // Will hold calculated stats like inflow, points, etc.
        lastCalculated: null, // Timestamp of the last calculation
      });
    }
        const dayData = dayMap.get(utcDate);
    dayData.transactions.push(tx);

    // Initialize daily stats if not already set
    if (!dayData.gasStats) {
      dayData.gasStats = {
        totalGasBnb: 0,
        totalGasUsd: 0,
        transactionCount: 0
      };
    }
    if (!dayData.flowStats) {
      dayData.flowStats = {
        alphaInflow: 0,
        alphaOutflow: 0,
        stablecoinInflow: 0,
        stablecoinOutflow: 0,
        bnbInflow: 0,
        bnbOutflow: 0,
        netAlphaUsd: 0,
        netStablecoinUsd: 0,
        netBnbUsd: 0
      };
    }
    if (dayData.alphaVolume === undefined) {
      dayData.alphaVolume = 0;
      dayData.alphaInflowUsd = 0;
      dayData.bscBonusUsd = 0;
      dayData.totalBnb = 0;
      dayData.totalUsdProfit = 0;
    }

    // Count transaction for gas stats
    dayData.gasStats.transactionCount++;

    // Add gas cost (assuming BNB price can be fetched later)
    if (tx.gasFee) {
      dayData.gasStats.totalGasBnb += tx.gasFee;
      dayData.totalBnb += tx.gasFee;
    }

    tx.flows.forEach((flow) => {
                          const tokenSymbol = flow.token.symbol.toUpperCase();
                    // More comprehensive stablecoin detection
                    const isStablecoin = ['USDT', 'USDC', 'BUSD', 'DAI', 'TUSD', 'FRAX', 'LUSD'].includes(tokenSymbol) ||
                                       tokenSymbol.includes('USD') ||
                                       flow.token.contractAddress?.toLowerCase() === '0x55d398326f99059ff775485246999027b3197955' || // BSC USDT
                                       flow.token.contractAddress?.toLowerCase() === '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d' || // BSC USDC
                                       flow.token.contractAddress?.toLowerCase() === '0xe9e7cea3dedca5984780bafc599bd69add087d56';   // BSC BUSD
                    const isBnb = tokenSymbol === 'BNB' || tokenSymbol === 'WBNB' || tokenSymbol === 'ETH' || tokenSymbol === 'WETH';

      // Logic to identify Alpha tokens (e.g., based on a list or if it has a price)
      // For now, we assume any token with a historical price is an "Alpha" token for volume calculation.
      if (flow.historicalPrice && flow.historicalPrice > 0) {
        const usdValue = flow.amount * flow.historicalPrice;

        // Categorize token type and update flow stats
        if (isStablecoin) {
          console.log(`[GROUPING] Stablecoin detected: ${tokenSymbol} (${flow.token.contractAddress}) | ${flow.isInflow ? 'Inflow' : 'Outflow'}: $${usdValue.toFixed(2)}`);
          if (flow.isInflow) {
            dayData.flowStats.stablecoinInflow += usdValue;
          } else {
            dayData.flowStats.stablecoinOutflow += usdValue;
          }
        } else if (isBnb) {
          if (flow.isInflow) {
            dayData.flowStats.bnbInflow += usdValue;
          } else {
            dayData.flowStats.bnbOutflow += usdValue;
          }
        } else {
          // Assume it's an Alpha token
          if (flow.isInflow) {
            dayData.flowStats.alphaInflow += usdValue;
          } else {
            dayData.flowStats.alphaOutflow += usdValue;
          }
        }

        if (flow.isInflow) {
          console.log(`[GROUPING] Day ${utcDate} - Found Alpha Inflow: ${flow.token.symbol} | Amount: ${flow.amount} | Price: ${flow.historicalPrice} | USD Value: ${usdValue}`);
          dayData.alphaInflowUsd += usdValue;

          // Check if this is a BSC chain token for bonus calculation
          // BSC chain contract addresses are typically 42 characters starting with "0x"
          const isBscToken = flow.token.contractAddress &&
                            flow.token.contractAddress.length === 42 &&
                            flow.token.contractAddress.startsWith('0x');

          if (isBscToken) {
            dayData.bscBonusUsd += usdValue;
            console.log(`[GROUPING] Day ${utcDate} - BSC Bonus Added: ${flow.token.symbol} | Bonus Value: ${usdValue}`);
          }
        }

        // For alpha volume, only count inflow to avoid double counting
        if (flow.isInflow) {
          dayData.alphaVolume += usdValue;
        }
      }

      // We can still populate tokenStats for general statistics if needed
      if (!dayData.tokenStats[tokenSymbol]) {
        dayData.tokenStats[tokenSymbol] = {
          inflow: 0,
          outflow: 0,
          address: flow.token.contractAddress || '',
        };
      }
      if (flow.isInflow) {
        dayData.tokenStats[tokenSymbol].inflow += flow.amount;
      } else {
        dayData.tokenStats[tokenSymbol].outflow += flow.amount;
      }
    });

    // Calculate net flows
    dayData.flowStats.netAlphaUsd = dayData.flowStats.alphaInflow - dayData.flowStats.alphaOutflow;
    dayData.flowStats.netStablecoinUsd = dayData.flowStats.stablecoinInflow - dayData.flowStats.stablecoinOutflow;
    dayData.flowStats.netBnbUsd = dayData.flowStats.bnbInflow - dayData.flowStats.bnbOutflow;

    // Calculate total net loss (negative values indicate loss)
    // Gas is always a loss, so we subtract it
    dayData.flowStats.totalNetUsd = dayData.flowStats.netAlphaUsd + dayData.flowStats.netStablecoinUsd + dayData.flowStats.netBnbUsd - (dayData.gasStats.totalGasBnb * 600); // Assuming BNB ~$600, should be dynamic

    // After processing all transactions for a day, calculate points with bonus
    dayData.points = calculatePoints(dayData.alphaInflowUsd, dayData.bscBonusUsd);
    console.log(`[GROUPING] Day ${utcDate} - Alpha Inflow: ${dayData.alphaInflowUsd.toFixed(2)} | BSC Bonus: ${dayData.bscBonusUsd.toFixed(2)} | Calculated Points: ${dayData.points.toFixed(2)}`);
  });
  console.log('[GROUPING] Grouping complete.');
  return dayMap;
};

// Helper function for points calculation, can be moved to a utility file later
const calculatePoints = (usdValue, bonusValue = 0) => {
  const totalValue = usdValue + bonusValue;
  if (!totalValue || totalValue <= 1) return 0;
  return Math.floor(Math.log(totalValue) / Math.log(2));
};

// Helper function to find the closest price in a chart for a given timestamp
const findPriceInChart = (chart, timestamp) => {
  if (!chart || chart.length === 0) return null;

  const txTime = timestamp * 1000; // Convert to ms to match chart timestamps

  // Find the price point with the minimum time difference
  let closest = chart.reduce((prev, curr) => {
    return (Math.abs(curr[0] - txTime) < Math.abs(prev[0] - txTime) ? curr : prev);
  });

  // If the closest found timestamp is more than 2 hours away, it's likely not representative
  if (Math.abs(closest[0] - txTime) > 2 * 3600 * 1000) {
    return null;
  }

  return closest[1]; // Return the price
};

export const useBscStore = defineStore('bsc', {
  state: () => ({
    // 搜索相关
    currentAddress: '',
    searchResults: [],
    searchHistory: [],

    // API Keys
    apiKeys: {
      bsc: '',
      cmc: '',
      coingecko: '',
    },

    // Alpha Tokens
    alphaTokens: null, // Will hold the rich token data from CMC, as a Map by contract address
    alphaTokensLastUpdated: null, // Timestamp of last fetch

    // 统计数据
    statistics: {
      totalTransactions: 0,
      totalVolume: 0,
      averageDaily: 0,
      activeDays: 0
    },

    // 设置
    settings: {
      autoRefresh: true,
      refreshInterval: 30,
      notifications: true,
      theme: 'light'
    },

    // UI状态
    loading: false,
    error: null
  }),

  getters: {
    // 获取格式化的搜索历史
    formattedSearchHistory: (state) => {
      return state.searchHistory.map(address => ({
        address,
        shortAddress: `${address.slice(0, 8)}...${address.slice(-6)}`,
        timestamp: Date.now() // 实际应用中应该保存真实时间戳
      }))
    },

    // 获取热门地址（基于搜索历史前三个）
    hotAddresses: (state) => {
      return state.searchHistory.slice(0, 3).map((address, index) => ({
        address,
        description: `历史查询 #${index + 1}`,
        shortAddress: `${address.slice(0, 8)}...${address.slice(-6)}`
      }))
    },

    // 是否有数据
    hasData: (state) => state.searchResults.length > 0,

    // 获取当前地址的短格式
    currentAddressShort: (state) => {
      if (!state.currentAddress) return ''
      return `${state.currentAddress.slice(0, 8)}...${state.currentAddress.slice(-6)}`
    },

    isAlphaTokensCacheExpired: (state) => {
      if (!state.alphaTokensLastUpdated) {
        return true;
      }
      const now = new Date().getTime();
      const lastUpdate = new Date(state.alphaTokensLastUpdated).getTime();
      return (now - lastUpdate) > ALPHA_TOKENS_CACHE_TTL;
    },
  },

  actions: {
    // --- ALPHA TOKEN MANAGEMENT ACTIONS ---

    async fetchAlphaTokens(force = false) {
      this.setLoading(true);
      this.clearError();

      if (!force && !this.isAlphaTokensCacheExpired && this.alphaTokens && this.alphaTokens.size > 0) {
        this.setLoading(false);
        return;
      }

      if (!this.apiKeys.cmc) {
        this.setError('CoinMarketCap API key is not set.');
        this.setLoading(false);
        return;
      }

      try {
        const cmcConnector = new CmcConnector();
        const categoryName = "Binance Alpha";

        console.log(`[ALPHA] Finding category ID for "${categoryName}"...`);
        const categoryId = await cmcConnector.findCategoryId(this.apiKeys.cmc, categoryName);

        if (!categoryId) {
          throw new Error(`Could not find the category "${categoryName}". Please check the name on CoinMarketCap.`);
        }

        console.log(`[ALPHA] Fetching tokens for category ID ${categoryId}...`);
        const rawTokens = await cmcConnector.getTokensByCategoryId(this.apiKeys.cmc, categoryId);

        // Process into a Map for efficient lookups
        const tokenMap = new Map();
        rawTokens.forEach(token => {
          let platform = token.platform;

          // CMC can return an array of platforms. We need to select one.
          // Prioritize BSC, otherwise take the first one.
          if (Array.isArray(platform)) {
            platform = platform.find(p => p.name === 'BNB Smart Chain (BEP20)') || platform[0];
          }

          const contractAddress = platform?.token_address;

          if (contractAddress) {
            // Standardize to lowercase for consistent lookups
            const finalContractAddress = contractAddress.toLowerCase();
            tokenMap.set(finalContractAddress, {
              id: token.id,
              name: token.name,
              symbol: token.symbol,
              cmc_rank: token.cmc_rank,
              platform: platform, // Now guaranteed to be an object or null
              quote: token.quote.USD,
            });
          }
        });

        this.alphaTokens = tokenMap;
        this.alphaTokensLastUpdated = new Date().toISOString();

        // Cache the new data
        // Note: Caching a Map directly might lose its type. We convert to array for storage.
        alphaTokensCache.set(ALPHA_TOKENS_CACHE_KEY, {
          alphaTokens: Array.from(this.alphaTokens.entries()),
          alphaTokensLastUpdated: this.alphaTokensLastUpdated,
        });

        console.log(`[ALPHA] Successfully fetched and processed ${this.alphaTokens.size} Alpha tokens.`);

      } catch (error) {
        console.error('Error fetching Alpha Tokens:', error);
        this.setError(error.message || 'Failed to fetch Alpha Tokens.');
        this.alphaTokens = null;
        this.alphaTokensLastUpdated = null;
        alphaTokensCache.remove(ALPHA_TOKENS_CACHE_KEY);
      } finally {
        this.setLoading(false);
      }
    },

    clearAlphaTokensCache() {
      this.alphaTokens = null;
      this.alphaTokensLastUpdated = null;
      alphaTokensCache.remove(ALPHA_TOKENS_CACHE_KEY);
    },

    loadAlphaTokensFromCache() {
      const cachedData = alphaTokensCache.get(ALPHA_TOKENS_CACHE_KEY);
      if (cachedData && cachedData.alphaTokens && Array.isArray(cachedData.alphaTokens)) {
        try {
          // Restore from array to Map
          this.alphaTokens = new Map(cachedData.alphaTokens);
          this.alphaTokensLastUpdated = cachedData.alphaTokensLastUpdated;
          console.log(`[ALPHA] Loaded ${this.alphaTokens.size} Alpha tokens from cache.`);
          return true;
        } catch (e) {
          console.error('[CACHE] Error parsing cached alpha tokens. Clearing cache.', e);
          // If parsing fails (e.g., malformed data), clear it to force a refresh.
          this.clearAlphaTokensCache();
          return false;
        }
      }
      // If cached data exists but is in an old, non-iterable format, or doesn't exist.
      if (cachedData) {
        console.warn('[CACHE] Old format for alpha tokens detected in cache. Clearing it.');
        this.clearAlphaTokensCache();
      }
      return false;
    },

    // --- REFACTORED TRANSACTION ACTION ---
    async fetchAndProcessTransactions(address, force = false) {
      this.setLoading(true);
      this.clearError();

      const cacheKey = TRANSACTIONS_CACHE_PREFIX + address.toLowerCase();
      const statsCacheKey = STATISTICS_CACHE_PREFIX + address.toLowerCase();

      // Try loading from cache first
      if (!force) {
        const cachedResults = transactionCache.get(cacheKey);
        const cachedStats = statisticsCache.get(statsCacheKey);

        // Ensure cache is not null and is in the expected array format before proceeding
        if (cachedResults && Array.isArray(cachedResults)) {
          console.log(`Cache hit for address: ${address}`);
          // Deep copy to avoid mutation issues with cached objects
          const results = JSON.parse(JSON.stringify(cachedResults));

          // Restore cached statistics if available
          if (cachedStats && typeof cachedStats === 'object') {
            console.log(`Restoring cached statistics for address: ${address}`);
            results.forEach(day => {
              if (cachedStats[day.date]) {
                day.statistics = cachedStats[day.date];
              }
            });
          }

          this.setSearchResults(results);
          this.setCurrentAddress(address);
          this.addToSearchHistory(address);
          this.setLoading(false);

          // Check if cached data already has historical prices and statistics
          const hasHistoricalPrices = results.some(day =>
            day.transactions?.some(tx =>
              tx.flows?.some(flow => flow.historicalPrice !== null && flow.historicalPrice !== undefined)
            )
          );
          const hasStatistics = results.some(day => day.statistics);

          if (hasHistoricalPrices && hasStatistics) {
            console.log('✅ Cached data includes historical prices and statistics. No recalculation needed.');
            this.calculateStatistics(); // Update global statistics
            return;
          } else if (hasHistoricalPrices) {
            console.log('✅ Cached data includes historical prices. Only need to recalculate statistics.');
            // Re-group with existing prices to calculate statistics
            const allTxs = results.flatMap(day => day.transactions);
            const groupedWithStats = _groupTransactionsByDay(allTxs);
            this.setSearchResults(Array.from(groupedWithStats.values()).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
            this.calculateStatistics();
            return;
          } else {
            console.log('⚠️ Cached data missing historical prices. Will need to fetch prices and recalculate.');
          }
        } else if (cachedResults) {
          // If cache exists but is not an array, it's an old format.
          console.warn('[CACHE] Old transaction cache format detected. Ignoring and fetching fresh data.');
          // We don't return here, just let the function proceed to fetch new data.
        }
      }

      console.log(`Fetching transactions for ${address}...`);

      try {
        if (!this.apiKeys.bsc) {
            this.setError('BSCScan API key is not set.');
            this.setLoading(false);
            return;
        }

        // 计算15天前的时间戳（包含今天）
        const now = new Date();
        const fifteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000); // 14天前，加上今天共15天
        const startTimestamp = Math.floor(fifteenDaysAgo.getTime() / 1000);

        console.log(`[FETCH] Querying transactions from ${fifteenDaysAgo.toISOString().split('T')[0]} to ${now.toISOString().split('T')[0]}`);

        const bscConnector = new BscScanConnector(this.apiKeys.bsc, startTimestamp);
        const dataProcessor = new DataProcessingService();
        const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

        // Fetch all transaction types serially with a delay to avoid rate limiting
        const normalTx = await bscConnector.getTransactions(address);
        console.log(`[FETCH] Normal transactions: ${normalTx.length} items`);
        await delay(350); // Delay to respect BscScan's rate limit (5 req/sec)
        const internalTx = await bscConnector.getInternalTransactions(address);
        console.log(`[FETCH] Internal transactions: ${internalTx.length} items`);
        await delay(350);
        const tokenTx = await bscConnector.getTokenTransactions(address);
        console.log(`[FETCH] Token transactions: ${tokenTx.length} items`);

        // Standardize transactions
        const standardTxs = dataProcessor.standardize(address, normalTx, internalTx, tokenTx);

        console.log(`[FETCH] Standardized ${standardTxs.length} transactions for address ${address}`);

        // Check if we have any transactions
        if (standardTxs.length === 0) {
          console.log(`[FETCH] No transactions found for address ${address}`);
          this.setSearchResults([]);
          this.setCurrentAddress(address);
          this.addToSearchHistory(address);
          // Don't set an error, just empty results - this is a valid state
          this.setLoading(false);
          return;
        }

        // Group by day
        const groupedByDay = _groupTransactionsByDay(standardTxs);

        // Sort and set results
        const sortedResults = Array.from(groupedByDay.values()).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        console.log(`[FETCH] Grouped transactions into ${sortedResults.length} days`);

        // Try to restore cached statistics even during force refresh
        const statsCacheKey = STATISTICS_CACHE_PREFIX + address.toLowerCase();
        const cachedStats = statisticsCache.get(statsCacheKey);
        if (cachedStats && typeof cachedStats === 'object') {
          console.log(`[FETCH] Restoring cached statistics during refresh for address: ${address}`);
          sortedResults.forEach(day => {
            if (cachedStats[day.date]) {
              day.statistics = cachedStats[day.date];
              console.log(`[FETCH] Restored stats for ${day.date}:`, day.statistics);
            }
          });
        }

        this.setSearchResults(sortedResults);

        // Cache the raw, unprocessed results
        transactionCache.set(cacheKey, sortedResults, TRANSACTIONS_CACHE_TTL);

        this.setCurrentAddress(address);
        this.addToSearchHistory(address);

      } catch (error) {
        console.error('Error fetching or processing transactions:', error);
        this.setError('Failed to fetch transaction data. Please check the address and API keys.');
      } finally {
        this.setLoading(false);
      }
    },

    // --- New action for on-demand statistics calculation ---
    async calculateAllStatistics() {
      if (this.loading) return;
      this.setLoading(true);
      this.clearError();
      console.log('Starting on-demand statistics calculation...');

      try {
        const allDailyGroups = this.searchResults;
        if (!allDailyGroups || allDailyGroups.length === 0) return;

        const priceConnector = new CoinGeckoPriceConnector(priceCache);
        const allTxs = allDailyGroups.flatMap(day => day.transactions);

        // --- Step 1: Batch fetch historical prices ---
        console.log('[STATS] Step 1: Building unique price requests...');
        const priceRequests = new Map();
        allTxs.forEach(tx => {
          tx.flows.forEach(flow => {
            const date = new Date(tx.timeStamp * 1000).toISOString().split('T')[0];
            const cacheKey = `${flow.token.contractAddress}-${date}`;
            if (!priceRequests.has(cacheKey) && !flow.historicalPrice) { // Only request if not already priced
              priceRequests.set(cacheKey, { contractAddress: flow.token.contractAddress, timestamp: tx.timeStamp });
            }
          });
        });
        console.log(`[STATS] Found ${priceRequests.size} unique token/date pairs needing prices.`);

        const prices = new Map();
        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        console.log('[STATS] Starting sequential price fetching to respect API rate limits.');
        for (const [key, req] of priceRequests.entries()) {
          console.log(`[STATS] Fetching price for ${key}`);
          const price = await priceConnector.getHistoricalPrice(req.contractAddress, req.timestamp);
          console.log(`[STATS] Fetched price for ${key}:`, price);
          prices.set(key, price);

          // Unconditionally delay to respect public API rate limits.
          await delay(2000);
        }
        console.log('[STATS] Step 1 Complete: Batch price fetching finished.');

        // --- Step 2: Update transactions with fetched prices ---
        console.log('[STATS] Step 2: Injecting prices into transaction flows...');
        let priceUpdatedCount = 0;
        allTxs.forEach(tx => {
          tx.flows.forEach(flow => {
            if (!flow.historicalPrice) { // Avoid overwriting existing prices
                const date = new Date(tx.timeStamp * 1000).toISOString().split('T')[0];
                const cacheKey = `${flow.token.contractAddress}-${date}`;
                if (prices.has(cacheKey)) {
                  flow.historicalPrice = prices.get(cacheKey) || null;
                  priceUpdatedCount++;
                }
            }
          });
        });
        console.log(`[STATS] Step 2 Complete: Price injection finished. Updated ${priceUpdatedCount} flows with historical prices.`);

        // --- Step 3: Re-group transactions by day with updated price info and calculate stats ---
        console.log('[STATS] Step 3: Re-grouping transactions and calculating final statistics...');
        const groupedWithStats = _groupTransactionsByDay(allTxs);

        this.setSearchResults(Array.from(groupedWithStats.values()).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));

        // --- Step 4: Update cache with enriched transaction data (including historical prices) ---
        console.log('[STATS] Step 4: Updating cache with enriched transaction data...');
        if (this.currentAddress) {
          const cacheKey = `${CACHE_PREFIX}${this.currentAddress}`;
          const cacheData = {
            data: this.searchResults,
            timestamp: Date.now(),
            address: this.currentAddress,
            enrichedWithPrices: true // Flag to indicate this data includes historical prices
          };
          transactionCache.set(cacheKey, cacheData, CACHE_TTL);
          console.log(`[STATS] Updated cache for ${this.currentAddress} with enriched price data.`);
        }

        console.log('✅ [SUCCESS] Statistics calculation complete.');

      } catch (error) {
        console.error('Error during statistics calculation:', error);
        this.setError('Failed to calculate statistics.');
      } finally {
        this.setLoading(false);
      }
    },

    // --- Daily Statistics Calculation Action ---
    async calculateDailyStatistics(dayData) {
        if (!dayData || !dayData.date) {
            console.error('[DAILY_STATS] Invalid dayData provided.');
            return;
        }

        console.log(`[DAILY_STATS] Starting calculation for date: ${dayData.date}`);
        this.setLoading(true);

        try {
            const priceConnector = new CoinGeckoPriceConnector(priceCache, this.apiKeys.coingecko);
            const alphaTokenMap = this.alphaTokens || new Map();

            // --- Step 1: Collect ALL unique tokens for the day ---
            const uniqueTokens = new Set();
            dayData.transactions.forEach(tx => {
                tx.flows.forEach(flow => {
                    uniqueTokens.add(flow.token.contractAddress);
                });
            });
            console.log(`[DAILY_STATS] Found ${uniqueTokens.size} unique tokens for ${dayData.date}.`);

            // --- Step 2: 批量获取15天的价格数据（优化API调用）---
            const targetDate = new Date(dayData.date);
            const startDate = new Date(targetDate.getTime() - 7 * 24 * 60 * 60 * 1000); // 前7天
            const endDate = new Date(targetDate.getTime() + 7 * 24 * 60 * 60 * 1000);   // 后7天

            console.log(`[DAILY_STATS] Fetching price data from ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`);

            const priceCharts = new Map();
            let apiCallCount = 0;
            let cacheHitCount = 0;

            for (const tokenAddress of uniqueTokens) {
                // 检查缓存中是否已有该代币在目标日期的价格数据
                const cacheKey = `chart_${tokenAddress}_${dayData.date}`;
                const cachedChart = priceCache.get(cacheKey);

                if (cachedChart) {
                    console.log(`[DAILY_STATS] Using cached price data for ${tokenAddress} on ${dayData.date}`);
                    priceCharts.set(tokenAddress.toLowerCase(), cachedChart);
                    cacheHitCount++;
                    continue;
                }

                // 检查是否已经在当前批次中处理过该代币
                if (priceCharts.has(tokenAddress.toLowerCase())) {
                    console.log(`[DAILY_STATS] Already processed ${tokenAddress} in this batch`);
                    continue;
                }

                // 如果缓存中没有，则获取15天范围的数据
                console.log(`[DAILY_STATS] Fetching 15-day price chart for ${tokenAddress}`);
                const chart = await priceConnector.getDailyMarketChart(tokenAddress, targetDate);
                priceCharts.set(tokenAddress.toLowerCase(), chart);
                apiCallCount++;

                // 每3次API调用后暂停，避免频率限制
                if (apiCallCount % 3 === 0) {
                    console.log(`[DAILY_STATS] Pausing after ${apiCallCount} API calls to respect rate limits...`);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }

            console.log(`[DAILY_STATS] Price data summary: ${cacheHitCount} cache hits, ${apiCallCount} API calls for ${uniqueTokens.size} unique tokens.`);

            // --- Step 3: Update flows with prices from charts ---
            console.log(`[DAILY_STATS] Step 3: Injecting prices for ${dayData.date}`);
            dayData.transactions.forEach(tx => {
                tx.flows.forEach(flow => {
                    // Only fetch if price is missing
                    if (!flow.historicalPrice) {
                        const chart = priceCharts.get(flow.token.contractAddress.toLowerCase());
                        flow.historicalPrice = findPriceInChart(chart, tx.timeStamp);
                    }
                });
            });
            console.log(`[DAILY_STATS] Step 3 Complete for ${dayData.date}.`);

                        // --- Step 4: Recalculate stats for the day ---
            console.log(`[DAILY_STATS] Step 4: Recalculating stats for ${dayData.date}`);
            let alphaInflowUsd = 0;
            let bscBonusUsd = 0;
            let totalDayVolume = 0;

            // Initialize gas and flow stats
            let gasStats = {
                totalGasBnb: 0,
                totalGasUsd: 0,
                transactionCount: 0
            };
            let flowStats = {
                alphaInflow: 0,
                alphaOutflow: 0,
                stablecoinInflow: 0,
                stablecoinOutflow: 0,
                bnbInflow: 0,
                bnbOutflow: 0,
                netAlphaUsd: 0,
                netStablecoinUsd: 0,
                netBnbUsd: 0
            };

            dayData.transactions.forEach(tx => {
                // Count transaction and gas
                gasStats.transactionCount++;
                if (tx.gasFee) {
                    gasStats.totalGasBnb += tx.gasFee;
                }

                tx.flows.forEach(flow => {
                    const contract = flow.token.contractAddress.toLowerCase();
                    const tokenSymbol = flow.token.symbol.toUpperCase();
                    // 🔧 FIX: 统一稳定币检测逻辑，确保BSC-USD被正确识别
                    const isStablecoin = ['USDT', 'USDC', 'BUSD', 'DAI', 'TUSD', 'FRAX', 'LUSD'].includes(tokenSymbol) ||
                                       tokenSymbol.includes('USD') ||
                                       flow.token.contractAddress?.toLowerCase() === '0x55d398326f99059ff775485246999027b3197955' || // BSC USDT
                                       flow.token.contractAddress?.toLowerCase() === '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d' || // BSC USDC
                                       flow.token.contractAddress?.toLowerCase() === '0xe9e7cea3dedca5984780bafc599bd69add087d56';   // BSC BUSD
                    // 🔧 FIX: 统一BNB检测逻辑，包含ETH和WETH
                    const isBnb = tokenSymbol === 'BNB' || tokenSymbol === 'WBNB' || tokenSymbol === 'ETH' || tokenSymbol === 'WETH';

                                        if (flow.historicalPrice && flow.historicalPrice > 0) {
                        const usdValue = flow.amount * flow.historicalPrice;

                        // For total day volume, only count inflow to avoid double counting
                        // (since outflow from one token often becomes inflow to another in swaps)
                        if (flow.isInflow) {
                            totalDayVolume += usdValue;
                        }

                        // Categorize token type and update flow stats
                        if (isStablecoin) {
                            console.log(`[DAILY_STATS] Stablecoin detected: ${tokenSymbol} (${flow.token.contractAddress}) | ${flow.isInflow ? 'Inflow' : 'Outflow'}: $${usdValue.toFixed(2)}`);
                            if (flow.isInflow) {
                                flowStats.stablecoinInflow += usdValue;
                            } else {
                                flowStats.stablecoinOutflow += usdValue;
                            }
                        } else if (isBnb) {
                            if (flow.isInflow) {
                                flowStats.bnbInflow += usdValue;
                            } else {
                                flowStats.bnbOutflow += usdValue;
                            }
                        } else {
                            // Assume it's an Alpha token
                            if (flow.isInflow) {
                                flowStats.alphaInflow += usdValue;
                            } else {
                                flowStats.alphaOutflow += usdValue;
                            }
                        }

                        // Check if it's an inflow of a real Alpha Token for points calculation
                        if (flow.isInflow && alphaTokenMap.has(contract)) {
                            alphaInflowUsd += usdValue;

                            // Check if this is a BSC chain token for bonus calculation
                            const isBscToken = flow.token.contractAddress &&
                                              flow.token.contractAddress.length === 42 &&
                                              flow.token.contractAddress.startsWith('0x');

                            if (isBscToken) {
                                bscBonusUsd += usdValue;
                                console.log(`[DAILY_STATS] BSC Bonus for ${flow.token.symbol}: ${usdValue}`);
                            }
                        }
                    }
                });
            });

            // Calculate net flows
            flowStats.netAlphaUsd = flowStats.alphaInflow - flowStats.alphaOutflow;
            flowStats.netStablecoinUsd = flowStats.stablecoinInflow - flowStats.stablecoinOutflow;
            flowStats.netBnbUsd = flowStats.bnbInflow - flowStats.bnbOutflow;

            // Calculate total net loss (negative values indicate loss)
            // Gas is always a loss, so we subtract it
            flowStats.totalNetUsd = flowStats.netAlphaUsd + flowStats.netStablecoinUsd + flowStats.netBnbUsd - (gasStats.totalGasBnb * 600); // Assuming BNB ~$600, should be dynamic

            const points = calculatePoints(alphaInflowUsd, bscBonusUsd);

            // Store calculated stats in the dayData object
            dayData.statistics = {
                alphaInflowUsd,
                bscBonusUsd,
                points,
                totalDayVolume, // Also storing total volume for the day
                gasStats,
                flowStats
            };
            dayData.lastCalculated = new Date().toISOString();

            console.log(`[DAILY_STATS] Day ${dayData.date} - Alpha Inflow: ${alphaInflowUsd.toFixed(2)} | BSC Bonus: ${bscBonusUsd.toFixed(2)} | Points: ${points.toFixed(2)} | Total Day Volume: ${totalDayVolume.toFixed(2)}`);

            // --- Step 5: Update cache with enriched transaction data (including historical prices) ---
            if (this.currentAddress) {
              const cacheKey = TRANSACTIONS_CACHE_PREFIX + this.currentAddress.toLowerCase();
              const currentResults = this.searchResults;
              transactionCache.set(cacheKey, currentResults, TRANSACTIONS_CACHE_TTL);
              console.log(`[DAILY_STATS] Updated transaction cache for ${this.currentAddress} with enriched price data.`);
            }

            // --- Step 6: Update the specific day in the searchResults AND the cache ---
            const dayIndex = this.searchResults.findIndex(d => d.date === dayData.date);
            if (dayIndex !== -1) {
                this.searchResults[dayIndex] = { ...dayData };

                // Update transaction cache
                const cacheKey = TRANSACTIONS_CACHE_PREFIX + this.currentAddress.toLowerCase();
                transactionCache.set(cacheKey, this.searchResults, TRANSACTIONS_CACHE_TTL);

                // Update statistics cache
                const statsCacheKey = STATISTICS_CACHE_PREFIX + this.currentAddress.toLowerCase();
                const existingStats = statisticsCache.get(statsCacheKey) || {};
                existingStats[dayData.date] = dayData.statistics;
                statisticsCache.set(statsCacheKey, existingStats, STATISTICS_CACHE_TTL);

                console.log(`[CACHE] Updated statistics cache for ${this.currentAddress} - ${dayData.date}`);
            }

            // --- Step 6: Recalculate global statistics ---
            this.calculateStatistics();

            console.log(`✅ [SUCCESS] Daily statistics calculation complete for ${dayData.date}.`);
        } catch (error) {
            console.error('Error during daily statistics calculation:', error);
            this.setError('Failed to calculate daily statistics.');
        } finally {
            this.setLoading(false);
        }
    },

    getCacheStats() {
      const getStorageSize = (storage) => {
        let size = 0;
        for (let i = 0; i < storage.length; i++) {
          const key = storage.key(i);
          if (key) {
            const value = storage.getItem(key);
            size += (key.length + (value?.length || 0)) * 2; // Size in bytes (approx)
          }
        }
        return (size / 1024).toFixed(2); // Size in KB
      };

      const getCacheInfo = (prefix) => {
        if (typeof window === 'undefined') return { count: 0, size: '0.00' };
        const storage = window.localStorage;
        let count = 0;
        let size = 0;
        for (let i = 0; i < storage.length; i++) {
          const key = storage.key(i);
          if (key && key.startsWith(prefix)) {
            count++;
            const value = storage.getItem(key);
            size += (key.length + (value?.length || 0)) * 2;
          }
        }
        return { count, size: (size / 1024).toFixed(2) };
      };

      return {
        alphaTokens: getCacheInfo(ALPHA_TOKENS_CACHE_KEY),
        transactions: getCacheInfo(TRANSACTIONS_CACHE_PREFIX),
        statistics: getCacheInfo(STATISTICS_CACHE_PREFIX),
        prices: getCacheInfo('chart_'), // Match the new key format in coingecko.ts
        coinIds: getCacheInfo('coinid_'),    // Based on the key format in coingecko.ts
        total: {
          count: window.localStorage.length,
          size: getStorageSize(window.localStorage)
        }
      };
    },

    clearCache(type) {
        if (typeof window === 'undefined') return;
        const storage = window.localStorage;
        let prefix = '';
        switch (type) {
            case 'alphaTokens': prefix = ALPHA_TOKENS_CACHE_KEY; break;
            case 'transactions': prefix = TRANSACTIONS_CACHE_PREFIX; break;
            case 'statistics': prefix = STATISTICS_CACHE_PREFIX; break;
            case 'prices': prefix = 'chart_'; break;
            case 'coinIds': prefix = 'coinid_'; break;
            default: return;
        }

        const keysToRemove = [];
        for (let i = 0; i < storage.length; i++) {
            const key = storage.key(i);
            if (key && key.startsWith(prefix)) {
                keysToRemove.push(key);
            }
        }

        keysToRemove.forEach(key => storage.removeItem(key));
        console.log(`[Cache] Cleared ${keysToRemove.length} items for cache type: ${type}`);
    },

    // --- UTILITY ACTIONS ---

    _mergeTransactions(oldDailyGroups, newTxs) {
      const txMap = new Map(oldDailyGroups.flatMap(day => day.transactions.map(tx => [tx.hash, tx])));

      // 2. Add new transactions, overwriting any with the same hash
      newTxs.forEach(tx => txMap.set(tx.hash, tx));

      // 3. Re-group all transactions by day
      const allTxs = Array.from(txMap.values());
      const grouped = _groupTransactionsByDay(allTxs);
      return Array.from(grouped.values()).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    },

    // 设置搜索结果
    setSearchResults(results) {
      this.searchResults = results || []
      this.calculateStatistics()
    },

    // 设置当前查询地址
    setCurrentAddress(address) {
      this.currentAddress = address
      this.addToSearchHistory(address)
    },

    // 添加到搜索历史
    addToSearchHistory(address) {
      if (!address || this.searchHistory.includes(address)) return
      this.searchHistory.unshift(address)
      if (this.searchHistory.length > 10) {
        this.searchHistory.pop()
      }
      this.saveSearchHistory()
    },

    // 从搜索历史中移除
    removeFromSearchHistory(index) {
      if (index >= 0 && index < this.searchHistory.length) {
        this.searchHistory.splice(index, 1)
        this.saveSearchHistory()
      }
    },

    // 清空搜索历史
    clearSearchHistory() {
      this.searchHistory = []
      this.saveSearchHistory()
    },

    // 保存搜索历史到localStorage
    saveSearchHistory() {
      try {
        localStorage.setItem('bsc_search_history', JSON.stringify(this.searchHistory))
      } catch (error) {
        console.error('保存搜索历史失败:', error)
      }
    },

    // 从localStorage加载搜索历史
    loadSearchHistory() {
      try {
        const saved = localStorage.getItem('bsc_search_history')
        if (saved) {
          this.searchHistory = JSON.parse(saved)
        }
      } catch (error) {
        console.error('加载搜索历史失败:', error)
        this.searchHistory = []
      }
    },

    // 计算统计数据
    calculateStatistics() {
      if (!this.searchResults.length) {
        this.statistics = {
          totalTransactions: 0,
          totalAlphaInflow: 0,
          totalBscBonus: 0,
          totalPoints: 0,
          activeDays: 0,
          averageDailyVolume: 0
        }
        return
      }

      let totalTransactions = 0;
      let totalAlphaInflow = 0;
      let totalBscBonus = 0;
      let totalPoints = 0;
      let totalVolumeAllDays = 0;

      this.searchResults.forEach(dayData => {
        totalTransactions += dayData.transactions?.length || 0;
        if (dayData.statistics) {
          totalAlphaInflow += dayData.statistics.alphaInflowUsd || 0;
          totalBscBonus += dayData.statistics.bscBonusUsd || 0;
          totalPoints += dayData.statistics.points || 0;
          totalVolumeAllDays += dayData.statistics.totalDayVolume || 0;
        }
      });

      let totalGasBnb = 0;
      let totalGasUsd = 0;
      let netAlphaUsd = 0;
      let netStablecoinUsd = 0;
      let netBnbUsd = 0;

      this.searchResults.forEach(dayData => {
        if (dayData.statistics?.gasStats) {
          totalGasBnb += dayData.statistics.gasStats.totalGasBnb || 0;
          totalGasUsd += dayData.statistics.gasStats.totalGasUsd || 0;
        }
        if (dayData.statistics?.flowStats) {
          netAlphaUsd += dayData.statistics.flowStats.netAlphaUsd || 0;
          netStablecoinUsd += dayData.statistics.flowStats.netStablecoinUsd || 0;
          netBnbUsd += dayData.statistics.flowStats.netBnbUsd || 0;
        }
      });

      this.statistics = {
        totalTransactions,
        totalAlphaInflow: parseFloat(totalAlphaInflow.toFixed(2)),
        totalBscBonus: parseFloat(totalBscBonus.toFixed(2)),
        totalPoints: Math.floor(totalPoints),
        activeDays: this.searchResults.length,
        averageDailyVolume: parseFloat((totalVolumeAllDays / this.searchResults.length).toFixed(2)),
        totalGasBnb: parseFloat(totalGasBnb.toFixed(6)),
        totalGasUsd: parseFloat(totalGasUsd.toFixed(2)),
        netAlphaUsd: parseFloat(netAlphaUsd.toFixed(2)),
        netStablecoinUsd: parseFloat(netStablecoinUsd.toFixed(2)),
        netBnbUsd: parseFloat(netBnbUsd.toFixed(2))
      };

      console.log('[GLOBAL_STATS] Updated global statistics:', this.statistics);
    },

    // 更新设置
    updateSettings(newSettings) {
      this.settings = { ...this.settings, ...newSettings }
      this.saveSettings()
    },

    // 保存设置
    saveSettings() {
      try {
        localStorage.setItem('bsc_settings', JSON.stringify(this.settings))
      } catch (error) {
        console.error('保存设置失败:', error)
      }
    },

    // 加载设置
    loadSettings() {
      try {
        const saved = localStorage.getItem('bsc_settings')
        if (saved) {
          this.settings = { ...this.settings, ...JSON.parse(saved) }
        }
      } catch (error) {
        console.error('加载设置失败:', error)
      }
    },

    // 生成模拟数据（用于演示）
    generateMockData(address) {
      const mockData = []
      const now = new Date()

      for (let i = 0; i < 30; i++) {
        const date = new Date(now)
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]

        const transactionCount = Math.floor(Math.random() * 50) + 1
        const transactions = []

        for (let j = 0; j < transactionCount; j++) {
          transactions.push({
            hash: `0x${Math.random().toString(16).substring(2, 66)}`,
            timeStamp: Math.floor(date.getTime() / 1000) + j * 3600,
            from: address,
            to: '0xb300000b72DEAEb607a12d5f54773D1C19c7028d',
            tokens: {
              'BSC-USD': {
                inflow: Math.random() * 1000,
                outflow: Math.random() * 1200
              }
            },
            status: Math.random() > 0.1 ? '成功' : '失败'
          })
        }

        const totalOutflow = transactions.reduce((sum, tx) =>
          sum + (tx.tokens['BSC-USD']?.outflow || 0), 0)
        const totalInflow = transactions.reduce((sum, tx) =>
          sum + (tx.tokens['BSC-USD']?.inflow || 0), 0)

        mockData.push({
          date: dateStr,
          transactions,
          tokenStats: {
            'BSC-USD': {
              outflow: totalOutflow,
              inflow: totalInflow
            }
          }
        })
      }

      return mockData.reverse()
    },

    // 设置加载状态
    setLoading(loading) {
      this.loading = loading
    },

    // 设置错误状态
    setError(error) {
      this.error = error
    },

    // 清除错误
    clearError() {
      this.error = null
    },

    // --- NEW ACTIONS FOR API KEYS ---
    loadApiKeys() {
      const cachedKeys = settingsCache.get(API_KEYS_CACHE_KEY)
      if (cachedKeys) {
        this.apiKeys = { ...this.apiKeys, ...cachedKeys }
        console.log('Loaded API keys from cache.')
      } else {
        // 设置默认API密钥
        this.apiKeys = {
          bsc: '1I6UUWQHJ4JV99S7H9RQAVFPKZN6W9A9BZ', // 默认BSCScan API密钥
          cmc: '',
          coingecko: '',
        }
        console.log('Using default API keys.')
      }
    },
    saveApiKeys(newKeys) {
      this.apiKeys = { ...this.apiKeys, ...newKeys }
      settingsCache.set(API_KEYS_CACHE_KEY, this.apiKeys, 365 * 24 * 60 * 60) // 1 year expiry
    },

    // 初始化store
    init() {
      this.loadSearchHistory()
      this.loadSettings()
      this.loadApiKeys()
      this.loadAlphaTokensFromCache()
    }
  }
})
