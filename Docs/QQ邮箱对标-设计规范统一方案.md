# QQ邮箱对标 · 设计规范统一方案

> 用途：以 QQ 邮箱为参照基准，梳理其设计规范，审查当前高完成度页面（课程开发 / 课程详情 / 工作台 / 新建课程 / 我的教学）的现状与问题，并给出**修改后的统一规范**（信息架构、内容区、顶部工具栏、文字等），作为后续整改的执行依据。
>
 - 参照基准：`Docs/template_qqmail.md`（QQ 邮箱渲染源码，约 2.8MB）
 - 当前令牌：`shared/design-tokens.css`
 - 审查范围：course-dev / course-center / dashboard / my-teaching / course-run
 - 硬约束（客户确认，不动）：左侧导航色 `#175898`、内容区白卡顶部圆角 `12px 12px 0 0`、外层背景使用 `var(--color-sidebar)`

---

## 第一部分 · QQ邮箱设计规范摘要（参照基准）

### 1.1 整体布局（三层框架）

```
#mailMainApp (flex column, 100%, min-width:820px)
├── .frame-header        顶部栏  height:60px, padding-right:16px
│   ├── .frame-header-logo   Logo区  width:220px（与侧栏严格对齐）
│   ├── 自动回复按钮          胶囊 32×54+, radius:16px
│   ├── .frame-header-space   弹性间距 margin:0 12px 0 auto
│   └── 设置按钮              40×12, radius:6px
└── .frame-body          主体 flex row, height:calc(100% - 60px)
    ├── .frame-sidebar        左导航  width:220px, flex-shrink:0
    │   ├── 写信按钮          height:36px, radius:6px
    │   ├── 账户区            padding-bottom:12px, margin:0 12px
    │   └── 菜单列表          padding:0 12px 40px 12px, 菜单项 height:32px
    └── .frame-route-content  主内容区  flex-grow:1, radius:12px 12px 0 0, margin-right:16px
        └── .mail-list-page-toolbar  内容区工具栏 height:48px
```

**核心特征**：灰底（`#E6EDF5`）+ 白色卡片（`#FFFFFF`，顶圆角 12px）双层背景；侧栏 220px 与顶栏 60px 形成"┌"型框架；侧栏透明融入灰底。

### 1.2 设计令牌体系

| 类别 | 关键变量 | 值 |
|------|---------|-----|
| 页面底色 | `--bg_gray_web_0` | `#E6EDF5`（浅蓝灰） |
| 内容白 | `--bg_white_web` | `#FFFFFF`（127 次引用） |
| 主文字 | `--base_gray_100` | `#13181D`（298 次引用，最常用） |
| 次文字 | `--base_gray_080` | `rgba(22,30,38,.80)` |
| 元信息 | `--base_gray_050` | `rgba(25,38,54,.50)`（259 次引用） |
| 分隔线 | `--base_gray_007` | `rgba(21,46,74,.07)` |
| hover底 | `--base_gray_005` | `rgba(20,46,77,.05)` |
| active底 | `--base_gray_010` | `rgba(22,46,74,.10)` |
| 主题色 | `--theme_primary` | `#0F7AF5`（默认）/ `#305BD2`（sky 主题） |
| 卡片阴影 | `--shadow_card` | `0 8px 16px 0 rgba(19,24,29,.06)` |

### 1.3 文字规范（字号 × 行高，差值恒为 +6px）

| 层级 | 字号 | 行高 | 字重 | 颜色 | 用途 |
|------|------|------|------|------|------|
| 详情主题 | 20px | 28px | 700 | `--base_gray_100` | 邮件详情标题 |
| 预览主题 | 18px | 24px | 700 | `--base_gray_100` | 列表预览大标题 |
| 文件夹名/搜索标题 | 16px | 22px | 700 | `--base_gray_100` | 工具栏标题、分组标题 |
| **正文/列表项/按钮** | **14px** | **20px** | initial | `--base_gray_100` | **最主流（526 次引用）** |
| 紧凑菜单/发件人 | 13px | 18px | initial/700 | `--base_gray_100` | 次级文字 |
| 元信息/时间/计数 | 12px | 16px | initial | `--base_gray_050` | 辅助说明 |
| 极小角标 | 10-11px | 14px | — | — | 红点、徽标 |

