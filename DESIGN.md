# 桂农易通 设计规范（Design Spec）

> 本文件是页面开发的设计基准。新增页面、组件必须遵循以下约定，除非设计稿明确特殊说明。
>
> **⚠️ 最高优先级规则**：本规范优先级高于任何外部约定、口头说明或一般开发习惯。所有页面构建必须严格遵循本文件定义的结构、命名和布局模式；任何偏离必须征得文档维护者书面同意并同步更新本文件。**违反本文件的行为视为技术债，需立即修正。**
>
> **📋 页面构建标准流程（强制，三步缺一不可）**：
> 1. **读取 Figma 设计稿属性**：字号、颜色、对齐方式、外边距、内边距、间隔、布局方式、字重、圆角、背景设置、图片资源——全部从设计稿取数，禁止凭空臆造数值。
> 2. **按本文件的页面结构搭框架**：先确定布局模式（App Shell / Full Scroll），再按 Header + Container（+ Tabbar）层级搭建，命名空间对齐规范。
> 3. **优先复用组件与已有样式**：先查组件库（`styles/components.css` / `scripts/*.js`）与现有页面，能复用组件/样式一律复用；没有才新建；**不确定时停止并询问用户**，禁止自行假设。
>
> **📢 交付流程（强制）**：页面/功能搭建完成后：① 立刻通知用户（不擅自做任何验证/预览）；② 同时列出可能出现的问题清单供用户判断；③ 是否验证（浏览器测试/预览/截图等）必须经用户明确同意后才能执行，禁止擅自验证。

---

## 1. 页面布局模式（强制）

页面分为 **两种互斥布局模式**，由页面类型决定，禁止混合使用。

### 1.1 App Shell 模式（Tab 内页 / 二级页）

用于：订单、收支、我的、亮码、大部分二级页面。

```
body（height:100vh, overflow:hidden，不整体滚动）
├── .page（flex column, flex:1, overflow:hidden）
│   ├── Header（flex-shrink:0，高度由 Topbar + 子栏决定）
│   │     ├── Topbar（必选，4 种变体之一，高 72px）
│   │     └── 子栏插槽区（可选 0~N 个）
│   └── Container（flex:1, min-height:0, overflow-y:auto，内部滚动）
└── Tabbar（flex-shrink:0，仅主模块页存在；二级页 DOM 中不存在）
```

规则：
- **body 不滚动**，滚动只发生在 Container
- Header / Tabbar 由 flex 自然锁定在视口内，不使用 `position:fixed`
- 二级页不显示 Tabbar 时，DOM 中不渲染 `.tabbar`，不预留高度

### 1.2 首页 Full Scroll 模式（视觉型页面）

用于：首页、集采详情页。

```
body（height:auto, overflow:auto，整体滚动）
├── Header（position:absolute → 滚动后切换为 fixed）
├── Hero Banner
└── 页面内容区
```

规则：
- 不使用 `.page` 的 `overflow:hidden` 结构
- Header 初始 `position:absolute`，背景透明，覆盖在 Hero Banner 上
- JS 监听滚动，当 Banner 完全离开视口后，Header 添加 `is-fixed`
  - `is-fixed` 时：`position:fixed; top:0; background:var(--header-bg)`，出现底部阴影
- Header 由 `PageHeader` 渲染，变体为 `home`
- 为防止内容跳动，Header 脱离文档流时用占位元素补位

### 1.3 布局模式选择表（强制）

| 页面 | 布局模式 |
|----|----|
| 首页 | Full Scroll |
| 订单、收支、我的、亮码 | App Shell |
| 所有二级页（详情、表单） | App Shell |

> 布局模式由 **页面类型** 决定，不由组件决定。  
> 同一个页面不允许部分区域用 fixed、部分用 flex。

---

## 2. 页面结构规则（App Shell 模式，强制）

> 本章仅适用于 App Shell 模式页面（Tab 内页 / 二级页）。

