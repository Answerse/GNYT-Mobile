# 桂农易通 V1.0 — DESIGN.md 设计规约

> 来源：Figma 文件 `桂农易通 V1.0`（fileKey: `1GzVU8vVsFMDNVK44UFWRs`）
> 数据来源说明：本文档的 **Design Tokens（颜色 / 间距 / 圆角 / 描边 / 文字 / 遮罩）**
> 提取自 Figma Variables 导出文件 `variables-export-2026-08-11.json`。
> **字体、阴影、布局系统、页面路由、组件清单、交互动效、图标资源** 因 Figma MCP
> 读取受阻（token 403 / 请求超时）暂未获取，已在对应章节标注 `[Figma 节点树未读取，待补]`，
> 待 MCP 权限恢复或补充导出后补全，**禁止编造**。

---

## 0. 设计 Token 总览（语义层 → 源色层）

Figma 采用两层变量结构：

- **语义层（ Semantic ）**：`桂农易通` 集合（Fill / Stroke / Text / Icon / Background / Overlay / Spacing / Radius），
  用于组件与页面引用，便于主题切换。
- **源色层（ Primitives ）**：`Colors` 集合（Green / Lime / Blue / Violet / Orange / Red / Gray / Neutral / Neutral-R），
  存放真实 hex，被语义层别名引用。

> 引用写法示例：`Fill.Primary.Default` → 别名 `{Colors.Green.500}` → 真实 `#22c55e`。
> 后续代码统一引用**语义层** token，不要直接写源色 hex。

---

## 1. Design Tokens

### 1.1 颜色 — 品牌主色（Fill.Primary）

| 语义 Token | 映射源色 | HEX | Tailwind 建议 class |
|---|---|---|---|
| `Fill.Primary.Default` | Colors.Green.500 | `#22c55e` | `bg-primary-500` / `text-primary-500` |
| `Fill.Primary.Hover` | Colors.Green.600 | `#16a34a` | `hover:bg-primary-600` |
| `Fill.Primary.Active` | Colors.Green.700 | `#15803d` | `active:bg-primary-700` |
| `Fill.Primary.Subtle` | Colors.Green.50 | `#f0fdf4` | `bg-primary-50` |
| `Fill.Primary.Weak` | Colors.Green.100 | `#dcfce7` | `bg-primary-100` |
| `Fill.Primary.Strong` | Colors.Green.700 | `#15803d` | `bg-primary-700` |

### 1.2 颜色 — 中性色（Fill.Neutral / Background）

| 语义 Token | 映射源色 | HEX | Tailwind 建议 class |
|---|---|---|---|
| `Fill.Neutral.Default` | Colors.Gray.100 | `#f3f4f6` | `bg-neutral-100` |
| `Fill.Neutral.Hover` | Colors.Gray.200 | `#e5e7eb` | `hover:bg-neutral-200` |
| `Fill.Neutral.Active` | Colors.Gray.300 | `#d1d5db` | `active:bg-neutral-300` |
| `Fill.Neutral.Subtle` | Colors.Neutral.10 | `rgba(16,18,21,0.05)` | `bg-neutral-10` |
| `Fill.Neutral.Weak` | Colors.Neutral.40 | `rgba(16,18,21,0.20)` | `bg-neutral-40` |
| `Fill.Neutral.Strong` | Colors.Neutral.80 | `rgba(16,18,21,0.40)` | `bg-neutral-80` |

| 语义 Token | 映射源色 | HEX | 说明 |
|---|---|---|---|
| `Background.Bg-1` | Colors.Neutral.0 | `#ffffff` | 页面主背景（白） |
| `Background.Bg-2` | Colors.Neutral.3 | `rgba(16,18,21,0.02)` | 次级背景 |
| `Background.Bg-3` | Colors.Neutral.6 | `rgba(16,18,21,0.03)` | 卡片/区块背景 |
| `Background.Bg-4` | Colors.Neutral.10 | `rgba(16,18,21,0.05)` | 凹陷/禁用背景 |

### 1.3 颜色 — 文字色（Text）

| 语义 Token | 映射 | 值 | 用途 |
|---|---|---|---|
| `Text.Primary` | Colors.Gray.900 | `#111827` | 主标题/正文 |
| `Text.Secondary` | Colors.Gray.600 | `#4b5563` | 次要文字 |
| `Text.Tertiary` | Colors.Gray.400 | `#9ca3af` | 占位/辅助 |
| `Text.Info` | Colors.Green.700 | `#15803d` | 信息强调 |
| `Text.On-Primary` | Colors.Neutral-R.100 | `rgba(255,255,255,0.96)` | 主色按钮上的文字（白） |
| `Text.Status.Success` | Colors.Green.700 | `#15803d` | 成功状态文字 |
| `Text.Status.Warning` | Colors.Orange.700 | `#c2410c` | 警告状态文字 |
| `Text.Status.Danger` | Colors.Red.700 | `#b91c1c` | 危险状态文字 |
| `Text.Status.Info` | Colors.Blue.700 | `#1d4ed8` | 信息状态文字 |

