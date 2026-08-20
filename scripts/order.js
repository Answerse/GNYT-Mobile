// 桂农易通 订单页交互（order.html）
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
  Tabbar.mount({ active: 'order' });
  WechatButton.mount();
  PageHeader.mount({
    container: document.querySelector('[data-header="order"]'),
    topbar: {
      left: 'logo',
      tabs: [
        { label: '买入', value: 'buy', active: true },
        { label: '卖出', value: 'sell' }
      ],
      right: 'wechat'
    },
    filter: {
      tabs: [
        { label: '全部', value: 'all', count: 0, active: true },
        { label: '待支付', value: 'pending', count: 0 },
        { label: '已完成', value: 'done', count: 10 },
        { label: '已取消', value: 'cancel', count: 0 }
      ],
      search: true,
      onTab: function (value) {
        document.querySelectorAll('#page-order .order-card').forEach(function (card) {
          if (value === 'all' || card.dataset.status === value) {
            card.removeAttribute('hidden');
          } else {
            card.setAttribute('hidden', '');
          }
        });
      }
    }
  });

  // ---------- 订单页：商品明细展开/收起（max-height 过渡动效，--detail-h 由 JS 测量） ----------
  document.querySelectorAll('.order-goods__toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = document.getElementById(btn.getAttribute('data-toggle'));
      if (!target) return;
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      if (expanded) {
        // 收起：先锁定当前高度，再移除 is-open，触发 max-height 过渡到 0
        target.style.setProperty('--detail-h', target.scrollHeight + 'px');
        target.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
      } else {
        // 展开：测量态（禁过渡）下放开 max-height 测含边框的完整高度，再回折叠态后开过渡展开
        target.classList.add('is-measuring');
        target.classList.add('is-open');
        target.style.setProperty('--detail-h', 'none');
        var h = target.offsetHeight;            // 含 border 的完整高度
        target.style.setProperty('--detail-h', h + 'px');
        target.classList.remove('is-open');
        void target.offsetHeight;               // 强制回流，回到折叠态
        target.classList.remove('is-measuring');
        target.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();