所有页面严格采用 **页头 Header + 内容 Container + 底部标签栏 Tabbar** 三层结构：

- **页头 Header**：必须由 `PageHeader` 组件渲染（Topbar 变体 + 可选子栏插槽）；**内边距必须为 0**，左右与视口边缘对齐（顶栏内容从 x=0 开始，不得留边）。
- **底部标签栏 Tabbar**：必须由 `Tabbar` 组件渲染；**内边距必须为 0**，左右与视口边缘对齐。
- **内容区 Container**：默认内边距 `0.16rem 0.08rem`（上下 16px、左右 8px）；无设计稿明确说明禁止改默认值。内容在 Container 内部滚动。
- **组件复用（强制）**：Header / Tabbar 一律复用组件（`PageHeader.mount` / `Tabbar.mount`），禁止在页面内手写顶栏 / 标签栏结构、禁止自造状态栏 / 内边距，禁止复制组件样式。二级页若无底部标签栏，则省略 Tabbar 层，仅 Header + Container。

- 页面切换用 `hidden` 属性 + `tabbar.js` 的 `switchPage`（选择器 `.page[id]`，勿匹配无 id 的内层元素）。

---

## 3. 顶栏（Topbar）组件：4 种变体（强制）

顶栏是页头的基础组件，按「背景明暗 × 左侧内容」共 4 种变体：

| 变体 | 背景 | 左侧 | 右侧 | 适用 |
|---|---|---|---|---|
| 1 | 深色（品牌绿 `#16A34A` 系） | 系统 Logo | 微信按钮（on-dark） | 主模块：**首页、我的、亮码** |
| 2 | 浅色（`#EBF2FC` / 白） | 系统 Logo | 微信按钮（on-light） | 主模块：**订单、收支** |
| 3 | 深色（品牌绿系） | 返回图标 + 居中标题 | 动作（更多 / 胶囊等） | 二级页面 |
| 4 | 浅色（`#FFFFFF` / `#EBF2FC`） | 返回图标 + 居中标题 | 动作（更多 / 胶囊等） | 二级页面 |

- **高度统一 72px（0.72rem）**，以首页为标准；内容垂直居中，水平 padding 16px。
- 主模块页（变体 1/2）右侧放微信按钮，按背景明暗传 `data-wechat-bg="dark|light"`。
- 二级页面（变体 3/4）左侧为返回图标，中间居中显示页面标题（如"订单详情""身份码"），右侧为动作按钮。
- 变体 3 深色用于品牌强调的二级页；一般二级页用变体 4 浅色。

---

## 4. 页头（Header）统一组件（强制）

**所有页面（含二级页）的 Header 统一为一个组件**，结构固定为：`Topbar（必选） + 子栏插槽区（可选，可空置）`，由 `PageHeader.mount()` 统一渲染。

```
Header（统一组件）
├── Topbar（4 变体之一，高度固定 72px）
└── 子栏插槽区（0~N 个，依次排在顶栏下方；无子栏则空置）
      ├── 空置（无子栏，纯顶栏）
      ├── 标签栏（如首页顶栏内嵌：买入 / 卖出）
      ├── 搜索栏
      └── 筛选栏（筛选标签 + 搜索，如订单页：全部/待支付/已完成/已取消 + 搜索）
```

- **禁止脱离 Header 组件单独手写顶栏/子栏**；新增页面一律通过挂载点 `data-header` + `PageHeader.mount()` 组合。
- 挂载点：

```html
<div class="header-mount" data-header="order"></div>
```

- 子栏插槽通过 `PageHeader.mount` 的 `slots`（或 `filter` 等具名配置）传入，可空置。
- 示例：订单页 Header = 变体 2 Topbar（浅色 + Logo + 微信按钮）+ 筛选栏（筛选 + 搜索）。
- Header 总高度 = Topbar 72px + 子栏高度（子栏高度不设死），**禁止手写 Header 总高**。
- **sticky 顶栏场景**（顶栏需随页面滚动粘住，如订单创建页）：用 `wrap: false, prepend: true` 直接挂到内容区首部，避免固定高包装层破坏 sticky（容器传内容区元素，如 `document.getElementById('oc-step-1')`）。

