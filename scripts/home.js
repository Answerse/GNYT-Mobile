// 桂农易通 首页交互（home.html）
// 仅负责交互，通过 class 切换状态，不写 element.style，无框架

(function () {
  'use strict';

  // ---------- rem 基准：375 设计稿等比缩放（1rem = 100px @375），JS 兜底兼容部分 Android 浏览器 ----------
  (function () {
    var baseW = 375, maxW = 430;
    function setRem() {
      var w = document.documentElement.clientWidth;
      if (w > maxW) w = maxW;
      document.documentElement.style.fontSize = (w / baseW * 100) + 'px';
    }
    setRem();
    window.addEventListener('resize', setRem);
  })();

  // ---------- 组件挂载（defer 脚本在 DOM 就绪后按序执行，组件已加载） ----------
  Tabbar.mount({ active: 'home' });
  WechatButton.mount();
  Badge.mount();
  // 首页（Figma 247:10080 导航：深色 + Logo + 农户版标签 + 企业版切换按钮 + 微信按钮）
  PageHeader.mount({
    container: document.querySelector('[data-header="home"]'),
    topbar: { variant: 'nav', right: 'wechat' }
  });
  // Full Scroll 页头吸顶（组件封装，@see scripts/full-scroll-header.js）
  FullScrollHeader.mount({
    scrollEl: '#page-home',
    headerEl: '[data-header="home"]',
    heroEl: '.hero-zone'
  });

  // 农民形象图占位兜底：加载失败时隐藏，避免在 HTML 中写行内 style
  var statDeco = document.querySelector('.stat__deco');
  if (statDeco) {
    statDeco.addEventListener('error', function () {
      statDeco.classList.add('stat__deco--hidden');
    });
  }

  // ---------- 首页导航：农户版 / 企业版 / 服务商版 三角色切换 ----------
  var HOME_ROLES = ['farm', 'enterprise', 'provider'];
  var HOME_LABELS = { farm: '农户版', enterprise: '企业版', provider: '服务商' };
  var homeRole = 'farm';

  function setHomeVersion(role) {
    var stat = document.querySelector('#page-home .stat--farm');
    var illusFarm = document.querySelector('#page-home .illus--farm');
    var illusEnt = document.querySelector('#page-home .illus--enterprise');
    var illusProv = document.querySelector('#page-home .illus--provider');
    if (stat) stat.hidden = role !== 'farm';
    if (illusFarm) illusFarm.hidden = role !== 'farm';
    if (illusEnt) illusEnt.hidden = role !== 'enterprise';
    if (illusProv) illusProv.hidden = role !== 'provider';
  }

  function updateHomeTag() {
    document.querySelectorAll('.topbar--nav .topbar__tag').forEach(function (el) {
      el.textContent = HOME_LABELS[homeRole];
    });
    document.querySelectorAll('.topbar--nav .topbar__switch-text').forEach(function (el) {
      el.textContent = '切换';
    });
  }

  document.querySelectorAll('.topbar--nav .topbar__switch').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var idx = (HOME_ROLES.indexOf(homeRole) + 1) % HOME_ROLES.length;
      homeRole = HOME_ROLES[idx];
      setHomeVersion(homeRole);
      updateHomeTag();
    });
  });
})();
