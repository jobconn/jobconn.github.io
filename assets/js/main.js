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

})();