### Header 定位规则（强制）

- **App Shell 页**：Header 不参与滚动，不使用 `position:fixed`，由 flex 布局自然锁定在视口顶部。
- **首页（Full Scroll）**：Header 初始 `position:absolute`，位于 Hero Banner 内，背景透明；滚动超过 Banner 高度后，JS 添加 `is-fixed`，切换为 `position:fixed` + 实色背景 + 阴影；同时用占位元素避免内容跳动。
- **禁止**：全站统一 `position:fixed`；手写 `calc(100vh - …)` 等高度计算；用 `padding-top` 强行补位。

### 页头组件用法

```html
<div class="header-mount" data-header="order"></div>
```

```js
PageHeader.mount({
  container: document.querySelector('[data-header="order"]'),
  topbar: {
    left: 'logo',   // 变体1/2：主模块页展示 Logo；变体3/4：二级页 { type: 'back', href: '...' } + 居中标题
    tabs: [{ label: '买入', value: 'buy', active: true }, { label: '卖出', value: 'sell' }],
    right: 'wechat' // 变体3/4 二级页可传 'actions'（更多 / 胶囊）
  },
  filter: {         // 可选：筛选标签栏（参考订单页）
    tabs: [{ label: '全部', value: 'all', count: 0, active: true }],
    search: true,
    onTab: fn
  },
  onTab: fn
});
```

### 二级页页头（od 顶栏）标准用法（强制）

> 所有二级页（详情 / 表单）页头统一复用 od 顶栏组件，样式已在 `components.css` 调好并冻结（Figma 840:8859）。
> **禁止**：页面手动操作组件 DOM、覆盖 `.od-topbar__*` 的尺寸/布局/字号、在页面 CSS 另写页头样式。

**标准浅色页头（绝大多数二级页）**：

```html
<div class="header-mount"></div>
```

```js
PageHeader.mount({
  container: document.querySelector('.header-mount'),
  topbar: { variant: 'od', title: '页面标题', right: 'wechat', left: { type: 'back', href: '上一页.html' } }
});
```

**明/暗两套颜色变体**：

```js
// 明（默认 od）：深色文字 + 底部边框，用于浅色内容页（如开户/充值）
PageHeader.mount({
  container: document.querySelector('.header-mount'),
  topbar: { variant: 'od', title: '页面标题', right: 'wechat' }
});

// 明 + 透明悬浮（ghost）：深色文字 + 透明无边框，用于浅色渐变/头图页（如集采列表、报名页）
PageHeader.mount({
  container: document.querySelector('.header-mount'),
  topbar: { variant: 'od', title: '页面标题', right: 'wechat', ghost: true }
});

// 暗（dark）：白色文字 + 透明无边框，用于深色头图页（如集采详情）
PageHeader.mount({
  container: document.querySelector('.header-mount'),
  topbar: { variant: 'od', title: '页面标题', right: 'wechat', dark: true }
});
```

**页面无需再写颜色覆盖**——明/暗两套颜色由 `components.css` 的 `.od-topbar--dark` 变体完整控制，深色头图页无需页面 CSS 干预。

**已冻结的组件细节（禁止修改）**：
- 标题**绝对居中**于顶栏正中（`position:absolute; left:50%; transform:translateX(-50%)`），居中不依赖左右控件宽度
- 左侧返回按钮 `0.76rem × 0.72rem`、箭头左对齐（`justify-content:flex-start`）、图标 `chevron-left.svg`（CSS mask 引用，颜色由 `color` → `currentColor` 控制，消除 SVG 硬编码）
- 右侧微信按钮 / spacer **等宽 0.76rem**（对称视觉平衡）
- nav 无白色背景（背景由页面透出）；明色有 `border-bottom: 0.005rem solid #E5E6EB`，暗色/ghost 无边框
- **明暗两套仅颜色差异**：布局/间距/字号/字重完全一致（标题统一 `0.17rem/500`）。明=深色文字（back/title `#1D2129`、微信 light），暗=白色文字（back/title `#FFFFFF/#F3F4F6`、微信 dark）。**禁止在 PageHeader.mount 调用之外手动操作组件 DOM、禁止覆盖 .od-topbar__* 尺寸/布局/字号**

