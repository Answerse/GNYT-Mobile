// 桂农易通 收支页交互（flow.html）
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
  Tabbar.mount({ active: 'flow' });
  WechatButton.mount();
  // 收支页（Figma 230:4345：顶栏 + 筛选栏[收入/支出 + 日/月/年]；筛选栏由 Header 统一渲染）
  PageHeader.mount({
    container: document.querySelector('[data-header="flow"]'),
    topbar: {
      left: 'logo',
      tabs: [
        { label: '收购', value: 'buy', active: true },
        { label: '交易', value: 'sell' }
      ],
      right: 'wechat'
    },
    filter: {
      type: 'segments',
      groups: [
        { cls: 'flow-seg--income', key: 'seg', items: [
          { label: '收入', value: 'income', active: true },
          { label: '支出', value: 'expense' }
        ] },
        { cls: 'flow-seg--range', key: 'range', items: [
          { label: '日', value: 'day' },
          { label: '月', value: 'month', active: true },
          { label: '年', value: 'year' }
        ] }
      ],
      onSeg: function (key, value) {
        if (key !== 'range') return;
        var page = document.getElementById('page-flow');
        if (!page) return;
        page.querySelectorAll('.flow-calgrid').forEach(function (g) { g.hidden = g.dataset.view !== value; });
        page.querySelectorAll('.flow-detail').forEach(function (d) { d.hidden = d.dataset.range !== value; });
        page.querySelectorAll('.flow-stat__value').forEach(function (v) { v.textContent = v.getAttribute('data-' + value); });
        var dateEl = page.querySelector('.flow-statcard__date--outside');
        var headEl = page.querySelector('.flow-calhead__title');
        if (value === 'month') { dateEl.textContent = '2025-07'; headEl.textContent = '2025'; }
        if (value === 'year') { dateEl.textContent = '2024年'; headEl.textContent = '2017 - 2025'; }
        if (value === 'day') { dateEl.textContent = '2025-07-16'; headEl.textContent = '2025-07'; }
      }
    }
  });

  // ---------- 收支页：日历选中日 ----------
  document.querySelectorAll('.flow-calgrid .cal-cell').forEach(function (cell) {
    cell.addEventListener('click', function () {
      if (cell.disabled) return;
      document.querySelectorAll('.flow-calgrid .cal-cell.is-selected')
        .forEach(function (el) { el.classList.remove('is-selected'); });
      cell.classList.add('is-selected');
    });
  });
})();