### 1.4 颜色 — 图标色（Icon）

| 语义 Token | 映射 | 值 |
|---|---|---|
| `Icon.Primary` | Colors.Green.500 | `#22c55e` |
| `Icon.Secondary` | Colors.Gray.500 | `#6b7280` |
| `Icon.Tertiary` | Colors.Gray.400 | `#9ca3af` |
| `Icon.On-Primary` | Colors.Neutral-R.100 | `rgba(255,255,255,0.96)` |

### 1.5 颜色 — 描边 / 边框（Stroke）

| 语义 Token | 映射源色 | HEX | 用途 |
|---|---|---|---|
| `Stroke.Primary.Default` | Colors.Green.500 | `#22c55e` | 主色描边 |
| `Stroke.Primary.Subtle` | Colors.Green.50 | `#f0fdf4` | 主色浅描边 |
| `Stroke.Secondary.Default` | Colors.Lime.500 | `#84cc16` | 次色描边（Lime） |
| `Stroke.Secondary.Subtle` | Colors.Lime.50 | `#f7fee7` | 次色浅描边 |
| `Stroke.Neutral.Default` | Colors.Gray.200 | `#e5e7eb` | 默认边框 |
| `Stroke.Neutral.Strong` | Colors.Gray.300 | `#d1d5db` | 强调边框 |

> 边框宽度（border width）[Figma 变量未读取，待补]。建议默认 `1px`，强边框 `1.5px`/`2px`。

### 1.6 颜色 — 状态色（Status）

| 语义 Token | 映射源色 | HEX | Tailwind class |
|---|---|---|---|
| `Fill.Status.Success.Default` | Colors.Green.500 | `#22c55e` | `bg-success-500` |
| `Fill.Status.Success.Subtle` | Colors.Green.50 | `#f0fdf4` | `bg-success-50` |
| `Fill.Status.Warning.Default` | Colors.Orange.500 | `#f97316` | `bg-warning-500` |
| `Fill.Status.Warning.Subtle` | Colors.Orange.50 | `#fff7ed` | `bg-warning-50` |
| `Fill.Status.Danger.Default` | Colors.Red.500 | `#ef4444` | `bg-danger-500` |
| `Fill.Status.Danger.Subtle` | Colors.Red.50 | `#fef2f2` | `bg-danger-50` |
| `Fill.Status.Info.Default` | Colors.Blue.500 | `#3b82f6` | `bg-info-500` |
| `Fill.Status.Info.Subtle` | Colors.Blue.50 | `#eff6ff` | `bg-info-50` |

### 1.7 颜色 — 遮罩（Overlay）

| 语义 Token | 值（alpha） | 用途 |
|---|---|---|
| `Overlay.Black.20` | `rgba(0,0,0,0.20)` | 浅遮罩 |
| `Overlay.Black.30` | `rgba(0,0,0,0.30)` | 弹窗遮罩 |
| `Overlay.Black.40` | `rgba(0,0,0,0.40)` | 强遮罩 |
| `Overlay.Black.60` | `rgba(0,0,0,0.60)` | 暗化背景 |
| `Overlay.Black.80` | `rgba(0,0,0,0.80)` | 接近全黑 |
| `Overlay.White.20` | `rgba(255,255,255,0.20)` | 浅色遮罩（Light 反白） |
| `Overlay.White.40` | `rgba(255,255,255,0.40)` | 浅色强遮罩 |
| `Overlay.White.60` | `rgba(255,255,255,0.60)` | — |
| `Overlay.White.80` | `rgba(255,255,255,0.80)` | — |
| `Overlay.White.90` | `rgba(255,255,255,0.90)` | 接近全白 |

### 1.8 间距（Spacing）

> 单位：px。统一为 4 的倍数。

| Token | 值 | 说明 |
|---|---|---|
| `Spacing.0` | `0` | 无间距 |
| `Spacing.3Xs` | `2` | 极小 |
| `Spacing.2Xs` | `4` | 超小 |
| `Spacing.Xs` | `8` | 小 |
| `Spacing.Sm` | `12` | 中小 |
| `Spacing.Md` | `16` | 中（基础栅格单位） |
| `Spacing.Lg` | `20` | 中大 |
| `Spacing.Xl` | `24` | 大 |
| `Spacing.2Xl` | `32` | 超大 |
| `Spacing.3Xl` | `40` | — |
| `Spacing.4Xl` | `48` | — |
| `Spacing.5Xl` | `64` | 区块间距 |

### 1.9 圆角（Radius）

