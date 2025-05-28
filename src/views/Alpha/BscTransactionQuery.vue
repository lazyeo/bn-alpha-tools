<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6 text-center">BSC每日交易量查询工具</h1>

    <div class="max-w-xl mx-auto mb-6">
      <el-input v-model="bscAddress" placeholder="请输入BSC地址" class="mb-4" clearable>
        <template #append>
          <el-button @click="queryTransactions" :loading="loading"> 查询 </el-button>
        </template>
      </el-input>

      <!-- 搜索历史记录 -->
      <div v-if="searchHistory.length > 0" class="search-history mt-2 mb-4">
        <div class="text-sm text-gray-500 mb-1">搜索记录：</div>
        <div class="flex flex-wrap gap-2">
          <div
            v-for="(address, index) in searchHistory"
            :key="index"
            class="search-history-item flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm"
          >
            <span
              class="address-text truncate max-w-40 cursor-pointer"
              @click="useHistoryAddress(address)"
              :title="address"
            >
              {{ address }}
            </span>
            <button
              class="ml-2 text-gray-500 hover:text-red-500 transition-colors"
              @click="removeHistoryAddress(index)"
              title="删除记录"
            >
              <span class="text-xs">×</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="errorMessage" class="text-red-500 text-center mb-4">
      {{ errorMessage }}
    </div>

    <!-- 自定义响应式列表，替代表格 -->
    <div v-if="transactionData.length > 0" class="max-w-6xl mx-auto">
      <!-- 列表标题 - 在移动端隐藏 -->
      <div class="hidden md:flex bg-gray-100 rounded-t-lg p-3 font-medium text-gray-700">
        <div class="w-1/6">日期</div>
        <div class="w-1/6">交易笔数</div>
        <div class="w-1/6">交易量</div>
        <div class="w-1/6">亏损</div>
        <div class="w-1/6">获得积分</div>
        <div class="w-1/6">操作</div>
      </div>

      <!-- 列表内容 -->
      <div class="transaction-list">
        <div
          v-for="(item, index) in transactionData"
          :key="index"
          class="transaction-item"
          :class="{ 'bg-gray-50': index % 2 === 0 }"
        >
          <!-- 桌面端显示 -->
          <div class="hidden md:flex p-3 border-b border-gray-200 items-center">
            <div class="w-1/6">{{ item.date }}</div>
            <div class="w-1/6">{{ item?.transactions?.length }}</div>
            <div class="w-1/6">{{ item?.tokenStats?.['BSC-USD']?.outflow?.toFixed(2) }}</div>
            <div class="w-1/6 text-red-500">{{ calculateLoss(item?.tokenStats) }}</div>
            <div class="w-1/6 text-green-600">
              {{ calculatePoints(item?.tokenStats) }}
            </div>
            <div class="w-1/6">
              <el-button
                size="small"
                @click="toggleExpanded(index)"
                type="primary"
                :icon="expandedRows.has(index) ? 'ArrowUp' : 'ArrowDown'"
                text
              >
                {{ expandedRows.has(index) ? '收起' : '展开' }}
              </el-button>
            </div>
          </div>

          <!-- 移动端卡片式显示 -->
          <div class="md:hidden p-4 rounded-lg shadow-sm border border-gray-200 mb-3">
            <div class="flex justify-between py-1 border-b border-gray-100">
              <span class="font-medium text-gray-600">日期</span>
              <span>{{ item.date }}</span>
            </div>
            <div class="flex justify-between py-1 border-b border-gray-100">
              <span class="font-medium text-gray-600">交易笔数</span>
              <span>{{ item?.transactions?.length }}</span>
            </div>
            <div class="flex justify-between py-1 border-b border-gray-100">
              <span class="font-medium text-gray-600">交易量</span>
              <span>{{ item?.tokenStats?.['BSC-USD']?.outflow?.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between py-1 border-b border-gray-100">
              <span class="font-medium text-gray-600">亏损</span>
              <span class="text-red-500">{{ calculateLoss(item?.tokenStats) }}</span>
            </div>
            <div class="flex justify-between py-1 border-b border-gray-100">
              <span class="font-medium text-gray-600">获得积分</span>
              <span class="text-green-600">{{ calculatePoints(item?.tokenStats) }}</span>
            </div>
            <div class="flex justify-between py-1">
              <span class="font-medium text-gray-600">操作</span>
              <el-button
                size="small"
                @click="toggleExpanded(index)"
                type="primary"
                :icon="expandedRows.has(index) ? 'ArrowUp' : 'ArrowDown'"
                text
              >
                {{ expandedRows.has(index) ? '收起' : '展开' }}
              </el-button>
            </div>
          </div>

          <!-- 展开的详细交易信息 -->
          <div v-if="expandedRows.has(index)" class="expanded-content bg-gray-50 border-t border-gray-200">
            <div class="p-4">
              <h3 class="text-lg font-medium mb-4 text-gray-800">{{ item.date }} 详细交易记录</h3>

              <!-- 交易详情表格 -->
              <div class="overflow-x-auto">
                <!-- 桌面端表格标题 -->
                <div class="hidden md:flex bg-white rounded-lg p-3 mb-2 shadow-sm font-medium text-gray-700 text-sm">
                  <div class="w-1/6">交易哈希</div>
                  <div class="w-1/6">时间</div>
                  <div class="w-1/6">发送方</div>
                  <div class="w-1/6">接收方</div>
                  <div class="w-1/6">代币流向</div>
                  <div class="w-1/6">状态</div>
                </div>

                <!-- 交易详情列表 -->
                <div class="space-y-2">
                  <div
                    v-for="tx in item.transactions"
                    :key="tx.hash"
                    class="bg-white rounded-lg shadow-sm"
                  >
                    <!-- 桌面端显示 -->
                    <div class="hidden md:flex p-3 text-sm">
                      <div class="w-1/6">
                        <div class="truncate" :title="tx.hash">
                          <a
                            :href="`https://bscscan.com/tx/${tx.hash}`"
                            target="_blank"
                            class="text-blue-600 hover:text-blue-800 underline"
                          >
                            {{ tx.hash.slice(0, 8) }}...{{ tx.hash.slice(-6) }}
                          </a>
                        </div>
                      </div>
                      <div class="w-1/6">
                        {{ formatTime(tx.timeStamp) }}
                      </div>
                      <div class="w-1/6">
                        <div class="truncate" :title="tx.from">
                          {{ tx.from.slice(0, 6) }}...{{ tx.from.slice(-4) }}
                        </div>
                      </div>
                      <div class="w-1/6">
                        <div class="truncate" :title="tx.to">
                          {{ tx.to.slice(0, 6) }}...{{ tx.to.slice(-4) }}
                        </div>
                      </div>
                      <div class="w-1/6">
                        <div class="token-flows">
                          <div v-for="(tokenData, tokenSymbol) in tx.tokens" :key="tokenSymbol" class="mb-1">
                            <div v-if="tokenData.inflow > 0 || tokenData.outflow > 0" class="text-xs">
                              <span class="font-medium">{{ tokenSymbol }}:</span>
                              <span v-if="tokenData.inflow > 0" class="text-green-600 ml-1">
                                +{{ tokenData.inflow.toFixed(6) }}
                              </span>
                              <span v-if="tokenData.outflow > 0" class="text-red-600 ml-1">
                                -{{ tokenData.outflow.toFixed(6) }}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="w-1/6">
                        <span
                          :class="{
                            'text-green-600 bg-green-100': tx.status === '成功',
                            'text-red-600 bg-red-100': tx.status === '失败'
                          }"
                          class="px-2 py-1 rounded-full text-xs font-medium"
                        >
                          {{ tx.status }}
                        </span>
                      </div>
                    </div>

                    <!-- 移动端卡片式显示 -->
                    <div class="md:hidden p-3 space-y-2">
                      <div class="flex justify-between items-center border-b border-gray-100 pb-2">
                        <span class="font-medium text-gray-600">交易哈希</span>
                        <a
                          :href="`https://bscscan.com/tx/${tx.hash}`"
                          target="_blank"
                          class="text-blue-600 hover:text-blue-800 underline text-sm"
                        >
                          {{ tx.hash.slice(0, 8) }}...{{ tx.hash.slice(-6) }}
                        </a>
                      </div>
                      <div class="flex justify-between py-1">
                        <span class="font-medium text-gray-600">时间</span>
                        <span class="text-sm">{{ formatTime(tx.timeStamp) }}</span>
                      </div>
                      <div class="flex justify-between py-1">
                        <span class="font-medium text-gray-600">发送方</span>
                        <span class="text-sm" :title="tx.from">
                          {{ tx.from.slice(0, 6) }}...{{ tx.from.slice(-4) }}
                        </span>
                      </div>
                      <div class="flex justify-between py-1">
                        <span class="font-medium text-gray-600">接收方</span>
                        <span class="text-sm" :title="tx.to">
                          {{ tx.to.slice(0, 6) }}...{{ tx.to.slice(-4) }}
                        </span>
                      </div>
                      <div class="py-1">
                        <div class="font-medium text-gray-600 mb-1">代币流向</div>
                        <div class="token-flows">
                          <div v-for="(tokenData, tokenSymbol) in tx.tokens" :key="tokenSymbol" class="mb-1">
                            <div v-if="tokenData.inflow > 0 || tokenData.outflow > 0" class="text-sm">
                              <span class="font-medium">{{ tokenSymbol }}:</span>
                              <span v-if="tokenData.inflow > 0" class="text-green-600 ml-1">
                                +{{ tokenData.inflow.toFixed(6) }}
                              </span>
                              <span v-if="tokenData.outflow > 0" class="text-red-600 ml-1">
                                -{{ tokenData.outflow.toFixed(6) }}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="flex justify-between py-1">
                        <span class="font-medium text-gray-600">状态</span>
                        <span
                          :class="{
                            'text-green-600 bg-green-100': tx.status === '成功',
                            'text-red-600 bg-red-100': tx.status === '失败'
                          }"
                          class="px-2 py-1 rounded-full text-xs font-medium"
                        >
                          {{ tx.status }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="queried && !loading" class="text-center text-gray-500 mt-8">
      没有找到交易数据
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { ApiUtils } from '@/utils/api'
import { TransactionUtils } from '@/utils/transaction'

const SEARCH_HISTORY_KEY = 'bsc_search_history'
const MAX_HISTORY_ITEMS = 5

const bscAddress = ref('')
const transactionData = ref([])
const loading = ref(false)
const errorMessage = ref('')
const queried = ref(false)
const searchHistory = ref([])
const expandedRows = ref(new Set())

// 初始化时加载搜索历史
onMounted(() => {
  loadSearchHistory()
})

// 加载搜索历史
const loadSearchHistory = () => {
  try {
    const savedHistory = localStorage.getItem(SEARCH_HISTORY_KEY)
    if (savedHistory) {
      searchHistory.value = JSON.parse(savedHistory)
    }
  } catch (error) {
    console.error('加载搜索历史失败:', error)
    // 如果加载失败，初始化为空数组
    searchHistory.value = []
  }
}

// 保存搜索历史
const saveSearchHistory = () => {
  try {
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(searchHistory.value))
  } catch (error) {
    console.error('保存搜索历史失败:', error)
  }
}