**字号使用频率**：14px(526次) > 12px(321次) > 13px(215次) > 16px(208次) > 18px(82次) > 24px(28次)。

**字体栈**：`-apple-system, BlinkMacSystemFont, system-ui, "PingFang SC", "Microsoft YaHei UI", "Microsoft YaHei", "Source Han Sans CN", sans-serif`

### 1.4 顶部工具栏结构（两级）

**一级顶部栏 `.frame-header`（全局，60px）**：Logo(220px) + 功能按钮 + 弹性间距 + 设置按钮。白底，全站统一。

**二级工具栏 `.mail-list-page-toolbar`（内容区顶部，48px）**：三栏布局
- 左栏 `min-width:354px`：全选(48px) + 文件夹名（16px/700/`--base_gray_100`）
- 中间 1px 分隔线（`--base_gray_007`）
- 右栏 `min-width:472px, padding-left:24px`：操作按钮 + 邮件总数（14px/`--base_gray_100`）

**搜索结果标题栏（48px）**：标题 16px/700 + 信息 14px/`--base_gray_070`。

### 1.5 内容区与间距

- 内容区横向标准内边距：**24px**（`reader-body-children: 0 24px 24px 24px`）
- 内容区与右边缘：16px
- 侧栏内统一水平间距：12px
- 列表项：`margin:0 4px`，项间 1px 分隔线（`--base_gray_007`，左右缩进 8px）
- 列表行高：宽行 40px / 紧凑 28px / 迷你三行 84px
- 卡片圆角：6-12px；列表项圆角 6px（紧凑 4px）
- 间距刻度：4 / 8 / 10 / 12 / 14 / 16 / 20 / 24px（4 倍数体系）

### 1.6 按钮系统（6 尺寸 × 11 主题矩阵）

| 尺寸 | height | font-size | padding(横) | radius |
|------|--------|-----------|------------|--------|
| size20 | 20px | 11px | 4px | 2px |
| size24 | 24px | 12px | 6px | 4px |
| size28 | 28px | 13px | 8px | 4px |
| **size32** | **32px** | **14px** | **8px** | **4px** |
| size36 | 36px | 14px | 10px | 6px |
| size40 | 40px | 16px | 12px | 6px |

主按钮：`--theme_primary` 实底 + 白字 + 蓝色材质阴影；次按钮：灰底（`--base_gray_005`）+ 主文字色 + 灰边框；文字按钮：透明底 + 主题色文字。

### 1.7 状态与交互态

- 交互态统一用三级灰阶叠加：hover `--base_gray_005` → active `--base_gray_010` → 选中 `--base_gray_015`
- 主题色选中态：`--theme_alpha_015` → `020` → `025`
- 全部通过 `::before` 伪元素覆盖，避免污染背景

---

## 第二部分 · 当前高完成度页面现状与问题

### 2.1 信息架构现状（各模块自成体系）

| 模块 | 外层类名 | 区块结构 |
|------|---------|---------|
| course-dev 列表 | `.cd-app>.cd-workbench` | tabs行 → filter行 → 卡片网格/表格 |
| course-dev 编辑器 | `.cd-editor-layout` | editor-toolbar → editor-shell(锚导航+主区+概览) |
| course-center | `.compact-list-header` | head → compact-row × N |
| dashboard 教师 | `.app-page-toolbar.dashboard-top-toolbar` | 工具栏 → welcome-banner → 统计 → 日程/待办/通知 |
| dashboard 学员/管理员 | `.dashboard-top-toolbar`（漏挂公共类） | 工具栏 → 内容 |
| my-teaching 列表 | `.mt-page>.mt-shell` | breadcrumb → global-tabs → toolbar → group×N |
| my-teaching 详情 | `.mt-detail-shell` | detail-toolbar → 左主区+右任务卡 |

**问题**：5 个模块 5 套外层类名，无统一"页面壳"；`patterns.css` 的 6 个业务组件（`.p-task-container` 等）无一被使用；面包屑使用不一致（仅 my-teaching 用）。

