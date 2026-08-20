// 桂农易通 微信按钮组件
// 用法（页面复用）：
//   <script src="scripts/wechat-button.js"></script>
//   <button class="topbar__wechat" type="button" aria-label="微信" data-wechat></button>
//   WechatButton.mount()  // 扫描所有 [data-wechat]，自动注入图标并适配明暗
// 适配规则：
//   - data-wechat-bg="dark"|"light" 显式指定（优先）
//   - 否则自动检测就近非透明背景色的亮度；背景为图片（深色头部）按深色处理
// 说明：仅通过 classList 切换状态，不写 element.style，无框架依赖

(function () {
  'use strict';

  var SVG = {
    dark: 'assets/icons/wechat-btn-on-dark.svg',    // 深色背景：白描边 10% + 白图标 50%
    light: 'assets/icons/wechat-btn-bright.svg'     // 明亮背景：白填充 10% + 深描边 10% + 深图标 50%（Figma 910:13227 深色模式=On）
  };

  function parseRGB(bg) {
    var m = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    return m ? [+m[1], +m[2], +m[3]] : null;
  }

  // 相对亮度（0 黑 → 1 白）
  function luminance(rgb) {
    return (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) / 255;
  }

  // 自动检测背景明暗：就近非透明背景色判断亮度；背景图为深色头部（本项目约定）视为深色
  function detectMode(el) {
    var cur = el;
    while (cur && cur !== document.body) {
      var cs = getComputedStyle(cur);
      var bg = cs.backgroundColor;
      if (bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
        var rgb = parseRGB(bg);
        if (rgb) return luminance(rgb) > 0.55 ? 'light' : 'dark';
      }
      if (cs.backgroundImage && cs.backgroundImage !== 'none') {
        return 'dark';
      }
      cur = cur.parentElement;
    }
    return 'light';
  }

  function mount() {
    document.querySelectorAll('[data-wechat]').forEach(function (btn) {
      if (btn.classList.contains('topbar__wechat--on-dark') ||
          btn.classList.contains('topbar__wechat--on-light')) {
        return; // 已渲染，幂等
      }
      var mode = btn.getAttribute('data-wechat-bg') || detectMode(btn);
      var img = document.createElement('img');
      img.className = 'topbar__wechat-icon';
      img.src = mode === 'dark' ? SVG.dark : SVG.light;
      img.alt = '';
      btn.appendChild(img);
      btn.classList.add(mode === 'dark' ? 'topbar__wechat--on-dark' : 'topbar__wechat--on-light');
    });
  }

  window.WechatButton = { mount: mount };
})();
// 桂农易通 徽章组件
// 用法（页面复用）：
//   <script src="scripts/badge.js"></script>
//   <span class="badge" data-badge="admin"></span>
//   Badge.mount()  // 扫描所有 [data-badge]，注入图标与文字
// 新增徽章类型：在 CONFIG 注册（label 必填，icon 可选），
//   并在 styles/badge.css 添加对应 .badge--xxx 背景变体。
// 说明：仅通过 classList 切换状态，不写 element.style，无框架依赖

(function () {
  'use strict';

  var CONFIG = {
    admin: { label: '管理员', icon: 'assets/icons/badge-broker.svg' },
    real:  { label: '已实名', icon: 'assets/icons/shield-check.svg' },
    broker:{ label: '经纪人', icon: 'assets/icons/broker-tag.svg' }
    // 示例：broker: { label: '经纪人', icon: 'assets/icons/broker-tag.svg' },
    //       real:  { label: '已实名', icon: 'assets/icons/shield-check.svg' }
  };

  function mount() {
    document.querySelectorAll('[data-badge]').forEach(function (el) {
      var type = el.getAttribute('data-badge');
      var cfg = CONFIG[type];
      if (!cfg || el.classList.contains('badge--' + type)) return;
      el.classList.add('badge--' + type);
      if (cfg.icon) {
        var img = document.createElement('img');
        img.className = 'badge__icon';
        img.src = cfg.icon;
        img.alt = '';
        el.appendChild(img);
      }
      el.appendChild(document.createTextNode(cfg.label));
    });
  }

  window.Badge = { mount: mount };
})();
// 桂农易通 底部标签栏组件
// 用法：<script src="scripts/tabbar.js"></script>
//   Tabbar.mount({ active: 'home' })
//     - active: 当前激活页（home/order/code/flow/mine），默认 'home'
// 说明：tabbar HTML 已内联在页面 body 中（消除 fetch 模板请求），本组件仅做高亮与跳转绑定
// 拆分后主模块为独立 HTML 文件，点击 tab 直接跳转对应页面

