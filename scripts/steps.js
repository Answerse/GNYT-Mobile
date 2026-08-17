// 桂农易通 步骤条组件
// 用法：<script src="scripts/steps.js"></script>
//   var s = Steps.mount({
//     container: document.querySelector('.ao-scroll'),
//     prepend: true,               // 可选，默认 true，插入到容器顶部
//     current: 1,                  // 当前步骤（1-based）
//     steps: ['开户表单', '支付密码', '充值说明']
//   });
//   s.setCurrent(2);              // 动态切换激活步骤
// 说明：仅通过 classList 切换状态，不写 element.style，无框架依赖

(function () {
  'use strict';

  function render(labels, current) {
    var html = '';
    labels.forEach(function (label, i) {
      var num = i + 1;
      // 连线
      if (i > 0) {
        var connClass = 'steps__connector';
        if (num - 1 < current) connClass += ' is-completed';
        html += '<div class="' + connClass + '"></div>';
      }
      // 步骤项
      var itemClass = 'steps__item';
      if (num === current) itemClass += ' is-active';
      else if (num < current) itemClass += ' is-completed';
      html += '<div class="' + itemClass + '">'
        + '<div class="steps__circle">' + num + '</div>'
        + '<span class="steps__label">' + label + '</span>'
        + '</div>';
    });
    return html;
  }

  function updateState(el, labels, current) {
    var items = el.querySelectorAll('.steps__item');
    items.forEach(function (item, i) {
      var num = i + 1;
      item.classList.toggle('is-active', num === current);
      item.classList.toggle('is-completed', num < current);
    });
    var conns = el.querySelectorAll('.steps__connector');
    conns.forEach(function (conn, i) {
      conn.classList.toggle('is-completed', i + 1 < current);
    });
  }

  function mount(opts) {
    opts = opts || {};
    var container = opts.container;
    if (!container) throw new Error('[Steps] container is required');

    var prepend = opts.prepend !== false;
    var current = opts.current || 1;
    var labels = opts.steps || ['Step 1', 'Step 2', 'Step 3'];

    var el = document.createElement('div');
    el.className = 'steps';
    el.innerHTML = render(labels, current);

    if (prepend && container.firstChild) {
      container.insertBefore(el, container.firstChild);
    } else {
      container.appendChild(el);
    }

    return {
      el: el,
      setCurrent: function (n) {
        current = n;
        updateState(el, labels, n);
      }
    };
  }

  window.Steps = { mount: mount };
})();