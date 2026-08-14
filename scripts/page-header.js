// 桂农易通 页头组件（顶栏 + 可选筛选栏，固定在页头不随页面滚动）
// 用法：
//   <script src="scripts/topbar.js"></script>  <!-- 依赖 -->
//   <script src="scripts/page-header.js"></script>
//   PageHeader.mount({
//     container: 挂载容器元素,
//     topbar: { left: 'logo', tabs: [...], right: 'wechat' },  // 复用顶栏组件
//     filter: {  // 可选：筛选栏（订单页等）
//       tabs: [{ label: '全部', value: 'all', count: 0, active: true }, ...],
//       search: true
//     },
//     onTab: 顶栏标签切换回调（value）
//   })
// 说明：仅通过 classList 切换状态，不写 element.style；微信按钮由 WechatButton 渲染

(function () {
  'use strict';

  function buildFilter(opts) {
    var bar = document.createElement('div');
    bar.className = 'order-filterbar';

    var tabs = document.createElement('div');
    tabs.className = 'order-tabs';
    opts.tabs.forEach(function (t) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'order-tab' + (t.active ? ' is-active' : '');
      btn.dataset.tab = t.value;
      btn.appendChild(document.createTextNode(t.label));
      if (t.count !== undefined) {
        var count = document.createElement('span');
        count.className = 'order-tab__count';
        count.textContent = t.count;
        btn.appendChild(count);
      }
      btn.addEventListener('click', function () {
        tabs.querySelectorAll('.order-tab').forEach(function (b) {
          b.classList.toggle('is-active', b === btn);
        });
        if (opts.onTab) opts.onTab(t.value);
      });
      tabs.appendChild(btn);
    });
    bar.appendChild(tabs);

    var divider = document.createElement('span');
    divider.className = 'order-filterbar__divider';
    divider.setAttribute('aria-hidden', 'true');
    bar.appendChild(divider);

    if (opts.search) {
      var search = document.createElement('div');
      search.className = 'order-search';
      search.innerHTML = '<svg class="order-search__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg><span class="order-search__text">搜索</span>';
      bar.appendChild(search);
    }
    return bar;
  }

  // 分段控件式筛选栏（收支页：收入/支出 + 日/月/年，Figma 230:4345）
  function buildSegments(opts) {
    var bar = document.createElement('div');
    bar.className = 'flow-segments';

    opts.groups.forEach(function (group) {
      var seg = document.createElement('div');
      seg.className = 'flow-seg ' + group.cls;

      group.items.forEach(function (item) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'flow-seg__btn' + (item.active ? ' is-active' : '');
        btn.dataset[group.key] = item.value;
        btn.appendChild(document.createTextNode(item.label));
        btn.addEventListener('click', function () {
          seg.querySelectorAll('.flow-seg__btn').forEach(function (b) {
            b.classList.toggle('is-active', b === btn);
          });
          if (opts.onSeg) opts.onSeg(group.key, item.value);
        });
        seg.appendChild(btn);
      });

      bar.appendChild(seg);
    });
    return bar;
  }

  function mount(opts) {
    var el = opts.container;
    if (!el) return;

    // 无包装模式：直接把顶栏挂到 container（首部），用于 sticky 顶栏等需要父容器包住内容的场景
    // （如订单创建页 oc-topbar sticky 相对滚动视口，父容器必须是内容区而非固定高包装层）
    if (opts.wrap === false) {
      if (window.Topbar) {
        Topbar.mount({
          container: el,
          prepend: opts.prepend,
          variant: opts.topbar.variant,
          left: opts.topbar.left,
          title: opts.topbar.title,
          tabs: opts.topbar.tabs,
          right: opts.topbar.right,
          onTab: opts.onTab
        });
      }
      return;
    }

    var header = document.createElement('div');
    header.className = 'page-header';

    var topbarMount = document.createElement('div');
    header.appendChild(topbarMount);

    // 先挂入文档，再构建顶栏：保证 WechatButton.mount() 的全文档扫描能命中页头内的微信按钮
    el.appendChild(header);

    if (window.Topbar) {
      Topbar.mount({
        container: topbarMount,
        variant: opts.topbar.variant,   // home/mine/code/app/od/oc
        left: opts.topbar.left,
        title: opts.topbar.title,       // 变体 od/oc 居中标题
        tabs: opts.topbar.tabs,
        right: opts.topbar.right,
        ghost: opts.topbar.ghost,       // 变体 od：透明悬浮态（od-topbar--ghost）
        onTab: opts.onTab
      });
    }

    if (opts.filter) {
      var sub = (opts.filter.type === 'segments') ? buildSegments(opts.filter) : buildFilter(opts.filter);
      header.appendChild(sub);
    }
  }

  window.PageHeader = { mount: mount };
})();
