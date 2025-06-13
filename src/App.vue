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
          sidebarCollapsed ? 'w-16 min-w-16' : 'w-72 min-w-72'
        ]
      ]"
    >
      <!-- 侧栏头部 -->
      <div
        :class="[
          'bg-gradient-to-r from-gray-800 to-gray-700 relative overflow-hidden',
          sidebarCollapsed && !isMobile ? 'px-2 py-6' : 'px-6 py-8'
        ]"
      >
        <div class="absolute inset-0 bg-black opacity-10"></div>
        <div
          :class="[
            'relative flex items-center',
            sidebarCollapsed && !isMobile ? 'justify-center' : 'justify-between'
          ]"
        >
          <h1
            :class="[
              'font-bold flex items-center transition-all duration-300 text-white',
              sidebarCollapsed && !isMobile ? 'text-lg justify-center' : 'text-2xl'
            ]"
          >
            <span
              :class="[
                'inline-block flex items-center justify-center flex-shrink-0',
                sidebarCollapsed && !isMobile ? 'w-8 h-8' : 'w-10 h-10 mr-3'
              ]"
            >
              <!-- 图片Logo - 如果有logo图片则显示，否则显示SVG -->
              <img
                v-if="logoImagePath"
                :src="logoImagePath"
                :alt="$t('app.title')"
                :class="[
                  'object-contain w-full h-full'
                ]"
              />
              <!-- 默认SVG Logo -->
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                :class="[sidebarCollapsed && !isMobile ? 'h-5 w-5' : 'h-6 w-6']"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2.5"
              >
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
      <nav
        :class="[
          'flex-1 py-6 space-y-3',
          sidebarCollapsed && !isMobile ? 'px-2 overflow-visible' : 'px-6 overflow-y-auto'
        ]"
      >
        <router-link
          v-for="item in menuItems"
          :key="item.name"
          :to="item.path"
          @click="handleMenuClick"
          :class="[
            'flex items-center rounded-xl transition-all duration-300 group relative backdrop-blur-sm',
            sidebarCollapsed && !isMobile ? 'px-3 py-3 justify-center' : 'px-4 py-4',
            isActiveRoute(item.path)
              ? 'bg-gradient-to-r from-gray-700 to-gray-600 text-white shadow-lg'
              : 'text-gray-300 hover:bg-gray-700 hover:bg-opacity-60 hover:text-white hover:shadow-md'
          ]"
        >
          <!-- 图标容器 -->
          <div
            :class="[
              'flex items-center justify-center flex-shrink-0',
              sidebarCollapsed && !isMobile ? 'w-6 h-6' : 'w-8 h-8'
            ]"
          >
            <i :class="['text-lg', item.icon]"></i>
          </div>

          <!-- 文字标签 -->
          <span
            v-show="isMobile || !sidebarCollapsed"
            class="ml-4 transition-all duration-300 font-medium text-base"
          >
            {{ item.name }}
          </span>

          <!-- 活跃状态指示器 -->
          <div
            v-if="isActiveRoute(item.path) && (isMobile || !sidebarCollapsed)"
            class="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"
          ></div>

          <!-- 收缩状态下的活跃指示器 -->
          <div
            v-if="isActiveRoute(item.path) && !isMobile && sidebarCollapsed"
            class="absolute right-1 top-1/2 transform -translate-y-1/2 w-0.5 h-6 bg-white rounded-full"
          ></div>

          <!-- 收缩状态下的工具提示 -->
          <div
            v-if="!isMobile && sidebarCollapsed"
            class="absolute left-full ml-6 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 shadow-xl border border-gray-700"
          >
            {{ item.name }}
            <div class="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45 border-l border-b border-gray-700"></div>
          </div>
        </router-link>
      </nav>



            <!-- 桌面端侧栏底部区域 -->
            <div
        v-if="!isMobile"
        :class="[
          'border-t border-gray-700 border-opacity-50',
          sidebarCollapsed ? 'px-0 py-4 space-y-3' : 'px-6 py-6 space-y-4'
        ]"
        style="overflow: visible;"
      >
                                <!-- 语言切换器 - 统一位置 -->
        <div
          class="flex justify-center"
          style="min-height: 40px; overflow: visible;"
        >
          <div
            :class="[
              'language-switcher-container transition-all duration-300',
              sidebarCollapsed ? 'scale-75' : ''
            ]"
          >
            <LanguageSwitcher />
          </div>
        </div>

        <!-- 收缩按钮 -->
        <button
          @click="toggleSidebar"
          :class="[
            'w-full flex items-center transition-all duration-300 group backdrop-blur-sm text-gray-300 hover:text-white hover:bg-gray-700 hover:bg-opacity-60 rounded-xl',
            sidebarCollapsed ? 'justify-center px-2 py-3' : 'justify-center px-4 py-3'
          ]"
        >
          <div
            :class="[
              'flex items-center justify-center',
              sidebarCollapsed ? 'w-6 h-6' : 'w-auto h-auto'
            ]"
          >
            <i :class="['fas text-lg transition-transform duration-300 group-hover:scale-110', sidebarCollapsed ? 'fa-chevron-right' : 'fa-chevron-left']"></i>
          </div>
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

    <StagewiseToolbar v-if="isDev" :config="{ plugins: [VuePlugin] }" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterView, useRoute, RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import logoImage from '@/assets/logo.png'
import { StagewiseToolbar } from '@stagewise/toolbar-vue'
import { VuePlugin } from '@stagewise-plugins/vue'

const route = useRoute()
const { t } = useI18n()

// 开发环境判断
const isDev = import.meta.env.DEV

// 响应式状态
const sidebarCollapsed = ref(false)
const sidebarOpen = ref(false)
const windowWidth = ref(window.innerWidth)

// Logo配置 - 如果您有自定义logo图片，请将路径设置在这里
// 使用import方式引入图片，确保在生产环境中正确打包
// 如果设置为null或空字符串，将显示默认的SVG图标
const logoImagePath = ref(logoImage)

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

/* 侧边栏收缩状态优化 */
.sidebar-collapsed-item {
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 防止收缩时内容溢出 */
.sidebar-nav-collapsed {
  overflow: visible !important;
}

.sidebar-nav-collapsed .router-link-active,
.sidebar-nav-collapsed .router-link-exact-active {
  position: relative;
}

/* 工具提示定位优化 */
.sidebar-tooltip {
  z-index: 9999;
  transform: translateX(0);
}

/* 确保图标居中 */
.icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  min-height: 24px;
}

/* 语言切换器缩放优化 */
.language-switcher-container {
  transform-origin: center center;
  will-change: transform;
}

.language-switcher-container.scale-75 {
  transform: scale(1);
}

/* 修复侧栏导航链接悬浮状态 */
.router-link:hover:not(.router-link-active) {
  background: rgba(55, 65, 81, 0.6) !important;
  color: white !important;
}

.router-link:hover:not(.router-link-active) .fas {
  color: white !important;
}

/* 确保活跃状态下的样式优先级 */
.router-link.router-link-active {
  background: linear-gradient(to right, #374151, #4b5563) !important;
  color: white !important;
}

.router-link.router-link-active .fas {
  color: white !important;
}
</style>

