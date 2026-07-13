/* =========================================================
   Heejung Choi — homepage interactions
   ========================================================= */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- theme toggle (persisted) ---------- */
  var toggle = document.getElementById("themeToggle");
  try {
    var saved = localStorage.getItem("hc-theme");
    if (saved === "light" || saved === "dark") root.setAttribute("data-theme", saved);
  } catch (e) { /* storage blocked — fall back to system theme */ }

  function currentTheme() {
    var attr = root.getAttribute("data-theme");
    if (attr === "light" || attr === "dark") return attr;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("hc-theme", next); } catch (e) {}
    });
  }

  /* ---------- current year ---------- */
  var yr = document.getElementById("yr");
  if (yr) {
    var d = new Date();
    if (!isNaN(d.getFullYear())) yr.textContent = d.getFullYear();
  }

  /* ---------- sticky nav border + active-section highlight ---------- */
  var nav = document.getElementById("nav");
  window.addEventListener("scroll", function () {
    if (nav) nav.classList.toggle("is-stuck", window.scrollY > 8);
  }, { passive: true });

  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav__links a[href^='#']"));
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var id = en.target.getAttribute("id");
        navLinks.forEach(function (a) {
          a.classList.toggle("active", a.getAttribute("href") === "#" + id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- scroll reveal ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    var ro = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); obs.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealEls.forEach(function (el) { ro.observe(el); });
  }

  /* ---------- hero vital-sign trace ----------
     Layered, slowly drifting signal lines evoking a patient monitor.
     A "prediction point" glows at the leading edge. Static if reduced-motion. */
  var canvas = document.getElementById("signal");
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext("2d");
    var dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
    var W = 0, H = 0;

    function accentRGB() {
      var v = getComputedStyle(root).getPropertyValue("--wave").trim();
      return v || "11,110,117";
    }

    function resize() {
      var rect = canvas.getBoundingClientRect();
      W = rect.width; H = rect.height;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // A single trace: sum of a few sines, phase-shifted per layer.
    function trace(t, cfg) {
      var rgb = accentRGB();
      ctx.beginPath();
      var midline = H * cfg.mid;
      var step = 6;
      for (var x = 0; x <= W + step; x += step) {
        var p = x / W;
        var y = midline
          + Math.sin(p * cfg.f1 + t * cfg.s1 + cfg.ph) * cfg.a1
          + Math.sin(p * cfg.f2 - t * cfg.s2) * cfg.a2
          + Math.sin(p * cfg.f3 + t * cfg.s3) * cfg.a3;
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "rgba(" + rgb + "," + cfg.alpha + ")";
      ctx.lineWidth = cfg.w;
      ctx.stroke();

      // leading "prediction" node on the primary layer
      if (cfg.node) {
        var lx = W * 0.82;
        var lp = lx / W;
        var ly = midline
          + Math.sin(lp * cfg.f1 + t * cfg.s1 + cfg.ph) * cfg.a1
          + Math.sin(lp * cfg.f2 - t * cfg.s2) * cfg.a2
          + Math.sin(lp * cfg.f3 + t * cfg.s3) * cfg.a3;
        var g = ctx.createRadialGradient(lx, ly, 0, lx, ly, 26);
        g.addColorStop(0, "rgba(" + rgb + ",0.22)");
        g.addColorStop(1, "rgba(" + rgb + ",0)");
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(lx, ly, 26, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "rgba(" + rgb + ",0.85)";
        ctx.beginPath(); ctx.arc(lx, ly, 2.6, 0, Math.PI * 2); ctx.fill();
      }
    }

    var layers = [
      { mid: 0.52, f1: 5.5, f2: 11, f3: 19, s1: 0.55, s2: 0.32, s3: 0.9, ph: 0.0, a1: 26, a2: 10, a3: 4, alpha: 0.5, w: 1.6, node: true },
      { mid: 0.5,  f1: 4.0, f2: 9,  f3: 15, s1: 0.4,  s2: 0.5,  s3: 0.7, ph: 1.7, a1: 34, a2: 8,  a3: 5, alpha: 0.22, w: 1.1, node: false },
      { mid: 0.55, f1: 7.0, f2: 13, f3: 23, s1: 0.3,  s2: 0.25, s3: 0.6, ph: 3.2, a1: 18, a2: 12, a3: 3, alpha: 0.14, w: 1.0, node: false }
    ];

    function draw(t) {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < layers.length; i++) trace(t, layers[i]);
    }

    resize();
    window.addEventListener("resize", function () { resize(); if (reduceMotion) draw(0.6); }, { passive: true });

    if (reduceMotion) {
      draw(0.6); // single calm frame
    } else {
      var start = null;
      (function loop(ts) {
        if (start === null) start = ts;
        var t = (ts - start) / 1000;
        draw(t);
        requestAnimationFrame(loop);
      })(performance.now ? performance.now() : 0);
    }
  }
})();