(function () {
  'use strict';

  // 主模块 → 独立页面映射
  var PAGE_MAP = {
    home: 'home.html',
    order: 'order.html',
    code: 'code.html',
    flow: 'flow.html',
    mine: 'mine.html'
  };

  // 激活指定 tab
  function setActive(nav, key) {
    nav.querySelectorAll('.tabbar__item').forEach(function (item) {
      item.classList.toggle('tabbar__item--active', item.getAttribute('data-page') === key);
    });
  }

  function bindTabs(nav, active) {
    nav.querySelectorAll('.tabbar__item').forEach(function (item) {
      item.addEventListener('click', function () {
        var key = item.getAttribute('data-page');
        if (key === active) return;          // 当前页不重复跳转
        var target = PAGE_MAP[key];
        if (target) window.location.href = target;
      });
    });
  }

  function mount(opts) {
    var active = (opts && opts.active) || 'home';
    // 直接查找页面中已内联的 tabbar DOM，不再 fetch 模板
    var nav = document.querySelector('.tabbar');
    if (!nav) return;
    setActive(nav, active);
    bindTabs(nav, active);
  }

  window.Tabbar = { mount: mount };
})();
// 桂农易通 顶栏组件（Topbar，DESIGN.md 顶栏 4 变体 + 首页/亮码等形态）
// 用法：
//   <script src="scripts/topbar.js"></script>
//   Topbar.mount({
//     container: 挂载容器元素,
//     variant: 'home' | 'mine' | 'code' | 'app' | 'od' | 'oc',   // 默认 'app'
//     left: 'logo' | { type: 'back', href: 'index.html' } | null,
//     title: '页面标题',        // 变体 od/oc 居中标题
//     tabs: [{ label, value, active }],  // app/home 中间标签
//     right: 'wechat' | 'actions' | null, // 右侧插槽（wechat 按背景明暗自动适配）
//     onTab: 切换回调（value）
//   })
// 说明：
//   - 按 variant 生成与手写版完全一致的 DOM（复用现有 CSS 类名），保证视觉零变化
//   - 仅通过 classList 切换状态，不写 element.style；微信按钮由 WechatButton 渲染（幂等）

