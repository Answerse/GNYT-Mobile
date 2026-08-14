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
