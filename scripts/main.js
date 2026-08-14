// 桂农易通 交互逻辑
// 仅负责交互（页面切换、tab 切换），通过 class 切换状态，不写 element.style，无框架

(function () {
  'use strict';

  // 农民形象图占位兜底：加载失败时隐藏，避免在 HTML 写行内 style
  var statDeco = document.querySelector('.stat__deco');
  if (statDeco) {
    statDeco.addEventListener('error', function () {
      statDeco.classList.add('stat__deco--hidden');
    });
  }

  // ---------- 顶栏（买入/卖出、收购/交易）：由 scripts/topbar.js 组件负责 ----------

  // ---------- 首页导航：农户版 / 企业版切换（Figma 247:10080 / 231:9724） ----------
  // 切换顶栏标签 + 头部版本（农户版：统计+交易插画；企业版：仅增长插画，无统计）
  function setHomeVersion(isFarm) {
    var stat = document.querySelector('#page-home .stat--farm');
    var illusFarm = document.querySelector('#page-home .illus--farm');
    var illusEnt = document.querySelector('#page-home .illus--enterprise');
    if (stat) stat.hidden = !isFarm;
    if (illusFarm) illusFarm.hidden = !isFarm;
    if (illusEnt) illusEnt.hidden = isFarm;
  }
  document.querySelectorAll('.topbar--nav .topbar__switch').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var nav = btn.closest('.topbar__nav');
      if (!nav) return;
      var tag = nav.querySelector('.topbar__tag');
      var isFarm = tag && tag.textContent === '农户版';
      if (tag) tag.textContent = isFarm ? '企业版' : '农户版';
      // 按钮文字始终指向可切换到的目标版本（农户版时显示"企业版"，反之亦然）
      var swText = nav.querySelector('.topbar__switch-text');
      if (swText) swText.textContent = isFarm ? '农户版' : '企业版';
      btn.setAttribute('aria-label', isFarm ? '切换农户版' : '切换企业版');
      setHomeVersion(!isFarm);
    });
  });

  // ---------- 订单页：筛选标签（全部/待支付/已完成/已取消）：由 scripts/page-header.js 组件负责过滤 ----------

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

  // ---------- 收支页：筛选栏（收入/支出 + 日/月/年）已由 PageHeader 组件统一渲染与切换 ----------

  // ---------- 收支页：日历选中日 ----------
  document.querySelectorAll('.flow-calgrid .cal-cell').forEach(function (cell) {
    cell.addEventListener('click', function () {
      if (cell.disabled) return;
      document.querySelectorAll('.flow-calgrid .cal-cell.is-selected')
        .forEach(function (el) { el.classList.remove('is-selected'); });
      cell.classList.add('is-selected');
    });
  });

  // ---------- 我的页：近7日交易趋势（ECharts，Figma 573:7154） ----------
  // 页面初始 hidden，切到"我的"后再初始化/resize，避免 0 尺寸
  function initTrendChart() {
    var el = document.getElementById('mineTrendChart');
    if (!el || !window.echarts) return;
    if (!el.__chart) {
      el.__chart = echarts.init(el);
      el.__chart.setOption({
        grid: { left: 0, right: 0, top: 4, bottom: 0 },   /* 图表两端对齐容器 */
        xAxis: { type: 'category', show: false, boundaryGap: false, data: ['一', '二', '三', '四', '五', '六', '日'] },
        yAxis: {
          type: 'value',
          show: true,
          position: 'right',
          min: 0,
          max: 100,
          splitNumber: 5,
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { show: false },                     /* 隐藏右侧 Y 轴标签 */
          splitLine: { show: true, lineStyle: { color: 'rgba(16, 18, 21, 0.05)' } }
        },
        series: [{
          type: 'line',
          data: [95, 80, 60, 70, 40, 30, 22],
          showSymbol: false,
          smooth: false,
          lineStyle: { color: '#16A34A', width: 2 },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(57, 204, 121, 0.4)' },
              { offset: 1, color: 'rgba(57, 204, 121, 0)' }
            ])
          }
        }]
      });
    }
    el.__chart.resize();
  }
  // 事件委托：底栏由 Tabbar.mount 异步注入，用 document 级监听避免漏绑
  document.addEventListener('click', function (e) {
    var item = e.target.closest('.tabbar__item');
    if (item && item.getAttribute('data-page') === 'mine') {
      setTimeout(initTrendChart, 80);
    }
  });
})();