// 添加地址到搜索历史
const addToSearchHistory = (address) => {
  // 如果地址已存在，先移除它
  const index = searchHistory.value.indexOf(address)
  if (index !== -1) {
    searchHistory.value.splice(index, 1)
  }

  // 添加到历史记录的开头
  searchHistory.value.unshift(address)

  // 如果超过最大数量，移除最旧的
  if (searchHistory.value.length > MAX_HISTORY_ITEMS) {
    searchHistory.value = searchHistory.value.slice(0, MAX_HISTORY_ITEMS)
  }

  // 保存到本地存储
  saveSearchHistory()
}

// 从搜索历史中移除地址
const removeHistoryAddress = (index) => {
  searchHistory.value.splice(index, 1)
  saveSearchHistory()
}

// 使用历史记录中的地址
const useHistoryAddress = (address) => {
  bscAddress.value = address
  queryTransactions()
}

// BSC地址验证函数
const isValidBscAddress = (address) => {
  // BSC地址是以0x开头的42位16进制字符串
  return /^0x[0-9a-fA-F]{40}$/.test(address)
}

// 查询交易数据
const queryTransactions = async () => {
  transactionData.value = []
  // 重置状态
  errorMessage.value = ''
  queried.value = true

  // 验证地址
  if (!bscAddress.value) {
    errorMessage.value = '请输入BSC地址'
    return
  }

  if (!isValidBscAddress(bscAddress.value)) {
    errorMessage.value = '请输入有效的BSC地址'
    return
  }

  // 添加到搜索历史
  addToSearchHistory(bscAddress.value)

  loading.value = true

  try {
    // 获取交易数据
    const filteredTransactions = await ApiUtils.fetchAddressData(bscAddress.value)
    if (filteredTransactions.length === 0) {
      ElMessage.info('未找到与目标合约的交易记录')
      loading.value = false
      transactionData.value = []
      return
    }
    const sortedDays = TransactionUtils.groupTransactionsByDay(filteredTransactions)

    transactionData.value = sortedDays.map((item) => item['1'])
  } catch (error) {
    console.error('查询失败:', error)
    errorMessage.value = '查询失败，请稍后重试'
    transactionData.value = []
  } finally {
    loading.value = false
  }
}