### 2.2 顶部工具栏现状（最严重的碎片化）

| 模块 | 工具栏类 | 用公共类 `.app-page-toolbar`? | 问题 |
|------|---------|------------------------------|------|
| course-dev 列表 | `.cd-tabs-row`+`.cd-toolbar-controls`+`.cd-filter-row` | ❌ | 三段拼接，无 sticky |
| course-center | `.compact-list-header` | ❌ | 模块自定义 |
| dashboard 教师 | `.app-page-toolbar.dashboard-top-toolbar` | ✅ | 唯一正确挂载 |
| dashboard 学员/管理员 | `.dashboard-top-toolbar` | ❌ | 漏挂公共类 |
| my-teaching 列表 | `.mt-toolbar` | ❌ | 模块自定义 |
| course-run | `.run-filters`+`.run-tabs` | ❌ | 模块自定义 |
| nav.css 服务大厅 | `.service-top-bar` | ❌ | padding 24px（与公共类 32px 冲突） |

**详情页工具栏**：course-dev 用 `.cd-editor-toolbar`、my-teaching 用 `.mt-detail-toolbar`（完整复刻公共类属性，违反 DRY）、course-run 用 `.drawer-header`。公共 `.app-detail-toolbar` / `.app-back-button` 均未被使用。

**抽屉头部**：course-dev 用蓝色渐变硬编码 `linear-gradient(135deg,#1677ff,#4096ff)`——这就是用户说的"样式飞起来"。

### 2.3 文字规范现状（硬编码泛滥）

| 模块 | 硬编码font-size | 严重问题 |
|------|----------------|---------|
| course-dev.css | 31 处 | 11/12/13/18/20/22px 混用 |
| course-center.css | 17 处 | 全档位乱用 + 引用 8 个未定义变量 |
| dashboard.css | 26 处 | **出现 10.5/11.5/13.5px 非整数字号**，违反"消灭非整数字号"规则 |
| my-teaching.css | 9 处 | 相对较好 |
| course-run.css | 1 处 | 最规范 |

**公共组件本身违规**：`.app-page-title` 硬编码 `18px`；`.s-stat-value` 硬编码 `22px`（不在 7 档字号体系内）。

**字号体系本身混乱**：design-tokens 同时定义 `--font-md:13px`（标注"正文主体，最常用"）和 `--font-base:14px`（标注"正文，列表item"），两个"正文"造成执行歧义。这也是客户反映"文字太小"的根源——执行时大量用了 13px 甚至更小。

### 2.4 颜色硬编码现状

| 模块 | 硬编码颜色 | 集中位置 |
|------|-----------|---------|
| course-dev.css | 47 处 | 抽屉蓝色渐变、AI助手模态框 rgba 阴影 |
| course-center.css | 30 处 | 状态标签、图表色板 |
| dashboard.css | 8 处 | 服务图标 tone 变体 |
| JS 内联 | 十余处 | course-run.js/course-center.js/dashboard.js 内联 `#165dff`/`#00b42a` 等 |

### 2.5 间距规范现状（一塌糊涂）

| 模块 | 硬编码padding/margin/gap | 用 `var(--space-*)`? |
|------|--------------------------|---------------------|
| course-dev.css | **309 处** | ❌ 几乎全硬编码 |
| dashboard.css | 33 处 | ❌ |
| my-teaching.css + content | 71 处 | ❌ |
| course-center.css | 部分 | ✅ 部分 |
| course-run.css | 较少 | ❌ 用负 margin `-28px -32px` 反向撑满 |

**只有 assessment.css 和 course-center.css 部分使用 `var(--space-*)`**。内容区大 padding 与卡片小 padding 各模块独立维护，无统一规范。

### 2.6 其他问题（用户未提及但需指出）

