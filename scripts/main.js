// 桂农易通 农户首页 交互逻辑
// 仅负责交互（tab 切换），通过 class 切换状态，不写 element.style，无框架

(function () {
  'use strict';

  var tabItems = document.querySelectorAll('.tabbar__item');
  tabItems.forEach(function (item) {
    item.addEventListener('click', function () {
      tabItems.forEach(function (el) {
        el.classList.remove('tabbar__item--active');
      });
      item.classList.add('tabbar__item--active');
    });
  });
})();
