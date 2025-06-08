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
 * An analysis plugin to identify "buy" transactions of specified Alpha tokens.
 */
export class AlphaAnalyzerPlugin implements IAnalysisPlugin {
  public name = 'AlphaTokenAnalyzer';
  private alphaContractAddresses: Set<string>;
  private userAddress: string;

  constructor(config: AlphaTokenConfig, userAddress: string) {
    this.userAddress = userAddress.toLowerCase();
    this.alphaContractAddresses = this.loadContractAddresses(config);
  }

  private loadContractAddresses(config: AlphaTokenConfig): Set<string> {
    const addresses = new Set<string>();
    if (!config || !config.tokens_by_chain) {
      return addresses;
    }
    Object.values(config.tokens_by_chain).forEach(tokens => {
      tokens.forEach(token => {
        if (token.contract_address && token.contract_address !== 'N/A') {
          addresses.add(token.contract_address.toLowerCase());
        }
      });
    });
    console.log(`[${this.name}] Loaded ${addresses.size} alpha token contracts.`);
    return addresses;
  }

  /**
   * Analyzes transactions to find alpha token "buy" activities.
   * @param transactions Standardized transaction data.
   * @returns An AnalysisResult object.
   */
  public analyze(transactions: StandardTransaction[]): AnalysisResult {
    const alphaTransactions: StandardTransaction[] = [];

    for (const tx of transactions) {
      // An alpha transaction must involve the user and be successful.
      if (tx.isError) continue;

      const isAlpha = tx.flows.some(flow =>
        this.alphaContractAddresses.has(flow.token.contractAddress.toLowerCase()) &&
        flow.isInflow // The user received the alpha token
      );

      if (isAlpha) {
        alphaTransactions.push(tx);
      }
    }

    return {
      pluginName: this.name,
      summary: {
        totalAlphaTransactions: alphaTransactions.length,
      },
      dailyData: [], // Further analysis (like grouping by day) would populate this.
      detailedTransactions: alphaTransactions,
    };
  }
}