1. **公共组件库形同虚设**：`design-tokens.css` 文件头声明的 12 个 s-* 自建组件、`patterns.css` 的 6 个 p-* 业务组件，在高完成度模块中**无一被使用**。
2. **状态标签 6 套并行**：`.s-badge`/`.p-status` 公共方案未被采用，course-run 单模块就定义了 15 个状态类（9 个 `.run-status.*` + 3 个 `.readiness-badge.*` + 3 个 `.roster-badge.*`）。
3. **空状态 5 套实现**：`.cd-empty`(3种)/`.mt-empty`/`.roster-empty`/`.admin-empty`/内联空状态。
4. **抽屉 4 套实现**：公共 `.s-drawer-header` 未被使用；course-dev 蓝色渐变硬编码、course-run 重复实现、my-teaching 独立实现、course-center 内联。
5. **未定义变量引用**：course-center.css 引用 8 个 design-tokens 未定义的变量（`--height-list-header` 等），存在样式失效风险。
6. **内联 style 滥用**：course-run.js、course-center.js、dashboard.js 大量内联颜色/字号/间距，无法通过令牌统一管理——这是规范执行的最大漏洞。

---

## 第三部分 · 对比诊断：核心差距

| 维度 | QQ邮箱 | 当前项目 | 差距 |
|------|--------|---------|------|
| 布局框架 | 顶栏60px+侧栏220px+白卡(顶圆角12px) | 结构类似，但侧栏色为客户确认蓝 | 框架基本一致，✅ |
| 文字基准 | **14px 为单一正文基准**（526次） | 13px/14px 并存，歧义导致偏小 | 🔴 客户反映"文字太小"的根源 |
| 文字颜色 | 三级灰阶清晰（100/080/050） | 令牌已定义四级，但执行乱 | 🟠 令牌OK，执行缺失 |
| 工具栏 | 全站统一（一级60px+二级48px） | 5模块5套，仅1个正确挂公共类 | 🔴 用户说的"不稳定" |
| 间距 | 4倍数体系，内容区24px横距 | 309处硬编码，无规范 | 🔴 用户说的"一塌糊涂" |
| 状态色 | 三级灰阶/主题色透明叠加 | 6套并行实现 | 🟠 |
| 组件复用 | 按钮矩阵统一 | 公共组件库零使用 | 🔴 |
| 内联样式 | 极少 | JS大量内联 | 🔴 最大执行漏洞 |

**结论**：项目 design-tokens.css 的令牌定义本身合理（借鉴飞书），问题在于**执行层完全失控**——公共组件库零采用、每个模块各自造轮子、JS 内联样式泛滥。整改核心不是重写令牌，而是**强制收敛到公共组件 + 令牌系统**。

---

## 第四部分 · 修改后的统一规范（执行依据）

> 以下为整改目标规范。所有高完成度页面整改后必须遵守。令牌体系沿用 `design-tokens.css`，仅做必要调整。

### 4.1 信息架构规范

#### 4.1.1 页面分类

| 类型 | 定义 | 示例 |
|------|------|------|
| **一级页面（列表/工作台）** | 展示数据集合，以筛选+列表/卡片为主 | 课程开发列表、工作台、我的教学列表、课程中心 |
| **二级页面（详情/编辑器）** | 单条数据的深度操作，从一级页面进入 | 课程编辑器、课程详情、教学详情 |

#### 4.1.2 一级页面信息架构（统一）

```
内容区白卡（.main-inner, radius:12px 12px 0 0）
└── 页面壳 .page-shell（统一容器）
    ├── ① 页面工具栏 .page-toolbar（一级，见4.2）
    │     ├── 左：页面标题（18px/700）+ 副标题/计数（13px/灰）
    │     └── 右：主操作按钮（新建/导入）
    ├── ② 筛选区 .page-filter（可选，紧贴工具栏下方）
    │     ├── 搜索框 + 筛选下拉 + 状态切换
    │     └── 右侧：视图切换（卡片/表格）+ 排序
    ├── ③ 内容区 .page-body（主体，可滚动）
    │     ├── 列表/卡片网格/表格
    │     └── 空状态 .s-empty（统一）
    └── （无底部分页，分页悬浮于内容区底部）
```

#### 4.1.3 二级页面信息架构（统一）

