export default {
  // Common
  common: {
    confirm: 'Confirm',
    cancel: 'Cancel',
    cancelled: 'Cancelled',
    delete: 'Delete',
    edit: 'Edit',
    save: 'Save',
    search: 'Search',
    loading: 'Loading...',
    refreshing: 'Refreshing...',
    manualRefresh: 'Manual Refresh',
    refreshStatistics: 'Refresh Statistics',
    noData: 'No Data',
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Info',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    submit: 'Submit',
    reset: 'Reset',
    refresh: 'Refresh',
    export: 'Export',
    import: 'Import',
    copy: 'Copy',
    copied: 'Copied',
    limited: 'Limited',
    count: ' items',
    tokens: ' tokens',
    total: 'Total',
    currentPrice: 'Current Price',
    contractAddress: 'Contract Address',
    copyContractAddress: 'Copy Contract Address',
    rank: 'Rank',
    cache: 'Cache',
    management: 'Management',
    overview: 'Overview',
    totalCacheEntries: 'Total Cache Entries',
    totalSize: 'Total Size',
    approximately: 'approx',
    cacheEntries: 'Cache Entries',
    size: 'Size',
    clear: 'Clear',
    clearCache: 'Clear Cache',
    alphaTokensCache: 'Alpha Tokens Cache',
    transactionsCache: 'Transactions Cache',
    statisticsCache: 'Statistics Cache',
    pricesCache: 'Prices Cache',
    coinIdsCache: 'Coin IDs Cache',
    notConfiguredUsingFree: 'Not configured (using free API)',
    configureCmcApiFirst: 'Please configure CoinMarketCap API key first, then click refresh to get latest data',
    configureApiKey: 'Configure API Key',
    fetchingAlphaTokens: 'Fetching Alpha tokens data...',
    pleaseWait: 'This may take a few seconds'
  },

  // Navigation Menu
  nav: {
    home: 'Home',
    alphaPointsRules: 'Alpha Points Rules',
    settings: 'Settings',
    airdropPreview: 'Airdrop Preview',
    addressManager: 'Address Manager',
    transactionResults: 'Transaction Results',
    contact: 'Contact Us',
    donation: 'Donation',
    help: 'Help Center',
    collapseSidebar: 'Collapse Sidebar'
  },

  // App Title
  app: {
    title: 'BN Alpha Tools',
    description: 'A not-so-professional BSC transaction data analysis tool'
  },

  // Home Page
  home: {
    searchPlaceholder: 'Enter BSC wallet address or select a saved address...',
    inputOrSelectAddress: 'Enter or select query address',
    startQuery: 'Start Query',
    querying: 'Querying...',
    searchHistory: 'Search History',
    noSavedAddresses: 'No saved addresses yet. Please add addresses in Settings for quick selection',
    features: {
      title: 'Key Features',
      transactionAnalysis: {
        title: 'Transaction Analysis',
        description: 'Detailed transaction data statistics'
      },
      tokenFlow: {
        title: 'Token Flow',
        description: 'Multi-dimensional fund flow analysis'
      },
      timeDistribution: {
        title: 'Time Distribution',
        description: 'Transaction time distribution charts'
      },
      pointsCalculation: {
        title: 'Points Calculation',
        description: 'Intelligent scoring system'
      }
    },
    currentTime: 'Current Time',
    unnamedAddress: 'Unnamed Address',
    viewInSettings: 'Settings',
    save: 'Save',
    saveAddress: 'Save Address',
    enterRemarkForAddress: 'Enter remark for address {address}:',
    remarkCannotBeEmpty: 'Remark cannot be empty'
  },

  // Error Page
  notFound: {
    title: 'Page Not Found',
    description: 'Sorry, the page you are looking for does not exist',
    backToHome: 'Back to Home'
  },

  // Form Validation
  validation: {
    required: 'This field is required',
    invalidAddress: 'Please enter a valid wallet address',
    invalidEmail: 'Please enter a valid email address',
    minLength: 'Minimum {min} characters required',
    maxLength: 'Maximum {max} characters allowed'
  },

  // Time Format
  time: {
    now: 'Just now',
    minutesAgo: '{minutes} minutes ago',
    hoursAgo: '{hours} hours ago',
    daysAgo: '{days} days ago',
    weeksAgo: '{weeks} weeks ago',
    monthsAgo: '{months} months ago',
    yearsAgo: '{years} years ago'
  },

  // Settings Page
  settings: {
    title: 'Settings',
    systemSettings: 'System Settings',
    description: 'Manage API keys, wallet addresses and Alpha token list',
    tabs: {
      api: 'API Keys',
      wallets: 'Wallet Management',
      tokens: 'Alpha Tokens',
      about: 'About'
    },
    apiKeys: {
      title: 'API Key Management',
      bscscan: {
        title: 'BSCScan API Key',
        placeholder: 'Enter BSCScan API Key',
        save: 'Save',
        resetToDefault: 'Reset to Default',
        currentUsing: 'Currently using',
        defaultKey: 'Default key',
        getFromUrl: 'Get from',
        rateLimit: 'Free users: 5 requests/second, 100,000 requests/day'
      },
      coinmarketcap: {
        title: 'CoinMarketCap API Key',
        dataSourceTitle: 'Alpha Token Data Source',
        dataSourceDesc: 'Use CoinMarketCap API to fetch Binance Alpha token list in real-time. Requires a valid API key to work properly.',
        placeholder: 'Enter CoinMarketCap API Key',
        currentStatus: 'Current status',
        usage: 'Used to fetch Binance Alpha token list'
      },
      coingecko: {
        title: 'CoinGecko API Key (Optional)',
        placeholder: 'Enter CoinGecko API Key (optional, for higher rate limits)',
        usage: 'Used to fetch historical price data, optional configuration',
        keyType: 'Key type'
      },
      common: {
        show: 'Show',
        hide: 'Hide',
        save: 'Save',
        status: {
          configured: 'Configured',
          notConfigured: 'Not configured',
          demo: 'Demo key',
          pro: 'Pro key'
        }
      }
    },
    wallets: {
      title: 'Wallet Address Management',
      addNew: 'Add New Address',
      addressPlaceholder: 'BSC Wallet Address (0x...)',
      remarkPlaceholder: 'Remark (optional)',
      addButton: 'Add Address',
      savedAddresses: 'Saved Addresses',
      actions: {
        edit: 'Edit',
        delete: 'Delete',
        query: 'Query'
      },
      validation: {
        invalidAddress: 'Invalid address format',
        addressExists: 'Address already exists'
      }
    },
    tokens: {
      title: 'Alpha Token Management',
      refresh: 'Refresh Token List',
      lastUpdate: 'Last updated',
      source: 'Data source',
      totalTokens: 'Total tokens',
      search: 'Search tokens...',
      noTokens: 'No token data',
      refreshHint: 'Click refresh button to get latest token list'
    },
    about: {
      title: 'About App',
      appInfo: 'App Information',
      version: 'Version',
      developer: 'Developer',
      description: 'Binance Smart Chain transaction data analysis tool',
      features: 'Main Features',
      featureList: {
        transactionAnalysis: 'Transaction data analysis',
        pointsCalculation: 'Alpha points calculation',
        historicalPrices: 'Historical price lookup',
        multiWallet: 'Multi-wallet management'
      },
      links: {
        sourceCode: 'Source Code',
        documentation: 'Documentation',
        support: 'Technical Support'
      }
    }
  },

  // Alpha Points Rules
  alphaPoints: {
    title: 'Alpha Points Rules',
    subtitle: 'Binance Alpha Points Rules',
    description: 'Learn about the point earning and calculation rules of Binance Alpha program',
    overview: {
      title: 'Points Rules Overview',
      content: 'The Binance Alpha points system is calculated based on two dimensions: user asset balance and trading activity. By holding qualified assets and trading Alpha tokens, users can earn corresponding point rewards. Points will be used to gain investment priority for Alpha projects and other exclusive benefits.'
    },
    balanceRules: {
      title: 'Balance Points Rules',
      qualifiedAssets: 'Qualified Assets Description',
      qualifiedAssetsDesc: 'Asset points include total assets held in Binance centralized exchange and Binance Wallet. Among them, centralized exchange assets are limited to tokens listed on Binance Spot in all accounts and assets in Alpha accounts; Binance Wallet assets are limited to Alpha tokens and tokens listed on Binance Spot. Other tokens not displayed in the Alpha zone and unable to trade on Binance Spot market, such as LSD tokens, are not considered qualified assets.',
      points: 'Points'
    },
    tradingRules: {
      title: 'Trading Volume Points Rules',
      limitedEvent: 'Limited Event: Double Points for BSC Chain Trading',
      limitedEventDesc: 'Trading Alpha tokens on BSC chain can earn double trading volume points (+1 point)!',
      viewAnnouncement: 'View Official Announcement',
      calculationMethod: 'Trading Volume Calculation Method',
      calculationDesc: 'Alpha tokens you purchased on Binance Exchange and/or Binance Web3 Wallet:',
      formula: 'Points calculation formula: floor(log₂(total trading amount))',
      totalAmount: 'Total trading amount = Alpha token purchase amount + BSC chain bonus',
      bscBonus: 'BSC chain trading: Additional +equivalent bonus (limited event)',
      example: 'Example: $16 Alpha + $16 BSC bonus = floor(log₂(32)) = 5 points',
      continue: '...and so on, +1 point for each doubling'
    },
    calculationExample: {
      title: 'Points Calculation Example',
      userA: 'Example User A',
      userB: 'Example User B',
      holdingAssets: 'Holding qualified assets',
      alphaPurchase: 'Alpha token purchase',
      bscChain: 'BSC chain',
      otherChain: 'Other chain',
      withBscBonus: 'With BSC bonus',
      noBscBonus: 'No BSC bonus',
      totalPoints: 'Total Points'
    },
    importantReminders: {
      title: 'Important Reminders',
      snapshotTime: {
        title: 'Points Snapshot Time',
        desc: 'Points calculation is based on specific time snapshots, please refer to official announcements for specific times.'
      },
      assetSecurity: {
        title: 'Asset Security',
        desc: 'Please ensure trading on official platforms and beware of phishing websites and scams.'
      },
      ruleUpdates: {
        title: 'Rule Updates',
        desc: 'Binance reserves the right to adjust point rules at any time, please follow official announcements.'
      }
    },
    relatedLinks: {
      title: 'Related Links',
      binanceAlpha: {
        title: 'Binance Alpha Projects',
        desc: 'Visit official Alpha page'
      },
      binanceWallet: {
        title: 'Binance Web3 Wallet',
        desc: 'Download and use wallet'
      }
    }
  },

  // Address Manager
  addressManager: {
    title: 'Address Manager',
    addAddress: 'Add Address',
    editAddress: 'Edit Address',
    deleteAddress: 'Delete Address',
    addressLabel: 'Address Label',
    walletAddress: 'Wallet Address',
    remark: 'Remark',
    createdAt: 'Created At',
    actions: 'Actions'
  },

  // Transaction Results
  transactionResults: {
    title: 'Transaction Results',
    transactionRecords: 'Transaction Records',
    globalStatistics: 'Global Statistics',
    pointsStatistics: 'Points Statistics',
    listView: 'List',
    statisticsView: 'Statistics',
    refresh: 'Refresh',
    refreshing: 'Refreshing',
    historicalPricesCached: 'Historical prices cached',
    needHistoricalPrices: 'Need historical prices',
    daysData: ' days data',
    totalTransactions: 'Total Transactions',
    totalAlphaInflow: 'Total Alpha Inflow',
    cumulativeAlphaPoints: 'Cumulative Alpha Points',
    averageDailyVolume: 'Average Daily Volume',
    transactions: ' transactions',
    calculateTransactions: 'Calculate Statistics',
    recalculate: 'Recalculate',
    alphaInflow: 'Alpha Inflow',
    alphaPoints: 'Alpha Points',
    gasConsumed: 'Gas Consumed',
    comprehensivePnL: 'Comprehensive P&L',
    calculationDescription: 'Calculation Method',
    calculationDetails: {
      alphaInflow: 'Alpha Inflow: Only counts Alpha token inflow amounts (USD)',
      bscBonus: 'BSC Bonus: BSC chain Alpha token inflows get additional equal rewards',
      pointsCalculation: 'Points Calculation: points = floor(log2(Alpha Inflow USD + BSC Bonus USD))',
      gasConsumed: 'Gas Consumed: Total gas fees for all transactions (BNB)',
      comprehensivePnL: 'Comprehensive P&L: All token net inflows minus gas fees',
      totalVolume: 'Total Volume: Sum of all token inflow amounts with price data',
      cacheOptimization: 'Cache Optimization: Historical price data is cached for faster calculations'
    },
    inflow: 'Inflow',
    outflow: 'Outflow',
    noPriceData: 'No price data',
    noTransactionRecords: 'No transaction records found',
    noTransactionsToday: 'No transactions today',
    noTransactionsThisDay: 'No transactions for this day',
    useRefreshModeToMonitor: 'Use refresh mode to monitor new transactions',
    statisticsViewInDevelopment: 'Statistics view in development',
    chartsAndAnalysisComingSoon: 'Charts and analysis features coming soon',
    // Points statistics related
    pointsOverview: 'Points Overview',
    rollingWindowStatistics: '15-day Rolling Window Points Statistics',
    transactionPoints: 'Transaction Points',
    balancePoints: 'Balance Points',
    adjustmentAmount: 'Adjustment Amount',
    totalPoints: 'Total Points',
    activeDays: 'Statistical Days',
    dailyBalanceSettings: 'Daily Balance Points Settings',
    dailyBalancePoints: 'Daily Balance Points',
    enterDailyBalance: 'Enter daily balance points',
    dailyBalanceDescription: 'Set daily fixed balance points (default 2 points/day)',
    resetAll: 'Reset All',
         timeRangeInfo: 'Time Range Information',
     utc15DaysDescription: 'Statistical range is 15 days from yesterday backwards in UTC time, current day data is not included',
     currentUtcTime: 'Current UTC Time',
     dailyPointsDetails: 'Daily Points Details',
     last15DaysUtc: '15-day points details (UTC yesterday backwards)',
    date: 'Date',
    adjustedBalance: 'Adjusted Balance',
    dailyTotal: 'Daily Total',
    actions: 'Actions',
         adjust: 'Adjust',
     reset: 'Reset',
     adjusted: 'Adjusted',
     latest: 'Latest',
    noPointsData: 'No points data available',
    pointsCalculationExplanation: 'Points Calculation Explanation',
    pointsCalculationRule1: 'Transaction Points: Based on Alpha token inflow, points = floor(log2(Inflow USD + BSC Bonus))',
    pointsCalculationRule2: 'Alpha tokens on BSC chain get additional equal bonus rewards',
         pointsCalculationRule3: 'Balance Points: Daily fixed points, default 2 points/day, globally adjustable',
     pointsCalculationRule4: 'Adjustment Amount: Additional daily points increase/decrease, supports positive and negative values',
     pointsCalculationRule5: 'Daily Total Points = Transaction Points + Balance Points + Adjustment Amount',
     pointsCalculationRule6: 'Statistical Range: 15 days from UTC yesterday backwards, rolling window auto-updates daily at UTC 00:00',
     rollingWindowHint: 'Points statistics automatically update the 15-day rolling window daily at UTC 00:00 (from yesterday backwards), historical data beyond the range will no longer be counted',
     rollingWindowSummary: '15-day Rolling Window Points Statistics',
     currentAlphaPoints: 'Current Alpha Points',
     calculatedAccurateValue: 'Precisely calculated based on rolling window',
          // Points adjustment related messages
     adjustPointsPrompt: 'Adjust points for {date} (current: {currentPoints}):',
     adjustDailyPoints: 'Adjust Daily Points',
     invalidPointsInput: 'Please enter a valid number',
     pointsAdjusted: 'Adjusted points for {date} to {points}',
     resetPointsConfirm: 'Are you sure you want to reset the points adjustment for {date}?',
     resetPoints: 'Reset Points Adjustment',
     pointsReset: 'Reset points adjustment for {date}',
    globalSpentPointsSaved: 'Daily balance points setting saved',
         resetAllConfirm: 'Are you sure you want to reset all points adjustments? This will clear all manual adjustments and balance points settings.',
     resetAllPoints: 'Reset All Points',
     allPointsReset: 'All points adjustments have been reset',
     // Points prediction feature
     pointsPrediction: 'Points Prediction',
     predictionDescription: 'Intelligent prediction of future points changes based on current data',
     dailyPredictedPoints: 'Predicted Daily Points',
     enterPredictedDaily: 'Enter predicted daily points',
     predictedDailyDescription: 'Predict the number of points that can be earned daily in the future',
     targetPoints: 'Target Points',
     enterTargetPoints: 'Enter target points',
     targetPointsDescription: 'Set the points target you want to achieve',
     datePrediction: 'Date Prediction',
     selectPredictionDate: 'Select prediction date',
     predictedPointsOn: 'Predicted points',
     basedOnCurrentData: 'Current points',
     futureEarnings: 'Future earnings',
     targetAchievement: 'Target Achievement',
     estimatedAchievementDate: 'Estimated achievement date',
     daysNeeded: 'Days needed',
     remainingPoints: 'Remaining points',
     alreadyAchieved: 'Target already achieved',
     currentTotal: 'Current total points',
     setTargetFirst: 'Please set target points first',
     rollingLoss: 'Rolling loss',
     rollingWindowNote: 'Due to 15-day rolling window mechanism, {lostPoints} points will be lost',
     rollingWindowWarning: 'Due to 15-day rolling window mechanism, this target cannot be achieved with current predictions. Consider increasing daily points or lowering the target',
     theoreticalMaxWarning: 'Target exceeds theoretical maximum! With 15-day rolling window, {dailyPoints} points per day can only reach maximum {maxPoints} points',
     cannotAchieve: 'Cannot achieve target'
  }
}
