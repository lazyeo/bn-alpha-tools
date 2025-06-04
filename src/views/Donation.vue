<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 头部 -->
    <div class="bg-gradient-to-br from-yellow-500 via-orange-600 to-red-700 px-4 py-6 text-white">
      <div class="mb-4">
        <h1 class="text-2xl font-bold flex items-center">
          <i class="fas fa-utensils mr-2"></i>
          打赏猪脚饭
        </h1>
      </div>
      <p class="text-yellow-100">请开发者吃个猪脚饭吧！您的支持是我们前进的动力 🍖</p>
    </div>

    <!-- 主要内容 -->
    <div class="px-4 py-4">
      <!-- 乞讨文案卡片 -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
        <div class="text-center mb-6">
          <div class="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-hamburger text-white text-2xl"></i>
          </div>
          <h3 class="font-bold text-gray-800 text-lg mb-2">开发不易，猪脚饭更难得！</h3>
          <div class="text-sm text-gray-600 space-y-2 leading-relaxed">
            <p>🥺 写代码写到半夜，肚子咕咕叫...</p>
            <p>🍖 一份猪脚饭 = 十行好代码</p>
            <p>☕ 一杯奶茶 = 一个新功能</p>
            <p>💻 您的打赏 = 无限开发动力</p>
          </div>
        </div>

        <div class="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
          <div class="flex items-start">
            <i class="fas fa-heart text-red-500 mr-3 mt-1"></i>
            <div>
              <h4 class="font-medium text-gray-800 mb-2">为什么要打赏？</h4>
              <div class="text-sm text-gray-700 space-y-1">
                <p>• 让开发者有动力继续优化工具</p>
                <p>• 支持开源项目的持续发展</p>
                <p>• 帮助添加更多实用功能</p>
                <p>• 最重要的是...让我吃顿好的！😋</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- BSC地址卡片 -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
        <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
          <i class="fas fa-wallet text-green-500 mr-2"></i>
          BSC 打赏地址
        </h3>

        <!-- 二维码区域 -->
        <div class="text-center mb-6">
          <div class="inline-block p-4 bg-white rounded-xl shadow-lg border-2 border-gray-100">
            <canvas
              ref="qrCanvas"
              class="block rounded-lg"
              :width="qrSize"
              :height="qrSize"
            ></canvas>
          </div>
          <p class="text-sm text-gray-500 mt-3">扫码打赏 BSC 地址</p>
        </div>

        <!-- 地址显示和复制 -->
        <div class="bg-gray-50 rounded-lg p-4">
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm font-medium text-gray-700">BSC 地址：</span>
            <div class="flex items-center space-x-2">
              <span :class="[
                'text-xs px-2 py-1 rounded-full',
                copySuccess ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
              ]">
                {{ copySuccess ? '已复制!' : 'BSC' }}
              </span>
            </div>
          </div>

          <div class="relative">
            <input
              type="text"
              :value="donationAddress"
              readonly
              class="w-full p-3 pr-14 bg-white border border-gray-200 rounded-lg text-sm font-mono text-gray-700 focus:ring-2 focus:ring-yellow-500 cursor-pointer"
              @click="copyAddress"
            >
            <button
              @click="copyAddress"
              :class="[
                'absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-all duration-200',
                copySuccess
                  ? 'bg-green-500 text-white'
                  : 'bg-yellow-500 hover:bg-yellow-600 text-white'
              ]"
            >
              <i :class="copySuccess ? 'fas fa-check' : 'fas fa-copy'"></i>
            </button>
          </div>

          <p class="text-xs text-gray-500 mt-2">
            点击地址或按钮即可复制到剪贴板
          </p>
        </div>
      </div>

      <!-- 打赏说明 -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
        <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
          <i class="fas fa-info-circle text-blue-500 mr-2"></i>
          打赏说明
        </h3>

        <div class="space-y-4">
          <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
            <h4 class="font-medium text-gray-800 mb-2 flex items-center">
              <i class="fas fa-coins text-yellow-500 mr-2"></i>
              支持的代币
            </h4>
            <div class="text-sm text-gray-700 space-y-1">
              <p>• <strong>BNB</strong>：币安智能链原生代币</p>
              <p>• <strong>USDT</strong>：稳定币，推荐使用</p>
              <p>• <strong>USDC</strong>：另一种稳定币选择</p>
              <p>• <strong>BUSD</strong>：币安稳定币</p>
              <p>• 其他 BSC 生态代币也支持</p>
            </div>
          </div>

          <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
            <h4 class="font-medium text-gray-800 mb-2 flex items-center">
              <i class="fas fa-gift text-green-500 mr-2"></i>
              打赏金额建议
            </h4>
            <div class="grid grid-cols-2 gap-3 text-sm">
              <div class="text-center p-2 bg-white rounded-lg">
                <div class="font-bold text-gray-800">☕ $2-5</div>
                <div class="text-gray-600">一杯奶茶</div>
              </div>
              <div class="text-center p-2 bg-white rounded-lg">
                <div class="font-bold text-gray-800">🍖 $8-15</div>
                <div class="text-gray-600">一份猪脚饭</div>
              </div>
              <div class="text-center p-2 bg-white rounded-lg">
                <div class="font-bold text-gray-800">🍱 $20-50</div>
                <div class="text-gray-600">一顿大餐</div>
              </div>
              <div class="text-center p-2 bg-white rounded-lg">
                <div class="font-bold text-gray-800">🎁 $50+</div>
                <div class="text-gray-600">土豪朋友</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 感谢区域 -->
      <div class="bg-white rounded-xl shadow-sm p-4">
        <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
          <i class="fas fa-heart text-red-500 mr-2"></i>
          感谢与承诺
        </h3>

        <div class="bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg p-4 border border-pink-200">
          <div class="text-center space-y-3">
            <div class="text-2xl">🙏</div>
            <h4 class="font-medium text-gray-800">非常感谢您的支持！</h4>
            <div class="text-sm text-gray-700 space-y-2">
              <p>每一份打赏都是对开发者最大的鼓励</p>
              <p>我们承诺将继续：</p>
              <div class="grid grid-cols-1 gap-1 mt-2">
                <p>• 🔧 持续优化工具性能和体验</p>
                <p>• ✨ 定期更新和添加新功能</p>
                <p>• 🐛 及时修复问题和bug</p>
                <p>• 📚 完善文档和使用指南</p>
                <p>• 💬 积极响应用户反馈</p>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-4 text-center">
          <p class="text-xs text-gray-500">
            您的支持让这个项目变得更好 ❤️
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import QRCode from 'qrcode'