```
内容区白卡
└── 详情壳 .detail-shell
    ├── ① 详情工具栏 .detail-toolbar（二级，见4.2）
    │     ├── 左：返回按钮 .app-back-button + 标题（18px/700）
    │     └── 右：保存/发布/更多操作
    ├── ② 详情主体 .detail-body
    │     ├── 左主区（编辑/详情内容）
    │     └── 右辅助区（任务卡/概览，可选）
    └── ③ 详情底部操作条（可选）
```

#### 4.1.4 面包屑规范

- **一级页面**：不使用面包屑（工具栏标题已足够）
- **二级页面**：工具栏内用返回按钮 + 标题，不单独使用面包屑
- **深层路径**（3级以上）：详情工具栏下方可加 `a-breadcrumb`，字号 13px

### 4.2 顶部工具栏结构规范

#### 4.2.1 一级页面工具栏 `.page-toolbar`

```css
.page-toolbar {
  position: sticky; top: 0; z-index: 10;
  min-height: 56px;
  padding: 0 var(--space-6);        /* 0 24px */
  background: rgba(255,255,255,0.96);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--color-border-light);
  display: flex; align-items: center; justify-content: space-between;
  gap: var(--space-4);
}
.page-toolbar-title { font-size: var(--font-xl); font-weight: 700; color: var(--color-text-1); }  /* 18px */
.page-toolbar-sub   { font-size: var(--font-md); color: var(--color-text-3); margin-left: var(--space-2); }  /* 13px */
.page-toolbar-actions { display: flex; gap: var(--space-2); align-items: center; }
```

**结构**：
- 左：`.page-toolbar-title`（18px/700）+ 可选 `.page-toolbar-sub`（13px/灰，如计数"共 24 项"）
- 右：`.page-toolbar-actions`（主按钮 + 次按钮 + 图标按钮）

#### 4.2.2 二级页面工具栏 `.detail-toolbar`

```css
.detail-toolbar {
  position: sticky; top: 0; z-index: 10;
  min-height: 56px;
  padding: 0 var(--space-6);
  background: rgba(255,255,255,0.96);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--color-border-light);
  display: flex; align-items: center; gap: var(--space-3);
}
.detail-toolbar .app-back-button { /* 公共返回按钮 */ }
.detail-toolbar-title { font-size: var(--font-xl); font-weight: 700; color: var(--color-text-1); }
.detail-toolbar-actions { margin-left: auto; display: flex; gap: var(--space-2); }
```

**结构**：
- 左：`.app-back-button`（返回箭头 + "返回"文字）+ `.detail-toolbar-title`（18px/700）
- 右：`.detail-toolbar-actions`（保存/发布/更多）

#### 4.2.3 筛选区 `.page-filter`（一级页面专用）

```css
.page-filter {
  padding: var(--space-3) var(--space-6);   /* 12px 24px */
  border-bottom: 1px solid var(--color-border-light);
  display: flex; align-items: center; gap: var(--space-3);
  flex-wrap: wrap;
}
```

**结构**：搜索框 + 筛选下拉（状态/类型/时间）+ 重置；右侧：视图切换 + 排序。

#### 4.2.4 工具栏统一禁令

- ❌ 禁止各模块自定义工具栏类名（`.cd-tabs-row`/`.mt-toolbar`/`.run-filters` 等全部废弃）
- ❌ 禁止抽屉/弹窗头部使用蓝色渐变背景（course-dev 的 `linear-gradient(#1677ff,#4096ff)` 必须移除）
- ❌ 禁止工具栏 padding 使用 32px（统一 24px，与内容区横距对齐）
- ✅ 所有工具栏必须 sticky + 半透明白底 + blur(8px)

### 4.3 内容区规范

#### 4.3.1 内容区容器（沿用现有，强化）

```css
/* 外层：间距+圆角（已由 nav.css 实现，不动） */
.app-shell { padding: 8px 8px 0 8px; box-sizing: border-box; }  /* 右/上 8px，底 0 */
.main-inner { border-radius: 12px 12px 0 0; background: var(--color-bg-1); overflow: hidden; }

/* 内层：内容padding */
.page-shell, .detail-shell { padding: 0; }  /* padding 由工具栏/内容区各自负责 */
```

#### 4.3.2 内容区主体 padding

