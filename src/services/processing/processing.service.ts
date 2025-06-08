import type { StandardTransaction, Token, TokenFlow } from '@/models/types';
import { BigNumber } from 'bignumber.js';
import { CoinGeckoPriceConnector } from '../datasource/coingecko';

export class DataProcessingService {
  private priceConnector: CoinGeckoPriceConnector;
  private alphaTokenAddresses: Set<string>;

  constructor(alphaTokenMap?: Map<string, any>) {
    this.priceConnector = new CoinGeckoPriceConnector();
    this.alphaTokenAddresses = new Set();

    // Initialize alpha token addresses from the provided map
    if (alphaTokenMap && alphaTokenMap instanceof Map) {
      this.alphaTokenAddresses = new Set(alphaTokenMap.keys());
      console.log(`[DataProcessor] Initialized with ${this.alphaTokenAddresses.size} Alpha token addresses for filtering`);
    }
  }

  /**
   * Updates the alpha token addresses used for filtering
   * @param alphaTokenMap Map of alpha token contract addresses to token data
   */
  updateAlphaTokenAddresses(alphaTokenMap: Map<string, any>) {
    this.alphaTokenAddresses = new Set(alphaTokenMap.keys());
    console.log(`[DataProcessor] Updated Alpha token filter with ${this.alphaTokenAddresses.size} addresses`);
  }

  /**
   * Checks if a transaction contains any Alpha token flows
   * @param flows Array of token flows in the transaction
   * @returns true if transaction contains Alpha tokens, false otherwise
   */
  private hasAlphaTokenFlow(flows: TokenFlow[]): boolean {
    return flows.some(flow =>
      this.alphaTokenAddresses.has(flow.token.contractAddress.toLowerCase())
    );
  }

