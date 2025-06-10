<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 头部 -->
    <div class="bg-gradient-to-br from-blue-500 via-purple-600 to-blue-700 px-4 py-6 text-white shadow-lg sticky top-0 z-10">
      <div class="mb-4">
        <h1 class="text-2xl font-bold mb-2">{{ currentViewTitle }}</h1>
        <p v-if="currentAddress" class="text-blue-100 text-sm break-all">
          {{ currentAddress }}
        </p>
      </div>

      <!-- 功能按钮行 -->
      <div class="flex items-center justify-between mb-4 gap-3">
        <!-- 视图切换按钮 -->
        <div class="bg-white/10 backdrop-blur-sm rounded-lg p-1 flex flex-1 max-w-xs">
          <button
            @click="currentView = 'list'"
            :class="[
              'flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center',
              currentView === 'list'
                ? 'bg-white/20 text-white shadow-inner'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            ]"
          >
            <i class="fas fa-list mr-2"></i>
            {{ $t('transactionResults.listView') }}
          </button>
          <button
            @click="currentView = 'statistics'"
            :class="[
              'flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center',
              currentView === 'statistics'
                ? 'bg-white/20 text-white shadow-inner'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            ]"
          >
            <i class="fas fa-chart-bar mr-2"></i>
            {{ $t('transactionResults.statisticsView') }}
          </button>
        </div>

        <!-- 刷新按钮 -->
        <div class="flex items-center gap-2">
          <button
            @click="refreshData"
            :disabled="loading"
            class="bg-white/20 backdrop-blur-sm text-white px-3 py-2 rounded-lg hover:bg-white/30 transition-all duration-300 disabled:opacity-50 flex items-center whitespace-nowrap text-sm"
          >
            <i :class="[loading ? 'fas fa-spinner fa-spin' : 'fas fa-sync-alt', 'mr-1']"></i>
            <span class="hidden sm:inline">{{ loading ? $t('transactionResults.refreshing') : $t('transactionResults.refresh') }}</span>
          </button>
        </div>
      </div>

      <!-- 数据状态指示器 -->
      <div class="mb-4 text-center">
          <div class="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 text-xs text-blue-100">
              <span v-if="hasHistoricalPrices" class="flex items-center">
                  <span class="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                  {{ $t('transactionResults.historicalPricesCached') }}
              </span>
              <span v-else class="flex items-center">
                  <span class="w-2 h-2 bg-yellow-400 rounded-full mr-1"></span>
                  {{ $t('transactionResults.needHistoricalPrices') }}
              </span>
              <span class="text-blue-200">|</span>
              <span>{{ transactionData.length }}{{ $t('transactionResults.daysData') }}</span>
          </div>
      </div>

      <!-- 统计卡片 -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          <div class="bg-white/20 backdrop-blur-sm rounded-xl p-3">
              <div class="text-2xl font-bold">{{ statistics.totalTransactions }}</div>
              <div class="text-xs text-blue-100">{{ $t('transactionResults.totalTransactions') }}</div>
          </div>
          <div class="bg-white/20 backdrop-blur-sm rounded-xl p-3">
              <div class="text-lg font-bold">
                ${{ formatNumber(statistics.totalAlphaInflow) }}
                <div v-if="statistics.totalBscBonus && statistics.totalBscBonus > 0" class="text-sm text-orange-300">
                  +${{ formatNumber(statistics.totalBscBonus) }} bonus
                </div>
              </div>
              <div class="text-xs text-blue-100">{{ $t('transactionResults.totalAlphaInflow') }}</div>
          </div>
          <div class="bg-white/20 backdrop-blur-sm rounded-xl p-3">
              <div class="text-2xl font-bold">{{ formatPoints(pointsStatistics.totalPoints) }}</div>
              <div class="text-xs text-blue-100">{{ $t('transactionResults.cumulativeAlphaPoints') }}</div>
              <div class="text-xs text-purple-200 mt-1 flex items-center justify-center">
                <i class="fas fa-calculator mr-1"></i>
                {{ $t('transactionResults.calculatedAccurateValue') }}
              </div>
          </div>
          <div class="bg-white/20 backdrop-blur-sm rounded-xl p-3">
              <div class="text-lg font-bold">${{ formatNumber(statistics.averageDailyVolume) }}</div>
              <div class="text-xs text-blue-100">{{ $t('transactionResults.averageDailyVolume') }}</div>
          </div>
      </div>

    </div>

    <!-- 错误提示 -->
    <div v-if="errorMessage" class="px-4 py-4">
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
        {{ errorMessage }}
      </div>
    </div>

    <!-- Loading Spinner -->
    <div v-if="loading && transactionData.length === 0" class="flex justify-center items-center h-64">
        <i class="fas fa-spinner fa-spin text-4xl text-blue-500"></i>
    </div>

    <!-- Transaction List View -->
    <div v-if="currentView === 'list' && transactionData.length > 0" class="px-2 sm:px-4 py-4">
      <div v-for="day in transactionData" :key="day.date" class="mb-6 bg-white rounded-xl shadow-md overflow-hidden">
        <div class="bg-gray-50 p-3 border-b border-gray-200 flex justify-between items-center cursor-pointer" @click="toggleDayExpansion(day.date)">
          <div class="flex items-center">
            <h3 class="text-lg font-semibold text-gray-800 mr-3">{{ day.date }}</h3>
            <span class="text-sm text-gray-500">({{ day.transactions.length }} {{ $t('transactionResults.transactions') }})</span>
            <i :class="[expandedDays.has(day.date) ? 'fas fa-chevron-up' : 'fas fa-chevron-down', 'ml-2 text-gray-400 transition-transform']"></i>
          </div>
          <button
            @click.stop="calculateDailyStatisticsForDay(day)"
            :disabled="loading"
            class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-sm shadow-md hover:shadow-lg"
          >
            <i :class="[loading && dayBeingProcessed === day.date ? 'fas fa-spinner fa-spin' : 'fas fa-calculator', 'mr-2']"></i>
            <span>{{ day.statistics ? $t('transactionResults.recalculate') : $t('transactionResults.calculateTransactions') }}</span>
          </button>
        </div>

        <!-- Daily Statistics Summary -->
        <div v-if="day.statistics" class="p-3 bg-blue-50 border-b border-gray-200">
            <!-- Main Stats Row -->
            <div class="grid grid-cols-2 gap-2 text-sm mb-3">
                <div class="text-center">
                    <span class="font-semibold text-gray-700">{{ $t('transactionResults.alphaInflow') }}: </span>
                    <span class="text-green-600 font-bold">
                      ${{ formatNumber(day.statistics.alphaInflowUsd) }}
                      <span v-if="day.statistics.bscBonusUsd && day.statistics.bscBonusUsd > 0" class="text-orange-600 ml-1">
                        (bonus+${{ formatNumber(day.statistics.bscBonusUsd) }})
                      </span>
                    </span>
                </div>
                <div class="text-center">
                    <span class="font-semibold text-gray-700">{{ $t('transactionResults.alphaPoints') }}: </span>
                    <span class="text-purple-600 font-bold">{{ formatPoints(day.statistics.points) }}</span>
                </div>
            </div>

                                                <!-- Extended Stats Row -->
            <div v-if="day.statistics.gasStats || day.statistics.flowStats" class="space-y-2">
                <!-- Simplified stats: Gas and Total Net only -->
                <div class="grid grid-cols-2 gap-2 text-xs">
                    <div v-if="day.statistics.gasStats" class="text-center bg-white/50 rounded p-2">
                        <div class="font-medium text-red-600">
                            {{ formatGas(day.statistics.gasStats.totalGasBnb) }} BNB
                            <div class="text-xs text-gray-500">≈${{ formatNumber(day.statistics.gasStats.totalGasBnb * 600) }}</div>
                        </div>
                        <div class="text-gray-600">{{ $t('transactionResults.gasConsumed') }}</div>
                    </div>

                    <!-- Total net result -->
                    <div v-if="day.statistics.flowStats && day.statistics.flowStats.totalNetUsd !== undefined" class="text-center">
                        <div class="bg-gray-100 rounded-lg p-2 border-2" :class="day.statistics.flowStats.totalNetUsd >= 0 ? 'border-green-300' : 'border-red-300'">
                            <div class="font-bold text-base" :class="day.statistics.flowStats.totalNetUsd >= 0 ? 'text-green-700' : 'text-red-700'">
                                {{ day.statistics.flowStats.totalNetUsd >= 0 ? '+' : '-' }}${{ formatNumber(Math.abs(day.statistics.flowStats.totalNetUsd)) }}
                            </div>
                            <div class="text-xs text-gray-600">{{ $t('transactionResults.comprehensivePnL') }}</div>
                        </div>
                    </div>
                </div>

                <!--
                TODO: Individual net amounts (commented out for now, may be optimized later)
                <div class="grid grid-cols-3 gap-2 text-xs">
                    <div v-if="day.statistics.flowStats" class="text-center bg-white/50 rounded p-2">
                        <div class="font-medium" :class="day.statistics.flowStats.netAlphaUsd >= 0 ? 'text-green-600' : 'text-red-600'">
                            {{ day.statistics.flowStats.netAlphaUsd >= 0 ? '+' : '-' }}${{ formatNumber(Math.abs(day.statistics.flowStats.netAlphaUsd)) }}
                        </div>
                        <div class="text-gray-600">Alpha净额</div>
                    </div>

                    <div v-if="day.statistics.flowStats" class="text-center bg-white/50 rounded p-2">
                        <div class="font-medium" :class="day.statistics.flowStats.netStablecoinUsd >= 0 ? 'text-green-600' : 'text-red-600'">
                            {{ day.statistics.flowStats.netStablecoinUsd >= 0 ? '+' : '-' }}${{ formatNumber(Math.abs(day.statistics.flowStats.netStablecoinUsd)) }}
                        </div>
                        <div class="text-gray-600">稳定币净额</div>
                    </div>

                    <div v-if="day.statistics.flowStats" class="text-center bg-white/50 rounded p-2">
                        <div class="font-medium" :class="day.statistics.flowStats.netBnbUsd >= 0 ? 'text-green-600' : 'text-red-600'">
                            {{ day.statistics.flowStats.netBnbUsd >= 0 ? '+' : '-' }}${{ formatNumber(Math.abs(day.statistics.flowStats.netBnbUsd)) }}
                        </div>
                        <div class="text-gray-600">BNB净额</div>
                    </div>
                </div>
                -->
            </div>

            <!-- 计算方法说明 -->
            <div class="mt-2 text-xs text-gray-500 bg-gray-50 rounded p-2">
                <details>
                    <summary class="cursor-pointer font-medium">📊 {{ $t('transactionResults.calculationDescription') }}</summary>
                    <div class="mt-2 space-y-1 text-xs">
                        <p>{{ $t('transactionResults.calculationDetails.alphaInflow') }}</p>
                        <p>{{ $t('transactionResults.calculationDetails.bscBonus') }}</p>
                        <p>{{ $t('transactionResults.calculationDetails.pointsCalculation') }}</p>
                        <p>{{ $t('transactionResults.calculationDetails.gasConsumed') }}</p>
                        <p>{{ $t('transactionResults.calculationDetails.comprehensivePnL') }}</p>
                        <p>{{ $t('transactionResults.calculationDetails.totalVolume') }}</p>
                        <p>{{ $t('transactionResults.calculationDetails.cacheOptimization') }}</p>
                    </div>
                </details>
            </div>
        </div>

        <!-- 可收缩的交易列表 -->
        <div v-show="expandedDays.has(day.date)" class="transition-all duration-300">
          <ul class="divide-y divide-gray-200">
            <li v-for="tx in day.transactions" :key="tx.hash" class="p-3 hover:bg-gray-50 transition-colors duration-200">
              <div class="flex justify-between items-center text-xs mb-2">
                  <a :href="`https://bscscan.com/tx/${tx.hash}`" target="_blank" class="font-mono text-blue-600 hover:underline">
                      {{ tx.hash.slice(0, 10) }}...{{ tx.hash.slice(-8) }}
                  </a>
                  <span class="text-gray-500">{{ new Date(tx.timeStamp * 1000).toLocaleTimeString() }}</span>
              </div>
              <div v-if="tx.flows && tx.flows.length > 0" class="mt-2 pl-4 border-l-4 border-gray-200">
                <div v-for="(flow, index) in tx.flows" :key="index" class="text-sm py-1 flex justify-between items-center">
                  <div>
                      <span :class="flow.isInflow ? 'text-green-600' : 'text-red-600'">
                      {{ flow.isInflow ? $t('transactionResults.inflow') : $t('transactionResults.outflow') }}
                      </span>
                      <strong class="mx-1">{{ formatNumber(flow.amount) }}</strong>
                      <span class="text-gray-800 font-semibold">{{ flow.token.symbol }}</span>
                  </div>
                  <div class="text-right">
                      <span v-if="flow.historicalPrice" class="text-gray-600 font-mono">
                      (@ ${{ formatPrice(flow.historicalPrice) }})
                      <span class="font-bold text-black ml-2">
                          ${{ formatNumber(flow.amount * flow.historicalPrice) }}
                      </span>
                      </span>
                      <span v-else class="text-gray-400 font-mono">
                      ({{ $t('transactionResults.noPriceData') }})
                      </span>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && transactionData.length === 0 && !errorMessage" class="text-center py-16">
        <p class="text-gray-500">{{ $t('transactionResults.noTransactionRecords') }}</p>
    </div>

    <!-- Statistics View (Points Statistics) -->
    <div v-if="currentView === 'statistics'" class="p-4 space-y-8">
      <!-- 顶部：积分总览大卡片 -->
      <div class="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div class="mb-4 lg:mb-0">
            <h3 class="text-3xl font-bold mb-2 flex items-center">
              <i class="fas fa-trophy mr-3 text-yellow-400"></i>
              {{ $t('transactionResults.pointsOverview') }}
            </h3>
            <p class="text-blue-100 text-lg">{{ $t('transactionResults.rollingWindowStatistics') }}</p>
          </div>
          <div class="text-center lg:text-right">
            <div class="text-6xl font-black text-yellow-300 mb-2">{{ pointsStatistics.totalPoints }}</div>
            <div class="text-lg text-purple-100 font-medium mb-1">{{ $t('transactionResults.currentAlphaPoints') }}</div>
            <div class="text-xs text-blue-200 bg-blue-500/20 rounded-lg px-3 py-1 inline-block border border-blue-400/30">
              <i class="fas fa-calculator mr-1"></i>
              {{ $t('transactionResults.calculatedAccurateValue') }}
            </div>
          </div>
        </div>

        <!-- 积分详细数据 -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div class="text-center bg-white/20 backdrop-blur-sm rounded-xl p-6 transform hover:scale-105 transition-all duration-200 border border-white/30 shadow-lg">
            <div class="text-3xl font-bold mb-2 text-white">{{ pointsStatistics.totalTransactionPoints }}</div>
            <div class="text-sm text-purple-100 font-medium">{{ $t('transactionResults.transactionPoints') }}</div>
          </div>
          <div class="text-center bg-white/20 backdrop-blur-sm rounded-xl p-6 transform hover:scale-105 transition-all duration-200 border border-white/30 shadow-lg">
            <div class="text-3xl font-bold mb-2 text-white">{{ pointsStatistics.totalBalancePoints }}</div>
            <div class="text-sm text-purple-100 font-medium">{{ $t('transactionResults.balancePoints') }}</div>
          </div>
          <div class="text-center bg-white/20 backdrop-blur-sm rounded-xl p-6 transform hover:scale-105 transition-all duration-200 border border-white/30 shadow-lg">
            <div class="text-3xl font-bold mb-2" :class="pointsStatistics.totalAdjustmentAmount >= 0 ? 'text-green-300' : 'text-red-300'">
              {{ pointsStatistics.totalAdjustmentAmount >= 0 ? '+' : '' }}{{ pointsStatistics.totalAdjustmentAmount }}
            </div>
            <div class="text-sm text-purple-100 font-medium">{{ $t('transactionResults.adjustmentAmount') }}</div>
          </div>
          <div class="text-center bg-white/20 backdrop-blur-sm rounded-xl p-6 transform hover:scale-105 transition-all duration-200 border border-white/30 shadow-lg">
            <div class="text-3xl font-bold mb-2 text-white">{{ pointsStatistics.activeDays }}</div>
            <div class="text-sm text-purple-100 font-medium">{{ $t('transactionResults.activeDays') }}</div>
          </div>
        </div>

        <!-- 15日滚动窗口说明 -->
        <div class="text-center">
          <div class="text-base text-white bg-white/20 backdrop-blur-sm rounded-xl px-6 py-4 inline-flex items-center border border-white/30 shadow-lg">
            <i class="fas fa-clock mr-3 text-yellow-400"></i>
            <span class="font-medium">{{ $t('transactionResults.rollingWindowSummary') }}</span>
          </div>
        </div>
      </div>

      <!-- 中间区域：设置和预测功能 -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 左侧：快速设置 -->
        <div class="space-y-6">
          <!-- 每日余额积分设置 -->
          <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h4 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                <i class="fas fa-cog text-white"></i>
              </div>
              {{ $t('transactionResults.dailyBalanceSettings') }}
            </h4>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-3">{{ $t('transactionResults.dailyBalancePoints') }}</label>
                <input
                  type="number"
                  v-model.number="dailyBalancePoints"
                  @change="saveDailyBalancePoints"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-medium"
                  :placeholder="$t('transactionResults.enterDailyBalance')"
                  min="0"
                  step="0.1"
                >
                <p class="text-sm text-gray-500 mt-2">{{ $t('transactionResults.dailyBalanceDescription') }}</p>
              </div>
              <button
                @click="resetAllPointsAdjustments"
                class="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center justify-center font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <i class="fas fa-undo mr-2"></i>
                {{ $t('transactionResults.resetAll') }}
              </button>
            </div>
          </div>

          <!-- 时间范围说明 -->
          <div class="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6">
            <div class="flex items-center space-x-3 text-blue-800 mb-4">
              <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <i class="fas fa-info-circle text-white text-sm"></i>
              </div>
              <span class="font-bold text-lg">{{ $t('transactionResults.timeRangeInfo') }}</span>
            </div>
            <p class="text-sm text-blue-700 mb-3 leading-relaxed">{{ $t('transactionResults.utc15DaysDescription') }}</p>
            <p class="text-xs text-blue-600 mb-3 font-mono">{{ $t('transactionResults.currentUtcTime') }}: {{ currentUtcTime }}</p>
            <div class="text-sm text-blue-700 bg-blue-100 rounded-xl px-4 py-3 font-medium">
              💡 {{ $t('transactionResults.rollingWindowHint') }}
            </div>
          </div>
        </div>

        <!-- 右侧：积分预测区域 -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                         <!-- 预测功能标题 -->
             <div class="bg-gradient-to-r from-emerald-500 to-blue-600 px-8 py-6 text-white">
               <h4 class="text-2xl font-bold flex items-center mb-2">
                 <div class="w-10 h-10 bg-emerald-600 bg-opacity-80 rounded-lg flex items-center justify-center mr-3 shadow-lg">
                   <i class="fas fa-chart-line text-white"></i>
                 </div>
                 {{ $t('transactionResults.pointsPrediction') }}
               </h4>
               <p class="text-emerald-100 text-lg">{{ $t('transactionResults.predictionDescription') }}</p>
             </div>

            <div class="p-8">
              <!-- 预测设置 -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                  <label class="block text-base font-bold text-gray-700 mb-4 flex items-center">
                    <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                      <i class="fas fa-calendar-day text-white text-sm"></i>
                    </div>
                    {{ $t('transactionResults.dailyPredictedPoints') }}
                  </label>
                  <input
                    type="number"
                    v-model.number="predictedDailyPoints"
                    @change="savePredictionSettings"
                    class="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xl font-bold text-center"
                    :placeholder="$t('transactionResults.enterPredictedDaily')"
                    min="0"
                    step="0.1"
                  >
                  <p class="text-sm text-gray-600 mt-3 leading-relaxed">{{ $t('transactionResults.predictedDailyDescription') }}</p>
                </div>

                <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                  <label class="block text-base font-bold text-gray-700 mb-4 flex items-center">
                    <div class="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center mr-3">
                      <i class="fas fa-bullseye text-white text-sm"></i>
                    </div>
                    {{ $t('transactionResults.targetPoints') }}
                  </label>
                  <input
                    type="number"
                    v-model.number="targetPoints"
                    @change="savePredictionSettings"
                    class="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-xl font-bold text-center"
                    :placeholder="$t('transactionResults.enterTargetPoints')"
                    min="0"
                    step="1"
                  >
                  <p class="text-sm text-gray-600 mt-3 leading-relaxed">{{ $t('transactionResults.targetPointsDescription') }}</p>
                </div>
              </div>

              <!-- 预测结果 -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- 日期预测 -->
                <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-200 shadow-lg">
                  <h5 class="font-bold text-green-800 mb-6 text-xl flex items-center">
                    <div class="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                      <i class="fas fa-calendar-alt text-white"></i>
                    </div>
                    {{ $t('transactionResults.datePrediction') }}
                  </h5>
                  <div class="mb-6">
                    <label class="block text-sm font-bold text-gray-700 mb-3">{{ $t('transactionResults.selectPredictionDate') }}</label>
                    <input
                      type="date"
                      v-model="predictionDate"
                      @change="calculateDatePrediction"
                      class="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-medium"
                      :min="getMinPredictionDate()"
                    >
                  </div>
                  <div v-if="predictionDate" class="text-center bg-white bg-opacity-70 rounded-2xl p-6 shadow-inner">
                    <div class="text-5xl font-black text-green-600 mb-3">{{ datePredictionResult.predictedPoints }}</div>
                    <div class="text-lg text-green-700 font-medium mb-4">{{ $t('transactionResults.predictedPointsOn') }} {{ predictionDate }}</div>
                    <div class="text-sm text-gray-700 space-y-2">
                      <div class="flex justify-between items-center bg-gray-100 rounded-lg px-3 py-2">
                        <span>{{ $t('transactionResults.basedOnCurrentData') }}:</span>
                        <span class="font-bold">{{ datePredictionResult.currentPoints }}</span>
                      </div>
                      <div class="flex justify-between items-center bg-blue-100 rounded-lg px-3 py-2">
                        <span>{{ $t('transactionResults.futureEarnings') }}:</span>
                        <span class="font-bold text-blue-600">+{{ datePredictionResult.futurePoints }}</span>
                      </div>
                      <div v-if="datePredictionResult.lostPoints > 0" class="flex justify-between items-center bg-red-100 rounded-lg px-3 py-2">
                        <span>{{ $t('transactionResults.rollingLoss') }}:</span>
                        <span class="font-bold text-red-600">-{{ datePredictionResult.lostPoints }}</span>
                      </div>
                    </div>
                    <div v-if="datePredictionResult.rollingNote" class="text-sm text-orange-700 mt-4 bg-orange-100 rounded-xl px-4 py-3 font-medium">
                      ⚠️ {{ datePredictionResult.rollingNote }}
                    </div>
                  </div>
                </div>

                <!-- 目标达成预测 -->
                <div class="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border-2 border-blue-200 shadow-lg">
                  <h5 class="font-bold text-blue-800 mb-6 text-xl flex items-center">
                    <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                      <i class="fas fa-trophy text-white"></i>
                    </div>
                    {{ $t('transactionResults.targetAchievement') }}
                  </h5>
                  <div class="text-center bg-white bg-opacity-70 rounded-2xl p-6 shadow-inner min-h-[200px] flex items-center justify-center">
                    <div v-if="targetPoints > 0" class="w-full">
                      <div v-if="targetPredictionResult.canAchieve" class="space-y-4">
                        <div class="text-4xl font-black text-blue-600 mb-2">{{ targetPredictionResult.achievementDate }}</div>
                        <div class="text-lg text-blue-700 font-medium">{{ $t('transactionResults.estimatedAchievementDate') }}</div>
                        <div class="space-y-2 text-sm">
                          <div class="flex justify-between items-center bg-blue-100 rounded-lg px-3 py-2">
                            <span>{{ $t('transactionResults.daysNeeded') }}:</span>
                            <span class="font-bold">{{ targetPredictionResult.daysNeeded }}</span>
                          </div>
                          <div class="flex justify-between items-center bg-gray-100 rounded-lg px-3 py-2">
                            <span>{{ $t('transactionResults.remainingPoints') }}:</span>
                            <span class="font-bold">{{ targetPredictionResult.remainingPoints }}</span>
                          </div>
                        </div>
                      </div>
                      <div v-else-if="targetPredictionResult.isAlreadyAchieved" class="text-orange-600">
                        <div class="text-3xl font-bold mb-3">🎉</div>
                        <div class="text-2xl font-bold mb-2">{{ $t('transactionResults.alreadyAchieved') }}</div>
                        <div class="text-lg">{{ $t('transactionResults.currentTotal') }}: {{ pointsStatistics.totalPoints }}</div>
                      </div>
                      <div v-else class="text-red-600">
                        <div class="text-3xl font-bold mb-3">⚠️</div>
                        <div class="text-xl font-bold mb-3">{{ $t('transactionResults.cannotAchieve') }}</div>
                        <div class="text-sm bg-red-100 rounded-xl px-4 py-3 font-medium">
                          {{ targetPredictionResult.rollingWarning }}
                        </div>
                      </div>
                    </div>
                    <div v-else class="text-gray-500 text-center">
                      <div class="text-5xl mb-4">🎯</div>
                      <div class="text-xl font-medium">{{ $t('transactionResults.setTargetFirst') }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 每日积分明细表格 -->
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                 <div class="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-6 text-white">
           <h4 class="text-2xl font-bold flex items-center mb-2">
             <div class="w-10 h-10 bg-purple-700 bg-opacity-80 rounded-lg flex items-center justify-center mr-3 shadow-lg">
               <i class="fas fa-table text-white"></i>
             </div>
             {{ $t('transactionResults.dailyPointsDetails') }}
           </h4>
           <p class="text-purple-100 text-lg">{{ $t('transactionResults.last15DaysUtc') }}</p>
         </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('transactionResults.date') }}</th>
                <th class="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('transactionResults.transactionPoints') }}</th>
                <th class="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('transactionResults.balancePoints') }}</th>
                <th class="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('transactionResults.adjustmentAmount') }}</th>
                <th class="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('transactionResults.dailyTotal') }}</th>
                <th class="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('transactionResults.actions') }}</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(day, index) in dailyPointsData" :key="day.date" :class="[
                index % 2 === 0 ? 'bg-white' : 'bg-gray-50',
                day.isLatest ? 'ring-2 ring-blue-200 bg-blue-50' : ''
              ]">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <div class="flex items-center">
                    {{ day.date }}
                    <span v-if="day.isLatest" class="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full flex items-center">
                      <i class="fas fa-star mr-1"></i>
                      {{ $t('transactionResults.latest') }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{{ formatPoints(day.transactionPoints) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{{ formatPoints(day.balancePoints) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-center" :class="day.hasAdjustment ? (day.adjustmentAmount >= 0 ? 'text-green-600' : 'text-red-600') : 'text-gray-500'">
                  <div class="flex items-center justify-center">
                    {{ day.adjustmentAmount >= 0 ? '+' : '' }}{{ formatPoints(day.adjustmentAmount) }}
                    <span v-if="day.hasAdjustment" class="ml-2 text-xs text-blue-500 flex items-center">
                      <i class="fas fa-edit mr-1"></i>
                      ({{ $t('transactionResults.adjusted') }})
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600 text-center">{{ formatPoints(day.dailyTotal) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                  <div class="flex items-center justify-center space-x-2">
                    <button
                      @click="adjustDailyPoints(day.date, day.adjustmentAmount)"
                      class="text-indigo-600 hover:text-indigo-900 flex items-center px-2 py-1 rounded hover:bg-indigo-50 transition-colors"
                    >
                      <i class="fas fa-edit mr-1"></i>
                      {{ $t('transactionResults.adjust') }}
                    </button>
                    <button
                      v-if="day.hasAdjustment"
                      @click="resetDailyPoints(day.date)"
                      class="text-red-600 hover:text-red-900 flex items-center px-2 py-1 rounded hover:bg-red-50 transition-colors"
                    >
                      <i class="fas fa-undo mr-1"></i>
                      {{ $t('transactionResults.reset') }}
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 空状态 -->
        <div v-if="dailyPointsData.length === 0" class="text-center py-12 text-gray-500">
          <i class="fas fa-inbox text-4xl mb-4"></i>
          <p>{{ $t('transactionResults.noPointsData') }}</p>
        </div>
      </div>

      <!-- 积分计算说明 -->
      <div class="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-8 shadow-lg">
                 <h4 class="text-2xl font-bold text-blue-800 mb-6 flex items-center">
           <div class="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
             <i class="fas fa-info-circle text-white text-lg"></i>
           </div>
           {{ $t('transactionResults.pointsCalculationExplanation') }}
         </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="space-y-4">
            <div class="flex items-start bg-white bg-opacity-60 rounded-xl p-4 shadow-sm">
              <div class="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                <i class="fas fa-check text-white text-sm"></i>
              </div>
              <span class="text-blue-700 leading-relaxed">{{ $t('transactionResults.pointsCalculationRule1') }}</span>
            </div>
            <div class="flex items-start bg-white bg-opacity-60 rounded-xl p-4 shadow-sm">
              <div class="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                <i class="fas fa-check text-white text-sm"></i>
              </div>
              <span class="text-blue-700 leading-relaxed">{{ $t('transactionResults.pointsCalculationRule2') }}</span>
            </div>
            <div class="flex items-start bg-white bg-opacity-60 rounded-xl p-4 shadow-sm">
              <div class="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                <i class="fas fa-check text-white text-sm"></i>
              </div>
              <span class="text-blue-700 leading-relaxed">{{ $t('transactionResults.pointsCalculationRule3') }}</span>
            </div>
          </div>
          <div class="space-y-4">
            <div class="flex items-start bg-white bg-opacity-60 rounded-xl p-4 shadow-sm">
              <div class="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                <i class="fas fa-check text-white text-sm"></i>
              </div>
              <span class="text-blue-700 leading-relaxed">{{ $t('transactionResults.pointsCalculationRule4') }}</span>
            </div>
            <div class="flex items-start bg-white bg-opacity-60 rounded-xl p-4 shadow-sm">
              <div class="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                <i class="fas fa-check text-white text-sm"></i>
              </div>
              <span class="text-blue-700 leading-relaxed">{{ $t('transactionResults.pointsCalculationRule5') }}</span>
            </div>
            <div class="flex items-start bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-4 shadow-sm border-2 border-yellow-200">
              <div class="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                <i class="fas fa-lightbulb text-white text-sm"></i>
              </div>
              <span class="text-yellow-800 leading-relaxed font-medium">{{ $t('transactionResults.pointsCalculationRule6') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useBscStore } from '@/stores/bsc'
import { storeToRefs } from 'pinia'
import { ElMessage, ElMessageBox } from 'element-plus'
import { CachingService } from '@/services/caching/caching.service'

const route = useRoute()
const { t } = useI18n()
const bscStore = useBscStore()

// Use storeToRefs to keep reactivity on state and getters
const {
  searchResults: transactionData,
  statistics,
  loading,
  error: errorMessage,
  currentAddress
} = storeToRefs(bscStore)

// 积分调整相关的缓存服务
const pointsCache = new CachingService('localStorage')

// Check if data has historical prices
const hasHistoricalPrices = computed(() => {
    return transactionData.value.some(day =>
        day.transactions?.some(tx =>
            tx.flows?.some(flow => flow.historicalPrice !== null && flow.historicalPrice !== undefined)
        )
    );
});

const currentView = ref('list') // 'list' or 'statistics'
const dayBeingProcessed = ref(null) // To track which day's stats are being calculated
const expandedDays = ref(new Set()) // To track expanded days

// 积分相关的响应式数据
const dailyBalancePoints = ref(2) // 默认每日余额积分2分
const forceUpdateKey = ref(0) // 强制更新key

// 预测功能相关数据
const predictedDailyPoints = ref(3) // 预测每日积分获得量
const targetPoints = ref(100) // 目标积分
const predictionDate = ref('') // 预测日期
const datePredictionResult = ref({
  predictedPoints: 0,
  currentPoints: 0,
  futurePoints: 0
})
const targetPredictionResult = ref({
  canAchieve: false,
  achievementDate: '',
  daysNeeded: 0,
  remainingPoints: 0
})

const currentViewTitle = computed(() => {
  return currentView.value === 'list' ? t('transactionResults.transactionRecords') : t('transactionResults.pointsStatistics')
})

// 当前UTC时间
const currentUtcTime = computed(() => {
  return new Date().toISOString().split('T')[0] + ' ' + new Date().toISOString().split('T')[1].split('.')[0] + ' UTC'
})

// 获取最近15天的日期列表（UTC时间，从昨天往前推15日）
const getLast15Days = () => {
  const days = []
  const utcNow = new Date()

  // 获取UTC昨天日期作为基准（前一天往前推15日）
  const utcYesterday = new Date(Date.UTC(
    utcNow.getUTCFullYear(),
    utcNow.getUTCMonth(),
    utcNow.getUTCDate() - 1
  ))

  for (let i = 14; i >= 0; i--) {
    const date = new Date(utcYesterday)
    date.setUTCDate(date.getUTCDate() - i)
    days.push(date.toISOString().split('T')[0])
  }

  return days
}

// 获取每日积分调整数据（额外调整金额）
const getDailyPointsAdjustments = () => {
  if (!currentAddress.value) return {}
  return pointsCache.get(`points_adjustments_${currentAddress.value.toLowerCase()}`) || {}
}

// 获取每日余额积分设置
const getDailyBalancePointsSetting = () => {
  if (!currentAddress.value) return 2
  return pointsCache.get(`daily_balance_points_${currentAddress.value.toLowerCase()}`) || 2
}

// 每日积分数据计算（15日滚动窗口）
const dailyPointsData = computed(() => {
  // 使用 forceUpdateKey 来强制重新计算
  forceUpdateKey.value

  const last15Days = getLast15Days()
  const pointsAdjustments = getDailyPointsAdjustments()

  // 获取UTC昨日日期（最新的统计日期）
  const utcNow = new Date()
  const utcYesterday = new Date(Date.UTC(
    utcNow.getUTCFullYear(),
    utcNow.getUTCMonth(),
    utcNow.getUTCDate() - 1
  )).toISOString().split('T')[0]

  // 创建交易数据的日期映射
  const transactionDataMap = new Map()
  if (transactionData.value) {
    transactionData.value.forEach(day => {
      if (day.statistics && day.statistics.points !== undefined) {
        transactionDataMap.set(day.date, day.statistics.points)
      }
    })
  }

  return last15Days.map(date => {
    const transactionPoints = transactionDataMap.get(date) || 0
    const balancePoints = dailyBalancePoints.value
    const adjustmentAmount = pointsAdjustments[date] || 0
    const dailyTotal = transactionPoints + balancePoints + adjustmentAmount

    return {
      date,
      transactionPoints: Math.round(transactionPoints * 100) / 100,
      balancePoints: Math.round(balancePoints * 100) / 100,
      adjustmentAmount: Math.round(adjustmentAmount * 100) / 100,
      dailyTotal: Math.round(dailyTotal * 100) / 100,
      hasAdjustment: pointsAdjustments[date] !== undefined,
      isLatest: date === utcYesterday
    }
  }).reverse() // 反转数组，让最新的日期在前
})

// 积分统计汇总
const pointsStatistics = computed(() => {
  const data = dailyPointsData.value
  if (data.length === 0) {
    return {
      totalTransactionPoints: 0,
      totalBalancePoints: 0,
      totalAdjustmentAmount: 0,
      totalPoints: 0,
      activeDays: 15
    }
  }

  const totalTransactionPoints = data.reduce((sum, day) => sum + day.transactionPoints, 0)
  const totalBalancePoints = data.reduce((sum, day) => sum + day.balancePoints, 0)
  const totalAdjustmentAmount = data.reduce((sum, day) => sum + day.adjustmentAmount, 0)
  const totalPoints = totalTransactionPoints + totalBalancePoints + totalAdjustmentAmount

  return {
    totalTransactionPoints: Math.round(totalTransactionPoints * 100) / 100,
    totalBalancePoints: Math.round(totalBalancePoints * 100) / 100,
    totalAdjustmentAmount: Math.round(totalAdjustmentAmount * 100) / 100,
    totalPoints: Math.round(totalPoints * 100) / 100,
    activeDays: 15
  }
})

// Function to format numbers for better readability
const formatNumber = (num) => {
  if (num === null || num === undefined) return '0.00'
  return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const formatPrice = (num) => {
    if (num === null || num === undefined) return 'N/A';
    if (num < 0.01) {
        return num.toPrecision(4);
    }
    return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 });
};

const formatPoints = (num) => {
    if (num === null || num === undefined) return '0';
    return Math.round(num * 100) / 100;
};

const formatGas = (num) => {
    if (num === null || num === undefined) return '0.000000';
    if (num < 0.000001) {
        return num.toExponential(2);
    }
    return num.toLocaleString(undefined, { minimumFractionDigits: 6, maximumFractionDigits: 6 });
};

// 积分调整相关方法
const adjustDailyPoints = async (date, currentAdjustment) => {
  try {
    const { value } = await ElMessageBox.prompt(
      t('transactionResults.adjustPointsPrompt', { date, currentPoints: currentAdjustment }),
      t('transactionResults.adjustDailyPoints'),
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        inputValue: currentAdjustment,
        inputValidator: (val) => !isNaN(parseFloat(val)),
        inputErrorMessage: t('transactionResults.invalidPointsInput')
      }
    )

    const newAdjustment = parseFloat(value)
    const adjustments = getDailyPointsAdjustments()

    if (newAdjustment === 0) {
      delete adjustments[date]
    } else {
      adjustments[date] = newAdjustment
    }

    pointsCache.set(`points_adjustments_${currentAddress.value.toLowerCase()}`, adjustments)

    // 强制更新数据
    forceUpdateKey.value++

    ElMessage.success(t('transactionResults.pointsAdjusted', { date, points: newAdjustment }))

  } catch {
    ElMessage.info(t('common.cancelled'))
  }
}

const resetDailyPoints = async (date) => {
  try {
    await ElMessageBox.confirm(
      t('transactionResults.resetPointsConfirm', { date }),
      t('transactionResults.resetPoints'),
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        type: 'warning'
      }
    )

    const adjustments = getDailyPointsAdjustments()
    delete adjustments[date]

    pointsCache.set(`points_adjustments_${currentAddress.value.toLowerCase()}`, adjustments)

    // 强制更新数据
    forceUpdateKey.value++

    ElMessage.success(t('transactionResults.pointsReset', { date }))

  } catch {
    ElMessage.info(t('common.cancelled'))
  }
}

const saveDailyBalancePoints = () => {
  if (!currentAddress.value) return

  pointsCache.set(`daily_balance_points_${currentAddress.value.toLowerCase()}`, dailyBalancePoints.value)

  // 强制更新数据
  forceUpdateKey.value++

  ElMessage.success(t('transactionResults.globalSpentPointsSaved'))
}

const resetAllPointsAdjustments = async () => {
  try {
    await ElMessageBox.confirm(
      t('transactionResults.resetAllConfirm'),
      t('transactionResults.resetAllPoints'),
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        type: 'warning'
      }
    )

    // 清除所有调整
    pointsCache.remove(`points_adjustments_${currentAddress.value.toLowerCase()}`)
    pointsCache.remove(`daily_balance_points_${currentAddress.value.toLowerCase()}`)

    // 重置本地数据
    dailyBalancePoints.value = 2

    // 强制更新数据
    forceUpdateKey.value++

    ElMessage.success(t('transactionResults.allPointsReset'))

  } catch {
    ElMessage.info(t('common.cancelled'))
  }
}

// 加载积分设置
const loadPointsSettings = () => {
  if (!currentAddress.value) return
  dailyBalancePoints.value = getDailyBalancePointsSetting()
  loadPredictionSettings()

  // 设置默认预测日期为今天
  if (!predictionDate.value) {
    const utcNow = new Date()
    const today = new Date(Date.UTC(
      utcNow.getUTCFullYear(),
      utcNow.getUTCMonth(),
      utcNow.getUTCDate()
    ))
    predictionDate.value = today.toISOString().split('T')[0]
    calculateDatePrediction()
  }
}

// 预测功能相关方法
const loadPredictionSettings = () => {
  if (!currentAddress.value) return

  const settings = pointsCache.get(`prediction_settings_${currentAddress.value.toLowerCase()}`)
  if (settings) {
    predictedDailyPoints.value = settings.predictedDailyPoints || 3
    targetPoints.value = settings.targetPoints || 100
  }
}

const savePredictionSettings = () => {
  if (!currentAddress.value) return

  const settings = {
    predictedDailyPoints: predictedDailyPoints.value,
    targetPoints: targetPoints.value
  }

  pointsCache.set(`prediction_settings_${currentAddress.value.toLowerCase()}`, settings)

  // 强制重新计算预测结果
  forceUpdateKey.value++

  // 等待下一个tick再计算，确保数据已更新
  nextTick(() => {
    if (predictionDate.value) {
      calculateDatePrediction()
    }
    calculateTargetAchievement()
  })
}

const getMinPredictionDate = () => {
  const utcNow = new Date()
  const tomorrow = new Date(Date.UTC(
    utcNow.getUTCFullYear(),
    utcNow.getUTCMonth(),
    utcNow.getUTCDate() + 1
  ))
  return tomorrow.toISOString().split('T')[0]
}

const calculateDatePrediction = () => {
  if (!predictionDate.value) return

  const targetDate = new Date(predictionDate.value + 'T00:00:00Z')
  const utcNow = new Date()
  const utcToday = new Date(Date.UTC(
    utcNow.getUTCFullYear(),
    utcNow.getUTCMonth(),
    utcNow.getUTCDate()
  ))

  // 计算从今天到目标日期的天数
  const daysDiff = Math.ceil((targetDate.getTime() - utcToday.getTime()) / (1000 * 60 * 60 * 24))

  if (daysDiff <= 0) {
    const currentTotal = pointsStatistics.value.totalPoints
    datePredictionResult.value = {
      predictedPoints: currentTotal,
      currentPoints: currentTotal,
      futurePoints: 0,
      rollingNote: ''
    }
    return
  }

  // 计算滚动窗口的影响
  const { predictedPoints, lostPoints, gainedPoints } = calculateRollingPrediction(daysDiff)

  datePredictionResult.value = {
    predictedPoints: Math.round(predictedPoints * 100) / 100,
    currentPoints: pointsStatistics.value.totalPoints,
    futurePoints: Math.round(gainedPoints * 100) / 100,
    lostPoints: Math.round(lostPoints * 100) / 100,
    rollingNote: lostPoints > 0 ? t('transactionResults.rollingWindowNote', { lostPoints: Math.round(lostPoints * 100) / 100 }) : ''
  }
}

// 计算考虑滚动窗口的预测
const calculateRollingPrediction = (daysDiff) => {
  const currentTotal = pointsStatistics.value.totalPoints
  const dailyData = dailyPointsData.value

  // 计算未来获得的积分
  const gainedPoints = daysDiff * predictedDailyPoints.value

  // 计算因滚动窗口失效的积分
  let lostPoints = 0

  if (daysDiff > 0) {
    // 当预测的天数超过当前窗口边界时，最早的数据会被滚出
    const currentWindowDays = dailyData.length // 当前窗口内的天数

    if (daysDiff > 0) {
      // 需要找出会被滚出窗口的最旧数据
      const numDaysToLose = Math.min(daysDiff, currentWindowDays)

      // 从最旧的数据开始计算失效积分
      for (let i = 0; i < numDaysToLose; i++) {
        const dayData = dailyData[i] // 最早的数据在数组前面
        if (dayData) {
          lostPoints += dayData.dailyTotal
          console.log(`Day ${i + 1} rolling out: ${dayData.date}, points: ${dayData.dailyTotal} (tx: ${dayData.transactionPoints}, balance: ${dayData.balancePoints}, adj: ${dayData.adjustmentAmount})`)
        }
      }

      console.log(`Rolling prediction for ${daysDiff} days: current=${currentTotal}, gained=${gainedPoints}, lost=${lostPoints}, final=${currentTotal + gainedPoints - lostPoints}`)
    }
  }

  const predictedPoints = currentTotal + gainedPoints - lostPoints

  return { predictedPoints, lostPoints, gainedPoints }
}

const calculateTargetAchievement = () => {
  if (targetPoints.value <= 0) return

  const currentTotal = pointsStatistics.value.totalPoints

  if (currentTotal >= targetPoints.value) {
    targetPredictionResult.value = {
      canAchieve: false,
      achievementDate: '',
      daysNeeded: 0,
      remainingPoints: 0,
      isAlreadyAchieved: true
    }
    return
  }

  // 计算理论最大积分（15日窗口）
  const theoreticalMaxPoints = predictedDailyPoints.value * 15

  // 如果目标积分超过理论最大值，直接返回无法达成
  if (targetPoints.value > theoreticalMaxPoints) {
    const remainingPoints = targetPoints.value - currentTotal
    targetPredictionResult.value = {
      canAchieve: false,
      achievementDate: '',
      daysNeeded: 0,
      remainingPoints: Math.round(remainingPoints * 100) / 100,
      isAlreadyAchieved: false,
      rollingWarning: t('transactionResults.theoreticalMaxWarning', {
        maxPoints: theoreticalMaxPoints,
        dailyPoints: predictedDailyPoints.value
      })
    }
    return
  }

  // 使用迭代方法找到达成目标的最短时间，考虑滚动窗口
  let canAchieve = false
  let daysNeeded = 0
  let achievementDate = ''
  let maxPointsReached = 0

  // 最多尝试365天（避免无限循环）
  for (let days = 1; days <= 365; days++) {
    const { predictedPoints } = calculateRollingPrediction(days)
    maxPointsReached = Math.max(maxPointsReached, predictedPoints)

    if (predictedPoints >= targetPoints.value) {
      canAchieve = true
      daysNeeded = days

      const utcNow = new Date()
      const targetDate = new Date(Date.UTC(
        utcNow.getUTCFullYear(),
        utcNow.getUTCMonth(),
        utcNow.getUTCDate() + days
      ))
      achievementDate = targetDate.toISOString().split('T')[0]
      break
    }

    // 如果连续多天都没有增长，说明已经达到平衡点
    if (days > 30 && Math.abs(predictedPoints - maxPointsReached) < 0.01) {
      break
    }
  }

  const remainingPoints = targetPoints.value - currentTotal

  targetPredictionResult.value = {
    canAchieve,
    achievementDate,
    daysNeeded,
    remainingPoints: Math.round(remainingPoints * 100) / 100,
    isAlreadyAchieved: false,
    rollingWarning: !canAchieve ? t('transactionResults.rollingWindowWarning') : '',
    maxPointsReached: Math.round(maxPointsReached * 100) / 100
  }
}

// Wrapper for the store action to track which day is being processed
const calculateDailyStatisticsForDay = async (day) => {
    dayBeingProcessed.value = day.date;
    try {
        await bscStore.calculateDailyStatistics(day);
    } finally {
        dayBeingProcessed.value = null;
    }
}

// Refresh data function
const refreshData = () => {
  if (currentAddress.value) {
    bscStore.fetchAndProcessTransactions(currentAddress.value, true)
  }
}

// Fetch initial data on component mount or when route changes
onMounted(() => {
  const address = route.params.address
  if (address && address !== currentAddress.value) {
    bscStore.fetchAndProcessTransactions(address)
  }
  loadPointsSettings()
})

watch(() => route.params.address, (newAddress) => {
    if (newAddress && newAddress !== currentAddress.value) {
        bscStore.fetchAndProcessTransactions(newAddress);
    }
});

// 监听当前地址变化，加载对应的积分设置
watch(currentAddress, () => {
  loadPointsSettings()
})

// 监听积分统计变化，自动重新计算预测
watch(pointsStatistics, () => {
  if (predictionDate.value) {
    calculateDatePrediction()
  }
  calculateTargetAchievement()
}, { deep: true })

// 监听目标积分变化，自动重新计算
watch(targetPoints, () => {
  calculateTargetAchievement()
})

// 监听预测每日积分变化，自动重新计算
watch(predictedDailyPoints, () => {
  if (predictionDate.value) {
    calculateDatePrediction()
  }
  calculateTargetAchievement()
})

// Function to toggle day expansion
const toggleDayExpansion = (date) => {
  if (expandedDays.value.has(date)) {
    expandedDays.value.delete(date);
  } else {
    expandedDays.value.add(date);
  }
}
</script>

<style scoped>
/* Scoped styles for any specific adjustments */
.shadow-inner {
    box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05);
}
</style>