// 定义组件名
defineOptions({
  name: 'DonationPage'
})

// 打赏地址
const donationAddress = '0xAc285F9BF78eC7B16cb1999A5c7Ddd7867C3e3c9'

// 复制状态
const copySuccess = ref(false)

// 二维码相关
const qrCanvas = ref(null)
const qrSize = 200

// 生成真正的二维码
const generateQRCode = async () => {
  try {
    const canvas = qrCanvas.value
    if (!canvas) return

    // 使用qrcode库生成二维码
    await QRCode.toCanvas(canvas, donationAddress, {
      width: qrSize,
      margin: 2,
      color: {
        dark: '#000000',  // 黑色模块
        light: '#FFFFFF'  // 白色背景
      },
      errorCorrectionLevel: 'M'
    })

  } catch (error) {
    console.error('生成二维码失败:', error)
    // 降级到Canvas模拟方案
    generateFallbackQRCode()
  }
}

// 降级方案：Canvas模拟二维码
const generateFallbackQRCode = () => {
  const canvas = qrCanvas.value
  const ctx = canvas.getContext('2d')

  // 清空画布
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, qrSize, qrSize)

  // 绘制简单的二维码样式（模拟）
  const blockSize = 10
  const blocks = qrSize / blockSize

  // 生成伪随机模式（基于地址）
  ctx.fillStyle = '#000000'

  for (let i = 0; i < blocks; i++) {
    for (let j = 0; j < blocks; j++) {
      // 使用地址字符生成模式
      const charCode = donationAddress.charCodeAt((i * blocks + j) % donationAddress.length)
      if (charCode % 3 === 0) {
        ctx.fillRect(i * blockSize, j * blockSize, blockSize, blockSize)
      }
    }
  }

  // 绘制定位点
  const drawCorner = (x, y) => {
    ctx.fillStyle = '#000000'
    ctx.fillRect(x, y, blockSize * 3, blockSize * 3)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(x + blockSize, y + blockSize, blockSize, blockSize)
  }

  drawCorner(0, 0) // 左上
  drawCorner(qrSize - blockSize * 3, 0) // 右上
  drawCorner(0, qrSize - blockSize * 3) // 左下

  // 添加中心图标区域
  const centerSize = blockSize * 4
  const centerX = (qrSize - centerSize) / 2
  const centerY = (qrSize - centerSize) / 2

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(centerX, centerY, centerSize, centerSize)
  ctx.strokeStyle = '#000000'
  ctx.lineWidth = 2
  ctx.strokeRect(centerX, centerY, centerSize, centerSize)

  // 添加BSC标识
  ctx.fillStyle = '#F3BA2F'
  ctx.fillRect(centerX + 4, centerY + 4, centerSize - 8, centerSize - 8)

  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 12px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('BSC', centerX + centerSize/2, centerY + centerSize/2 + 4)
}

// 复制地址功能
const copyAddress = async () => {
  try {
    await navigator.clipboard.writeText(donationAddress)
    copySuccess.value = true
    setTimeout(() => {
      copySuccess.value = false
    }, 2000)
  } catch {
    // 降级方案
    const textArea = document.createElement('textarea')
    textArea.value = donationAddress
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)

    copySuccess.value = true
    setTimeout(() => {
      copySuccess.value = false
    }, 2000)
  }
}

onMounted(() => {
  generateQRCode()
})
</script>

<style scoped>
/* 优化阅读体验 */
h4 {
  line-height: 1.4;
}

p {
  line-height: 1.6;
}

/* 渐变背景动画 */
.bg-gradient-to-br {
  background-size: 200% 200%;
  animation: gradientShift 8s ease infinite;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* 复制按钮动画 */
button {
  transition: all 0.2s ease-in-out;
}

button:active {
  transform: scale(0.95);
}

/* 二维码容器阴影 */
.inline-block {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 输入框聚焦效果 */
input:focus {
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
}

/* 卡片悬停效果 */
.bg-white:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 渐变卡片动画 */
.bg-gradient-to-r {
  background-size: 200% 200%;
  animation: gradientFloat 6s ease-in-out infinite;
}

@keyframes gradientFloat {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* 表情符号动画 */
.text-2xl {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

/* 字体平滑 */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