  /**
   * Processes raw transaction lists from a blockchain data source and standardizes them.
   * Only includes transactions that involve Alpha tokens, but keeps ALL tokens in those transactions.
   * @param userAddress The address of the user wallet.
   * @param normalTxList Raw list of normal transactions.
   * @param internalTxList Raw list of internal transactions.
   * @param tokenTxList Raw list of ERC-20/BEP-20 token transactions.
   * @returns A sorted array of standardized transactions containing only Alpha-related transactions with all their tokens.
   */
  public standardize(
    userAddress: string,
    normalTxList: any[],
    internalTxList: any[],
    tokenTxList: any[]
  ): StandardTransaction[] {
    const txMap = new Map<string, StandardTransaction>();
    const lowerUserAddress = userAddress.toLowerCase();

    console.log(`[DataProcessor] Starting standardization with Alpha token filtering`);
    console.log(`[DataProcessor] Input: ${normalTxList.length} normal, ${internalTxList.length} internal, ${tokenTxList.length} token transactions`);

    // Step 1: Group token transactions by hash to identify which transactions involve Alpha tokens
    const txTokenMap = new Map<string, any[]>();
    tokenTxList.forEach(tx => {
      if (!txTokenMap.has(tx.hash)) {
        txTokenMap.set(tx.hash, []);
      }
      txTokenMap.get(tx.hash)!.push(tx);
    });

    // Step 2: Identify transaction hashes that involve Alpha tokens
    const alphaRelatedHashes = new Set<string>();
    txTokenMap.forEach((tokenTxs, hash) => {
      const hasAlpha = tokenTxs.some(tx => {
        const contractAddress = tx.contractAddress?.toLowerCase();
        return contractAddress && this.alphaTokenAddresses.has(contractAddress);
      });

      if (hasAlpha) {
        alphaRelatedHashes.add(hash);
      }
    });

    console.log(`[DataProcessor] Found ${alphaRelatedHashes.size} transactions involving Alpha tokens from ${txTokenMap.size} total token transactions`);

    // Step 3: Process normal transactions (only those related to Alpha token transactions)
    normalTxList.forEach((tx) => {
      // Only include normal transactions that are part of Alpha token transactions
      if (!alphaRelatedHashes.has(tx.hash)) {
        return; // Skip this normal transaction
      }

      const bnbValue = new BigNumber(tx.value);
      const nativeFlows = { inflow: 0, outflow: 0 };

      if (bnbValue.gt(0) && tx.isError === '0') {
        if (tx.to.toLowerCase() === lowerUserAddress) {
          nativeFlows.inflow = bnbValue.div(1e18).toNumber();
        } else if (tx.from.toLowerCase() === lowerUserAddress) {
          nativeFlows.outflow = bnbValue.div(1e18).toNumber();
        }
      }

      txMap.set(tx.hash, {
        hash: tx.hash,
        timeStamp: parseInt(tx.timeStamp),
        from: tx.from,
        to: tx.to,
        gasFee: new BigNumber(tx.gasUsed).times(tx.gasPrice).div(1e18).toNumber(),
        blockNumber: parseInt(tx.blockNumber),
        flows: [],
        nativeFlows,
        isError: tx.isError !== '0',
      });
    });

    // Step 4: Add internal transactions (only for Alpha-related transaction hashes)
    internalTxList.forEach((tx) => {
      if (tx.isError !== '0' || !alphaRelatedHashes.has(tx.hash)) return;

      const existingTx = txMap.get(tx.hash);
      const bnbValue = new BigNumber(tx.value).div(1e18);

      if (existingTx) {
        if (tx.to.toLowerCase() === lowerUserAddress) {
          existingTx.nativeFlows!.inflow += bnbValue.toNumber();
        } else if (tx.from.toLowerCase() === lowerUserAddress) {
          existingTx.nativeFlows!.outflow += bnbValue.toNumber();
        }
      }
    });

    // Step 5: Add ALL token transactions for Alpha-related transaction hashes
    tokenTxList.forEach((tx) => {
      // Only process token transactions that are part of Alpha-related transactions
      if (!alphaRelatedHashes.has(tx.hash)) {
        return; // Skip this token transaction
      }

      let existingTx = txMap.get(tx.hash);
      if (!existingTx) {
        // Create new transaction record for Alpha-related transactions
        txMap.set(tx.hash, {
          hash: tx.hash,
          timeStamp: parseInt(tx.timeStamp),
          from: tx.from,
          to: tx.to,
          gasFee: 0, // Gas fee will be added if there's a corresponding normal transaction
          blockNumber: parseInt(tx.blockNumber),
          flows: [],
          isError: false,
        });
        existingTx = txMap.get(tx.hash)!;
      }

      const token: Token = {
        contractAddress: tx.contractAddress,
        symbol: tx.tokenSymbol,
        name: tx.tokenName,
        decimals: parseInt(tx.tokenDecimal),
      };

      const tokenValue = new BigNumber(tx.value).div(new BigNumber(10).pow(token.decimals));

      const flow: TokenFlow = {
        token: token,
        amount: tokenValue.toNumber(),
        isInflow: tx.to.toLowerCase() === lowerUserAddress,
        historicalPrice: null, // Price will be fetched on demand
      };

      existingTx.flows.push(flow);
    });

    const finalTransactions = Array.from(txMap.values()).sort((a, b) => b.timeStamp - a.timeStamp);

    // Count Alpha and non-Alpha tokens in the final result
    let alphaTokenCount = 0;
    let totalTokenCount = 0;
    finalTransactions.forEach(tx => {
      tx.flows.forEach(flow => {
        totalTokenCount++;
        if (this.alphaTokenAddresses.has(flow.token.contractAddress.toLowerCase())) {
          alphaTokenCount++;
        }
      });
    });

    console.log(`[DataProcessor] Final result: ${finalTransactions.length} Alpha-related transactions`);
    console.log(`[DataProcessor] Token composition: ${alphaTokenCount} Alpha tokens + ${totalTokenCount - alphaTokenCount} other tokens = ${totalTokenCount} total tokens`);
    console.log(`[DataProcessor] Filtering efficiency: ${((1 - finalTransactions.length / (normalTxList.length + tokenTxList.length)) * 100).toFixed(1)}% of transactions filtered out`);

    return finalTransactions;
  }
}
