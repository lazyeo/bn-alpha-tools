export default {
  // 通用
  common: {
    confirm: '确认',
    cancel: '取消',
    cancelled: '已取消',
    delete: '删除',
    edit: '编辑',
    save: '保存',
    search: '搜索',
    loading: '加载中...',
    refreshing: '刷新中...',
    manualRefresh: '手动刷新',
    refreshStatistics: '刷新统计',
    noData: '暂无数据',
    success: '成功',
    error: '错误',
    warning: '警告',
    info: '信息',
    close: '关闭',
    back: '返回',
    next: '下一步',
    previous: '上一步',
    submit: '提交',
    reset: '重置',
    refresh: '刷新',
    export: '导出',
    import: '导入',
    copy: '复制',
    copied: '已复制',
    limited: '限时',
    count: '个',
    tokens: '个代币',
    total: '总计',
    currentPrice: '当前价格',
    contractAddress: '合约地址',
    copyContractAddress: '复制合约地址',
    rank: '排名',
    cache: '缓存',
    management: '管理',
    overview: '总览',
    totalCacheEntries: '总缓存条目',
    totalSize: '总占用空间',
    approximately: '约',
    cacheEntries: '缓存条目',
    size: '占用空间',
    clear: '清空',
    clearCache: '清除缓存',
    alphaTokensCache: 'Alpha代币缓存',
    transactionsCache: '交易记录缓存',
    statisticsCache: '统计数据缓存',
    pricesCache: '价格数据缓存',
    coinIdsCache: '代币ID缓存',
    notConfiguredUsingFree: '未设置（使用免费接口）',
    configureCmcApiFirst: '请先配置CoinMarketCap API密钥，然后点击刷新获取最新数据',
    configureApiKey: '配置API密钥',
    fetchingAlphaTokens: '正在获取Alpha代币数据...',
    pleaseWait: '这可能需要几秒钟时间'
  },

  // 导航菜单
  nav: {
    home: '首页',
    alphaPointsRules: 'Alpha积分规则',
    settings: '设置',
    airdropPreview: '空投预告',
    addressManager: '地址管理',
    transactionResults: '交易结果',
    contact: '联系我们',
    donation: '赞助支持',
    help: '帮助中心',
    collapseSidebar: '收缩侧栏'
  },

  // 应用标题
  app: {
    title: 'BN Alpha Tools',
    description: '并不是很专业的币安智能链交易数据分析工具'
  },

  // 首页
  home: {
    searchPlaceholder: '请输入BSC钱包地址或选择已保存的地址...',
    inputOrSelectAddress: '输入或选择查询地址',
    startQuery: '开始查询',
    querying: '查询中...',
    searchHistory: '搜索记录',
    noSavedAddresses: '暂无已保存的地址，请先在设置中添加地址以便快速选择',
    features: {
      title: '功能特色',
      transactionAnalysis: {
        title: '交易分析',
        description: '详细的交易数据统计'
      },
      tokenFlow: {
        title: '代币流向',
        description: '多维度资金流向分析'
      },
      timeDistribution: {
        title: '时间分布',
        description: '交易时间分布图表'
      },
      pointsCalculation: {
        title: '积分计算',
        description: '智能积分评价系统'
      }
    },
    currentTime: '当前时间',
    unnamedAddress: '未命名地址',
    viewInSettings: '设置',
    save: '保存',
    saveAddress: '保存地址',
    enterRemarkForAddress: '为地址 {address} 输入备注:',
    remarkCannotBeEmpty: '备注不能为空'
  },

  // 错误页面
  notFound: {
    title: '页面未找到',
    description: '抱歉，您访问的页面不存在',
    backToHome: '返回首页'
  },

  // 表单验证
  validation: {
    required: '此字段为必填项',
    invalidAddress: '请输入有效的钱包地址',
    invalidEmail: '请输入有效的邮箱地址',
    minLength: '至少需要 {min} 个字符',
    maxLength: '不能超过 {max} 个字符'
  },

  // 时间格式
  time: {
    now: '刚刚',
    minutesAgo: '{minutes} 分钟前',
    hoursAgo: '{hours} 小时前',
    daysAgo: '{days} 天前',
    weeksAgo: '{weeks} 周前',
    monthsAgo: '{months} 个月前',
    yearsAgo: '{years} 年前'
  },

  // 设置页面
  settings: {
    title: '设置',
    systemSettings: '系统设置',
    description: '管理API密钥、钱包地址和Alpha代币列表',
    tabs: {
      api: 'API密钥',
      wallets: '钱包管理',
      tokens: 'Alpha代币',
      about: '关于'
    },
    apiKeys: {
      title: 'API密钥管理',
      bscscan: {
        title: 'BSCScan API密钥',
        placeholder: '请输入BSCScan API密钥',
        save: '保存',
        resetToDefault: '重置默认',
        currentUsing: '当前使用',
        defaultKey: '默认密钥',
        getFromUrl: '获取地址',
        rateLimit: '免费用户每秒5次请求，每天100,000次请求'
      },
      coinmarketcap: {
        title: 'CoinMarketCap API密钥',
        dataSourceTitle: 'Alpha代币数据源',
        dataSourceDesc: '使用CoinMarketCap API实时获取Binance Alpha代币列表。需要有效的API密钥才能正常工作。',
        placeholder: '请输入CoinMarketCap API密钥',
        currentStatus: '当前状态',
        usage: '用于获取Binance Alpha代币列表'
      },
      coingecko: {
        title: 'CoinGecko API密钥 (可选)',
        placeholder: '请输入CoinGecko API密钥 (可选，用于提高请求限制)',
        usage: '用于获取历史价格数据，可选配置',
        keyType: '密钥类型'
      },
      common: {
        show: '显示',
        hide: '隐藏',
        save: '保存',
        status: {
          configured: '已配置',
          notConfigured: '未配置',
          demo: '演示密钥',
          pro: 'Pro密钥'
        }
      }
    },
    wallets: {
      title: '钱包地址管理',
      addNew: '添加新地址',
      addressPlaceholder: 'BSC钱包地址 (0x...)',
      remarkPlaceholder: '备注 (可选)',
      addButton: '添加地址',
      savedAddresses: '已保存的地址',
      actions: {
        edit: '编辑',
        delete: '删除',
        query: '查询'
      },
      validation: {
        invalidAddress: '地址格式无效',
        addressExists: '地址已存在'
      }
    },
    tokens: {
      title: 'Alpha代币管理',
      refresh: '刷新代币列表',
      lastUpdate: '最后更新',
      source: '数据源',
      totalTokens: '代币总数',
      search: '搜索代币...',
      noTokens: '暂无代币数据',
      refreshHint: '点击刷新按钮获取最新代币列表'
    },
    about: {
      title: '关于应用',
      appInfo: '应用信息',
      version: '版本',
      developer: '开发者',
      description: '币安智能链交易数据分析工具',
      features: '主要功能',
      featureList: {
        transactionAnalysis: '交易数据分析',
        pointsCalculation: 'Alpha积分计算',
        historicalPrices: '历史价格查询',
        multiWallet: '多钱包管理'
      },
      links: {
        sourceCode: '源代码',
        documentation: '使用文档',
        support: '技术支持'
      }
    }
  },

  // Alpha积分规则
  alphaPoints: {
    title: 'Alpha积分规则',
    subtitle: '币安Alpha积分规则',
    description: '了解币安Alpha计划的积分获取和计算规则',
    overview: {
      title: '积分规则概述',
      content: '币安Alpha积分系统基于用户的资产余额和交易活动两个维度进行计算。通过持有合格资产和进行Alpha代币交易，用户可以获得相应的积分奖励。积分将用于获得Alpha项目的投资优先权和其他专属福利。'
    },
    balanceRules: {
      title: '余额积分规则',
      qualifiedAssets: '合格资产说明',
      qualifiedAssetsDesc: '资产积分包括在币安中心化交易所和币安钱包中持有的总资产。其中，中心化交易所资产仅限于所有账户中已上币安现货的代币以及Alpha账户中的资产；币安钱包资产仅限于Alpha代币和已上币安现货的代币。其他未在Alpha区展示以及未能在币安现货市场上交易的代币，例如LSD代币，均不被视为合格资产。',
      points: '积分'
    },
    tradingRules: {
      title: '交易量积分规则',
      limitedEvent: '限时活动：BSC链交易双倍积分',
      limitedEventDesc: '在BSC链进行Alpha代币交易可获得双倍交易量积分（积分+1）！',
      viewAnnouncement: '查看官方公告',
      calculationMethod: '交易量计算方式',
      calculationDesc: '你在币安交易所和/或币安Web3钱包上购买的Alpha代币：',
      formula: '积分计算公式：floor(log₂(总交易额))',
      totalAmount: '总交易额 = Alpha代币购买金额 + BSC链bonus',
      bscBonus: 'BSC链交易：额外+等额bonus（限时活动）',
      example: '例如：$16 Alpha + $16 BSC bonus = floor(log₂(32)) = 5积分',
      continue: '...以此类推，每翻倍增加1分'
    },
    calculationExample: {
      title: '积分计算示例',
      userA: '示例用户A',
      userB: '示例用户B',
      holdingAssets: '持有合格资产',
      alphaPurchase: 'Alpha代币购买',
      bscChain: 'BSC链',
      otherChain: '其他链',
      withBscBonus: '含BSC bonus',
      noBscBonus: '无BSC bonus',
      totalPoints: '总积分'
    },
    importantReminders: {
      title: '重要提醒',
      snapshotTime: {
        title: '积分快照时间',
        desc: '积分计算基于特定时间点的快照，具体时间以官方公告为准。'
      },
      assetSecurity: {
        title: '资产安全',
        desc: '请确保在官方平台进行交易，谨防钓鱼网站和诈骗行为。'
      },
      ruleUpdates: {
        title: '规则更新',
        desc: '币安保留随时调整积分规则的权利，请关注官方最新公告。'
      }
    },
    relatedLinks: {
      title: '相关链接',
      binanceAlpha: {
        title: '币安Alpha项目',
        desc: '访问官方Alpha页面'
      },
      binanceWallet: {
        title: '币安Web3钱包',
        desc: '下载和使用钱包'
      }
    }
  },

  // 地址管理
  addressManager: {
    title: '地址管理',
    addAddress: '添加地址',
    editAddress: '编辑地址',
    deleteAddress: '删除地址',
    addressLabel: '地址标签',
    walletAddress: '钱包地址',
    remark: '备注',
    createdAt: '创建时间',
    actions: '操作'
  },

  // 交易结果
  transactionResults: {
    title: '交易结果',
    transactionRecords: '交易记录',
    globalStatistics: '全局统计',
    pointsStatistics: '积分统计',
    listView: '列表',
    statisticsView: '统计',
    refresh: '刷新',
    refreshing: '刷新中',
    historicalPricesCached: '历史价格已缓存',
    needHistoricalPrices: '需要历史价格',
    daysData: '天数据',
    totalTransactions: '总交易数',
    totalAlphaInflow: 'Alpha流入总额',
    cumulativeAlphaPoints: '累计Alpha积分',
    averageDailyVolume: '日均交易量',
    transactions: '笔交易',
    calculateTransactions: '计算统计',
    recalculate: '重新计算',
    alphaInflow: 'Alpha流入',
    alphaPoints: 'Alpha积分',
    gasConsumed: 'Gas消耗',
    comprehensivePnL: '综合盈亏',
    calculationDescription: '计算方法说明',
    calculationDetails: {
      alphaInflow: 'Alpha流入：仅统计Alpha代币的流入金额（USD）',
      bscBonus: 'BSC奖励：BSC链上Alpha代币流入额外获得等额奖励',
      pointsCalculation: '积分计算：points = floor(log2(Alpha流入USD + BSC奖励USD))',
      gasConsumed: 'Gas消耗：所有交易的Gas费用总和（BNB）',
      comprehensivePnL: '综合盈亏：所有代币净流入减去Gas费用的综合损益',
      totalVolume: '总交易量：所有有价格数据的代币流入金额总和',
      cacheOptimization: '缓存优化：历史价格数据会被缓存以提高后续计算速度'
    },
    inflow: '流入',
    outflow: '流出',
    noPriceData: '无价格数据',
    noTransactionRecords: '暂无交易记录',
    statisticsViewInDevelopment: '统计视图开发中',
    chartsAndAnalysisComingSoon: '图表和分析功能即将推出',
    // 积分统计相关
    pointsOverview: '积分总览',
    rollingWindowStatistics: '15日滚动窗口积分统计',
    transactionPoints: '交易积分',
    balancePoints: '余额积分',
    adjustmentAmount: '调整金额',
    totalPoints: '总积分',
    activeDays: '统计天数',
    dailyBalanceSettings: '每日余额积分设置',
    dailyBalancePoints: '每日余额积分',
    enterDailyBalance: '输入每日余额积分',
    dailyBalanceDescription: '设置每日固定获得的余额积分（默认2分/日）',
    resetAll: '重置全部',
    timeRangeInfo: '时间范围说明',
    utc15DaysDescription: '统计范围为UTC时间前一天往前推15日，当日数据不计入统计',
    currentUtcTime: '当前UTC时间',
    dailyPointsDetails: '每日积分明细',
    last15DaysUtc: '15日积分明细（UTC前一天往前推）',
    date: '日期',
    adjustedBalance: '调整后余额',
    dailyTotal: '每日总计',
    actions: '操作',
    adjust: '调整',
    reset: '重置',
    adjusted: '已调整',
    latest: '最新',
    noPointsData: '暂无积分数据',
    pointsCalculationExplanation: '积分计算说明',
    pointsCalculationRule1: '交易积分：基于Alpha代币流入金额计算，points = floor(log2(流入USD + BSC奖励))',
    pointsCalculationRule2: 'BSC链上的Alpha代币流入可获得等额奖励加成',
    pointsCalculationRule3: '余额积分：每日固定获得的积分，默认2分/日，可全局调整',
    pointsCalculationRule4: '调整金额：可对每日额外增减积分，支持正负数调整',
    pointsCalculationRule5: '每日总积分 = 交易积分 + 余额积分 + 调整金额',
    pointsCalculationRule6: '统计范围：UTC前一天往前推15日，每日UTC 00:00自动更新滚动窗口',
    rollingWindowHint: '积分统计每日UTC 00:00自动更新15日滚动窗口（从前一天往前推），超出范围的历史数据将不再计入统计',
    rollingWindowSummary: '15日滚动窗口积分统计',
    currentAlphaPoints: '当前Alpha积分',
    calculatedAccurateValue: '基于滚动窗口精确计算',
    // 积分调整相关消息
    adjustPointsPrompt: '调整 {date} 的积分（当前：{currentPoints}）：',
    adjustDailyPoints: '调整每日积分',
    invalidPointsInput: '请输入有效的数字',
    pointsAdjusted: '已将 {date} 的积分调整为 {points}',
    resetPointsConfirm: '确定要重置 {date} 的积分调整吗？',
    resetPoints: '重置积分调整',
    pointsReset: '已重置 {date} 的积分调整',
    globalSpentPointsSaved: '每日余额积分设置已保存',
    resetAllConfirm: '确定要重置所有积分调整吗？这将清除所有手动调整和余额积分设置。',
    resetAllPoints: '重置所有积分',
    allPointsReset: '已重置所有积分调整',
    // 积分预测功能
    pointsPrediction: '积分预测',
    predictionDescription: '基于当前数据智能预测未来积分变化',
    dailyPredictedPoints: '预测每日积分',
    enterPredictedDaily: '输入预测每日积分',
    predictedDailyDescription: '预测未来每日可获得的积分数量',
    targetPoints: '目标积分',
    enterTargetPoints: '输入目标积分',
    targetPointsDescription: '设置想要达成的积分目标',
    datePrediction: '日期预测',
    selectPredictionDate: '选择预测日期',
    predictedPointsOn: '预计积分',
    basedOnCurrentData: '当前积分',
    futureEarnings: '未来收益',
    targetAchievement: '目标达成',
    estimatedAchievementDate: '预计达成日期',
    daysNeeded: '需要天数',
    remainingPoints: '剩余积分',
    alreadyAchieved: '已达成目标',
    currentTotal: '当前总积分',
    setTargetFirst: '请先设置目标积分',
    rollingLoss: '滚动失效',
    rollingWindowNote: '由于15日滚动窗口机制，将失效 {lostPoints} 积分',
    rollingWindowWarning: '由于15日滚动窗口机制，以当前预测无法达成此目标。建议提高每日积分或降低目标',
    theoreticalMaxWarning: '目标积分超过理论最大值！15日滚动窗口下，每日{dailyPoints}分最多只能达到{maxPoints}分',
    cannotAchieve: '无法达成目标'
  }
}