| 区域 | padding | 说明 |
|------|---------|------|
| 工具栏 | `0 24px` | 左右 24px，与内容对齐 |
| 筛选区 | `12px 24px` | 上下 12px，左右 24px |
| 内容主体 | `16px 24px` | 上下 16px，左右 24px（对齐QQ邮箱横距） |
| 卡片内部 | `16px`（`var(--space-4)`） | 统一用 `.s-card-body` |
| 卡片间距 | `16px`（`var(--space-4)`） | 网格 gap |
| 列表行 padding | `12px 16px` | 表格行/列表项 |

#### 4.3.3 卡片规范（统一用公共 `.s-card`）

- 卡片背景：`var(--color-bg-1)`（白）
- 卡片边框：`1px solid var(--color-border-light)`
- 卡片圆角：`var(--radius-md)`（8px）
- 卡片阴影：**不用阴影**，靠边框分隔（飞书风格）
- 卡片标题：`var(--font-lg)`（15px）/ 600 / `var(--color-text-1)`
- 卡片正文：`var(--font-base)`（14px）/ `var(--color-text-2)`

**禁令**：废弃 `.db-card`/`.mt-course-card`/`.cd-course-card` 等模块自定义卡片，统一用 `.s-card`。

### 4.4 文字规范（重点修正"文字太小"）

#### 4.4.1 字号体系调整

> **核心修正**：取消 `--font-md(13px)` 作为"正文主体最常用"的定位，改为 `--font-base(14px)` 为唯一正文基准，对齐 QQ 邮箱。

| 变量 | 值 | 定位（修正后） | 用途 |
|------|-----|--------------|------|
| `--font-xs` | 11px | 辅助标注 | 角标、徽标数字 |
| `--font-sm` | 12px | 元信息 | 时间、计数、标签 |
| `--font-md` | 13px | 次文字 | 描述、表头、紧凑菜单 |
| **`--font-base`** | **14px** | **正文基准（最常用）** | **列表项、按钮、正文、表格内容** |
| `--font-lg` | 15px | 卡片标题 | 卡片标题、子标题 |
| `--font-xl` | 18px | 页面标题 | 工具栏标题、详情标题 |
| `--font-2xl` | 24px | 大标题 | Hero数字、大标题 |

**行高对齐规则**（对齐QQ邮箱，行高 = 字号 + 6px）：
- 11px → 16px（紧凑）
- 12px → 18px
- 13px → 20px（次文字）
- 14px → 22px（正文，略宽松于QQ邮箱的20px，提升可读性）
- 15px → 24px
- 18px → 26px
- 24px → 32px

#### 4.4.2 文字颜色层级（沿用令牌，强化执行）

| 层级 | 变量 | 值 | 用途 |
|------|------|-----|------|
| 主文字 | `--color-text-1` | `#1f2329` | 标题、重要数据、列表主文字 |
| 次文字 | `--color-text-2` | `#646a73` | 描述、标签名、卡片正文 |
| 辅助文字 | `--color-text-3` | `#8f959e` | 时间、占位、元信息 |
| 禁用 | `--color-text-4` | `#bbbfc4` | 禁用态 |
| 主题链接 | `--color-primary` | `#175898` | 链接、可点击文字 |

#### 4.4.3 文字规范禁令

- ❌ 禁止硬编码 `font-size` 数字（必须用 `var(--font-*)`）
- ❌ 禁止非整数字号（10.5/11.5/13.5px 必须消除）
- ❌ 禁止正文使用 13px（13px 仅用于次文字/表头）
- ❌ 禁止硬编码文字颜色（必须用 `var(--color-text-*)`）
- ❌ 禁止 22px 字号（`.s-stat-value` 改为 `var(--font-2xl)` 即 24px）
- ✅ 正文统一 14px，解决客户"文字太小"反馈

### 4.5 间距规范

#### 4.5.1 间距刻度（沿用 `--space-*`，强制使用）

