import { useI18n as useVueI18n } from 'vue-i18n'
import { computed } from 'vue'
import { supportedLocales, saveLocale } from '@/locales/index.js'

/**
 * 国际化组合式函数
 * 提供便捷的国际化工具方法
 */
export function useI18n() {
  const { t, locale, availableLocales } = useVueI18n()

  // 当前语言信息
  const currentLocale = computed(() => {
    return supportedLocales.find(l => l.code === locale.value) || supportedLocales[0]
  })

  // 是否为中文
  const isChinese = computed(() => {
    return locale.value.startsWith('zh')
  })

  // 是否为英文
  const isEnglish = computed(() => {
    return locale.value.startsWith('en')
  })

  // 切换语言
  const switchLanguage = (localeCode) => {
    if (localeCode && localeCode !== locale.value) {
      locale.value = localeCode
      saveLocale(localeCode)
      return true
    }
    return false
  }

  // 获取本地化的日期格式
  const formatDate = (date, options = {}) => {
    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }

    return new Intl.DateTimeFormat(locale.value, { ...defaultOptions, ...options }).format(date)
  }

  // 获取本地化的时间格式
  const formatTime = (date, options = {}) => {
    const defaultOptions = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }

    return new Intl.DateTimeFormat(locale.value, { ...defaultOptions, ...options }).format(date)
  }

  // 获取本地化的日期时间格式
  const formatDateTime = (date, options = {}) => {
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }

    return new Intl.DateTimeFormat(locale.value, { ...defaultOptions, ...options }).format(date)
  }

  // 获取本地化的数字格式
  const formatNumber = (number, options = {}) => {
    return new Intl.NumberFormat(locale.value, options).format(number)
  }

  // 获取本地化的货币格式
  const formatCurrency = (amount, currency = 'USD', options = {}) => {
    const defaultOptions = {
      style: 'currency',
      currency: currency
    }

    return new Intl.NumberFormat(locale.value, { ...defaultOptions, ...options }).format(amount)
  }

  // 获取相对时间格式（如：2小时前）
  const formatRelativeTime = (date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)

    if (diffInSeconds < 60) {
      return t('time.now')
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return t('time.minutesAgo', { minutes })
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return t('time.hoursAgo', { hours })
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400)
      return t('time.daysAgo', { days })
    } else if (diffInSeconds < 2419200) {
      const weeks = Math.floor(diffInSeconds / 604800)
      return t('time.weeksAgo', { weeks })
    } else if (diffInSeconds < 31536000) {
      const months = Math.floor(diffInSeconds / 2419200)
      return t('time.monthsAgo', { months })
    } else {
      const years = Math.floor(diffInSeconds / 31536000)
      return t('time.yearsAgo', { years })
    }
  }

  // 获取语言方向（LTR/RTL）
  const getTextDirection = () => {
    // 大部分语言都是从左到右，如果需要支持阿拉伯语等RTL语言可以在这里扩展
    return 'ltr'
  }

  return {
    // Vue I18n 原生方法
    t,
    locale,
    availableLocales,

    // 扩展的便捷方法
    currentLocale,
    isChinese,
    isEnglish,
    switchLanguage,
    formatDate,
    formatTime,
    formatDateTime,
    formatNumber,
    formatCurrency,
    formatRelativeTime,
    getTextDirection,

    // 支持的语言列表
    supportedLocales
  }
}
