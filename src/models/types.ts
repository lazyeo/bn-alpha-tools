/**
 * @description Standardized token information
 */
export interface Token {
  contractAddress: string;
  symbol: string;
  name: string;
  decimals: number;
}

/**
 * @description Price information for a token
 */
export interface PriceInfo {
  usd: number;
}

/**
 * @description Represents a standardized token flow within a transaction (inflow/outflow)
 */
export interface TokenFlow {
  token: Token;
  amount: number; // Parsed amount considering decimals
  isInflow: boolean;
  historicalPrice?: number | null; // Historical price for calculating USD value
}

/**
 * @description A standardized transaction object, normalized from various API sources.
 */
export interface StandardTransaction {
  hash: string;
  timeStamp: number;
  from: string;
  to: string;
  gasFee: number; // in native currency (e.g., BNB)
  blockNumber: number;
  flows: TokenFlow[]; // All token movements in this transaction
  nativeFlows?: { // Specifically for native currency like BNB
    inflow: number;
    outflow: number;
  };
  isError: boolean;
}

/**
 * @description The result of a specific analysis plugin.
 */
export interface AnalysisResult {
  pluginName: string;
  summary: Record<string, any>; // e.g., { totalAlphaVolume: 1234, points: 50 }
  dailyData: Record<string, any>[]; // Array of data points grouped by day
  detailedTransactions: StandardTransaction[]; // Transactions relevant to this analysis
}
