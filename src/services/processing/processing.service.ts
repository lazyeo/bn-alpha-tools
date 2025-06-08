import type { StandardTransaction, Token, TokenFlow } from '@/models/types';
import { BigNumber } from 'bignumber.js';
import { CoinGeckoPriceConnector } from '../datasource/coingecko';

export class DataProcessingService {
  private priceConnector: CoinGeckoPriceConnector;

  constructor() {
    this.priceConnector = new CoinGeckoPriceConnector();
  }

  /**
   * Processes raw transaction lists from a blockchain data source and standardizes them.
   * This version does NOT fetch prices. It only standardizes the format.
   * @param userAddress The address of the user wallet.
   * @param normalTxList Raw list of normal transactions.
   * @param internalTxList Raw list of internal transactions.
   * @param tokenTxList Raw list of ERC-20/BEP-20 token transactions.
   * @returns A sorted array of standardized transactions.
   */
  public standardize(
    userAddress: string,
    normalTxList: any[],
    internalTxList: any[],
    tokenTxList: any[]
  ): StandardTransaction[] {
    const txMap = new Map<string, StandardTransaction>();
    const lowerUserAddress = userAddress.toLowerCase();

    // 1. Process normal transactions (main BNB transfers and gas fees)
    normalTxList.forEach((tx) => {
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

    // 2. Add internal transactions (contract-internal BNB transfers)
    internalTxList.forEach((tx) => {
      if (tx.isError !== '0') return;

      const existingTx = txMap.get(tx.hash);
      const bnbValue = new BigNumber(tx.value).div(1e18);

      if (existingTx) {
        if (tx.to.toLowerCase() === lowerUserAddress) {
          existingTx.nativeFlows!.inflow += bnbValue.toNumber();
        } else if (tx.from.toLowerCase() === lowerUserAddress) {
          existingTx.nativeFlows!.outflow += bnbValue.toNumber();
        }
      }
      // Note: Standalone internal transactions without a parent normal tx are ignored for simplicity.
    });

    // 3. Add token transactions (BEP-20)
    tokenTxList.forEach((tx) => {
      let existingTx = txMap.get(tx.hash);
      if (!existingTx) {
         txMap.set(tx.hash, {
            hash: tx.hash,
            timeStamp: parseInt(tx.timeStamp),
            from: tx.from,
            to: tx.to,
            gasFee: 0,
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

    return Array.from(txMap.values()).sort((a, b) => b.timeStamp - a.timeStamp);
  }
}
