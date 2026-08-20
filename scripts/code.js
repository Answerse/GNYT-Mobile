// 桂农易通 亮码页交互（code.html）
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
  Tabbar.mount({ active: 'code' });
  WechatButton.mount();
  // 亮码（变体1：深色 + Logo + 微信按钮）
  PageHeader.mount({
    container: document.querySelector('[data-header="code"]'),
    topbar: { variant: 'code', right: 'wechat' }
  });
})();
