<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 头部 -->
    <div class="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 px-4 py-6 text-white shadow-lg sticky top-0 z-10">
      <div class="mb-4">
        <h1 class="text-2xl font-bold mb-2">{{ $t('alphaPoints.subtitle') }}</h1>
        <p class="text-blue-100">{{ $t('alphaPoints.description') }}</p>
      </div>
    </div>

    <!-- 积分规则详情 -->
    <div class="px-4 py-6">
      <!-- 概述 -->
      <div class="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
        <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
          <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
            <i class="fas fa-info-circle text-white"></i>
          </div>
          {{ $t('alphaPoints.overview.title') }}
        </h3>
        <div class="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200 rounded-xl p-6">
          <p class="text-sm text-gray-700 leading-relaxed" v-html="$t('alphaPoints.overview.content')">
          </p>
        </div>
      </div>

      <!-- 余额积分规则 -->
      <div class="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
        <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
          <div class="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center mr-3">
            <i class="fas fa-wallet text-white"></i>
          </div>
          {{ $t('alphaPoints.balanceRules.title') }}
        </h3>

        <div class="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-xl p-6 mb-6">
          <div class="flex items-start">
            <div class="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
              <i class="fas fa-exclamation-triangle text-white"></i>
            </div>
            <div>
              <h4 class="font-medium text-gray-800 mb-2">{{ $t('alphaPoints.balanceRules.qualifiedAssets') }}</h4>
              <p class="text-sm text-gray-700 leading-relaxed">
                {{ $t('alphaPoints.balanceRules.qualifiedAssetsDesc') }}
              </p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="flex justify-between items-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
                <span class="text-white font-bold">1</span>
              </div>
              <span class="text-sm font-medium text-gray-700">≥$100 &lt;$1,000</span>
            </div>
            <span class="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-bold shadow-inner">1{{ $t('alphaPoints.balanceRules.points') }}</span>
          </div>

          <div class="flex justify-between items-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
                <span class="text-white font-bold">2</span>
              </div>
              <span class="text-sm font-medium text-gray-700">≥$1,000 &lt;$10,000</span>
            </div>
            <span class="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-bold shadow-inner">2{{ $t('alphaPoints.balanceRules.points') }}</span>
          </div>

          <div class="flex justify-between items-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
                <span class="text-white font-bold">3</span>
              </div>
              <span class="text-sm font-medium text-gray-700">≥$10,000 &lt;$100,000</span>
            </div>
            <span class="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-bold shadow-inner">3{{ $t('alphaPoints.balanceRules.points') }}</span>
          </div>

          <div class="flex justify-between items-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
                <span class="text-white font-bold">4</span>
              </div>
              <span class="text-sm font-medium text-gray-700">≥$100,000</span>
            </div>
            <span class="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-bold shadow-inner">4{{ $t('alphaPoints.balanceRules.points') }}</span>
          </div>
        </div>
      </div>

      <!-- 交易量积分规则 -->
      <div class="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
        <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
          <div class="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-3">
            <i class="fas fa-chart-line text-white"></i>
          </div>
          {{ $t('alphaPoints.tradingRules.title') }}
        </h3>

        <!-- 限时活动公告 -->
        <div class="bg-gradient-to-r from-red-50 via-orange-50 to-yellow-50 border-l-4 border-red-500 rounded-xl p-6 mb-6 shadow-lg">
          <div class="flex items-start">
            <div class="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
              <i class="fas fa-fire text-white animate-pulse"></i>
            </div>
            <div class="flex-1">
              <h4 class="font-medium text-red-800 mb-2 flex items-center">
                🔥 {{ $t('alphaPoints.tradingRules.limitedEvent') }}
                <span class="ml-2 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">{{ $t('common.limited') }}</span>
              </h4>
              <p class="text-sm text-red-700 mb-3" v-html="$t('alphaPoints.tradingRules.limitedEventDesc')">
              </p>
              <a
                href="https://www.binance.com/zh-CN/support/announcement/detail/37f90caac9c24988bbd9ce3595a136a2"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center text-sm text-red-600 hover:text-red-800 font-medium underline transition-colors bg-red-100 hover:bg-red-200 rounded-lg px-3 py-2"
              >
                <i class="fas fa-external-link-alt mr-1"></i>
                {{ $t('alphaPoints.tradingRules.viewAnnouncement') }}
              </a>
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 mb-6">
          <div class="flex items-start">
            <div class="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
              <i class="fas fa-coins text-white"></i>
            </div>
            <div>
              <h4 class="font-medium text-gray-800 mb-2">{{ $t('alphaPoints.tradingRules.calculationMethod') }}</h4>
              <p class="text-sm text-gray-700 mb-3">
                {{ $t('alphaPoints.tradingRules.calculationDesc') }}
              </p>
              <div class="space-y-2">
                <p class="text-sm text-gray-700 bg-white/60 rounded-lg px-3 py-2">• {{ $t('alphaPoints.tradingRules.formula') }}</p>
                <p class="text-sm text-gray-700 bg-white/60 rounded-lg px-3 py-2">• {{ $t('alphaPoints.tradingRules.totalAmount') }}</p>
                <p class="text-sm text-red-600 font-medium bg-red-50 rounded-lg px-3 py-2">• {{ $t('alphaPoints.tradingRules.bscBonus') }}</p>
                <p class="text-sm text-blue-600 bg-blue-50 rounded-lg px-3 py-2">• {{ $t('alphaPoints.tradingRules.example') }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div class="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 shadow-sm hover:shadow-md transition-shadow">
            <span class="text-sm font-medium text-gray-700">$2</span>
            <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold shadow-inner">1{{ $t('alphaPoints.balanceRules.points') }}</span>
          </div>

          <div class="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 shadow-sm hover:shadow-md transition-shadow">
            <span class="text-sm font-medium text-gray-700">$4</span>
            <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold shadow-inner">2{{ $t('alphaPoints.balanceRules.points') }}</span>
          </div>

          <div class="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 shadow-sm hover:shadow-md transition-shadow">
            <span class="text-sm font-medium text-gray-700">$8</span>
            <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold shadow-inner">3{{ $t('alphaPoints.balanceRules.points') }}</span>
          </div>

          <div class="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 shadow-sm hover:shadow-md transition-shadow">
            <span class="text-sm font-medium text-gray-700">$16</span>
            <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold shadow-inner">4{{ $t('alphaPoints.balanceRules.points') }}</span>
          </div>

          <div class="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 shadow-sm hover:shadow-md transition-shadow">
            <span class="text-sm font-medium text-gray-700">$32</span>
            <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold shadow-inner">5{{ $t('alphaPoints.balanceRules.points') }}</span>
          </div>

          <div class="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 shadow-sm hover:shadow-md transition-shadow">
            <span class="text-sm font-medium text-gray-700">$64</span>
            <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold shadow-inner">6{{ $t('alphaPoints.balanceRules.points') }}</span>
          </div>

          <div class="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 shadow-sm hover:shadow-md transition-shadow">
            <span class="text-sm font-medium text-gray-700">$128</span>
            <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold shadow-inner">7{{ $t('alphaPoints.balanceRules.points') }}</span>
          </div>

          <div class="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 shadow-sm hover:shadow-md transition-shadow">
            <span class="text-sm font-medium text-gray-700">$256</span>
            <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold shadow-inner">8{{ $t('alphaPoints.balanceRules.points') }}</span>
          </div>

          <div class="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 shadow-sm hover:shadow-md transition-shadow">
            <span class="text-sm font-medium text-gray-700">$512</span>
            <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold shadow-inner">9{{ $t('alphaPoints.balanceRules.points') }}</span>
          </div>
        </div>

        <div class="text-center py-6 mt-6">
          <span class="text-sm text-gray-500 bg-gray-100 px-6 py-3 rounded-full border border-gray-200 shadow-inner">{{ $t('alphaPoints.tradingRules.continue') }}</span>
        </div>
      </div>

      <!-- 积分计算示例 -->
      <div class="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
        <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
          <div class="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
            <i class="fas fa-calculator text-white"></i>
          </div>
          {{ $t('alphaPoints.calculationExample.title') }}
        </h3>

        <div class="bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 border-2 border-purple-200 rounded-xl p-6">
          <div class="space-y-4">
            <div class="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-sm">
              <h4 class="font-medium text-gray-800 mb-3 flex items-center">
                <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <span class="text-blue-600 font-bold">A</span>
                </div>
                {{ $t('alphaPoints.calculationExample.userA') }}
              </h4>
              <div class="text-sm text-gray-600 space-y-2">
                <div class="bg-blue-50 rounded-lg p-3">
                  <p>• {{ $t('alphaPoints.calculationExample.holdingAssets') }}：$5,000 → <span class="text-blue-600 font-medium">2{{ $t('alphaPoints.balanceRules.points') }}</span></p>
                  <p>• {{ $t('alphaPoints.calculationExample.alphaPurchase') }}：$16 ({{ $t('alphaPoints.calculationExample.bscChain') }}) → <span class="text-green-600 font-medium">floor(log₂(16+16)) = 5{{ $t('alphaPoints.balanceRules.points') }}</span></p>
                  <p class="text-xs text-orange-600">  {{ $t('alphaPoints.calculationExample.withBscBonus') }}: $16</p>
                  <p class="border-t pt-2 mt-2">
                    <span class="font-medium text-gray-800">{{ $t('alphaPoints.calculationExample.totalPoints') }}：</span>
                    <span class="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-bold">7{{ $t('alphaPoints.balanceRules.points') }}</span>
                  </p>
                </div>
              </div>
            </div>

            <div class="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-sm">
              <h4 class="font-medium text-gray-800 mb-3 flex items-center">
                <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <span class="text-purple-600 font-bold">B</span>
                </div>
                {{ $t('alphaPoints.calculationExample.userB') }}
              </h4>
              <div class="text-sm text-gray-600 space-y-2">
                <div class="bg-purple-50 rounded-lg p-3">
                  <p>• {{ $t('alphaPoints.calculationExample.holdingAssets') }}：$150,000 → <span class="text-blue-600 font-medium">4{{ $t('alphaPoints.balanceRules.points') }}</span></p>
                  <p>• {{ $t('alphaPoints.calculationExample.alphaPurchase') }}：$128 ({{ $t('alphaPoints.calculationExample.otherChain') }}) → <span class="text-green-600 font-medium">floor(log₂(128)) = 7{{ $t('alphaPoints.balanceRules.points') }}</span></p>
                  <p class="text-xs text-gray-500">  {{ $t('alphaPoints.calculationExample.noBscBonus') }}</p>
                  <p class="border-t pt-2 mt-2">
                    <span class="font-medium text-gray-800">{{ $t('alphaPoints.calculationExample.totalPoints') }}：</span>
                    <span class="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-bold">11{{ $t('alphaPoints.balanceRules.points') }}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 重要提醒 -->
      <div class="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
        <h3 class="font-semibold text-gray-800 mb-6 flex items-center">
          <div class="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center mr-3">
            <i class="fas fa-exclamation-circle text-white"></i>
          </div>
          {{ $t('alphaPoints.importantReminders.title') }}
        </h3>

        <div class="space-y-4">
          <div class="bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-start">
              <div class="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <i class="fas fa-clock text-white"></i>
              </div>
              <div>
                <h4 class="font-medium text-red-800 mb-2">{{ $t('alphaPoints.importantReminders.snapshotTime.title') }}</h4>
                <p class="text-sm text-red-700 leading-relaxed">{{ $t('alphaPoints.importantReminders.snapshotTime.desc') }}</p>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-start">
              <div class="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <i class="fas fa-shield-alt text-white"></i>
              </div>
              <div>
                <h4 class="font-medium text-amber-800 mb-2">{{ $t('alphaPoints.importantReminders.assetSecurity.title') }}</h4>
                <p class="text-sm text-amber-700 leading-relaxed">{{ $t('alphaPoints.importantReminders.assetSecurity.desc') }}</p>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-start">
              <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <i class="fas fa-info-circle text-white"></i>
              </div>
              <div>
                <h4 class="font-medium text-blue-800 mb-2">{{ $t('alphaPoints.importantReminders.ruleUpdates.title') }}</h4>
                <p class="text-sm text-blue-700 leading-relaxed">{{ $t('alphaPoints.importantReminders.ruleUpdates.desc') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 相关链接 -->
      <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 class="font-semibold text-gray-800 mb-6 flex items-center">
          <div class="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center mr-3">
            <i class="fas fa-external-link-alt text-white"></i>
          </div>
          {{ $t('alphaPoints.relatedLinks.title') }}
        </h3>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a href="https://www.binance.com/zh-CN/alpha" target="_blank" class="block bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 transform hover:scale-105">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center mr-4">
                <i class="fab fa-ethereum text-white text-xl"></i>
              </div>
              <div>
                <h4 class="font-medium text-gray-800 mb-1">{{ $t('alphaPoints.relatedLinks.binanceAlpha.title') }}</h4>
                <p class="text-sm text-gray-600 leading-relaxed">{{ $t('alphaPoints.relatedLinks.binanceAlpha.desc') }}</p>
              </div>
            </div>
          </a>

          <a href="https://www.binance.com/zh-CN/web3wallet" target="_blank" class="block bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 transform hover:scale-105">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mr-4">
                <i class="fas fa-wallet text-white text-xl"></i>
              </div>
              <div>
                <h4 class="font-medium text-gray-800 mb-1">{{ $t('alphaPoints.relatedLinks.binanceWallet.title') }}</h4>
                <p class="text-sm text-gray-600 leading-relaxed">{{ $t('alphaPoints.relatedLinks.binanceWallet.desc') }}</p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 定义组件名
defineOptions({
  name: 'AlphaPointsRulesPage'
})

// Alpha积分规则页面主要是静态内容展示
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
  animation: gradientShift 6s ease infinite;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* 卡片悬停效果 */
.hover\:shadow-md:hover {
  transform: translateY(-1px);
}
</style>
