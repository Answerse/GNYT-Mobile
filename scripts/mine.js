// 桂农易通 我的页交互（mine.html）
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
  Tabbar.mount({ active: 'mine' });
  WechatButton.mount();
  Badge.mount();
  // 我的（农户版：深色 + Logo + 切换按钮 + 微信按钮，叠在绿色头图上）
  PageHeader.mount({
    container: document.querySelector('[data-header="mine"]'),
    topbar: { variant: 'mine', right: 'switch+wechat' }
  });
  // 服务商版我的（深色 + Logo + "服务商"标签 + 切换按钮 + 微信按钮）
  PageHeader.mount({
    container: document.querySelector('[data-header="mine-provider"]'),
    topbar: { variant: 'mine', right: 'switch+wechat', tagText: '服务商' }
  });
  // 经纪人版我的（深色 + Logo + "经纪人"标签 + 切换按钮 + 微信按钮）
  PageHeader.mount({
    container: document.querySelector('[data-header="mine-broker"]'),
    topbar: { variant: 'mine', right: 'switch+wechat', tagText: '经纪人' }
  });

  // ---------- 我的页：农户版 / 经纪人版 / 服务商版 三角色切换 ----------
  var MINE_ROLES = ['farm', 'broker', 'provider'];
  var MINE_LABELS = { farm: '农户版', broker: '经纪人', provider: '服务商' };
  var MINE_IDS = { farm: 'page-mine', broker: 'page-mine-broker', provider: 'page-mine-provider' };
  var mineVersion = 'provider';

  function updateMineSwitchText() {
    document.querySelectorAll('.mine-topbar .topbar__switch-text').forEach(function (el) {
      el.textContent = '切换';
    });
    MINE_ROLES.forEach(function (role) {
      var tag = document.querySelector('#' + MINE_IDS[role] + ' .topbar__tag');
      if (tag) tag.textContent = MINE_LABELS[role];
    });
  }
  setTimeout(updateMineSwitchText, 0);

  document.querySelectorAll('.mine-topbar .topbar__switch').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var nextIdx = (MINE_ROLES.indexOf(mineVersion) + 1) % MINE_ROLES.length;
      var nextRole = MINE_ROLES[nextIdx];
      // 隐藏当前，显示下一个
      document.getElementById(MINE_IDS[mineVersion]).setAttribute('hidden', '');
      document.getElementById(MINE_IDS[nextRole]).removeAttribute('hidden');
      mineVersion = nextRole;
      updateMineSwitchText();
      // 延迟初始化图表
      setTimeout(function () {
        if (nextRole === 'farm') initTrendChart();
        else if (nextRole === 'broker') initBrokerTrendChart();
        else initProviderTrendChart();
      }, 80);
    });
  });

  // 服务商版图表初始化
  function initProviderTrendChart() {
    var el = document.getElementById('mineProviderTrendChart');
    if (!el || !window.echarts) return;
    if (!el.__chart) {
      el.__chart = echarts.init(el);
      el.__chart.setOption({
        grid: { left: 0, right: 0, top: 4, bottom: 0 },
        xAxis: { type: 'category', show: false, boundaryGap: false, data: ['一', '二', '三', '四', '五', '六', '日'] },
        yAxis: {
          type: 'value', show: true, position: 'right', min: 0, max: 100, splitNumber: 5,
          axisLine: { show: false }, axisTick: { show: false }, axisLabel: { show: false },
          splitLine: { show: true, lineStyle: { color: 'rgba(16, 18, 21, 0.05)' } }
        },
        series: [{
          type: 'line', data: [95, 80, 60, 70, 40, 30, 22], showSymbol: false, smooth: false,
          lineStyle: { color: '#16A34A', width: 2 },
          areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(57, 204, 121, 0.4)' },
            { offset: 1, color: 'rgba(57, 204, 121, 0)' }
          ]) }
        }]
      });
    }
    el.__chart.resize();
  }

  // 经纪人版图表初始化
  function initBrokerTrendChart() {
    var el = document.getElementById('mineBrokerTrendChart');
    if (!el || !window.echarts) return;
    if (!el.__chart) {
      el.__chart = echarts.init(el);
      el.__chart.setOption({
        grid: { left: 0, right: 0, top: 4, bottom: 0 },
        xAxis: { type: 'category', show: false, boundaryGap: false, data: ['一', '二', '三', '四', '五', '六', '日'] },
        yAxis: {
          type: 'value', show: true, position: 'right', min: 0, max: 100, splitNumber: 5,
          axisLine: { show: false }, axisTick: { show: false }, axisLabel: { show: false },
          splitLine: { show: true, lineStyle: { color: 'rgba(16, 18, 21, 0.05)' } }
        },
        series: [{
          type: 'line', data: [95, 80, 60, 70, 40, 30, 22], showSymbol: false, smooth: false,
          lineStyle: { color: '#16A34A', width: 2 },
          areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(57, 204, 121, 0.4)' },
            { offset: 1, color: 'rgba(57, 204, 121, 0)' }
          ]) }
        }]
      });
    }
    el.__chart.resize();
  }

  // 农户版图表初始化（Figma 573:7154）
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

  // 默认页为服务商版，页面加载后即初始化其图表
  setTimeout(initProviderTrendChart, 80);
})();
