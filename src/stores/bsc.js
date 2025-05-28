import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useBscStore = defineStore('bsc', {
  state: () => ({
    // 搜索相关
    currentAddress: '',
    searchResults: [],
    searchHistory: [],

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
    }
  },

  actions: {
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
      if (!address) return

      // 移除已存在的地址
      const existingIndex = this.searchHistory.indexOf(address)
      if (existingIndex !== -1) {
        this.searchHistory.splice(existingIndex, 1)
      }

      // 添加到开头
      this.searchHistory.unshift(address)

      // 限制历史记录数量
      if (this.searchHistory.length > 10) {
        this.searchHistory = this.searchHistory.slice(0, 10)
      }

      // 保存到localStorage
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
          totalVolume: 0,
          averageDaily: 0,
          activeDays: 0
        }
        return
      }

      let totalTransactions = 0
      let totalVolume = 0

      this.searchResults.forEach(dayData => {
        totalTransactions += dayData.transactions?.length || 0
        totalVolume += dayData.tokenStats?.['BSC-USD']?.outflow || 0
      })

      this.statistics = {
        totalTransactions,
        totalVolume: parseFloat(totalVolume.toFixed(2)),
        averageDaily: parseFloat((totalVolume / this.searchResults.length).toFixed(2)),
        activeDays: this.searchResults.length
      }
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

    // 初始化store
    init() {
      this.loadSearchHistory()
      this.loadSettings()
    }
  }
})
