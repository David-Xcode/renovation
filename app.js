/* ============================================================
   厨房装修监工指南 — 共享交互脚本
   两个页面共用：阅读进度条 + 滚动入场动画（渐进增强）
   ============================================================ */
(function () {
  "use strict";

  /* 阅读进度条：随滚动填充顶部 3px 横条 */
  var bar = document.querySelector(".progress");
  function updateProgress() {
    if (!bar) return;
    var doc = document.documentElement;
    var scrollable = doc.scrollHeight - doc.clientHeight;
    var pct = scrollable > 0 ? (doc.scrollTop / scrollable) * 100 : 0;
    bar.style.width = pct + "%";
  }

  /* 滚动入场：先给元素加 .reveal（隐藏），再用 IO 逐个点亮。
     注意——只有 JS 跑起来才会隐藏，保证无脚本时内容照常显示 */
  function setupReveal() {
    var targets = document.querySelectorAll("[data-reveal]");
    if (!targets.length) return;

    var reduce = window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce || !("IntersectionObserver" in window)) {
      // 不支持或用户偏好减少动效：直接显示，不做动画
      return;
    }

    targets.forEach(function (el) { el.classList.add("reveal"); });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    targets.forEach(function (el) { io.observe(el); });
  }

  /* 节流的滚动监听 */
  var ticking = false;
  window.addEventListener("scroll", function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        updateProgress();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  document.addEventListener("DOMContentLoaded", function () {
    updateProgress();
    setupReveal();
  });
})();
