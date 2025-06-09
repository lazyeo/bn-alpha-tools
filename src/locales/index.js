import { createI18n } from 'vue-i18n'
import zhCN from './zh-CN.js'
import enUS from './en-US.js'

// 支持的语言列表
export const supportedLocales = [
  {
    code: 'zh-CN',
    name: '简体中文',
    flag: '🇨🇳'
  },
  {
    code: 'en-US',
    name: 'English',
    flag: '🇺🇸'
  }
]

// 获取默认语言
export function getDefaultLocale() {
  // 1. 从localStorage获取用户设置
  const saved = localStorage.getItem('app_locale')
  if (saved && supportedLocales.find(locale => locale.code === saved)) {
    return saved
  }

  // 2. 从浏览器语言检测
  const browserLang = navigator.language || navigator.userLanguage

  // 检查是否直接匹配
  if (supportedLocales.find(locale => locale.code === browserLang)) {
    return browserLang
  }

  // 检查语言前缀匹配 (如 zh 匹配 zh-CN)
  const langPrefix = browserLang.split('-')[0]
  const matchedLocale = supportedLocales.find(locale =>
    locale.code.startsWith(langPrefix)
  )

  if (matchedLocale) {
    return matchedLocale.code
  }

  // 3. 默认返回中文
  return 'zh-CN'
}

// 保存语言设置
export function saveLocale(locale) {
  localStorage.setItem('app_locale', locale)
}

// 创建i18n实例
const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  locale: getDefaultLocale(),
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS
  },
  // 全局属性配置
  globalInjection: true,
  warnHtmlMessage: false
})

export default i18n
