<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 头部 -->
    <div class="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 px-4 py-6 text-white">
      <div class="mb-4">
        <h1 class="text-2xl font-bold flex items-center">
          <i class="fas fa-wallet mr-2"></i>
          多地址管理
        </h1>
      </div>
      <p class="text-blue-100">管理您的BSC地址列表，添加备注便于识别和使用</p>
    </div>

    <!-- 主要内容 -->
    <div class="px-4 py-4">
      <!-- API Key 设置区域 -->
      <div class="bg-gray-50 rounded-xl shadow-sm p-4 mb-4">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="font-semibold text-gray-800 flex items-center">
              <i class="fas fa-key text-orange-500 mr-2"></i>
              BSCScan API 配置
            </h3>
            <p class="text-sm text-gray-500 mt-1">
              配置您的BSCScan API密钥以获得更好的查询体验
            </p>
          </div>
          <button
            @click="toggleApiKeySection"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <i :class="showApiKeySection ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
          </button>
        </div>

        <!-- API Key 设置内容 -->
        <div v-if="showApiKeySection" class="space-y-4">
          <!-- 当前API Key显示 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              当前API密钥
            </label>
            <div class="flex items-center space-x-2">
              <input
                v-model="currentApiKey"
                type="text"
                readonly
                class="flex-1 p-3 border border-gray-200 rounded-lg bg-gray-50 text-sm font-mono"
                :placeholder="isDefaultApiKey ? '使用默认API密钥' : ''"
              />
              <button
                @click="toggleApiKeyVisibility"
                class="px-3 py-3 text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg transition-colors"
                title="显示/隐藏API密钥"
              >
                <i :class="showApiKey ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
          </div>

          <!-- 新API Key输入 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              更新API密钥
            </label>
            <div class="flex items-center space-x-2">
              <input
                v-model="newApiKey"
                type="text"
                placeholder="输入新的BSCScan API密钥..."
                class="flex-1 p-3 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="{ 'border-red-300': apiKeyError }"
              />
              <button
                @click="saveApiKey"
                :disabled="!newApiKey.trim()"
                class="px-4 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors"
              >
                保存
              </button>
            </div>
            <p v-if="apiKeyError" class="text-red-500 text-xs mt-1">
              {{ apiKeyError }}
            </p>
          </div>

          <!-- API Key 相关说明 -->
          <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h4 class="text-sm font-medium text-blue-800 mb-2">
              <i class="fas fa-info-circle mr-1"></i>
              关于API密钥
            </h4>
            <ul class="text-xs text-blue-700 space-y-1">
                              <li>• 免费API密钥：访问 <a href="https://bscscan.com/apidashboard" target="_blank" class="underline">BSCScan API</a> 免费注册获取</li>
              <li>• 默认密钥：如不设置，将使用内置的公共API密钥</li>
              <li>• 查询限制：个人API密钥通常有更高的查询频率限制</li>
              <li>• 数据安全：API密钥仅保存在本地浏览器，不会上传到服务器</li>
              <li>• 重置密钥：点击"使用默认"按钮可恢复使用内置密钥</li>
            </ul>
          </div>

          <!-- 操作按钮 -->
          <div class="flex items-center justify-between pt-2">
            <button
              @click="resetToDefaultApiKey"
              class="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg transition-colors text-sm"
            >
              <i class="fas fa-undo mr-1"></i>
              使用默认
            </button>
            <div class="text-xs text-gray-500">
              <i class="fas fa-shield-alt mr-1"></i>
              本地存储，安全可靠
            </div>
          </div>
        </div>
      </div>

      <!-- 添加地址按钮 -->
      <div class="bg-gray-50 rounded-xl shadow-sm p-4 mb-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-semibold text-gray-800 flex items-center">
              <i class="fas fa-list text-blue-500 mr-2"></i>
              地址管理
            </h3>
            <p class="text-sm text-gray-500 mt-1">
              共 {{ addresses.length }} 个地址
            </p>
          </div>
          <button
            @click="openAddModal"
            class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-all duration-200 flex items-center"
          >
            <i class="fas fa-plus mr-2"></i>
            添加地址
          </button>
        </div>
      </div>

      <!-- 地址列表 -->
      <div class="bg-gray-50 rounded-xl shadow-sm p-4">
        <!-- 空状态 -->
        <div v-if="addresses.length === 0" class="text-center py-12">
          <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-wallet text-gray-400 text-2xl"></i>
          </div>
          <h4 class="text-gray-600 font-medium mb-2">暂无地址</h4>
          <p class="text-gray-400 text-sm mb-4">添加您的第一个BSC地址开始管理</p>
          <button
            @click="openAddModal"
            class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-all duration-200 inline-flex items-center"
          >
            <i class="fas fa-plus mr-2"></i>
            添加地址
          </button>
        </div>

        <!-- 地址列表 -->
        <div v-else class="space-y-3">
          <div
            v-for="(item, index) in addresses"
            :key="index"
            class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1 min-w-0">
                <!-- 地址信息 -->
                <div class="mb-2">
                  <div class="flex items-center space-x-2 mb-1">
                    <span class="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
                      BSC
                    </span>
                    <span class="text-sm font-medium text-gray-800">
                      {{ item.remark }}
                    </span>
                  </div>
                  <div class="font-mono text-sm text-gray-600 break-all">
                    {{ item.address }}
                  </div>
                </div>

                <!-- 元信息 -->
                <div class="flex items-center text-xs text-gray-400 space-x-4">
                  <span>
                    <i class="far fa-clock mr-1"></i>
                    {{ formatDate(item.createdAt) }}
                  </span>
                  <span v-if="item.updatedAt !== item.createdAt">
                    <i class="fas fa-edit mr-1"></i>
                    {{ formatDate(item.updatedAt) }}
                  </span>
                </div>
              </div>

              <!-- 操作按钮 -->
              <div class="flex items-center space-x-2 ml-4">
                <!-- 查询按钮 -->
                <button
                  @click="queryAddress(item.address)"
                  class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="查询交易"
                >
                  <i class="fas fa-search"></i>
                </button>

                <!-- 复制按钮 -->
                <button
                  @click="copyAddress(item.address)"
                  class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="复制地址"
                >
                  <i class="fas fa-copy"></i>
                </button>

                <!-- 编辑按钮 -->
                <button
                  @click="openEditModal(index)"
                  class="p-2 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                  title="编辑"
                >
                  <i class="fas fa-edit"></i>
                </button>

                <!-- 删除按钮 -->
                <button
                  @click="deleteAddress(index)"
                  class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="删除"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 操作提示 -->
      <div class="bg-blue-50 rounded-lg p-4 mt-4 border border-blue-200">
        <div class="flex items-start">
          <i class="fas fa-info-circle text-blue-500 mr-3 mt-0.5"></i>
          <div class="text-sm text-blue-700">
            <h4 class="font-medium mb-1">使用提示</h4>
            <ul class="space-y-1 text-blue-600">
              <li>• 所有数据都保存在您的浏览器本地，不会上传到服务器</li>
              <li>• 备注必填，帮助您识别不同的地址用途</li>
              <li>• 可以直接点击查询按钮跳转到交易查询页面</li>
              <li>• 建议定期备份重要的地址信息</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加/编辑地址弹窗 -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeModal"
    >
              <div class="bg-gray-50 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <!-- 弹窗头部 -->
        <div class="bg-gradient-to-r from-gray-700 to-gray-600 px-6 py-4 text-white rounded-t-xl">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold flex items-center">
              <i :class="editingIndex !== null ? 'fas fa-edit' : 'fas fa-plus-circle'" class="mr-2"></i>
              {{ editingIndex !== null ? '编辑地址' : '添加新地址' }}
            </h3>
            <button
              @click="closeModal"
              class="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>

        <!-- 弹窗内容 -->
        <form @submit.prevent="saveAddress" class="p-6 space-y-6">
          <!-- BSC地址输入 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              BSC 地址 <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.address"
              type="text"
              required
              placeholder="0x... (42位字符)"
              :class="[
                'w-full p-3 border rounded-lg text-sm font-mono transition-colors',
                addressError
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              ]"
              @blur="validateAddress"
              @input="validateAddress"
            >
            <p v-if="addressError" class="text-red-500 text-xs mt-1">
              {{ addressError }}
            </p>
          </div>

          <!-- 备注输入 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              备注 <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.remark"
              type="text"
              required
              placeholder="请输入地址备注，例如：主钱包、DeFi专用等"
              :class="[
                'w-full p-3 border rounded-lg text-sm transition-colors',
                remarkError
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              ]"
              maxlength="50"
              @blur="validateRemark"
              @input="validateRemark"
            >
            <div class="flex justify-between items-center mt-1">
              <p v-if="remarkError" class="text-red-500 text-xs">
                {{ remarkError }}
              </p>
              <p class="text-gray-400 text-xs ml-auto">{{ form.remark.length }}/50</p>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="flex space-x-3 pt-4">
            <button
              type="submit"
              :disabled="!isFormValid"
              :class="[
                'flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center',
                !isFormValid
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : editingIndex !== null
                                  ? 'bg-gray-600 hover:bg-gray-700 text-white'
              : 'bg-gray-600 hover:bg-gray-700 text-white'
              ]"
            >
              <i :class="editingIndex !== null ? 'fas fa-save' : 'fas fa-plus'" class="mr-2"></i>
              {{ editingIndex !== null ? '保存修改' : '添加地址' }}
            </button>

            <button
              type="button"
              @click="closeModal"
              class="px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-all duration-200"
            >
              <i class="fas fa-times mr-2"></i>
              取消
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useClipboard } from '@vueuse/core'