//计算亏损
const calculateLoss = (tokenStats) => {
  const outflow = tokenStats['BSC-USD']?.outflow || 0
  const inflow = tokenStats['BSC-USD']?.inflow || 0
  return (inflow - outflow).toFixed(2)
}
//计算积分
const calculatePoints = (tokenStats) => {
  const outflow = tokenStats['BSC-USD']?.outflow || 0
  // 如果亏损为0或负数，返回0积分
  if (outflow <= 0) return 0

  // 将亏损转换为正数并向下取整
  const absoluteLoss = Math.floor(Math.abs(outflow * 2))

  // 计算2的幂次方
  const power = Math.floor(Math.log2(absoluteLoss))

  // 返回2的幂次方作为积分
  return power
}

// 格式化时间戳
const formatTime = (timestamp) => {
  const date = new Date(parseInt(timestamp) * 1000)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 切换展开状态
const toggleExpanded = (index) => {
  if (expandedRows.value.has(index)) {
    expandedRows.value.delete(index)
  } else {
    expandedRows.value.add(index)
  }
}
</script>

<style scoped>
.transaction-list {
  border-radius: 8px;
  overflow: hidden;
}

.search-history-item {
  transition: all 0.2s ease;
}

.search-history-item:hover {
  background-color: #e5e7eb;
}

.address-text {
  transition: color 0.2s ease;
}

.address-text:hover {
  color: #3b82f6;
}

.expanded-content {
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.token-flows {
  max-height: 100px;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .transaction-list {
    padding: 0 0.5rem;
  }

  .transaction-item {
    transition: all 0.2s ease;
  }

  .transaction-item:active {
    transform: scale(0.98);
  }
}
</style>
