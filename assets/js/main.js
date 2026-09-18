/* 个人网站 · 交互脚本（零依赖，原生 JS）
   功能：主题切换并记忆、页脚年份自动更新 */

(function () {
  'use strict';

  // ---------- 主题切换 ----------
  var root = document.documentElement;
  var toggle = document.getElementById('themeToggle');
  var STORE_KEY = 'site-theme';

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (toggle) {
      toggle.textContent = theme === 'dark' ? '☀️' : '🌙';
      toggle.setAttribute('aria-label', theme === 'dark' ? '切换到浅色' : '切换到深色');
    }
  }

  // 初始化：优先读本地记忆，否则跟随系统
  var saved = null;
  try { saved = localStorage.getItem(STORE_KEY); } catch (e) {}
  if (!saved) {
    saved = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
      ? 'dark' : 'light';
  }
  applyTheme(saved);

  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem(STORE_KEY, next); } catch (e) {}
    });
  }

  // ---------- 页脚年份 ----------
  var yearEl = document.getElementById('year');
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }

  // ---------- 应用内嵌弹层（iframe 站内运行） ----------
  var APP_MAP = {
    lia: { src: 'apps/lia/index.html', name: '精益改善分析助手（LIA）' },
    zhixiu: { src: 'apps/zhixiu/index.html', name: '智修 · Agent 修炼系统' }
  };
  var modal = document.getElementById('appModal');
  var frame = document.getElementById('appModalFrame');
  var titleEl = document.getElementById('appModalTitle');
  var openLink = document.getElementById('appModalOpen');
  var closeBtn = document.getElementById('appModalClose');

  function openApp(key) {
    var a = APP_MAP[key];
    if (!a || !modal) return;
    titleEl.textContent = a.name;
    frame.src = a.src;
    openLink.href = a.src;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeApp() {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    frame.src = ''; // 停止运行中的应用，释放资源
  }

  var appBtns = document.querySelectorAll('[data-app]');
  for (var i = 0; i < appBtns.length; i++) {
    appBtns[i].addEventListener('click', function () {
      openApp(this.getAttribute('data-app'));
    });
  }
  if (closeBtn) closeBtn.addEventListener('click', closeApp);
  if (modal) {
    modal.addEventListener('click', function (e) { if (e.target === modal) closeApp(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeApp();
    });
  }

})();
