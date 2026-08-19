// 桂农易通 通用弹窗组件
// 用法（页面复用）：
//   <link rel="stylesheet" href="styles/modal.css">
//   <script src="scripts/modal.js"></script>
//
//   <div class="modal" id="my-modal">
//     <div class="modal__mask"></div>
//     <div class="modal__card">
//       <div class="modal__illust"><img src="..." alt=""></div>
//       <div class="modal__texts">...</div>
//       <div class="modal__actions">...</div>
//     </div>
//     <button class="modal__close" type="button" aria-label="关闭"><img src="..." alt=""></button>
//   </div>
//
//   Modal.mount('#my-modal', { onClose: fn, onClickMask: fn });
//   Modal.open('#my-modal');
//   Modal.close('#my-modal');
//
// 说明：仅通过 classList 切换状态，不写 element.style，无框架依赖

(function () {
  'use strict';

  /**
   * 挂载弹窗组件
   * @param {string} selector - 弹窗根元素选择器
   * @param {object} [opts] - 可选配置
   * @param {function} [opts.onClose] - 点击关闭按钮回调
   * @param {function} [opts.onClickMask] - 点击遮罩回调（默认关闭弹窗）
   */
  function mount(selector, opts) {
    var el = document.querySelector(selector);
    if (!el || el.dataset.modalMounted === 'true') return;
    el.dataset.modalMounted = 'true';

    var closeBtn = el.querySelector('.modal__close');
    var mask = el.querySelector('.modal__mask');

    // 点击关闭按钮
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        if (opts && typeof opts.onClose === 'function') {
          opts.onClose();
        } else {
          close(selector);
        }
      });
    }

    // 点击遮罩
    if (mask) {
      mask.addEventListener('click', function () {
        if (opts && typeof opts.onClickMask === 'function') {
          opts.onClickMask();
        } else {
          close(selector);
        }
      });
    }
  }

  /**
   * 打开弹窗
   * @param {string} selector - 弹窗根元素选择器
   */
  function open(selector) {
    var el = document.querySelector(selector);
    if (el) el.classList.add('is-open');
  }

  /**
   * 关闭弹窗
   * @param {string} selector - 弹窗根元素选择器
   */
  function close(selector) {
    var el = document.querySelector(selector);
    if (el) el.classList.remove('is-open');
  }

  window.Modal = { mount: mount, open: open, close: close };
})();