| 变量 | 值 | 主用途 |
|------|-----|--------|
| `--space-1` | 4px | 标签间距、图标间距 |
| `--space-2` | 8px | 按钮间距、紧凑元素间距 |
| `--space-3` | 12px | 筛选区上下、列表行上下 |
| `--space-4` | 16px | 卡片内padding、卡片间距、内容主体上下 |
| `--space-5` | 20px | 区块间距 |
| `--space-6` | 24px | **内容区横向padding（对齐QQ邮箱）** |
| `--space-8` | 32px | 大区块间距 |
| `--space-10` | 40px | 页面底部留白 |

#### 4.5.2 间距规范禁令

- ❌ 禁止硬编码 padding/margin/gap 数字（必须用 `var(--space-*)`）
- ❌ 禁止用负 margin 反向撑满（course-run 的 `margin:-28px -32px` 必须移除）
- ❌ 禁止内容区横向 padding 用 32px（统一 24px）
- ✅ 内容区横向统一 24px，卡片内统一 16px

### 4.6 状态标签规范（统一用 `.s-badge`）

废弃所有模块自定义状态类（`.cd-status.tone-*`/`.mt-cover-badge.*`/`.run-status.*`/`.readiness-badge.*`/`.roster-badge.*`），统一用公共 `.s-badge[data-tone]`：

| tone | 用途 | 背景 | 文字 | 边框 |
|------|------|------|------|------|
| `default` | 中性 | `--color-gray-bg` | `--color-gray` | `--color-gray-border` |
| `primary` | 主题 | `--color-primary-bg` | `--color-primary` | `--color-primary-border` |
| `success` | 成功/进行中 | `--color-success-bg` | `--color-success` | `--color-success-border` |
| `warning` | 警告/待处理 | `--color-warning-bg` | `--color-warning` | `--color-warning-border` |
| `danger` | 危险/失败 | `--color-danger-bg` | `--color-danger` | `--color-danger-border` |
| `info` | 信息/草稿 | `--color-cyan-bg` | `--color-cyan` | `--color-cyan-border` |

**规格**：height 22px，padding `0 8px`，font-size `--font-sm`(12px)，radius `--radius-xs`(4px)。

### 4.7 空状态规范（统一用 `.s-empty`）

废弃 `.cd-empty`/`.mt-empty`/`.roster-empty`/`.admin-empty`/内联空状态，统一用 `.s-empty`：
- 图标 48px（`--color-text-4`）
- 主文字 `--font-base`(14px) / `--color-text-2`
- 辅助文字 `--font-sm`(12px) / `--color-text-3`
- 上下 padding `var(--space-10)`（40px）

### 4.8 抽屉/弹窗头部规范

废弃蓝色渐变头部，统一用 `.s-drawer-header`：
- 背景：`var(--color-bg-1)`（白）
- 标题：`--font-lg`(15px) / 600 / `--color-text-1`
- 关闭按钮：`.s-drawer-close`
- 底部 1px 边框 `--color-border-light`

### 4.9 组件使用规范（强制收敛）

| 场景 | 必须使用 | 禁止使用 |
|------|---------|---------|
| 工具栏 | `.page-toolbar` / `.detail-toolbar` | 模块自定义工具栏类 |
| 卡片 | `.s-card` | `.db-card`/`.mt-course-card`/`.cd-course-card` |
| 状态标签 | `.s-badge[data-tone]` | 模块自定义状态类 |
| 空状态 | `.s-empty` | 模块自定义空状态 |
| 抽屉头部 | `.s-drawer-header` | 蓝色渐变头部 |
| 返回按钮 | `.app-back-button` | `.cd-back`/`.mt-back`/`.drawer-close-btn` |
| 表格 | `.s-table` 或 Arco `a-table` | `.compact-row`/`.run-table` 自建 |
| 业务模式 | `.p-*`（patterns.css） | 模块重复实现 |

### 4.10 内联样式禁令

- ❌ JS 文件中禁止内联 `style="color:#xxx"` / `style="font-size:Npx"` / `style="padding:Npx"`
- ✅ 必须通过 class + design-tokens 实现
- ✅ 动态颜色（如图表色板）必须从 design-tokens 派生的常量数组中取值

---

## 第五部分 · 整改优先级与执行建议

### 5.1 优先级

