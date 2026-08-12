// 桂农易通 农户首页 交互逻辑
// 仅负责交互（tab 切换），通过 class 切换状态，不写 element.style，无框架

(function () {
  'use strict';

  // 农民形象图占位兜底：加载失败时隐藏，避免在 HTML 写行内 style
  var statDeco = document.querySelector('.stat__deco');
  if (statDeco) {
    statDeco.addEventListener('error', function () {
      statDeco.classList.add('stat__deco--hidden');
    });
  }

  // tab 切换：仅普通导航项参与，中间的"亮码卖货"主按钮不参与选中态切换
  var tabItems = document.querySelectorAll('.tabbar__item:not(.tabbar__item--main)');
  tabItems.forEach(function (item) {
    item.addEventListener('click', function () {
      tabItems.forEach(function (el) {
        el.classList.remove('tabbar__item--active');
      });
      item.classList.add('tabbar__item--active');
    });
  });
})();