(function () {
  'use strict';

  var LOGO_MARK_SRC = 'assets/icons/logo-mark.svg';  // app 变体 40px 方标
  var LOGO_SRC = 'assets/icons/logo.svg';            // home/mine/code 系统 logo（含"农户版"tag）

  // 系统 logo + tag（首页/我的/亮码共用；tagText 可自定义，默认"农户版"）
  function buildLogoWrap(tagText) {
    var wrap = document.createElement('div');
    wrap.className = 'topbar__logo-wrap';
    var logo = document.createElement('img');
    logo.className = 'topbar__logo';
    logo.src = LOGO_SRC;
    logo.alt = '桂农易通';
    wrap.appendChild(logo);
    var tag = document.createElement('span');
    tag.className = 'topbar__tag';
    tag.textContent = tagText || '农户版';
    wrap.appendChild(tag);
    return wrap;
  }

  // 微信按钮（mode: dark 深色背景 / light 亮色背景）
  function buildWechat(mode) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'topbar__wechat';
    btn.setAttribute('aria-label', '微信');
    btn.setAttribute('data-wechat', '');
    btn.setAttribute('data-wechat-bg', mode);
    return btn;
  }

  function buildNav(header, opts) {
    var variant = opts.variant || 'app';

    if (variant === 'home') {
      var nav1 = document.createElement('div');
      nav1.className = 'topbar__nav';
      nav1.appendChild(buildLogoWrap());
      if (opts.right === 'wechat') nav1.appendChild(buildWechat('dark'));
      header.appendChild(nav1);
      return;
    }

    // 首页导航（Figma 247:10080）：标签新尺寸 + 切换按钮（企业版），独立变体不影响 mine/code
    if (variant === 'nav') {
      var navN = document.createElement('div');
      navN.className = 'topbar__nav';
      navN.appendChild(buildLogoWrap());
      var actions = document.createElement('div');
      actions.className = 'topbar__nav-actions';
      // 切换按钮：图标 + "企业版"文字（Figma 911:16168，白 50%/60% 透明）
      var sw = document.createElement('button');
      sw.type = 'button';
      sw.className = 'topbar__switch';
      sw.setAttribute('aria-label', '切换企业版');
      var swIcon = document.createElement('img');
      swIcon.className = 'topbar__switch-icon';
      swIcon.src = 'assets/icons/topbar-switch.svg';
      swIcon.alt = '';
      sw.appendChild(swIcon);
      var swText = document.createElement('span');
      swText.className = 'topbar__switch-text';
      swText.textContent = '企业版';
      sw.appendChild(swText);
      actions.appendChild(sw);
      if (opts.right === 'wechat') actions.appendChild(buildWechat('dark'));
      navN.appendChild(actions);
      header.appendChild(navN);
      return;
    }

    if (variant === 'mine') {
      var nav2 = document.createElement('div');
      nav2.className = 'mine-topbar__nav';
      nav2.appendChild(buildLogoWrap(opts.tagText));
      var right2 = document.createElement('div');
      right2.className = 'mine-topbar__right';
      // 切换按钮（right === 'switch+wechat' 时显示，如服务商版）
      if (opts.right === 'switch+wechat') {
        var sw2 = document.createElement('button');
        sw2.type = 'button';
        sw2.className = 'topbar__switch';
        sw2.setAttribute('aria-label', '切换版本');
        var swIcon2 = document.createElement('img');
        swIcon2.className = 'topbar__switch-icon';
        swIcon2.src = 'assets/icons/topbar-switch.svg';
        swIcon2.alt = '';
        sw2.appendChild(swIcon2);
        var swText2 = document.createElement('span');
        swText2.className = 'topbar__switch-text';
        swText2.textContent = '切换';
        sw2.appendChild(swText2);
        right2.appendChild(sw2);
      }
      right2.appendChild(buildWechat('dark'));
      nav2.appendChild(right2);
      header.appendChild(nav2);
      return;
    }

    if (variant === 'code') {
      var nav3 = document.createElement('div');
      nav3.className = 'code-topbar__nav';
      nav3.appendChild(buildLogoWrap());
      var right3 = document.createElement('div');
      right3.className = 'code-topbar__right';
      right3.appendChild(buildWechat('dark'));
      nav3.appendChild(right3);
      header.appendChild(nav3);
      return;
    }

    if (variant === 'od') {
      var nav4 = document.createElement('div');
      nav4.className = 'od-topbar__nav';
      // 透明悬浮态（浅色渐变头图）：类名由 od-topbar--ghost 变体定义
      if (opts.ghost) header.classList.add('od-topbar--ghost');
      // 暗色变体（深色头图背景）：类名由 od-topbar--dark 变体定义
      if (opts.dark) header.classList.add('od-topbar--dark');
      // 返回：默认 a 跳转；传 onBack 时为 button 触发回调（如订单创建"回上一步"）
      var isBtn = opts.left && opts.left.onBack;
      var back4 = document.createElement(isBtn ? 'button' : 'a');
      back4.className = 'od-topbar__back';
      if (isBtn) {
        back4.type = 'button';
        back4.addEventListener('click', opts.left.onBack);
      } else {
        back4.href = (opts.left && opts.left.href) || 'index.html';
      }
      back4.setAttribute('aria-label', '返回');
      // 返回图标：CSS mask 引用 chevron-left.svg，颜色由父级 color → currentColor 控制
      var backIcon = document.createElement('span');
      backIcon.className = 'od-topbar__back-icon';
      back4.appendChild(backIcon);
      nav4.appendChild(back4);
      var title4 = document.createElement('h1');
      title4.className = 'od-topbar__title';
      title4.textContent = opts.title || '';
      nav4.appendChild(title4);
      // 右侧：可选微信按钮（明色模式用 light，暗色模式用 dark；wechatBg 显式覆盖优先）
      if (opts.right === 'wechat') {
        nav4.appendChild(buildWechat(opts.wechatBg || (opts.dark ? 'dark' : 'light')));
      } else {
        var spacer4 = document.createElement('div');
        spacer4.className = 'od-topbar__spacer';
        nav4.appendChild(spacer4);
      }
      header.appendChild(nav4);
      return;
    }

    // ---- app 变体（订单 / 收支主模块，浅色 + Logo/返回 + 标签 + 微信按钮） ----
    var nav = document.createElement('div');
    nav.className = 'app-topbar__nav';

    if (opts.left === 'logo') {
      var logo = document.createElement('img');
      logo.className = 'app-topbar__logo';
      logo.src = LOGO_MARK_SRC;
      logo.alt = '桂农易通';
      nav.appendChild(logo);
    } else if (opts.left && opts.left.type === 'back') {
      var back = document.createElement('a');
      back.className = 'app-topbar__back';
      back.href = opts.left.href || 'index.html';
      back.setAttribute('aria-label', '返回');
      back.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>';
      nav.appendChild(back);
    }

    if (opts.tabs && opts.tabs.length) {
      var tabs = document.createElement('div');
      tabs.className = 'app-topbar__tabs';
      opts.tabs.forEach(function (t) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'app-topbar__tab' + (t.active ? ' is-active' : '');
        btn.dataset.tab = t.value;
        btn.textContent = t.label;
        btn.addEventListener('click', function () {
          tabs.querySelectorAll('.app-topbar__tab').forEach(function (b) {
            b.classList.toggle('is-active', b === btn);
          });
          if (opts.onTab) opts.onTab(t.value);
        });
        tabs.appendChild(btn);
      });
      nav.appendChild(tabs);
    }

    if (opts.right === 'wechat') {
      nav.appendChild(buildWechat('light'));
    }

    header.appendChild(nav);
  }

  function mount(opts) {
    var el = opts.container;
    if (!el) return;
    var variant = opts.variant || 'app';
    var header = document.createElement('header');
    if (variant === 'nav') {
      header.className = 'topbar topbar--nav';
    } else {
      header.className =
        variant === 'home' ? 'topbar' :
        variant === 'mine' ? 'mine-topbar' :
        variant === 'code' ? 'code-topbar' :
        variant === 'od' ? 'od-topbar' :
        variant === 'oc' ? 'oc-topbar' : 'app-topbar';
    }
    buildNav(header, opts);
    if (opts.prepend) {
      el.insertBefore(header, el.firstChild);
    } else {
      el.appendChild(header);
    }
    // 渲染微信按钮（幂等）
    if (window.WechatButton) WechatButton.mount();
  }

  window.Topbar = { mount: mount };
})();
// 桂农易通 页头组件（顶栏 + 可选筛选栏，固定在页头不随页面滚动）
// 用法：
//   <script src="scripts/topbar.js"></script>  <!-- 依赖 -->
//   <script src="scripts/page-header.js"></script>
//   PageHeader.mount({
//     container: 挂载容器元素,
//     topbar: { left: 'logo', tabs: [...], right: 'wechat' },  // 复用顶栏组件
//     filter: {  // 可选：筛选栏（订单页等）
//       tabs: [{ label: '全部', value: 'all', count: 0, active: true }, ...],
//       search: true
//     },
//     onTab: 顶栏标签切换回调（value）
//   })
// 说明：仅通过 classList 切换状态，不写 element.style；微信按钮由 WechatButton 渲染