| 优先级 | 任务 | 影响面 |
|--------|------|--------|
| **P0** | 修正字号体系：正文统一 14px，消除非整数字号 | 解决客户"文字太小"反馈 |
| **P0** | 统一顶部工具栏：5 模块收敛到 `.page-toolbar`/`.detail-toolbar` | 解决"工具栏不稳定" |
| **P0** | 移除蓝色渐变抽屉头部（course-dev） | 解决"样式飞起来" |
| **P1** | 统一间距：内容区横距 24px，强制用 `var(--space-*)` | 解决"padding一塌糊涂" |
| **P1** | 统一状态标签到 `.s-badge[data-tone]` | 视觉一致 |
| **P1** | 清除 JS 内联样式（course-run.js/course-center.js/dashboard.js） | 令牌可管理 |
| **P2** | 统一空状态/抽屉头部/返回按钮 | 组件复用 |
| **P2** | 修复 course-center.css 未定义变量引用 | 消除隐患 |

### 5.2 整改顺序建议

1. **先修 design-tokens.css**：明确 `--font-base(14px)` 为正文基准，删除 `.s-stat-value` 的 22px
2. **再修公共组件**：`.app-page-title` 改用 `var(--font-xl)`，补全 `.page-toolbar`/`.detail-toolbar`/`.page-filter` 公共类
3. **逐模块收敛**：从最规范的 course-run 开始，到 course-dev（最严重）收尾
4. **JS 内联清除**：最后处理，逐文件替换内联样式为 class

### 5.3 验收标准

整改完成后，每个高完成度页面必须满足：
- [ ] 工具栏使用 `.page-toolbar` 或 `.detail-toolbar`，sticky + 半透明白底
- [ ] 正文文字 14px，无 13px 正文，无非整数字号
- [ ] 所有 font-size/color/spacing 引用 design-tokens 变量，零硬编码
- [ ] 内容区横向 padding 统一 24px
- [ ] 状态标签用 `.s-badge[data-tone]`，无模块自定义状态类
- [ ] 空状态用 `.s-empty`
- [ ] 无蓝色渐变头部，无内联 style 颜色/字号

---

## 附录 · 各模块整改清单（执行时对照）

### course-dev（最严重，309处间距硬编码）
- 废弃 `.cd-tabs-row`/`.cd-toolbar-controls`/`.cd-filter-row` → `.page-toolbar`+`.page-filter`
- 废弃 `.cd-editor-toolbar` → `.detail-toolbar` + `.app-back-button`
- 移除 `.cd-cp-header`/`.cd-ac-header` 蓝色渐变 → `.s-drawer-header`
- 31处字号硬编码、47处颜色硬编码、309处间距硬编码全部替换为令牌
- 11处 box-shadow 硬编码 → `var(--shadow-*)`

### course-center
- 废弃 `.compact-list-header` → `.page-toolbar`
- 修复 8 个未定义变量引用
- 17处字号、30处颜色硬编码替换

### dashboard
- 学员端/管理员端补挂 `.app-page-toolbar`（或迁移到新的 `.page-toolbar`）
- 26处字号硬编码（含10.5/11.5/13.5px非整数）全部修正
- 8处颜色硬编码（服务图标tone）替换为令牌
- dashboard.js 内联颜色清除

### my-teaching
- 废弃 `.mt-toolbar` → `.page-toolbar`
- 废弃 `.mt-detail-toolbar`（复刻公共类）→ 直接用 `.detail-toolbar`
- 废弃 `.mt-back` → `.app-back-button`
- 废弃 `.mt-empty` → `.s-empty`
- 废弃 `.mt-cover-badge.status-*`（5个状态类）→ `.s-badge[data-tone]`

### course-run（最规范，作为整改起点）
- 废弃 `.run-filters`/`.run-tabs` → `.page-toolbar`+`.page-filter`
- 移除 `.course-run-page` 负 margin `-28px -32px`
- 废弃 `.drawer-header`/`.drawer-close-btn` → `.s-drawer-header`/`.s-drawer-close`
- 15个状态类（`.run-status.*`/`.readiness-badge.*`/`.roster-badge.*`）→ `.s-badge[data-tone]`
- course-run.js 内联样式全部清除
