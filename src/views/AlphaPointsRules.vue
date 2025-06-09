<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 头部 -->
    <div class="bg-gradient-to-br from-blue-500 via-purple-600 to-blue-700 px-4 py-6 text-white">
      <div class="mb-4">
        <h1 class="text-2xl font-bold">{{ $t('alphaPoints.subtitle') }}</h1>
      </div>
      <p class="text-blue-100">{{ $t('alphaPoints.description') }}</p>
    </div>

    <!-- 积分规则详情 -->
    <div class="px-4 py-4">
      <!-- 概述 -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
        <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
          <i class="fas fa-info-circle text-blue-500 mr-2"></i>
          {{ $t('alphaPoints.overview.title') }}
        </h3>
        <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
          <p class="text-sm text-gray-700 leading-relaxed" v-html="$t('alphaPoints.overview.content')">
          </p>
        </div>
      </div>

      <!-- 余额积分规则 -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
        <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
          <i class="fas fa-wallet text-blue-500 mr-2"></i>
          {{ $t('alphaPoints.balanceRules.title') }}
        </h3>

        <div class="bg-blue-50 rounded-lg p-4 mb-4">
          <div class="flex items-start">
            <i class="fas fa-exclamation-triangle text-amber-500 mr-3 mt-1"></i>
            <div>
              <h4 class="font-medium text-gray-800 mb-2">{{ $t('alphaPoints.balanceRules.qualifiedAssets') }}</h4>
              <p class="text-sm text-gray-700 leading-relaxed">
                {{ $t('alphaPoints.balanceRules.qualifiedAssetsDesc') }}
              </p>
            </div>
          </div>
        </div>

        <div class="space-y-3">
          <div class="flex justify-between items-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
            <div class="flex items-center">
              <div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                <span class="text-yellow-700 font-bold text-sm">1</span>
              </div>
              <span class="text-sm font-medium text-gray-700">≥$100 &lt;$1,000</span>
            </div>
            <span class="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">1{{ $t('alphaPoints.balanceRules.points') }}</span>
          </div>

          <div class="flex justify-between items-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
            <div class="flex items-center">
              <div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                <span class="text-yellow-700 font-bold text-sm">2</span>
              </div>
              <span class="text-sm font-medium text-gray-700">≥$1,000 &lt;$10,000</span>
            </div>
            <span class="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">2{{ $t('alphaPoints.balanceRules.points') }}</span>
          </div>

          <div class="flex justify-between items-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
            <div class="flex items-center">
              <div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                <span class="text-yellow-700 font-bold text-sm">3</span>
              </div>
              <span class="text-sm font-medium text-gray-700">≥$10,000 &lt;$100,000</span>
            </div>
            <span class="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">3{{ $t('alphaPoints.balanceRules.points') }}</span>
          </div>

          <div class="flex justify-between items-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
            <div class="flex items-center">
              <div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                <span class="text-yellow-700 font-bold text-sm">4</span>
              </div>
              <span class="text-sm font-medium text-gray-700">≥$100,000</span>
            </div>
            <span class="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">4{{ $t('alphaPoints.balanceRules.points') }}</span>
          </div>
        </div>
      </div>

      <!-- 交易量积分规则 -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
        <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
          <i class="fas fa-chart-line text-green-500 mr-2"></i>
          {{ $t('alphaPoints.tradingRules.title') }}
        </h3>

        <!-- 限时活动公告 -->
        <div class="bg-gradient-to-r from-red-50 via-orange-50 to-yellow-50 border-l-4 border-red-500 rounded-lg p-4 mb-4">
          <div class="flex items-start">
            <i class="fas fa-fire text-red-500 mr-3 mt-1 animate-pulse"></i>
            <div class="flex-1">
              <h4 class="font-medium text-red-800 mb-2 flex items-center">
                🔥 {{ $t('alphaPoints.tradingRules.limitedEvent') }}
                <span class="ml-2 bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-bold">{{ $t('common.limited') }}</span>
              </h4>
              <p class="text-sm text-red-700 mb-2" v-html="$t('alphaPoints.tradingRules.limitedEventDesc')">
              </p>
              <a
                href="https://www.binance.com/zh-CN/support/announcement/detail/37f90caac9c24988bbd9ce3595a136a2"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center text-sm text-red-600 hover:text-red-800 font-medium underline transition-colors"
              >
                <i class="fas fa-external-link-alt mr-1"></i>
                {{ $t('alphaPoints.tradingRules.viewAnnouncement') }}
              </a>
            </div>
          </div>
        </div>

        <div class="bg-green-50 rounded-lg p-4 mb-4">
          <div class="flex items-start">
            <i class="fas fa-coins text-green-500 mr-3 mt-1"></i>
            <div>
              <h4 class="font-medium text-gray-800 mb-2">{{ $t('alphaPoints.tradingRules.calculationMethod') }}</h4>
              <p class="text-sm text-gray-700 mb-2">
                {{ $t('alphaPoints.tradingRules.calculationDesc') }}
              </p>
              <div class="space-y-1">
                <p class="text-sm text-gray-700">• {{ $t('alphaPoints.tradingRules.formula') }}</p>
                <p class="text-sm text-gray-700">• {{ $t('alphaPoints.tradingRules.totalAmount') }}</p>
                <p class="text-sm text-red-600 font-medium">• {{ $t('alphaPoints.tradingRules.bscBonus') }}</p>
                <p class="text-sm text-gray-500">• {{ $t('alphaPoints.tradingRules.example') }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <span class="text-sm font-medium text-gray-700">$2</span>
            <span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">1{{ $t('alphaPoints.balanceRules.points') }}</span>
          </div>

          <div class="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <span class="text-sm font-medium text-gray-700">$4</span>
            <span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">2{{ $t('alphaPoints.balanceRules.points') }}</span>
          </div>

          <div class="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <span class="text-sm font-medium text-gray-700">$8</span>
            <span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">3{{ $t('alphaPoints.balanceRules.points') }}</span>
          </div>

          <div class="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <span class="text-sm font-medium text-gray-700">$16</span>
            <span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">4{{ $t('alphaPoints.balanceRules.points') }}</span>
          </div>

          <div class="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <span class="text-sm font-medium text-gray-700">$32</span>
            <span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">5{{ $t('alphaPoints.balanceRules.points') }}</span>
          </div>

          <div class="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <span class="text-sm font-medium text-gray-700">$64</span>
            <span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">6{{ $t('alphaPoints.balanceRules.points') }}</span>
          </div>

          <div class="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <span class="text-sm font-medium text-gray-700">$128</span>
            <span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">7{{ $t('alphaPoints.balanceRules.points') }}</span>
          </div>

          <div class="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <span class="text-sm font-medium text-gray-700">$256</span>
            <span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">8{{ $t('alphaPoints.balanceRules.points') }}</span>
          </div>

          <div class="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <span class="text-sm font-medium text-gray-700">$512</span>
            <span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">9{{ $t('alphaPoints.balanceRules.points') }}</span>
          </div>
        </div>

        <div class="text-center py-3 mt-3">
          <span class="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{{ $t('alphaPoints.tradingRules.continue') }}</span>
        </div>
      </div>

      <!-- 积分计算示例 -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
        <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
          <i class="fas fa-calculator text-purple-500 mr-2"></i>
          {{ $t('alphaPoints.calculationExample.title') }}
        </h3>

        <div class="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
          <div class="space-y-3">
            <div class="bg-white rounded-lg p-3 border border-purple-200">
              <h4 class="font-medium text-gray-800 mb-2">{{ $t('alphaPoints.calculationExample.userA') }}</h4>
              <div class="text-sm text-gray-600 space-y-1">
                <p>• {{ $t('alphaPoints.calculationExample.holdingAssets') }}：$5,000 → <span class="text-blue-600 font-medium">2{{ $t('alphaPoints.balanceRules.points') }}</span></p>
                <p>• {{ $t('alphaPoints.calculationExample.alphaPurchase') }}：$16 ({{ $t('alphaPoints.calculationExample.bscChain') }}) → <span class="text-green-600 font-medium">floor(log₂(16+16)) = 5{{ $t('alphaPoints.balanceRules.points') }}</span></p>
                <p class="text-xs text-orange-600">  {{ $t('alphaPoints.calculationExample.withBscBonus') }}: $16</p>
                <p class="border-t pt-2 mt-2">
                  <span class="font-medium text-gray-800">{{ $t('alphaPoints.calculationExample.totalPoints') }}：</span>
                  <span class="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-bold">7{{ $t('alphaPoints.balanceRules.points') }}</span>
                </p>
              </div>
            </div>

            <div class="bg-white rounded-lg p-3 border border-purple-200">
              <h4 class="font-medium text-gray-800 mb-2">{{ $t('alphaPoints.calculationExample.userB') }}</h4>
              <div class="text-sm text-gray-600 space-y-1">
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

      <!-- 重要提醒 -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
        <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
          <i class="fas fa-exclamation-circle text-red-500 mr-2"></i>
          {{ $t('alphaPoints.importantReminders.title') }}
        </h3>

        <div class="space-y-3">
          <div class="bg-red-50 border border-red-200 rounded-lg p-3">
            <div class="flex items-start">
              <i class="fas fa-clock text-red-500 mr-2 mt-0.5"></i>
              <div>
                <h4 class="font-medium text-red-800 mb-1">{{ $t('alphaPoints.importantReminders.snapshotTime.title') }}</h4>
                <p class="text-sm text-red-700">{{ $t('alphaPoints.importantReminders.snapshotTime.desc') }}</p>
              </div>
            </div>
          </div>

          <div class="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div class="flex items-start">
              <i class="fas fa-shield-alt text-amber-500 mr-2 mt-0.5"></i>
              <div>
                <h4 class="font-medium text-amber-800 mb-1">{{ $t('alphaPoints.importantReminders.assetSecurity.title') }}</h4>
                <p class="text-sm text-amber-700">{{ $t('alphaPoints.importantReminders.assetSecurity.desc') }}</p>
              </div>
            </div>
          </div>

          <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div class="flex items-start">
              <i class="fas fa-info-circle text-blue-500 mr-2 mt-0.5"></i>
              <div>
                <h4 class="font-medium text-blue-800 mb-1">{{ $t('alphaPoints.importantReminders.ruleUpdates.title') }}</h4>
                <p class="text-sm text-blue-700">{{ $t('alphaPoints.importantReminders.ruleUpdates.desc') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 相关链接 -->
      <div class="bg-white rounded-xl shadow-sm p-4">
        <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
          <i class="fas fa-external-link-alt text-gray-500 mr-2"></i>
          {{ $t('alphaPoints.relatedLinks.title') }}
        </h3>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a href="https://www.binance.com/zh-CN/alpha" target="_blank" class="block bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-3 border border-yellow-200 hover:shadow-md transition-shadow">
            <div class="flex items-center">
              <i class="fab fa-ethereum text-yellow-600 mr-3"></i>
              <div>
                <h4 class="font-medium text-gray-800 text-sm">{{ $t('alphaPoints.relatedLinks.binanceAlpha.title') }}</h4>
                <p class="text-xs text-gray-600">{{ $t('alphaPoints.relatedLinks.binanceAlpha.desc') }}</p>
              </div>
            </div>
          </a>

          <a href="https://www.binance.com/zh-CN/web3wallet" target="_blank" class="block bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-3 border border-blue-200 hover:shadow-md transition-shadow">
            <div class="flex items-center">
              <i class="fas fa-wallet text-blue-600 mr-3"></i>
              <div>
                <h4 class="font-medium text-gray-800 text-sm">{{ $t('alphaPoints.relatedLinks.binanceWallet.title') }}</h4>
                <p class="text-xs text-gray-600">{{ $t('alphaPoints.relatedLinks.binanceWallet.desc') }}</p>
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
