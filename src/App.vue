<script setup>
import { RouterView } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 屏幕尺寸检测
const isMobile = ref(false)
const isMenuOpen = ref(false)

// 菜单项配置
const menuItems = [
  { path: '/', name: 'home', label: '首页', icon: 'fas fa-home' },
  { path: '/statistics', name: 'statistics', label: '统计', icon: 'fas fa-chart-bar' },
  { path: '/settings', name: 'settings', label: '设置', icon: 'fas fa-cog' },
  { path: '/help', name: 'help', label: '帮助', icon: 'fas fa-question-circle' }
]

// 检测屏幕尺寸
const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 768
}

// 导航到指定路径
const navigateTo = (path) => {
  router.push(path)
  isMenuOpen.value = false
}

// 切换菜单
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

// 关闭菜单
const closeMenu = () => {
  isMenuOpen.value = false
}

// 判断当前路由是否激活
const isActiveRoute = (path) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})
</script>

<template>
  <div id="app">
    <!-- PC端顶部导航栏 -->
    <nav v-if="!isMobile" class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-bold text-gray-800 mr-8">BSC交易查询工具</h1>

            <!-- Tab 导航 -->
            <div class="flex space-x-8">
              <button
                v-for="item in menuItems"
                :key="item.path"
                @click="navigateTo(item.path)"
                :class="[
                  'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200',
                  isActiveRoute(item.path)
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                ]"
              >
                <i :class="item.icon" class="mr-2"></i>
                {{ item.label }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- 移动端顶部导航栏 -->
    <nav v-if="isMobile" class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div class="px-4 h-16 flex items-center justify-between">
        <!-- 菜单按钮 -->
        <button
          @click="toggleMenu"
          class="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        >
          <i class="fas fa-bars text-xl"></i>
        </button>

        <!-- 标题 -->
        <h1 class="text-lg font-semibold text-gray-800">BSC查询工具</h1>

        <!-- 占位符保持平衡 -->
        <div class="w-10"></div>
      </div>
    </nav>

    <!-- 移动端侧边抽屉菜单 -->
    <div
      v-if="isMobile"
      :class="[
        'fixed inset-0 z-50 transition-opacity duration-300',
        isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      ]"
    >
      <!-- 遮罩层 -->
      <div
        @click="closeMenu"
        :class="[
          'absolute inset-0 bg-black transition-opacity duration-300',
          isMenuOpen ? 'opacity-50' : 'opacity-0'
        ]"
      ></div>

      <!-- 抽屉内容 -->
      <div
        :class="[
          'absolute left-0 top-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out',
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        ]"
      >
        <!-- 抽屉头部 -->
        <div class="h-16 bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-between px-4">
          <h2 class="text-white font-semibold">菜单</h2>
          <button @click="closeMenu" class="text-white p-1">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <!-- 菜单项 -->
        <div class="py-4">
          <button
            v-for="item in menuItems"
            :key="item.path"
            @click="navigateTo(item.path)"
            :class="[
              'w-full flex items-center px-6 py-3 text-left transition-colors duration-200',
              isActiveRoute(item.path)
                ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                : 'text-gray-700 hover:bg-gray-50'
            ]"
          >
            <i :class="item.icon" class="w-5 mr-3"></i>
            {{ item.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <main class="flex-1">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 确保页面内容不被固定导航遮挡 */
main {
  flex: 1;
}

/* 平滑过渡效果 */
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

.transition-opacity {
  transition-property: opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.transition-transform {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* 移动端菜单按钮点击效果 */
button:active {
  transform: scale(0.95);
}

/* 抽屉阴影效果 */
.shadow-xl {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
</style>
