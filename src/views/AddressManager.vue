<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 头部 -->
    <div class="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 px-4 py-6 text-white">
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
      <!-- 添加地址按钮 -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
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
            class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all duration-200 flex items-center"
          >
            <i class="fas fa-plus mr-2"></i>
            添加地址
          </button>
        </div>
      </div>

      <!-- 地址列表 -->
      <div class="bg-white rounded-xl shadow-sm p-4">
        <!-- 空状态 -->
        <div v-if="addresses.length === 0" class="text-center py-12">
          <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-wallet text-gray-400 text-2xl"></i>
          </div>
          <h4 class="text-gray-600 font-medium mb-2">暂无地址</h4>
          <p class="text-gray-400 text-sm mb-4">添加您的第一个BSC地址开始管理</p>
          <button
            @click="openAddModal"
            class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all duration-200 inline-flex items-center"
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
                  class="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                  title="查询交易"
                >
                  <i class="fas fa-search"></i>
                </button>

                <!-- 复制按钮 -->
                <button
                  @click="copyAddress(item.address)"
                  class="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors"
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
                  class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <!-- 弹窗头部 -->
        <div class="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4 text-white rounded-t-xl">
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
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-green-500 hover:bg-green-600 text-white'
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

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useClipboard } from '@vueuse/core'

// 定义组件名
defineOptions({
  name: 'AddressManager'
})

const router = useRouter()

// 使用VueUse的剪贴板功能
const { copy } = useClipboard()

// 响应式数据
const addresses = ref([])
const editingIndex = ref(null)
const addressError = ref('')
const remarkError = ref('')
const showModal = ref(false)

// 表单数据
const form = reactive({
  address: '',
  remark: ''
})

// 存储键名
const STORAGE_KEY = 'bsc-addresses'

// 表单验证状态
const isFormValid = computed(() => {
  return form.address &&
         form.remark &&
         !addressError.value &&
         !remarkError.value
})

// 加载本地存储的地址
const loadAddresses = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      addresses.value = JSON.parse(stored)
    }
  } catch (error) {
    console.error('加载地址列表失败:', error)
    addresses.value = []
  }
}

// 保存地址到本地存储
const saveToStorage = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses.value))
  } catch (error) {
    console.error('保存地址列表失败:', error)
  }
}

// BSC地址验证
const validateAddress = () => {
  addressError.value = ''

  if (!form.address) {
    addressError.value = 'BSC地址不能为空'
    return
  }

  // BSC地址格式验证
  if (!/^0x[a-fA-F0-9]{40}$/.test(form.address)) {
    addressError.value = 'BSC地址格式不正确，应为0x开头的42位字符'
    return
  }

  // 检查重复（编辑时排除当前项）
  const existingIndex = addresses.value.findIndex(item =>
    item.address.toLowerCase() === form.address.toLowerCase()
  )

  if (existingIndex !== -1 && existingIndex !== editingIndex.value) {
    addressError.value = '该地址已存在'
    return
  }
}

// 备注验证
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

// 打开添加弹窗
const openAddModal = () => {
  editingIndex.value = null
  form.address = ''
  form.remark = ''
  addressError.value = ''
  remarkError.value = ''
  showModal.value = true
}

// 打开编辑弹窗
const openEditModal = (index) => {
  const item = addresses.value[index]
  editingIndex.value = index
  form.address = item.address
  form.remark = item.remark
  addressError.value = ''
  remarkError.value = ''
  showModal.value = true
}

// 关闭弹窗
const closeModal = () => {
  showModal.value = false
  editingIndex.value = null
  form.address = ''
  form.remark = ''
  addressError.value = ''
  remarkError.value = ''
}

// 保存地址
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
    // 编辑模式
    addresses.value[editingIndex.value] = {
      ...addresses.value[editingIndex.value],
      address: form.address,
      remark: form.remark.trim(),
      updatedAt: now
    }
    ElMessage.success('地址修改成功')
  } else {
    // 添加模式
    addresses.value.unshift({
      address: form.address,
      remark: form.remark.trim(),
      createdAt: now,
      updatedAt: now
    })
    ElMessage.success('地址添加成功')
  }

  // 保存到本地存储
  saveToStorage()

  // 关闭弹窗
  closeModal()
}

// 删除地址
const deleteAddress = (index) => {
  if (confirm('确定要删除这个地址吗？')) {
    addresses.value.splice(index, 1)
    saveToStorage()
    ElMessage.success('地址删除成功')
  }
}

// 复制地址
const copyAddress = async (address) => {
  try {
    await copy(address)
    ElMessage.success('地址已复制到剪贴板')
  } catch (error) {
    console.error('复制失败:', error)
    ElMessage.error('复制失败，请手动复制')
  }
}

// 查询地址
const queryAddress = (address) => {
  router.push(`/results/${address}`)
}

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 组件挂载时加载数据
onMounted(() => {
  loadAddresses()
})
</script>

<style scoped>
/* 表单聚焦效果 */
input:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* 地址卡片悬停效果 */
.border-gray-200:hover {
  border-color: #e5e7eb;
  transform: translateY(-1px);
}

/* 按钮交互效果 */
button:active {
  transform: scale(0.95);
}

/* 弹窗动画 */
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

/* 复制成功提示动画 */
.transition-all {
  transition: all 0.3s ease;
}

/* 字体平滑 */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 滚动条样式 */
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

/* 弹窗阴影效果 */
.shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* 禁用状态按钮样式 */
.cursor-not-allowed {
  cursor: not-allowed;
}

/* 错误状态样式 */
.border-red-300:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}
</style>
