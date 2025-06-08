import type { StandardTransaction, AnalysisResult, Token } from '@/models/types';

/**
 * Interface for all analysis plugins.
 * Each plugin takes standardized transactions and returns a structured analysis result.
 */
export interface IAnalysisPlugin {
  name: string;
  analyze(transactions: StandardTransaction[]): AnalysisResult;
}

/**
 * Configuration for the AlphaAnalyzerPlugin.
 */
export interface AlphaTokenConfig {
  tokens_by_chain: {
    [chainName: string]: {
      contract_address: string;
      [key: string]: any;
    }[];
  };
}

/**
 * An analysis plugin to analyze pre-filtered Alpha token transactions.
 * Since transactions are now pre-filtered to only include Alpha tokens,
 * this plugin focuses on analysis rather than filtering.
 */
export class AlphaAnalyzerPlugin implements IAnalysisPlugin {
  public name = 'AlphaTokenAnalyzer';
  private alphaTokenMap: Map<string, any>;
  private userAddress: string;

  constructor(alphaTokenMap: Map<string, any>, userAddress: string) {
    this.userAddress = userAddress.toLowerCase();
    this.alphaTokenMap = alphaTokenMap || new Map();
    console.log(`[${this.name}] Initialized with ${this.alphaTokenMap.size} Alpha tokens for analysis.`);
  }

  /**
   * Updates the alpha token map used for analysis
   * @param alphaTokenMap Map of alpha token contract addresses to token data
   */
  updateAlphaTokenMap(alphaTokenMap: Map<string, any>) {
    this.alphaTokenMap = alphaTokenMap;
    console.log(`[${this.name}] Updated Alpha token map with ${this.alphaTokenMap.size} tokens`);
  }

  /**
   * Analyzes pre-filtered Alpha token transactions.
   * Since transactions are already filtered to only include Alpha tokens,
   * this method focuses on detailed analysis and statistics.
   * @param transactions Pre-filtered standardized Alpha token transaction data.
   * @returns An AnalysisResult object.
   */
  public analyze(transactions: StandardTransaction[]): AnalysisResult {
    console.log(`[${this.name}] Analyzing ${transactions.length} pre-filtered Alpha token transactions`);

    const alphaTransactions: StandardTransaction[] = [];
    let totalInflowTransactions = 0;
    let totalOutflowTransactions = 0;
    const uniqueAlphaTokensTraded = new Set<string>();

    for (const tx of transactions) {
      // Skip error transactions
      if (tx.isError) continue;

      // Since transactions are pre-filtered, we can directly process them
      let hasInflow = false;
      let hasOutflow = false;

      tx.flows.forEach(flow => {
        uniqueAlphaTokensTraded.add(flow.token.contractAddress.toLowerCase());

        if (flow.isInflow) {
          hasInflow = true;
        } else {
          hasOutflow = true;
        }
      });

      if (hasInflow) totalInflowTransactions++;
      if (hasOutflow) totalOutflowTransactions++;

      alphaTransactions.push(tx);
    }

    console.log(`[${this.name}] Analysis complete: ${alphaTransactions.length} valid transactions, ${uniqueAlphaTokensTraded.size} unique Alpha tokens traded`);

    return {
      pluginName: this.name,
      summary: {
        totalAlphaTransactions: alphaTransactions.length,
        totalInflowTransactions,
        totalOutflowTransactions,
        uniqueAlphaTokensCount: uniqueAlphaTokensTraded.size,
        filteringEnabled: true, // Indicate that pre-filtering is active
      },
      dailyData: [], // Further analysis (like grouping by day) would populate this.
      detailedTransactions: alphaTransactions,
    };
  }

  /**
   * Legacy constructor for backward compatibility with static config
   */
  static fromStaticConfig(config: AlphaTokenConfig, userAddress: string): AlphaAnalyzerPlugin {
    const alphaTokenMap = new Map<string, any>();

    if (config && config.tokens_by_chain) {
      Object.values(config.tokens_by_chain).forEach(tokens => {
        tokens.forEach(token => {
          if (token.contract_address && token.contract_address !== 'N/A') {
            alphaTokenMap.set(token.contract_address.toLowerCase(), token);
          }
        });
      });
    }

    console.log(`[AlphaTokenAnalyzer] Created from static config with ${alphaTokenMap.size} alpha token contracts.`);
    return new AlphaAnalyzerPlugin(alphaTokenMap, userAddress);
  }
}
