(() => {
  let totalPages = 1;
  let currentPage = 1;
  const leftFrame  = document.getElementById('leftFrame');
  const rightFrame = document.getElementById('rightFrame');
  const syncScroll = document.getElementById('syncScroll');
  const syncPage   = document.getElementById('syncPage');

  Office.onReady(info => {
    if (info.host === Office.HostType.Pdf) init();
  });

  async function init() {
    // 1. 拿到总页数
    const doc = Office.context.document;
    totalPages = await doc.getPdfPageCount();   // WPS 2025+ 新增 API
    currentPage = 1;
    loadPages(1, Math.min(2, totalPages));

    // 2. 绑定按钮
    document.getElementById('btnLeftRight').onclick = () => setLayout('lr');
    document.getElementById('btnTopBottom').onclick = () => setLayout('tb');

    // 3. 同步滚轮（简易版）
    syncScroll.onchange = e => toggleSync(e.target.checked);
  }

  /* 加载指定两页 */
  function loadPages(p1, p2) {
    const base = Office.context.document.url;          // 当前 PDF 路径
    leftFrame.src  = `${base}#page=${p1}`;
    rightFrame.src = `${base}#page=${p2}`;
  }

  /* 切换布局 */
  function setLayout(mode) {
    const grid = document.getElementById('grid');
    grid.className = mode === 'lr' ? 'grid-lr' : 'grid-tb';
  }

  /* 简易同步滚轮（仅演示思路） */
  function toggleSync(on) {
    const handler = (src, dst) => {
      src.onscroll = () => {
        if (syncScroll.checked) dst.scrollTop = src.scrollTop;
      };
    };
    handler(leftFrame.contentWindow,  rightFrame.contentWindow);
    handler(rightFrame.contentWindow, leftFrame.contentWindow);
    if (!on) { leftFrame.contentWindow.onscroll = null; rightFrame.contentWindow.onscroll = null; }
  }

  /* 如果用户勾选“同步翻页”，可在翻页按钮里同时改变两个 iframe 的 #page 锚点 */
  /* 此处略，留给你按需扩展 */
})();