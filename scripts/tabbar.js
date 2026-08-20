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
