# 多语言支持使用指南

## 概述

本项目已集成 Vue I18n 多语言支持，目前支持中文（简体）和英文两种语言。

## 功能特性

- ✅ 自动语言检测（基于浏览器语言）
- ✅ 语言切换器组件
- ✅ 本地存储语言偏好
- ✅ 响应式语言切换
- ✅ 扩展的国际化工具函数
- ✅ 日期、时间、数字本地化格式

## 支持的语言

| 语言 | 代码 | 状态 |
|------|------|------|
| 简体中文 | zh-CN | ✅ 完整支持 |
| English | en-US | ✅ 完整支持 |

## 使用方法

### 1. 在组件中使用翻译

#### 模板中使用
```vue
<template>
  <div>
    <!-- 基础翻译 -->
    <h1>{{ $t('app.title') }}</h1>
    
    <!-- 带参数的翻译 -->
    <p>{{ $t('time.minutesAgo', { minutes: 5 }) }}</p>
    
    <!-- 属性绑定 -->
    <input :placeholder="$t('home.searchPlaceholder')" />
  </div>
</template>
```

#### 脚本中使用
```vue
<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// 在函数中使用
const showMessage = () => {
  alert(t('common.success'))
}
</script>
```

### 2. 使用扩展的国际化工具

```vue
<script setup>
import { useI18n } from '@/composables/useI18n.js'

const { 
  t, 
  formatDate, 
  formatTime, 
  formatDateTime,
  formatNumber,
  formatCurrency,
  formatRelativeTime,
  isChinese,
  isEnglish,
  switchLanguage 
} = useI18n()

// 格式化日期
const formattedDate = formatDate(new Date()) // 2024年1月15日 (中文) / January 15, 2024 (英文)

// 格式化时间
const formattedTime = formatTime(new Date()) // 14:30:25

// 格式化相对时间
const relativeTime = formatRelativeTime(new Date(Date.now() - 3600000)) // 1小时前 / 1 hour ago

// 格式化数字
const formattedNumber = formatNumber(1234567.89) // 1,234,567.89

// 格式化货币
const formattedCurrency = formatCurrency(1234.56, 'USD') // $1,234.56

// 语言检测
if (isChinese.value) {
  console.log('当前是中文环境')
}

// 切换语言
switchLanguage('en-US')
</script>
```

### 3. 添加语言切换器

```vue
<template>
  <div>
    <!-- 基础语言切换器 -->
    <LanguageSwitcher />
    
    <!-- 移动端语言切换器 -->
    <LanguageSwitcher :is-mobile="true" />
  </div>
</template>

<script setup>
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
</script>
```

## 添加新的翻译内容

### 1. 更新语言包文件

在 `src/locales/zh-CN.js` 中添加中文翻译：
```javascript
export default {
  // 现有内容...
  
  // 新增模块
  newModule: {
    title: '新模块标题',
    description: '新模块描述',
    button: '按钮文本'
  }
}
```

在 `src/locales/en-US.js` 中添加对应的英文翻译：
```javascript
export default {
  // 现有内容...
  
  // 新增模块
  newModule: {
    title: 'New Module Title',
    description: 'New module description',
    button: 'Button Text'
  }
}
```

### 2. 在组件中使用新翻译

```vue
<template>
  <div>
    <h2>{{ $t('newModule.title') }}</h2>
    <p>{{ $t('newModule.description') }}</p>
    <button>{{ $t('newModule.button') }}</button>
  </div>
</template>
```

## 添加新语言支持

### 1. 创建新语言包文件

例如添加日语支持，创建 `src/locales/ja-JP.js`：
```javascript
export default {
  common: {
    confirm: '確認',
    cancel: 'キャンセル',
    // ... 其他翻译
  },
  // ... 完整的翻译内容
}
```

### 2. 更新语言配置

在 `src/locales/index.js` 中添加新语言：
```javascript
import jaJP from './ja-JP.js'

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
  },
  {
    code: 'ja-JP',
    name: '日本語',
    flag: '🇯🇵'
  }
]

const i18n = createI18n({
  // ... 现有配置
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS,
    'ja-JP': jaJP
  }
})
```

## 最佳实践

### 1. 翻译键命名规范
- 使用点分隔的层级结构：`module.section.key`
- 使用驼峰命名：`userProfile.editButton`
- 保持键名简洁且有意义

### 2. 翻译内容规范
- 保持翻译的一致性和准确性
- 考虑不同语言的文本长度差异
- 使用占位符处理动态内容：`{count} items`

### 3. 组件设计考虑
- 为不同语言的文本长度预留足够空间
- 考虑从右到左（RTL）语言的布局需求
- 使用语义化的HTML结构

### 4. 性能优化
- 语言包按需加载（如果包含大量内容）
- 避免在计算属性中频繁调用翻译函数
- 合理使用缓存机制

## 故障排除

### 常见问题

1. **翻译不显示**
   - 检查翻译键是否正确
   - 确认语言包文件是否正确导入
   - 检查浏览器控制台是否有错误信息

2. **语言切换不生效**
   - 确认组件是否正确使用了响应式的翻译
   - 检查本地存储是否正常工作
   - 验证语言代码是否在支持列表中

3. **格式化函数不工作**
   - 确认浏览器是否支持 Intl API
   - 检查传入的参数是否正确
   - 验证语言代码格式是否正确

### 调试技巧

```javascript
// 在浏览器控制台中调试
console.log('当前语言:', this.$i18n.locale)
console.log('可用语言:', this.$i18n.availableLocales)
console.log('翻译结果:', this.$t('some.key'))
```

## 更新日志

- **v1.0.0** (2024-01-15)
  - 初始多语言支持
  - 中英文双语支持
  - 语言切换器组件
  - 扩展的国际化工具函数 