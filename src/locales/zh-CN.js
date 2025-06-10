export default {
  // 通用
  common: {
    confirm: '确认',
    cancel: '取消',
    delete: '删除',
    edit: '编辑',
    save: '保存',
    search: '搜索',
    loading: '加载中...',
    refreshing: '刷新中...',
    manualRefresh: '手动刷新',
    refreshStatistics: '刷新统计',
    noData: '暂无数据',
    success: '操作成功',
    error: '操作失败',
    warning: '警告',
    info: '提示',
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
    listView: '列表',
    statisticsView: '统计',
    refresh: '刷新',
    refreshing: '刷新中',
    historicalPricesCached: '历史价格已缓存',
    needHistoricalPrices: '需要获取历史价格',
    daysData: '天数据',
    totalTransactions: '总交易笔数',
    totalAlphaInflow: 'Alpha代币总流入',
    cumulativeAlphaPoints: '累计Alpha积分',
    averageDailyVolume: '日均交易额',
    transactions: '笔交易',
    recalculate: '重新统计',
    calculateTransactions: '统计交易',
    alphaInflow: 'Alpha Inflow',
    alphaPoints: 'Alpha Points',
    gasConsumed: 'Gas消耗',
    comprehensivePnL: '综合损益',
    alphaNet: 'Alpha净额',
    stablecoinNet: '稳定币净额',
    bnbNet: 'BNB净额',
    calculationDescription: '统计计算说明',
    calculationDetails: {
      alphaInflow: 'Alpha Inflow: 当日所有Alpha代币流入的USD价值总和',
      bscBonus: 'BSC Bonus: BSC链Alpha代币流入额外计算一次（双倍奖励）',
      pointsCalculation: '积分计算: floor(log₂(Alpha Inflow + BSC Bonus))',
      gasConsumed: 'Gas消耗: 当日所有交易的BNB gas费用总和（按BNB≈$600计算USD）',
      comprehensivePnL: '综合损益: 所有代币净流入流出差额 - Gas费用，绿色(+)盈利，红色(-)亏损',
      totalVolume: '总交易量: 只统计流入避免重复计算（交换中的流出通常对应其他代币流入）',
      cacheOptimization: '💾 缓存优化: 历史价格数据已缓存，无需重复获取'
    },
    noTransactionRecords: '没有找到交易记录。',
    statisticsViewInDevelopment: '统计视图正在建设中',
    chartsAndAnalysisComingSoon: '详细的图表和数据分析即将推出。',
    inflow: '↓ In',
    outflow: '↑ Out',
    noPriceData: 'No price data'
  }
}
