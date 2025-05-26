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