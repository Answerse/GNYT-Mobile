// 桂农易通 按钮组件
// 用法（页面复用）：
//   <script src="scripts/button.js"></script>
//   <button class="btn btn--fill btn--m" type="button" data-btn-icon-left="check.svg" data-btn-icon-right="arrow-right.svg">
//     提交
//   </button>
//   Button.mount()  // 扫描所有 .btn，注入图标插槽
// 说明：仅通过 classList 切换状态，不写 element.style，无框架依赖

(function () {
  'use strict';

  /**
   * 渲染图标元素
   * @param {string} src - 图标路径
   * @param {string} pos - 'left' | 'right'
   * @returns {HTMLElement}
   */
  function createIcon(src, pos) {
    var icon = document.createElement('span');
    icon.className = 'btn-icon btn-icon--' + pos;
    var img = document.createElement('img');
    img.src = src;
    img.alt = '';
    icon.appendChild(img);
    return icon;
  }

  /**
   * 挂载按钮组件
   * 扫描所有 .btn 元素，根据 data 属性注入图标
   */
  function mount() {
    document.querySelectorAll('.btn').forEach(function (el) {
      // 防止重复挂载
      if (el.dataset.btnMounted === 'true') return;
      el.dataset.btnMounted = 'true';

      var textEl = el.querySelector('.btn-text');
      if (!textEl) {
        // 如果没有 btn-text，把原有文本包裹进 span
        var text = '';
        el.childNodes.forEach(function (node) {
          if (node.nodeType === 3) text += node.textContent;
        });
        if (text.trim()) {
          textEl = document.createElement('span');
          textEl.className = 'btn-text';
          textEl.textContent = text.trim();
          el.innerHTML = '';
          el.appendChild(textEl);
        }
      }

      // 处理左侧图标
      var leftIcon = el.getAttribute('data-btn-icon-left');
      if (leftIcon) {
        var iconLeft = createIcon(leftIcon, 'left');
        if (textEl) {
          el.insertBefore(iconLeft, textEl);
        } else {
          el.insertBefore(iconLeft, el.firstChild);
        }
      }

      // 处理右侧图标
      var rightIcon = el.getAttribute('data-btn-icon-right');
      if (rightIcon) {
        var iconRight = createIcon(rightIcon, 'right');
        el.appendChild(iconRight);
      }
    });
  }

  window.Button = { mount: mount };
})();