---

## 5. 卡片默认样式（强制）

**无特殊说明时，所有卡片（白底内容块）默认**：

- 圆角：**8px**（`border-radius: 0.08rem`）
- 描边：**无**（不加 border；需要分隔时用背景色或内部上边框）
- 内边距：参考 Figma 对应设计稿（常见 16px）
- 背景：`#FFFFFF`

如需其他圆角/描边，必须由设计稿明确标注，并在代码注释注明 Figma 节点。

---

## 6. 复用组件（新增页面优先复用，禁止重造）

**通用组件样式单源化（强制）：所有组件样式统一放在 `styles/components.css`（基础重置 / 字体 / 色板 Token / 页头 / 顶栏全部变体 / 微信按钮），各页面在页面 CSS 之前先引入 `components.css`，页面 CSS 只允许写页面专属样式与设计稿特殊变体的覆盖，禁止复制组件样式到页面 CSS。**

**图标资源复用（强制）：以下通用图标已有现成资源，禁止再从设计稿下载、禁止另造图标，统一引用 `assets/icons/` 下资源：**

| 用途 | 资源 | 说明 |
|---|---|---|
| 二级页面页头返回箭头 | `assets/icons/chevron-left.svg` | 18×16 填充左箭头，Figma 932:68725 向左-线性 |
| 文字+箭头按钮的箭头（查看/更多/详情/余额明细等） | `assets/icons/chevron-right.svg` | 16×16 填充右箭头（**带中间一横的箭头图标**，与无横的三角图标区分）；经 CSS mask 填充 `currentColor`，颜色/尺寸由 CSS 控制；日历"上/下一项"与返回箭头不在此列 |
| 三角图标（明细展开等） | `assets/icons/oc-chevron-down.svg` | 16×16 描边下三角（**无中间一横的三角图标**，与日历上/下一项同风格） |

### 三角图标 vs 箭头图标 语义（强制）

**三角图标（无中间一横）＝ 状态性**：切换、收缩/伸展、上一个/下一个。
**箭头图标（有中间一横）＝ 方向性**：前往、后退、向上/向下。

| 场景 | 图标类型 | 资源 |
|---|---|---|
| 查看 / 更多 / 详情 / 余额明细 / 去充值 / 我要参加（前往） | 箭头 | `chevron-right.svg` |
| 页头返回 / 后退 | 箭头 | `chevron-left.svg` |
| 明细展开 / 收起（收缩/伸展） | 三角 | `oc-chevron-down.svg` |
| 日历上 / 下一项（上一个/下一个） | 三角 | 内联描边 chevron |
| 选填信息展开、表单下拉（切换/伸展） | 三角 | 内联描边 chevron |

### 文字+箭头按钮组件（text-arrow，强制）

**所有"文字 + 箭头"按钮（查看 / 更多 / 详情 / 余额明细 / 查看帮助 / 查看资质 / 去充值 / 我要参加 等）必须统一使用本组件，禁止在页面 CSS 中另写样式。**

