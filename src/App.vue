<template>
  <div class="flex h-screen font-sans">
    <!-- Sidebar -->
    <div
      :class="[
        'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col transition-all duration-300 ease-in-out z-30 border-r border-gray-700 shadow-xl',
        // 移动端样式
        isMobile ? [
          'fixed top-0 left-0 h-full transform md:transform-none',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'w-72'
        ] : [
          // 桌面端样式
          'relative',
          sidebarCollapsed ? 'w-16' : 'w-72'
        ]
      ]"
    >
      <!-- 侧栏头部 -->
      <div class="px-6 py-8 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        <div class="absolute inset-0 bg-black opacity-10"></div>
        <div class="relative flex items-center justify-between">
          <h1
            :class="[
              'font-bold flex items-center transition-all duration-300 text-white',
              (isMobile || !sidebarCollapsed) ? 'text-2xl' : 'text-lg'
            ]"
          >
            <span class="inline-block w-10 h-10 bg-white text-blue-600 rounded-xl mr-3 flex items-center justify-center flex-shrink-0 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4-8-4V7l8 4 8-4z" />
              </svg>
            </span>
            <span
              v-show="isMobile || !sidebarCollapsed"
              class="transition-opacity duration-300 font-extrabold tracking-wide"
            >
              {{ $t('app.title') }}
            </span>
          </h1>

          <!-- 移动端关闭按钮 -->
          <button
            v-if="isMobile"
            @click="sidebarOpen = false"
            class="text-white hover:text-gray-200 transition-colors p-2 rounded-lg hover:bg-white hover:bg-opacity-20"
          >
            <i class="fas fa-times text-lg"></i>
          </button>
        </div>
      </div>

      <!-- 导航菜单 -->
      <nav class="flex-1 px-6 py-6 space-y-3 overflow-y-auto">
        <router-link
          v-for="item in menuItems"
          :key="item.name"
          :to="item.path"
          @click="handleMenuClick"
          :class="[
            'flex items-center px-4 py-4 rounded-xl transition-all duration-300 group relative backdrop-blur-sm',
            isActiveRoute(item.path)
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105'
              : 'text-gray-300 hover:bg-white hover:bg-opacity-10 hover:text-white hover:transform hover:scale-105 hover:shadow-md'
          ]"
        >
          <i :class="['text-center flex-shrink-0 text-lg', item.icon, (isMobile || !sidebarCollapsed) ? 'w-8' : 'w-6']"></i>
          <span
            v-show="isMobile || !sidebarCollapsed"
            :class="[
              'ml-4 transition-all duration-300 font-medium',
              (isMobile || !sidebarCollapsed) ? 'text-base' : 'text-sm'
            ]"
          >
            {{ item.name }}
          </span>

          <!-- 活跃状态指示器 -->
          <div
            v-if="isActiveRoute(item.path) && (isMobile || !sidebarCollapsed)"
            class="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"
          ></div>

          <!-- 收缩状态下的工具提示 -->
          <div
            v-if="!isMobile && sidebarCollapsed"
            class="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 shadow-xl border border-gray-700"
          >
            {{ item.name }}
            <div class="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45 border-l border-b border-gray-700"></div>
          </div>
        </router-link>
      </nav>



      <!-- 桌面端侧栏底部区域 -->
      <div v-if="!isMobile" class="px-6 py-6 border-t border-gray-700 border-opacity-50 space-y-4">
        <!-- 语言切换器 -->
        <div v-show="!sidebarCollapsed" class="flex justify-center">
          <LanguageSwitcher />
        </div>

        <!-- 收缩按钮 -->
        <button
          @click="toggleSidebar"
          class="w-full flex items-center justify-center px-4 py-3 text-gray-300 hover:text-white hover:bg-white hover:bg-opacity-10 rounded-xl transition-all duration-300 group backdrop-blur-sm"
        >
          <i :class="['fas text-lg transition-transform duration-300 group-hover:scale-110', sidebarCollapsed ? 'fa-chevron-right' : 'fa-chevron-left']"></i>
          <span v-show="!sidebarCollapsed" class="ml-3 font-medium">{{ $t('nav.collapseSidebar') }}</span>
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div
      class="flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out"
      :class="isMobile && sidebarOpen ? 'filter blur-sm' : 'bg-gray-50'"
    >
      <!-- 移动端顶部栏 -->
      <header v-if="isMobile" class="bg-white shadow-md px-4 py-4 flex items-center justify-between border-b border-gray-200 relative z-10">
        <button
          @click="sidebarOpen = true"
          class="text-gray-600 hover:text-gray-900 transition-all duration-200 p-2 rounded-lg hover:bg-gray-100"
        >
          <i class="fas fa-bars text-lg"></i>
        </button>
        <h2 class="text-lg font-bold text-gray-800 tracking-wide">{{ $t('app.title') }}</h2>
        <div class="flex items-center space-x-2">
          <LanguageSwitcher />
        </div>
      </header>

      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterView, useRoute, RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'

const route = useRoute()
const { t } = useI18n()

// 响应式状态
const sidebarCollapsed = ref(false)
const sidebarOpen = ref(false)
const windowWidth = ref(window.innerWidth)

// 计算属性
const isMobile = computed(() => windowWidth.value < 768)

// 菜单项配置 - 使用国际化
const menuItems = computed(() => [
  { name: t('nav.home'), path: '/', icon: 'fas fa-home' },
  // { name: t('nav.airdropPreview'), path: '/airdrop-preview', icon: 'fas fa-parachute-box' }, // 暂时隐藏
  { name: t('nav.alphaPointsRules'), path: '/alpha-points-rules', icon: 'fas fa-award' },
  { name: t('nav.settings'), path: '/settings', icon: 'fas fa-cog' },
])

// 方法
const isActiveRoute = (path) => {
  return route.path === path
}

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
  // 保存状态到本地存储
  localStorage.setItem('sidebarCollapsed', sidebarCollapsed.value.toString())
}

const handleMenuClick = () => {
  // 移动端点击菜单项后关闭侧栏
  if (isMobile.value) {
    sidebarOpen.value = false
  }
}

const handleResize = () => {
  windowWidth.value = window.innerWidth
  // 桌面端时关闭移动端侧栏
  if (!isMobile.value) {
    sidebarOpen.value = false
  }
}

// 生命周期
onMounted(() => {
  // 从本地存储恢复侧栏状态
  const savedState = localStorage.getItem('sidebarCollapsed')
  if (savedState !== null) {
    sidebarCollapsed.value = savedState === 'true'
  }

  // 添加窗口大小监听
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style>
/* Font Awesome for icons */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 自定义滚动条样式 */
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

/* 过渡动画优化 */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* 工具提示箭头 */
.group:hover .absolute::before {
  content: '';
  position: absolute;
  top: 50%;
  left: -4px;
  transform: translateY(-50%);
  border: 4px solid transparent;
  border-right-color: #374151;
}
</style>

