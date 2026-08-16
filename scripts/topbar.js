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

  // 系统 logo + "农户版" tag（首页/我的/亮码共用）
  function buildLogoWrap() {
    var wrap = document.createElement('div');
    wrap.className = 'topbar__logo-wrap';
    var logo = document.createElement('img');
    logo.className = 'topbar__logo';
    logo.src = LOGO_SRC;
    logo.alt = '桂农易通';
    wrap.appendChild(logo);
    var tag = document.createElement('span');
    tag.className = 'topbar__tag';
    tag.textContent = '农户版';
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
      nav2.appendChild(buildLogoWrap());
      var right2 = document.createElement('div');
      right2.className = 'mine-topbar__right';
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
      // 透明悬浮态（集采活动页 932:68725）：类名由 od-topbar--ghost 变体定义
      if (opts.ghost) header.classList.add('od-topbar--ghost');
      var back4 = document.createElement('a');
      back4.className = 'od-topbar__back';
      back4.href = 'index.html';
      back4.setAttribute('aria-label', '返回');
      // 返回图标：复用图标库 chevron-left.svg（Figma 932:68725 向左-线性 18×16）
      var backIcon = document.createElement('img');
      backIcon.className = 'od-topbar__back-icon';
      backIcon.src = 'assets/icons/chevron-left.svg';
      backIcon.alt = '';
      back4.appendChild(backIcon);
      nav4.appendChild(back4);
      var title4 = document.createElement('h1');
      title4.className = 'od-topbar__title';
      title4.textContent = opts.title || '';
      nav4.appendChild(title4);
      // 右侧：可选微信按钮（浅色），默认占位（集采活动页 932:68725 右侧为微信按钮）
      if (opts.right === 'wechat') {
        nav4.appendChild(buildWechat('light'));
      } else {
        var spacer4 = document.createElement('div');
        spacer4.className = 'od-topbar__spacer';
        nav4.appendChild(spacer4);
      }
      header.appendChild(nav4);
      return;
    }

    if (variant === 'oc') {
      var nav5 = document.createElement('div');
      nav5.className = 'oc-topbar__nav';
      // 返回：默认 a 跳转；传 onBack 时为 button 触发回调（如订单创建"回上一步"）
      var isBtn = opts.left && opts.left.onBack;
      var back5 = document.createElement(isBtn ? 'button' : 'a');
      back5.className = 'oc-topbar__back';
      if (isBtn) {
        back5.type = 'button';
        back5.addEventListener('click', opts.left.onBack);
      } else {
        back5.href = (opts.left && opts.left.href) || 'index.html';
      }
      back5.setAttribute('aria-label', '返回');
      // 返回图标：复用图标库 chevron-left.svg（design.md 二级页页头返回箭头）
      var backIcon = document.createElement('img');
      backIcon.className = 'oc-topbar__back-icon';
      backIcon.src = 'assets/icons/chevron-left.svg';
      backIcon.alt = '';
      back5.appendChild(backIcon);
      nav5.appendChild(back5);
      var title5 = document.createElement('h1');
      title5.className = 'oc-topbar__title';
      title5.textContent = opts.title || '';
      nav5.appendChild(title5);
      var capsule = document.createElement('div');
      capsule.className = 'oc-topbar__capsule';
      var dots = document.createElement('div');
      dots.className = 'oc-topbar__capsule-dot';
      dots.innerHTML = '<span></span><span></span><span></span>';
      capsule.appendChild(dots);
      var record = document.createElement('div');
      record.className = 'oc-topbar__capsule-record';
      capsule.appendChild(record);
      nav5.appendChild(capsule);
      header.appendChild(nav5);
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