- 组件样式单源：`styles/components.css` 中的 `.text-arrow` / `.text-arrow__icon` 及变体类。
- **结构固定（禁止变更）**：按钮（`button`/`a`）上挂 `text-arrow` 类，内容为文字 + 一个箭头图标；箭头必须带 `text-arrow__icon` 类并使用**统一箭头资源 `assets/icons/chevron-right.svg`**（见上文图标资源复用表），禁止内联 SVG、禁止更换资源。
- **仅 3 个维度可变**：颜色（变体类）、尺寸（图标尺寸变体）、风向（图标风向变体）；文字内容直接写在元素内。
  - 颜色变体（作用于按钮或图标）：`text-arrow--primary`（绿）、`--white`（白，深底）、`--muted`（灰 6B7280）、`--faint`（浅灰 C4C9D0，列表行尾）、`--blue`（蓝 4080FF，查看帮助/资质）。
  - 尺寸变体：`text-arrow--sm`（文字 12px，紧凑场景如"查看帮助/查看资质"）；默认 14px。图标尺寸：`text-arrow__icon--lg`（16px）；默认 12px。
  - 风向变体：`text-arrow__icon--left`（向左）、`--up`（向上）、`--down`（向下）；默认向右。
  - 三角图标变体：`text-arrow__icon--triangle`（无横三角，明细展开等，默认向下；展开时旋转 180° 向上）。

标准结构：

```html
<button class="text-arrow text-arrow--primary" type="button">查看
  <span class="text-arrow__icon" aria-hidden="true"></span>
</button>
```

| 组件 | 文件 | 用途 |
|---|---|---|
| 底部标签栏 | `components/tabbar.html` + `scripts/tabbar.js` + `styles/tabbar.css` | `Tabbar.mount({ active: 'home' })` |
| 页头（顶栏+筛选） | `scripts/page-header.js` + `scripts/topbar.js` + `styles/components.css` | `PageHeader.mount(...)` |
| 微信按钮 | `scripts/wechat-button.js` + `styles/components.css` | `<button data-wechat data-wechat-bg="dark|light">`，仅明暗两种样式 |
| 徽章 | `scripts/badge.js` + `styles/badge.css` | `<span class="badge" data-badge="admin">`，类型在 CONFIG 注册 |
| 文字+箭头按钮 | `styles/components.css` 的 `.text-arrow` | 查看/详情/余额明细/更多等，见上文规范 |
| 填充按钮 | `styles/components.css` 的 `.btn-fill` | 主操作胶囊按钮（确定报名/去开通/确定参加/提交开户/查看订单等），高 50 圆角 40 绿底白字 20/330（Figma 65:1317） |

### 填充按钮组件规范（强制）

**所有底部主操作胶囊按钮统一复用 `.btn-fill` 组件，禁止在页面 CSS 另写同类样式。**

```html
<button class="btn-fill" type="button">确定报名</button>
```

- 组件样式单源：`styles/components.css` 的 `.btn-fill`（Figma 65:1317 填充按钮：高 0.5rem、圆角 0.4rem、绿底 `--c-primary`、白字 20/330 `#F9FAFB`、padding 0.05rem 0.3rem）
- 宽度 / 横向 padding 为设计稿实例差异时，页面用扩展类覆盖（如 `.jd-bottombar__btn { width: 100% }`、`.js-bottombar__btn { padding: 0.05rem 0.64rem }`），**禁止改组件本身**
- 描边透明变体（次要按钮）在页面保留：`background: transparent; border: 0.01rem solid ...`

### 微信按钮组件规范（强制）

微信按钮一律通过组件渲染，**禁止在页面或顶栏变体中另造样式**（如自造胶囊/其他右侧元素）：

- 组件：`scripts/wechat-button.js`（`WechatButton.mount()` 扫描 `[data-wechat]` 自动注入图标）+ `styles/components.css` 的 `.topbar__wechat`（75×25、圆角 20）
- 结构（固定）：`<button class="topbar__wechat" type="button" aria-label="微信" data-wechat data-wechat-bg="dark|light"></button>`，图标由组件按明暗注入，禁止手写内容
- **仅明暗两种样式**：
  - `data-wechat-bg="dark"` → `--on-dark`（深色背景）：白描边 10% + 白图标 50%（`assets/icons/wechat-btn-on-dark.svg`）
  - `data-wechat-bg="light"` → `--on-light`（浅色背景）：白填充 10% + 深描边 10% + 深图标 50%（`assets/icons/wechat-btn-bright.svg`）
