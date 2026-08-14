// 桂农易通 微信按钮组件
// 用法（页面复用）：
//   <script src="scripts/wechat-button.js"></script>
//   <button class="topbar__wechat" type="button" aria-label="微信" data-wechat></button>
//   WechatButton.mount()  // 扫描所有 [data-wechat]，自动注入图标并适配明暗
// 适配规则：
//   - data-wechat-bg="dark"|"light" 显式指定（优先）
//   - 否则自动检测就近非透明背景色的亮度；背景为图片（深色头部）按深色处理
// 说明：仅通过 classList 切换状态，不写 element.style，无框架依赖

(function () {
  'use strict';

  var SVG = {
    dark: 'assets/icons/wechat-btn-on-dark.svg',    // 深色背景：白描边 10% + 白图标 50%
    light: 'assets/icons/wechat-btn-bright.svg'     // 明亮背景：白填充 10% + 深描边 10% + 深图标 50%（Figma 910:13227 深色模式=On）
  };

  function parseRGB(bg) {
    var m = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    return m ? [+m[1], +m[2], +m[3]] : null;
  }

  // 相对亮度（0 黑 → 1 白）
  function luminance(rgb) {
    return (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) / 255;
  }

  // 自动检测背景明暗：就近非透明背景色判断亮度；背景图为深色头部（本项目约定）视为深色
  function detectMode(el) {
    var cur = el;
    while (cur && cur !== document.body) {
      var cs = getComputedStyle(cur);
      var bg = cs.backgroundColor;
      if (bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
        var rgb = parseRGB(bg);
        if (rgb) return luminance(rgb) > 0.55 ? 'light' : 'dark';
      }
      if (cs.backgroundImage && cs.backgroundImage !== 'none') {
        return 'dark';
      }
      cur = cur.parentElement;
    }
    return 'light';
  }

  function mount() {
    document.querySelectorAll('[data-wechat]').forEach(function (btn) {
      if (btn.classList.contains('topbar__wechat--on-dark') ||
          btn.classList.contains('topbar__wechat--on-light')) {
        return; // 已渲染，幂等
      }
      var mode = btn.getAttribute('data-wechat-bg') || detectMode(btn);
      var img = document.createElement('img');
      img.className = 'topbar__wechat-icon';
      img.src = mode === 'dark' ? SVG.dark : SVG.light;
      img.alt = '';
      btn.appendChild(img);
      btn.classList.add(mode === 'dark' ? 'topbar__wechat--on-dark' : 'topbar__wechat--on-light');
    });
  }

  window.WechatButton = { mount: mount };
})();