(function () {
  'use strict';

  function buildFilter(opts) {
    var bar = document.createElement('div');
    bar.className = 'order-filterbar';

    var tabs = document.createElement('div');
    tabs.className = 'order-tabs';
    opts.tabs.forEach(function (t) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'order-tab' + (t.active ? ' is-active' : '');
      btn.dataset.tab = t.value;
      btn.appendChild(document.createTextNode(t.label));
      if (t.count !== undefined) {
        var count = document.createElement('span');
        count.className = 'order-tab__count';
        count.textContent = t.count;
        btn.appendChild(count);
      }
      btn.addEventListener('click', function () {
        tabs.querySelectorAll('.order-tab').forEach(function (b) {
          b.classList.toggle('is-active', b === btn);
        });
        if (opts.onTab) opts.onTab(t.value);
      });
      tabs.appendChild(btn);
    });
    bar.appendChild(tabs);

    var divider = document.createElement('span');
    divider.className = 'order-filterbar__divider';
    divider.setAttribute('aria-hidden', 'true');
    bar.appendChild(divider);

    if (opts.search) {
      var search = document.createElement('div');
      search.className = 'order-search';
      search.innerHTML = '<svg class="order-search__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg><span class="order-search__text">搜索</span>';
      bar.appendChild(search);
    }
    return bar;
  }

  // 分段控件式筛选栏（收支页：收入/支出 + 日/月/年，Figma 230:4345）
  function buildSegments(opts) {
    var bar = document.createElement('div');
    bar.className = 'flow-segments';

    opts.groups.forEach(function (group) {
      var seg = document.createElement('div');
      seg.className = 'flow-seg ' + group.cls;

      group.items.forEach(function (item) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'flow-seg__btn' + (item.active ? ' is-active' : '');
        btn.dataset[group.key] = item.value;
        btn.appendChild(document.createTextNode(item.label));
        btn.addEventListener('click', function () {
          seg.querySelectorAll('.flow-seg__btn').forEach(function (b) {
            b.classList.toggle('is-active', b === btn);
          });
          if (opts.onSeg) opts.onSeg(group.key, item.value);
        });
        seg.appendChild(btn);
      });

      bar.appendChild(seg);
    });
    return bar;
  }

  function mount(opts) {
    var el = opts.container;
    if (!el) return;

    // 无包装模式：直接把顶栏挂到 container（首部），用于 sticky 顶栏等需要父容器包住内容的场景
    // （如订单创建页 oc-topbar sticky 相对滚动视口，父容器必须是内容区而非固定高包装层）
    if (opts.wrap === false) {
      if (window.Topbar) {
        Topbar.mount({
          container: el,
          prepend: opts.prepend,
          variant: opts.topbar.variant,
          left: opts.topbar.left,
          title: opts.topbar.title,
          tabs: opts.topbar.tabs,
          right: opts.topbar.right,
          onTab: opts.onTab
        });
      }
      return;
    }

    var header = document.createElement('div');
    header.className = 'page-header';

    var topbarMount = document.createElement('div');
    header.appendChild(topbarMount);

    // 先挂入文档，再构建顶栏：保证 WechatButton.mount() 的全文档扫描能命中页头内的微信按钮
    el.appendChild(header);

    if (window.Topbar) {
      Topbar.mount({
        container: topbarMount,
        variant: opts.topbar.variant,   // home/mine/code/app/od/oc
        left: opts.topbar.left,
        title: opts.topbar.title,       // 变体 od/oc 居中标题
        tabs: opts.topbar.tabs,
        right: opts.topbar.right,
        ghost: opts.topbar.ghost,       // 变体 od：透明悬浮态（浅色渐变头图）
        dark: opts.topbar.dark,         // 变体 od：暗色 — 白色文字 + 透明无边框（深色头图）
        onTab: opts.onTab
      });
    }

    if (opts.filter) {
      var sub = (opts.filter.type === 'segments') ? buildSegments(opts.filter) : buildFilter(opts.filter);
      header.appendChild(sub);
    }
  }

  window.PageHeader = { mount: mount };
})();
/**
 * FullScrollHeader — 首页模式 Full Scroll 页头吸顶组件
 *
 * 用法：
 *   FullScrollHeader.mount({
 *     scrollEl: '#page-home',     // 滚动容器（默认 window）
 *     headerEl: '.header-mount',  // 页头挂载点（必须）
 *     heroEl:   '.jd-hero',       // Hero 元素（必须）
 *     threshold: 0,               // 触发偏移（默认 0，即 Hero 完全离开视口后触发）
 *   });
 *
 * 行为：
 *   - Hero 完全离开视口后给 headerEl 添加 .is-fixed 类（fixed 吸顶 + 白底 + 入场动效）
 *   - Hero 重新进入视口时移除 .is-fixed（恢复文档流原位置）
 *   - rAF 节流，passive 监听，零 style 写入，仅 classList 切换
 *
 * 样式依赖（components.css）：
 *   @keyframes header-drop-in   — 入场从上渐入动效
 *
 * 页面 CSS 负责：
 *   .header-mount.is-fixed { position: fixed; top: 0; ... } 等布局 + 颜色覆盖
 */