- 背景明暗判定：显式 `data-wechat-bg` 优先；未传时组件自动检测就近非透明背景亮度
- 顶栏变体（od/app/home/mine/code 等）需要微信按钮时，一律传 `right: 'wechat'` 由顶栏组件渲染（自动按顶栏背景明暗传 `on-dark/on-light`），页面不手写

### 徽章组件规范（强制）

徽章一律通过组件渲染，**禁止在 HTML 硬编码**图标/文字/颜色 class：

```html
<span class="badge" data-badge="real"></span>   <!-- 由 Badge.mount() 注入 .badge--xxx 类、图标与文字 -->
```

- 图标、文字由 `badge.js` 的 `CONFIG` 按 `data-badge` 类型注册；颜色由 `badge.css` 的 `.badge--xxx` 变体定义。
- 已注册类型（复用前查此表，勿新造）：

| data-badge | 文字 | 图标 | 背景色 |
|---|---|---|---|
| `admin` | 管理员 | `badge-broker.svg` | `#16A34A` |
| `real` | 已实名 | `shield-check.svg` | `#84CC16` |
| `broker` | 经纪人 | `broker-tag.svg` | `#22C55E` |

- 新增徽章类型：在 `CONFIG` 注册（label 必填、icon 可选）+ `badge.css` 添加 `.badge--xxx` 背景变体，不要改动其他类型。
- 圆角统一 4px、左上角 6px（`border-radius: 0.06rem 0.04rem 0.04rem 0.04rem`）；图标 24×24 左侧上凸 5.5px。

### 亮码卖货页-用户信息条（Figma 65:5897，强制）

深绿条 + 底部白色切角曲线，**结构与素材复用首页 `qr-card__user`**（切角一律用 `assets/icons/card-corner.svg`，贴底铺满）：

- 背景：`var(--c-primary-deep)`（`#15803D`）
- 圆角：上 16px（`0.16rem 0.16rem 0 0`），底部直角衔接白色卡片
- 内边距：16 / 24 / 24（`0.16rem 0.24rem 0.24rem`），不设固定高度
- 姓名：中文常规文本（MiSans 330，16px，白）
- 电话：西文5级标题（DINish Condensed 700，20px，白）
- 切角曲线：`position:absolute; left:0; bottom:0; width:100%; height:auto`

### 亮码卖货页-今日数据统计卡片（Figma 65:5925，强制）

两张**深绿卡**（`#15803D`、圆角 8、内边距 16、卡内纵向 gap 16、卡间 gap 16、距上 24）：

- 标签：中文小号文本（MiSans 330，14px，`#F3F4F6`），内容居中
- 数值：西文3级标题（DINish Condensed 700，**30px**，`#F3F4F6`）；`¥` 为独立 14px 元素，与数值基线对齐（gap 2）
- 按钮：**透明底**（无填充），图标 20×20 白、文字 16px `#F3F4F6`、行尾白箭头（text-arrow--white），gap 8，内容左对齐

---

## 7. 通用约束

