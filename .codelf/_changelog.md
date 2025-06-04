## 2024-12-19 16:00:00

### 1. URL参数化搜索系统

**Change Type**: feature

> **Purpose**: 实现URL参数化搜索，支持页面刷新和URL分享功能
> **Detailed Description**: 修改搜索逻辑，点击搜索时跳转到/results/:address页面而非直接查询。TransactionResults.vue增加从URL参数获取地址并自动查询的功能。用户可以通过刷新页面获取最新数据，也可以分享带参数的URL给他人。
> **Reason for Change**: 用户希望能够刷新页面查看最新数据，同时URL参数化便于分享和书签
> **Impact Scope**: 影响BscHome.vue的搜索逻辑、TransactionResults.vue的数据加载逻辑和路由配置
> **API Changes**: 无API变更
> **Configuration Changes**: 修改router/index.js路由配置
> **Performance Impact**: 优化了数据加载逻辑，减少不必要的重复查询

   ```
   root
   - src
      - views
         - BscHome.vue              // refact 搜索跳转逻辑改为参数化URL
         - TransactionResults.vue   // feature 支持URL参数自动查询
      - router
         - index.js                 // refact 路由配置支持地址参数
   ```

### 2. 自动数据加载和刷新功能

**Change Type**: feature

> **Purpose**: 增强用户体验，支持页面刷新和手动刷新数据
> **Detailed Description**: TransactionResults.vue页面加载时自动检测URL参数中的地址并查询数据。添加刷新按钮，用户可以手动重新获取最新交易数据。支持浏览器刷新页面重新加载数据。
> **Reason for Change**: 提供更灵活的数据获取方式，用户可以随时获取最新数据
> **Impact Scope**: 影响TransactionResults.vue的用户交互和数据管理
> **API Changes**: 无
> **Configuration Changes**: 无
> **Performance Impact**: 优化了数据查询时机，只在需要时进行查询

   ```
   root
   - src
      - views
         - TransactionResults.vue   // feature 自动数据加载和刷新功能
   ```

### 3. 历史记录参数化优化

**Change Type**: improvement

> **Purpose**: 统一搜索体验，历史记录也支持URL参数化
> **Detailed Description**: 修改BscHome.vue中历史记录的点击逻辑，从直接设置输入框值改为跳转到参数化URL。确保所有搜索入口都使用统一的URL参数化方式。
> **Reason for Change**: 保持搜索逻辑的一致性，无论从哪里发起搜索都使用相同的流程
> **Impact Scope**: 影响首页历史记录的交互逻辑
> **API Changes**: 无
> **Configuration Changes**: 无
> **Performance Impact**: 无明显性能影响

   ```
   root
   - src
      - views
         - BscHome.vue              // improvement 历史记录参数化跳转
   ```

## 2024-12-19 15:30:00

### 1. 真正沉浸式融合设计

**Change Type**: feature/improvement

> **Purpose**: 实现菜单背景与页面背景的完全融合，营造无边界沉浸体验
> **Detailed Description**: 将整个应用改为全屏蓝紫渐变背景，导航栏透明度降至2%实现完全穿透。移除所有边框和分割线，添加三层浮动光球动态背景。所有UI元素采用纯白设计语言，配合深度阴影营造浮在背景上的效果。
> **Reason for Change**: 用户希望菜单背景和页面背景融合的沉浸式效果，而非独立分层的设计
> **Impact Scope**: 重构整个应用的视觉架构，从App.vue到所有UI元素的色彩和透明度系统
> **API Changes**: 无API变更
> **Configuration Changes**: 无配置变更
> **Performance Impact**: 增加了全局背景动画，但通过CSS3优化保证流畅性

   ```
   root
   - src
      - App.vue                     // feature 全屏背景融合和无边界设计
   ```

### 2. 全局动态背景系统

**Change Type**: feature

> **Purpose**: 营造生动的空间感和层次感，增强沉浸体验
> **Detailed Description**: 添加三层不同大小和颜色的浮动光球背景，采用8秒循环float动画。设置不同的animation-delay实现错落有致的动画效果。所有背景元素设为pointer-events-none避免交互干扰。
> **Reason for Change**: 静态背景缺乏生动感，需要动态元素增强视觉吸引力和空间层次
> **Impact Scope**: 影响整个应用的背景视觉效果，提升沉浸感和现代化程度
> **API Changes**: 无
> **Configuration Changes**: 无
> **Performance Impact**: 通过CSS3硬件加速优化，性能影响最小

   ```
   root
   - src
      - App.vue                     // feature 全局动态背景装饰系统
   ```

### 3. 纯白设计语言和无边界系统

**Change Type**: improvement

> **Purpose**: 统一视觉语言，实现完全的融合效果
> **Detailed Description**: 将所有Logo、文字、图标、按钮改为纯白色系统，配合深度阴影增强可读性。移除所有nav的边框和box-shadow，采用超透明背景实现无边界效果。增强所有元素的backdrop-filter和阴影效果。
> **Reason for Change**: 原有的彩色设计在融合背景下缺乏一致性，需要统一的视觉语言
> **Impact Scope**: 影响所有导航元素的颜色、边框、阴影和透明度设计
> **API Changes**: 无
> **Configuration Changes**: 无
> **Performance Impact**: 阴影和毛玻璃效果对性能影响极小

   ```
   root
   - src
      - App.vue                     // improvement 纯白设计语言和无边界系统
   ```

## 2024-12-19 15:00:00

