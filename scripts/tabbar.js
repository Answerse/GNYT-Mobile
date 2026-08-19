// 桂农易通 底部标签栏组件
// 用法：<script src="scripts/tabbar.js"></script>
//   Tabbar.mount({ active: 'home' })
//     - active: 当前激活页（home/order/code/flow/mine），默认 'home'
//     - home: 无对应页面 div 时跳转的基址（独立页复用场景），默认 'index.html?tab='
// 说明：仅通过 class 切换状态，不写 element.style，无框架依赖

(function () {
  'use strict';

  var TEMPLATE_URL = 'components/tabbar.html';
  var DEFAULT_HOME = 'index.html?tab=';

  // 将模板注入 body，返回 nav 元素
  function mountNav(template) {
    var holder = document.createElement('div');
    holder.innerHTML = template.trim();
    var nav = holder.querySelector('.tabbar');
    document.body.appendChild(nav);
    return nav;
  }

  // 激活指定 tab
  function setActive(nav, key) {
    nav.querySelectorAll('.tabbar__item').forEach(function (item) {
      item.classList.toggle('tabbar__item--active', item.getAttribute('data-page') === key);
    });
  }

  // 切换 index.html 内的模块页（SPA）
  // 注意：只匹配带 id 的页面容器（.page[id]），避免误伤首页内层 <main class="page"> 内容区
  function switchPage(key) {
    var found = false;
    var MINE_PAGE_IDS = ['page-mine', 'page-mine-broker', 'page-mine-provider'];
    var isMine = (key === 'mine');
    document.querySelectorAll('.page[id]').forEach(function (page) {
      if (isMine) {
        // mine 页：保留当前可见的 mine 页，隐藏其他所有页
        if (MINE_PAGE_IDS.indexOf(page.id) !== -1) {
          if (!page.hasAttribute('hidden')) found = true;
        } else {
          page.setAttribute('hidden', '');
        }
      } else {
        // 非 mine 页：隐藏所有 mine 页
        if (MINE_PAGE_IDS.indexOf(page.id) !== -1) {
          page.setAttribute('hidden', '');
        } else if (page.id === 'page-' + key) {
          page.removeAttribute('hidden');
          found = true;
        } else {
          page.setAttribute('hidden', '');
        }
      }
    });
    // mine tab：如果都隐藏了，默认显示服务商版
    if (isMine && !found) {
      document.getElementById('page-mine-provider').removeAttribute('hidden');
      found = true;
    }
    if (found) {
      // body 不滚动，各页内容区内部滚动：切换时统一回到顶部
      ['#page-home', '#page-home main.page', '.order-list', '.page-content', '.mine-content', '.code-main']
        .forEach(function (sel) {
          document.querySelectorAll(sel).forEach(function (el) { el.scrollTop = 0; });
        });
    }
    return found;
  }

  function bindTabs(nav, home) {
    var currentTab = 'home';
    nav.querySelectorAll('.tabbar__item').forEach(function (item) {
      item.addEventListener('click', function () {
        var key = item.getAttribute('data-page');
        // 当前页存在（SPA 复用）则切换并高亮；否则作为独立页跳转到模块首页
        if (switchPage(key)) {
          currentTab = key;
          setActive(nav, key);
        } else {
          window.location.href = home + key;
        }
      });
    });
  }

  function mount(opts) {
    var active = (opts && opts.active) || 'home';
    var home = (opts && opts.home) || DEFAULT_HOME;

    fetch(TEMPLATE_URL)
      .then(function (res) {
        if (!res.ok) throw new Error('tabbar template load failed: ' + res.status);
        return res.text();
      })
      .then(function (html) {
        var nav = mountNav(html);
        setActive(nav, active);
        bindTabs(nav, home);
      })
      .catch(function (err) {
        console.error('[Tabbar]', err);
      });
  }

  window.Tabbar = { mount: mount };
})();
