<template>
  <div class="language-switcher-modern">
    <!-- 开关式语言切换器 -->
    <div
      @click="toggleLanguage"
      class="language-toggle"
      :class="{ 'toggle-active': currentLanguage === 'en-US' }"
    >
      <!-- 背景轨道 -->
      <div class="toggle-track">
        <!-- 滑动按钮 -->
        <div class="toggle-thumb">
          <span class="toggle-flag">{{ currentLocale.flag }}</span>
        </div>

        <!-- 语言标签 -->
        <div class="language-labels">
          <span
            class="lang-label lang-left"
            :class="{ 'label-active': currentLanguage === 'zh-CN' }"
          >
            中
          </span>
          <span
            class="lang-label lang-right"
            :class="{ 'label-active': currentLanguage === 'en-US' }"
          >
            EN
          </span>
        </div>
      </div>

      <!-- 悬浮提示 -->
      <div class="tooltip">
        {{ currentLocale.name }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { supportedLocales, saveLocale } from '@/locales/index.js'

// 国际化
const { locale } = useI18n()

// 计算属性
const currentLanguage = computed(() => locale.value)
const currentLocale = computed(() => {
  return supportedLocales.find(l => l.code === currentLanguage.value) || supportedLocales[0]
})

// 方法
const toggleLanguage = () => {
  const newLocale = currentLanguage.value === 'zh-CN' ? 'en-US' : 'zh-CN'
  locale.value = newLocale
  saveLocale(newLocale)
}
</script>

<style scoped>
.language-switcher-modern {
  display: inline-block;
  user-select: none;
}

.language-toggle {
  position: relative;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
}

.language-toggle:hover .tooltip {
  opacity: 1;
  transform: translateY(-8px);
  visibility: visible;
}

.toggle-track {
  position: relative;
  width: 72px;
  height: 36px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 18px;
  overflow: hidden;
  box-shadow:
    0 4px 12px rgba(102, 126, 234, 0.4),
    inset 0 2px 4px rgba(255, 255, 255, 0.1);
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  will-change: background, box-shadow, transform;
}

.language-toggle.toggle-active .toggle-track {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  box-shadow:
    0 4px 12px rgba(245, 87, 108, 0.4),
    inset 0 2px 4px rgba(255, 255, 255, 0.1);
}

.toggle-thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 30px;
  height: 30px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.7s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.15),
    0 1px 3px rgba(0, 0, 0, 0.2);
  z-index: 10;
  will-change: transform;
}

.language-toggle.toggle-active .toggle-thumb {
  transform: translateX(36px);
}

.toggle-flag {
  font-size: 16px;
  transition: opacity 0.3s ease;
}

.language-labels {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  pointer-events: none;
}

.lang-label {
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  will-change: transform, color;
}

.lang-label.label-active {
  color: rgba(255, 255, 255, 0.9);
  transform: scale(1.1);
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
}

.lang-left {
  margin-left: 2px;
}

.lang-right {
  margin-right: 2px;
}

.tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(-4px);
  background: rgba(17, 24, 39, 0.95);
  color: white;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 50;
}

.tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 4px solid transparent;
  border-top-color: rgba(17, 24, 39, 0.95);
}

/* 悬浮效果 */
.language-toggle:hover .toggle-track {
  transform: scale(1.05);
  box-shadow:
    0 6px 20px rgba(102, 126, 234, 0.5),
    inset 0 2px 4px rgba(255, 255, 255, 0.1);
}

.language-toggle.toggle-active:hover .toggle-track {
  box-shadow:
    0 6px 20px rgba(245, 87, 108, 0.5),
    inset 0 2px 4px rgba(255, 255, 255, 0.1);
}

.language-toggle:hover .toggle-thumb {
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.25),
    0 2px 6px rgba(0, 0, 0, 0.15);
}

/* 按压反馈动画 */
@keyframes press-feedback {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.95);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes track-squeeze {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scaleY(0.9) scaleX(1.02);
  }
  100% {
    transform: scale(1);
  }
}

.language-toggle:active .toggle-thumb {
  animation: press-feedback 0.2s ease-out;
}

.language-toggle:active .toggle-track {
  animation: track-squeeze 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* 增强弹性效果 */
.language-toggle.toggle-active .toggle-thumb {
  transform: translateX(36px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .toggle-track {
    width: 64px;
    height: 32px;
    border-radius: 16px;
  }

  .toggle-thumb {
    width: 26px;
    height: 26px;
    top: 3px;
    left: 3px;
  }

  .language-toggle.toggle-active .toggle-thumb {
    transform: translateX(32px);
  }

  .toggle-flag {
    font-size: 14px;
  }

  .lang-label {
    font-size: 10px;
  }

  .language-labels {
    padding: 0 10px;
  }
}
</style>