### 1. PC端沉浸式导航深度优化

**Change Type**: improvement

> **Purpose**: 解决PC端导航可读性问题，营造极致沉浸式视觉体验
> **Detailed Description**: 大幅增强PC端导航的毛玻璃效果（40px blur），添加动态背景装饰包括浮动光球和多层渐变。提升文字对比度通过阴影和高透明度设计。丰富按钮交互效果包括Y轴位移、光线扫过动画。实现多层光晕系统和智能边框装饰。
> **Reason for Change**: 用户反馈PC端导航看不清楚且背景缺乏沉浸感，需要增强视觉效果和可读性
> **Impact Scope**: 主要影响App.vue的PC端导航部分和相关CSS样式，大幅提升视觉质感
> **API Changes**: 无API变更
> **Configuration Changes**: 无配置变更
> **Performance Impact**: 增加了视觉效果复杂度，但通过CSS3硬件加速保证性能

   ```
   root
   - src
      - App.vue                     // improvement PC端导航深度毛玻璃和动态背景优化
   ```

### 2. 文字对比度和可读性增强

**Change Type**: fix

> **Purpose**: 确保PC端导航文字在任何背景下都清晰可读
> **Detailed Description**: 为text-gray-700和text-gray-800类增加文字阴影效果，提高color透明度到0.9和0.95。移除原有的bg-clip-text渐变文字效果，采用纯色+阴影的高对比度方案。
> **Reason for Change**: 毛玻璃背景下原有文字对比度不足，影响用户阅读体验
> **Impact Scope**: 影响PC端导航的所有文字元素，提升可读性
> **API Changes**: 无
> **Configuration Changes**: 无
> **Performance Impact**: 文字阴影对性能影响极小

   ```
   root
   - src
      - App.vue                     // fix 文字对比度和阴影效果优化
   ```

### 3. 多层光晕和边框系统

**Change Type**: feature

> **Purpose**: 营造更丰富的视觉层次和状态反馈
> **Detailed Description**: 为活跃按钮增加多重阴影效果包括外阴影、边框光晕和内部高光。非活跃按钮增加透明边框和悬停时的顶部光线效果。实现光线扫过动画和Y轴悬停位移。
> **Reason for Change**: 增强视觉反馈和交互体验，让界面更具现代感和沉浸感
> **Impact Scope**: 影响PC端导航按钮的视觉效果和交互反馈
> **API Changes**: 无
> **Configuration Changes**: 无
> **Performance Impact**: 通过CSS3动画优化，性能影响可控

   ```
   root
   - src
      - App.vue                     // feature 多层光晕和智能边框系统
   ```

## {datetime: YYYY-MM-DD HH:mm:ss}

### 1. {function simple description}

**Change Type**: {type: feature/fix/improvement/refactor/docs/test/build}

> **Purpose**: {function purpose}
> **Detailed Description**: {function detailed description}
> **Reason for Change**: {why this change is needed}
> **Impact Scope**: {other modules or functions that may be affected by this change}
> **API Changes**: {if there are API changes, detail the old and new APIs}
> **Configuration Changes**: {changes to environment variables, config files, etc.}
> **Performance Impact**: {impact of the change on system performance}

   ```
   root
   - pkg    // {type: add/del/refact/-} {The role of a folder}
    - utils // {type: add/del/refact} {The function of the file}
   - xxx    // {type: add/del/refact} {The function of the file}
   ```

### 2. {function simple description}

**Change Type**: {type: feature/fix/improvement/refactor/docs/test/build}

> **Purpose**: {function purpose}
> **Detailed Description**: {function detailed description}
> **Reason for Change**: {why this change is needed}
> **Impact Scope**: {other modules or functions that may be affected by this change}
> **API Changes**: {if there are API changes, detail the old and new APIs}
> **Configuration Changes**: {changes to environment variables, config files, etc.}
> **Performance Impact**: {impact of the change on system performance}

   ```
   root
   - pkg    // {type: add/del/refact/-} {The role of a folder}
    - utils // {type: add/del/refact} {The function of the file}
   - xxx    // {type: add/del/refact} {The function of the file}
   ```

## 2024-06-08  

### 1. 删除旧页面和组件，新增BSC地址每日交易量查询页面

**Change Type**: feature/refactor

> **Purpose**: 清理模板页面，搭建BSC地址每日交易量查询主页面
> **Detailed Description**: 删除了AboutView.vue、HomeView.vue、HelloWorld.vue、WelcomeItem.vue、TheWelcome.vue等模板页面和组件，重构路由，仅保留首页BscAddressQueryView.vue，页面包含BSC地址输入、查询、表格展示、获取积分等功能。
> **Reason for Change**: 满足用户查询BSC地址每日交易量的需求，简化项目结构。
> **Impact Scope**: 影响views、components、router、App.vue等相关文件。
> **API Changes**: 暂无，后续可对接后端API。
> **Configuration Changes**: 无
> **Performance Impact**: 简化页面结构，提升可维护性。

   ```
   root
   - src
      - views
         - AboutView.vue    // del 删除模板页面
         - HomeView.vue     // del 删除模板页面
         - BscAddressQueryView.vue // add 新增BSC地址查询页面
      - components
         - HelloWorld.vue   // del 删除模板组件
         - WelcomeItem.vue  // del 删除模板组件
         - TheWelcome.vue   // del 删除模板组件
      - router
         - index.js         // refact 仅保留BSC查询页面路由
      - App.vue             // refact 移除旧导航和组件
   ```

...