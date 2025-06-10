<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 头部 -->
    <div class="bg-gradient-to-br from-blue-500 via-purple-600 to-blue-700 px-4 py-6 text-white">
      <div class="text-center mb-8">
        <p class="text-blue-100">{{ $t('app.description') }}</p>
      </div>

      <!-- 搜索框 -->
      <div class="max-w-lg mx-auto mb-6">
        <div class="bg-white rounded-2xl p-6 shadow-lg">
          <!-- 统一地址输入控件 -->
          <div class="mb-4">
            <h3 class="text-sm font-medium text-gray-700 mb-4">{{ $t('home.inputOrSelectAddress') }}</h3>

            <!-- 地址输入/选择组合框 -->
            <div class="relative">
              <!-- 文本输入框 -->
              <input
                v-model="bscAddress"
                @keyup.enter="queryTransactions"
                @input="onAddressInput"
                @focus="showDropdown = true"
                @blur="onInputBlur"
                type="text"
                :placeholder="$t('home.searchPlaceholder')"
                class="w-full px-4 py-4 pl-12 pr-16 border border-gray-200 rounded-xl text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                :class="{ 'border-red-300': errorMessage }"
              />

              <!-- 搜索图标 -->
              <i class="fas fa-search absolute left-4 top-5 text-gray-400"></i>

              <!-- 下拉箭头 -->
              <button
                @click="toggleDropdown"
                class="absolute right-2 top-2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                type="button"
              >
                <i :class="showDropdown ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
              </button>

              <!-- 下拉选项列表 -->
              <div
                v-if="showDropdown && filteredAddresses.length > 0"
                class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-y-auto"
              >
                <div
                  v-for="(address, index) in filteredAddresses"
                  :key="index"
                  @click="selectAddress(address)"
                  class="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex-1">
                      <div class="font-medium text-gray-800">{{ address.remark || $t('home.unnamedAddress') }}</div>
                      <div class="text-sm text-gray-500 font-mono">{{ formatAddress(address.address) }}</div>
                    </div>
                    <i class="fas fa-check text-blue-500 opacity-0" :class="{ 'opacity-100': bscAddress === address.address }"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 无已保存地址提示 -->
          <div v-if="savedAddresses.length === 0" class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <div class="flex items-center">
              <i class="fas fa-info-circle text-yellow-500 mr-2"></i>
              <span class="text-sm text-yellow-700">
                {{ $t('home.noSavedAddresses') }}
                <router-link to="/settings" class="font-medium underline">{{ $t('home.viewInSettings') }}</router-link>
              </span>
            </div>
          </div>

          <!-- 错误提示 -->
          <div v-if="errorMessage" class="mt-3 text-red-500 text-sm">
            {{ errorMessage }}
          </div>

          <button
            @click="queryTransactions"
            :disabled="loading || !bscAddress"
            class="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
          >
            <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
            <i v-else class="fas fa-search-plus mr-2"></i>
            {{ loading ? $t('home.querying') : $t('home.startQuery') }}
          </button>
        </div>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="px-4 py-6 pb-8">
      <!-- 搜索历史 -->
      <div v-if="searchHistory.length > 0" class="mb-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <i class="fas fa-history text-blue-500 mr-2"></i>
          {{ $t('home.searchHistory') }}
        </h3>
        <div class="space-y-2">
          <div
            v-for="(address, index) in searchHistory"
            :key="index"
            class="bg-white rounded-lg p-3 shadow-sm flex items-center justify-between"
          >
            <div
              @click="useHistoryAddress(address)"
              class="flex-1 cursor-pointer min-w-0"
            >
              <div class="font-medium text-gray-800 truncate">
                {{ getWalletRemark(address) || t('home.unnamedAddress') }}
              </div>
              <div class="text-sm text-gray-500 font-mono truncate">
                {{ address }}
              </div>
            </div>
            <button
              @click.stop="copyAddress(address)"
              class="text-blue-500 hover:text-blue-700 transition-colors mr-2 px-2 py-1 rounded-md bg-blue-100 text-xs"
            >
              <i class="fas fa-copy"></i>
            </button>
            <button
              v-if="!isWalletSaved(address)"
              @click.stop="promptAndSaveAddress(address)"
              class="text-green-500 hover:text-green-700 transition-colors mr-2 px-2 py-1 rounded-md bg-green-100 text-xs"
            >
              <i class="fas fa-save mr-1"></i>
              {{ $t('home.save') }}
            </button>
            <button
              @click="removeHistoryAddress(index)"
              class="text-red-400 hover:text-red-600 transition-colors"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- 功能介绍 -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <i class="fas fa-info-circle text-green-500 mr-2"></i>
          {{ $t('home.features.title') }}
        </h3>
        <div class="grid grid-cols-2 gap-3">
          <div class="bg-white rounded-lg p-4 shadow-sm text-center">
            <i class="fas fa-chart-line text-blue-500 text-2xl mb-2"></i>
            <div class="font-medium text-gray-800">{{ $t('home.features.transactionAnalysis.title') }}</div>
            <div class="text-sm text-gray-500">{{ $t('home.features.transactionAnalysis.description') }}</div>
          </div>
          <div class="bg-white rounded-lg p-4 shadow-sm text-center">
            <i class="fas fa-coins text-green-500 text-2xl mb-2"></i>
            <div class="font-medium text-gray-800">{{ $t('home.features.tokenFlow.title') }}</div>
            <div class="text-sm text-gray-500">{{ $t('home.features.tokenFlow.description') }}</div>
          </div>
          <div class="bg-white rounded-lg p-4 shadow-sm text-center">
            <i class="fas fa-clock text-purple-500 text-2xl mb-2"></i>
            <div class="font-medium text-gray-800">{{ $t('home.features.timeDistribution.title') }}</div>
            <div class="text-sm text-gray-500">{{ $t('home.features.timeDistribution.description') }}</div>
          </div>
          <div class="bg-white rounded-lg p-4 shadow-sm text-center">
            <i class="fas fa-trophy text-orange-500 text-2xl mb-2"></i>
            <div class="font-medium text-gray-800">{{ $t('home.features.pointsCalculation.title') }}</div>
            <div class="text-sm text-gray-500">{{ $t('home.features.pointsCalculation.description') }}</div>
          </div>
        </div>
      </div>

      <!-- 实时时间显示 -->
      <div class="text-center">
        <div class="bg-white rounded-lg p-4 shadow-sm">
          <div class="text-2xl font-bold text-gray-800">{{ currentTime }}</div>
          <div class="text-sm text-gray-500">{{ $t('home.currentTime') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useClipboard } from '@vueuse/core'
// import { StorageUtils } from '@/utils/storage' // DELETED
import { useBscStore } from '@/stores/bsc'
import { useWalletManagement } from '@/composables/useWalletManagement'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const store = useBscStore()
const { addresses: savedWallets, addAddress: saveWallet } = useWalletManagement()
const { t } = useI18n()
const { copy } = useClipboard()

// The store is now the single source of truth for search history
const searchHistory = computed(() => store.searchHistory)

const bscAddress = ref('')
const loading = ref(false)
const errorMessage = ref('')
const currentTime = ref('')

// Address selection logic can remain as-is for now,
// as it reads from a separate localStorage key not handled by the old StorageUtils.
const SAVED_ADDRESSES_KEY = 'saved_addresses' // Define key locally
const savedAddresses = ref([])
const showDropdown = ref(false)
const filteredAddresses = ref([])

let timeInterval = null

onMounted(() => {
  // The store's init action already loads the history
  // store.loadSearchHistory()
  loadSavedAddresses()
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})

// 加载已保存的地址 (Kept as local implementation)
const loadSavedAddresses = () => {
  try {
    const data = localStorage.getItem(SAVED_ADDRESSES_KEY);
    if(data) {
        savedAddresses.value = JSON.parse(data);
    }
    filteredAddresses.value = savedAddresses.value
  } catch (error) {
    console.error('加载已保存地址失败:', error)
    savedAddresses.value = []
    filteredAddresses.value = []
  }
}

// 格式化地址显示
const formatAddress = (address) => {
  if (!address) return ''
  return `${address.slice(0, 8)}...${address.slice(-6)}`
}

// 地址输入处理
const onAddressInput = () => {
  const inputValue = bscAddress.value.toLowerCase()
  if (inputValue.trim() === '') {
    filteredAddresses.value = savedAddresses.value
  } else {
    filteredAddresses.value = savedAddresses.value.filter(address =>
      address.address.toLowerCase().includes(inputValue) ||
      (address.remark && address.remark.toLowerCase().includes(inputValue))
    )
  }
  showDropdown.value = filteredAddresses.value.length > 0
}

// 选择地址
const selectAddress = (address) => {
  bscAddress.value = address.address
  showDropdown.value = false
  errorMessage.value = ''
}

// 切换下拉框显示
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
  if (showDropdown.value) {
    filteredAddresses.value = savedAddresses.value
  }
}

