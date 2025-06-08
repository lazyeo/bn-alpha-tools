<template>
  <div class="flex h-screen font-sans">
    <!-- 移动端遮罩层 -->
    <div
      v-if="isMobile && sidebarOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
      @click="sidebarOpen = false"
    ></div>

    <!-- Sidebar -->
    <div
      :class="[
        'bg-gray-900 text-white flex flex-col transition-all duration-300 ease-in-out z-50',
        // 移动端样式
        isMobile ? [
          'fixed top-0 left-0 h-full transform md:transform-none',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'w-64'
        ] : [
          // 桌面端样式
          'relative',
          sidebarCollapsed ? 'w-16' : 'w-64'
        ]
      ]"
    >
      <!-- 侧栏头部 -->
      <div class="px-4 py-6">
        <div class="flex items-center justify-between">
          <h1
            :class="[
              'font-bold flex items-center transition-all duration-300',
              (isMobile || !sidebarCollapsed) ? 'text-2xl' : 'text-lg'
            ]"
          >
            <span class="inline-block w-8 h-8 bg-white text-gray-900 rounded-md mr-3 flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4-8-4V7l8 4 8-4z" />
              </svg>
            </span>
            <span
              v-show="isMobile || !sidebarCollapsed"
              class="transition-opacity duration-300"
            >
              BN Alpha Tools
            </span>
          </h1>

          <!-- 移动端关闭按钮 -->
          <button
            v-if="isMobile"
            @click="sidebarOpen = false"
            class="text-gray-400 hover:text-white transition-colors p-2"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>

      <!-- 导航菜单 -->
      <nav class="flex-1 px-4 py-4 space-y-2">
        <router-link
          v-for="item in menuItems"
          :key="item.name"
          :to="item.path"
          @click="handleMenuClick"
          :class="[
            'flex items-center px-4 py-3 rounded-lg transition-all duration-200 group relative',
            isActiveRoute(item.path)
              ? 'bg-gray-800 text-white'
              : 'text-gray-400 hover:bg-gray-700 hover:text-white'
          ]"
        >
          <i :class="['text-center flex-shrink-0', item.icon, (isMobile || !sidebarCollapsed) ? 'w-8' : 'w-6']"></i>
          <span
            v-show="isMobile || !sidebarCollapsed"
            :class="[
              'ml-3 transition-opacity duration-300',
              (isMobile || !sidebarCollapsed) ? 'text-lg' : 'text-sm'
            ]"
          >
            {{ item.name }}
          </span>

          <!-- 收缩状态下的工具提示 -->
          <div
            v-if="!isMobile && sidebarCollapsed"
            class="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50"
          >
            {{ item.name }}
          </div>
        </router-link>
      </nav>

      <!-- 桌面端收缩按钮 -->
      <div v-if="!isMobile" class="px-4 py-4 border-t border-gray-700">
        <button
          @click="toggleSidebar"
          class="w-full flex items-center justify-center px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200"
        >
          <i :class="['fas', sidebarCollapsed ? 'fa-chevron-right' : 'fa-chevron-left']"></i>
          <span v-show="!sidebarCollapsed" class="ml-3">收缩侧栏</span>
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden bg-gray-100">
      <!-- 移动端顶部栏 -->
      <header v-if="isMobile" class="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
        <button
          @click="sidebarOpen = true"
          class="text-gray-600 hover:text-gray-900 transition-colors p-2"
        >
          <i class="fas fa-bars text-lg"></i>
        </button>
        <h2 class="text-lg font-semibold text-gray-800">BN Alpha Tools</h2>
        <div class="w-10"></div> <!-- 占位符，保持标题居中 -->
      </header>

      <main class="flex-1 overflow-x-hidden overflow-y-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterView, useRoute, RouterLink } from 'vue-router'

const route = useRoute()

// 响应式状态
const sidebarCollapsed = ref(false)
const sidebarOpen = ref(false)
const windowWidth = ref(window.innerWidth)

// 计算属性
const isMobile = computed(() => windowWidth.value < 768)

// 菜单项配置
const menuItems = [
  { name: '首页', path: '/', icon: 'fas fa-home' },
  // { name: '空投预告', path: '/airdrop-preview', icon: 'fas fa-parachute-box' }, // 暂时隐藏
  { name: 'Alpha积分规则', path: '/alpha-points-rules', icon: 'fas fa-award' },
  { name: '设置', path: '/settings', icon: 'fas fa-cog' },
]

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