// Define component name and setup
export default {
  name: 'AddressManager',
  setup() {
    const router = useRouter()
    const { copy } = useClipboard()

    const SAVED_ADDRESSES_KEY = 'saved_addresses';
    const BSC_API_KEY = 'bsc_api_key';

    // State for addresses
    const addresses = ref([])
    const editingIndex = ref(null)
    const addressError = ref('')
    const remarkError = ref('')
    const showModal = ref(false)
    const showApiKeySection = ref(false)
    const showApiKey = ref(false)
    const currentApiKey = ref('')
    const isDefaultApiKey = ref(true)

    // Form data
    const form = reactive({
      address: '',
      remark: ''
    })

    // Form validation status
    const isFormValid = computed(() => {
      return form.address &&
             form.remark &&
             !addressError.value &&
             !remarkError.value
    })

    // Load addresses from local storage
    const loadAddresses = () => {
      const data = localStorage.getItem(SAVED_ADDRESSES_KEY);
      if (data) {
        addresses.value = JSON.parse(data);
      }
    }

    // Save addresses to local storage
    const saveAddresses = () => {
      localStorage.setItem(SAVED_ADDRESSES_KEY, JSON.stringify(addresses.value));
    }

    // BSC address validation
    const validateAddress = () => {
      addressError.value = ''

      if (!form.address) {
        addressError.value = 'BSC地址不能为空'
        return
      }

      // BSC address format validation
      if (!/^0x[a-fA-F0-9]{40}$/.test(form.address)) {
        addressError.value = 'BSC地址格式不正确，应为0x开头的42位字符'
        return
      }

      // Check for duplicates (excluding current item)
      const existingIndex = addresses.value.findIndex(item =>
        item.address.toLowerCase() === form.address.toLowerCase()
      )

      if (existingIndex !== -1 && existingIndex !== editingIndex.value) {
        addressError.value = '该地址已存在'
        return
      }
    }

    // Remark validation
    const validateRemark = () => {
      remarkError.value = ''

      if (!form.remark || form.remark.trim() === '') {
        remarkError.value = '备注不能为空'
        return
      }

      if (form.remark.length < 2) {
        remarkError.value = '备注至少需要2个字符'
        return
      }
    }

    // Open add modal
    const openAddModal = () => {
      editingIndex.value = null
      form.address = ''
      form.remark = ''
      addressError.value = ''
      remarkError.value = ''
      showModal.value = true
    }

    // Open edit modal
    const openEditModal = (index) => {
      const item = addresses.value[index]
      editingIndex.value = index
      form.address = item.address
      form.remark = item.remark
      addressError.value = ''
      remarkError.value = ''
      showModal.value = true
    }

    // Close modal
    const closeModal = () => {
      showModal.value = false
      editingIndex.value = null
      form.address = ''
      form.remark = ''
      addressError.value = ''
      remarkError.value = ''
    }

    // Save address
    const saveAddress = () => {
      validateAddress()
      validateRemark()

      if (addressError.value) {
        ElMessage.error(addressError.value)
        return
      }

      if (remarkError.value) {
        ElMessage.error(remarkError.value)
        return
      }

      const now = new Date().toISOString()

      if (editingIndex.value !== null) {
        // Edit mode
        addresses.value[editingIndex.value] = {
          ...addresses.value[editingIndex.value],
          address: form.address,
          remark: form.remark.trim(),
          updatedAt: now
        }
        ElMessage.success('地址修改成功')
      } else {
        // Add mode
        addresses.value.unshift({
          address: form.address,
          remark: form.remark.trim(),
          createdAt: now,
          updatedAt: now
        })
        ElMessage.success('地址添加成功')
      }

      // Save to local storage
      saveAddresses()

      // Close modal
      closeModal()
    }

    // Delete address
    const deleteAddress = (index) => {
      if (confirm('确定要删除这个地址吗？')) {
        addresses.value.splice(index, 1)
        saveAddresses()
        ElMessage.success('地址删除成功')
      }
    }

    // Copy address
    const copyAddress = async (address) => {
      try {
        await copy(address)
        ElMessage.success('地址已复制到剪贴板')
      } catch (error) {
        console.error('复制失败:', error)
        ElMessage.error('复制失败，请手动复制')
      }
    }

    // Query address
    const queryAddress = (address) => {
      router.push({
        name: 'transaction-results',
        params: { address: address }
      })
    }

    // Format date
    const formatDate = (dateString) => {
      if (!dateString) return '未知时间'

      try {
        const date = new Date(dateString)
        return date.toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        })
      } catch {
        return '时间格式错误'
      }
    }

    // Toggle API Key section
    const toggleApiKeySection = () => {
      showApiKeySection.value = !showApiKeySection.value
    }

    // Toggle API Key visibility
    const toggleApiKeyVisibility = () => {
      showApiKey.value = !showApiKey.value
      if (showApiKey.value) {
        currentApiKey.value = localStorage.getItem(BSC_API_KEY) || ''
      } else {
        currentApiKey.value = ''
      }
    }

    const saveApiKey = () => {
      apiKeyError.value = ''

      if (!newApiKey.value.trim()) {
        apiKeyError.value = 'API密钥不能为空'
        return
      }

      if (newApiKey.value.length < 20) {
        apiKeyError.value = 'API密钥格式不正确，请检查输入'
        return
      }

      try {
        localStorage.setItem(BSC_API_KEY, newApiKey.value.trim())
        currentApiKey.value = newApiKey.value.trim()
        newApiKey.value = ''
        ElMessage.success('API密钥保存成功')
      } catch (error) {
        console.error('保存API密钥失败:', error)
        apiKeyError.value = '保存失败，请重试'
      }
    }

    const resetToDefaultApiKey = () => {
      localStorage.removeItem(BSC_API_KEY)
      currentApiKey.value = ''
      ElMessage.success('已重置为默认API密钥')
    }

    // Load API key status
    const loadApiKeyStatus = () => {
      const savedKey = localStorage.getItem(BSC_API_KEY)
      const defaultKey = '1I6UUWQHJ4JV99S7H9RQAVFPKZN6W9A9BZ'

      isDefaultApiKey.value = savedKey === defaultKey
      showApiKey.value = false
      currentApiKey.value = '••••••••••••••••••••••••••••••••••••••••'
    }

    // Component mounted
    onMounted(() => {
      loadAddresses()
      loadApiKeyStatus()
    })

    return {
      addresses,
      editingIndex,
      addressError,
      remarkError,
      showModal,
      showApiKeySection,
      showApiKey,
      currentApiKey,
      isDefaultApiKey,
      form,
      isFormValid,
      openAddModal,
      openEditModal,
      closeModal,
      saveAddress,
      deleteAddress,
      copyAddress,
      queryAddress,
      formatDate,
      toggleApiKeySection,
      toggleApiKeyVisibility,
      saveApiKey,
      resetToDefaultApiKey,
      apiKeyError,
      newApiKey
    }
  }
}
</script>

<style scoped>
/* Form focus effect */
input:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Address card hover effect */
.border-gray-200:hover {
  border-color: #e5e7eb;
  transform: translateY(-1px);
}

/* Button interaction effect */
button:active {
  transform: scale(0.95);
}

/* Modal animation */
.fixed.inset-0 {
  animation: fadeIn 0.3s ease-out;
}

.bg-white.rounded-xl {
  animation: slideUp 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Copy success prompt animation */
.transition-all {
  transition: all 0.3s ease;
}

/* Font smoothing */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Scrollbar style */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Modal shadow effect */
.shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* Disabled state button style */
.cursor-not-allowed {
  cursor: not-allowed;
}

/* Error state style */
.border-red-300:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}
</style>