// 输入框失焦处理
const onInputBlur = () => {
  // 延迟隐藏下拉框，以便点击选项能够正常工作
  setTimeout(() => {
    showDropdown.value = false
  }, 200)
}

// 更新时间
const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
}

// BSC地址验证函数
const isValidBscAddress = (address) => {
  return /^0x[0-9a-fA-F]{40}$/.test(address)
}

const queryTransactions = async () => {
  if (!bscAddress.value.trim()) {
    errorMessage.value = '请输入钱包地址'
    return
  }
  errorMessage.value = ''
  loading.value = true

  try {
    // Add to history via store action
    store.addToSearchHistory(bscAddress.value.trim())

    // Navigate to the results page
    await router.push({ name: 'transaction-results', params: { address: bscAddress.value.trim() } })
  } catch (error) {
    console.error('查询失败:', error)
    errorMessage.value = '导航失败，请重试'
  } finally {
    loading.value = false
  }
}

const useHistoryAddress = (address) => {
  bscAddress.value = address
  queryTransactions()
}

const removeHistoryAddress = (index) => {
  // Remove from history via store action
  store.removeFromSearchHistory(index)
}

// 检查地址是否已保存
const isWalletSaved = (address) => {
  return savedWallets.value.some(wallet => wallet.address.toLowerCase() === address.toLowerCase())
}