| Token | 值 | Tailwind class |
|---|---|---|
| `Radius.None` | `0` | `rounded-none` |
| `Radius.Xxs` | `2` | `rounded-[2px]` |
| `Radius.Xs` | `4` | `rounded` |
| `Radius.Sm` | `6` | `rounded-md` |
| `Radius.Md` | `8` | `rounded-lg` |
| `Radius.Lg` | `12` | `rounded-xl` |
| `Radius.Xl` | `16` | `rounded-2xl` |
| `Radius.2Xl` | `20` | `rounded-[20px]` |
| `Radius.3Xl` | `24` | `rounded-3xl` |
| `Radius.4Xl` | `28` | `rounded-[28px]` |
| `Radius.5Xl` | `32` | `rounded-[32px]` |
| `Radius.6Xl` | `36` | `rounded-[36px]` |
| `Radius.Full` | `9999` | `rounded-full` |

### 1.10 字体（Typography）

> [Figma 变量未读取，待补] — 变量导出文件中未包含 FontSize / FontWeight / LineHeight 变量。
> 待从 Figma 节点树或 typography 变量集合补全。建议补充：字号阶梯 12/14/16/20/24/32/40，
> 字重 400/500/600/700，行高对应比例。

### 1.11 阴影（Shadow / Elevation）

> [Figma 变量未读取，待补] — 导出文件中无 Shadow / Effect 变量。
> 待从 Figma 节点树补全 card / modal / toast 各档 shadow。

### 1.12 边框（Border）

- 边框色见 §1.5（Stroke.Neutral.Default = `#e5e7eb` 等）。
- 边框宽度 [Figma 变量未读取，待补]，建议默认 `1px`。
- 边框圆角见 §1.9（Radius）。

---

## 2. 布局系统

> [Figma 节点树未读取，待补]
> 待补：容器最大宽度、栅格栏数、gutter、页面 margin、断点（mobile / tablet / desktop）。
> 已知项目为 **Mobile** 端（仓库名 GNYT-Mobile），推测以移动端单列布局为主，
> 具体断点定义需从 Figma 框架确认。

---

## 3. 页面与路由映射

> [Figma 节点树未读取，待补]
> Figma MCP 读取受阻，无法列出 Page / Frame 与路由。待权限恢复后补全：
> 列出所有 Page/Frame、推断路由路径（如 `/home`、`/login`、`/profile`）、
> 标注每个页面核心区块（Header / Hero / Content / Footer）。

---

## 4. 组件清单

> [Figma 节点树未读取，待补]
> 待列：Button / Input / Card / Nav / Modal / TabBar 等可复用组件，
> 标注 Figma 节点 id、变体（variant）、状态（default/hover/active/disabled），
> 建议组件路径（React + TypeScript + Tailwind 约定，如 `src/components/ui/Button.tsx`）。

---

## 5. 交互与动效

> [Figma 节点树未读取，待补]
> 待补：hover/active/focus/disabled 样式差异、Smart Animate / Prototype 转场动画。
> 已知交互语义：Primary 色含 Hover(600) / Active(700) 三态，见 §1.1。

---

## 6. 图标与资源

> [Figma 节点树未读取，待补]
> 待列：图标集、图片资源、存放路径建议（如 `src/assets/icons/`）。
> 已知图标色 token 见 §1.4（Icon.Primary/Secondary/Tertiary/On-Primary）。

---

## 7. 禁止事项（后续 AI 生成代码时必须遵守）

1. **禁止硬编码颜色 hex / rgba** 散落在组件代码里。所有颜色必须引用语义 Token
   （如 `bg-primary-500`、`text-neutral-600`、`bg-neutral-10`），仅在本 DESIGN.md
   的 Token 表及必要的 Tailwind 配置中允许出现原始值。
2. **禁止直接引用源色层**（如 `Colors.Green.500`）——必须走语义层
   （`Fill.Primary.Default` 等），否则主题切换会失效。
3. **禁止编造缺失信息**。凡标注 `[Figma 节点树未读取，待补]` 的章节
   （字体、阴影、布局、页面、组件、交互、图标），在拿到真实数据前不得假定具体值。
4. **禁止偏离间距/圆角档位**。间距只能用 §1.8 的 `Spacing.*`，圆角只能用 §1.9 的 `Radius.*`，
   不得擅自使用其他数值。
5. **禁止把语义色当状态色混用**。Primary/Neutral 用于品牌与中性，
   Status(Success/Warning/Danger/Info) 仅用于状态语义。
6. **禁止在 HTML/Vue template 写行内 style 属性**，样式一律放 `.css` / Tailwind class。
   （项目硬性规则）

---

## 8. 数据来源与待办

- ✅ 已提取（来自 `variables-export-2026-08-11.json`）：颜色（品牌/中性/文字/图标/描边/状态/遮罩）、间距、圆角。
- ⬜ 待补（需 Figma 节点树或补充导出）：
  1. 字体（§1.10）
  2. 阴影（§1.11）
  3. 边框宽度（§1.12）
  4. 布局系统 / 断点（§2）
  5. 页面与路由映射（§3）
  6. 组件清单（§4）
  7. 交互与动效（§5）
  8. 图标与资源（§6）

> 补全流程：修复 Figma MCP token 权限（403）→ 调用 `get_figma_data` 读取节点树
> （建议指定具体 Page/Frame 的 node-id 避免超时，如 `59:2267`）→ 回填上述待补章节。