- 尺寸单位用 **rem**（根字号 = 视口宽 / 3.75，375 设计稿等比缩放）；仅用户/设计明确指定固定值的元素可用 px（如 logo 40px）。
- **边距、间隔（padding / margin / gap）以 375 设计稿为准、用 rem 表达**：结构性间距按 8 的倍数（0.08rem 的倍数：8 / 16 / 24 / 32 @375）；**小图标、小徽章等元素内部允许 2 / 4 / 6 px 等小值**（设计稿如此，无需强归 8 倍数）。非 375 视口下 rem 等比缩放（如 8px 显示为 9px）属正常适配，不是误差；禁止因此改用固定 px 破坏整体等比。
- **顶栏高度统一 72px（0.72rem）**，以首页为标准；所有模块/二级页面顶栏保持一致，禁止另设高度。
- HTML **禁止硬编码行内样式**（`style="..."`）；JS 通过 `classList` 切换状态，不写 `element.style`。
- **禁止在多处重复硬编码相同的 DOM 结构**（如为每个步骤各写一份步骤条）；应提取为单份模板，状态由 JS 动态切换。
- **位图资源下载（远程/设计稿导出的 PNG 等）：必须下载 3x 分辨率**（`pngScale=3`），避免在手机屏幕上模糊。
- 字体：中文 MiSans / PingFang SC；**英文与数字统一使用 DINish Condensed**（开源字体 SIL OFL v1.1，本地嵌入 `assets/fonts/DINishCondensed-Regular.woff2`、`DINishCondensed-SemiBold.woff2`，字重 400 / 600）。
  - CSS 中只使用以下两个 token：
    ```css
    .font-body { font-family: var(--font-body); }
    .font-mono { font-family: var(--font-mono); }
    ```
  - 禁止手写 `font-family`。
- 状态切换（激活/选中/展开）统一用 `is-active`、`aria-expanded` 等语义类。
- **布局**：除首页吸顶外，禁止 `position:fixed` 做布局。
- **高度**：全部由 flex 控制，不允许手写 `calc(100vh - …)` 等高度计算。
- **挂载点**：每个 `.header-mount` 只挂载一次，内部 DOM 完全由组件接管，页面 JS 不往里插子节点。

---

## 8. 禁止行为速查表（强制）

> 以下行为一律禁止，无论页面类型。

- ❌ 在页面 HTML 中手写 `<header>` / `.topbar` / `.filter-bar` 结构
- ❌ 使用 `position:fixed` 做布局（首页吸顶除外）
- ❌ 用 `style="..."` 写行内样式
- ❌ 多个页面各自写一份 Header / Tabbar CSS
- ❌ 二级页 DOM 中保留 `.tabbar` 但隐藏（`display:none`）
- ❌ 计算 `height: calc(100vh - xxx)` 等手写高度
- ❌ 手写 `font-family`
- ❌ 混合使用两种布局模式（App Shell + Full Scroll 不共存于同一页面）

---

## 9. 表单组件规范（强制）

> 所有页面的表单（开户、称重、订单等）统一复用 `components.css` 的 `.form__*` 组件，禁止在页面 CSS 另写同类样式。

### 9.1 组件结构

```html
<div class="form__row">
  <label class="form__label form__label--required">标签</label>
  <div class="form__field">
    <input class="form__input" type="text" placeholder="..." />
    <span class="form__unit">元</span>         <!-- 可选：后缀单位 -->
    <svg class="form__arrow">...</svg>          <!-- 可选：行尾箭头 -->
  </div>
</div>
```

### 9.2 布局规则（强制）

- 每个 `.form__row` 水平外边距统一为 **`0.16rem`（16px）**，与卡片内边距对齐，禁止使用其他值
- 行高最小 **0.52rem（52px）**，内容垂直居中
- 行间分隔线：`0.005rem solid #E5E7EB`，首行无分隔线
- `.form__label` 固定宽度 **0.86rem**，标签与输入框间隙由 flex 自动撑满
- `.form__label--wide` 用于 **6 字以上长标签**，宽度 **1.36rem**，配合 `white-space: nowrap` 禁止换行
- `.form__label--required` 标签前添加红色 `*` 星号（颜色 `#C94747`）
- `.form__input` 文字 **右对齐**，背景透明，无默认边框，placeholder 颜色 `#9CA3AF`
- `.form__input::placeholder`：使用 `var(--c-text-light)`

### 9.3 禁止行为

- ❌ 在页面 CSS 中重写 `form__row` / `form__label` / `form__input` 样式
- ❌ 使用 `.form__row` 之外的其他结构（如 `display:grid` 或 `table`）做表单行
- ❌ 修改 `.form__row` 的 margin 值（统一 16px，不可变）