// 获取已保存钱包的备注
const getWalletRemark = (address) => {
  const wallet = savedWallets.value.find(w => w.address.toLowerCase() === address.toLowerCase())
  return wallet ? wallet.remark : null
}

// 提示并保存地址
const promptAndSaveAddress = async (address) => {
  try {
    const { value: remark } = await ElMessageBox.prompt(
      t('home.enterRemarkForAddress', { address: formatAddress(address) }),
      t('home.saveAddress'),
      {
        confirmButtonText: t('common.save'),
        cancelButtonText: t('common.cancel'),
        inputPattern: /\S+/,
        inputErrorMessage: t('home.remarkCannotBeEmpty'),
      }
    )

    if (remark && remark.trim() !== '') {
      const newWallet = { address, remark: remark.trim() };
      saveWallet(newWallet);
    }
  } catch (error) {
    // 用户取消输入
    ElMessage.info(t('common.cancel'));
  }
}

const copyAddress = (address) => {
  copy(address)
  ElMessage.success(t('common.copied'))
}
</script>

<style scoped>
/* 渐变背景动画 */
.bg-gradient-to-br {
  background-size: 200% 200%;
  animation: gradientShift 6s ease infinite;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* 按钮点击效果 */
.cursor-pointer:active {
  transform: scale(0.98);
}

/* 平滑过渡效果 */
.transition-all {
  transition: all 0.3s ease;
}

/* 输入框焦点效果 */
input:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* 搜索卡片动画 */
.bg-white {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