(function () {
  'use strict';

  var FullScrollHeader = {
    mount: function (opts) {
      if (!opts) return;

      // --- 解析参数 ---
      var scrollEl;
      if (typeof opts.scrollEl === 'string') {
        scrollEl = document.querySelector(opts.scrollEl);
      } else if (opts.scrollEl) {
        scrollEl = opts.scrollEl;
      } else {
        scrollEl = window;
      }

      var headerEl = typeof opts.headerEl === 'string'
        ? document.querySelector(opts.headerEl)
        : opts.headerEl;

      var heroEl = typeof opts.heroEl === 'string'
        ? document.querySelector(opts.heroEl)
        : opts.heroEl;

      if (!headerEl || !heroEl) {
        console.warn('FullScrollHeader: missing headerEl or heroEl');
        return;
      }

      var threshold = opts.threshold !== undefined ? opts.threshold : 0;

      // --- 事件绑定 ---
      var ticking = false;

      function update() {
        var heroRect = heroEl.getBoundingClientRect();

        // 容器顶边：window=0，元素=该元素相对视口顶边
        var containerTop = scrollEl === window ? 0 : scrollEl.getBoundingClientRect().top;

        // Hero 底部 <= 容器顶部 + 阈值  → 触发吸顶
        headerEl.classList.toggle('is-fixed', heroRect.bottom <= containerTop + threshold);

        ticking = false;
      }

      var target = scrollEl === window ? window : scrollEl;
      target.addEventListener('scroll', function () {
        if (!ticking) {
          requestAnimationFrame(update);
          ticking = true;
        }
      }, { passive: true });

      // 初始化
      update();

      // 返回实例，便于外部访问（如需）
      return {
        headerEl: headerEl,
        heroEl: heroEl,
        scrollEl: scrollEl,
        update: update
      };
    }
  };

  // 暴露到全局
  window.FullScrollHeader = FullScrollHeader;
})();