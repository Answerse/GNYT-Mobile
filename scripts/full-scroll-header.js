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