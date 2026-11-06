(function () {
  // pause / play all looping motion (WCAG 2.2.2)
  var root = document.getElementById('root');
  var t = document.getElementById('toggle');
  if (t && root) {
    t.addEventListener('click', function () {
      var p = root.classList.toggle('paused');
      t.setAttribute('aria-pressed', p ? 'true' : 'false');
      t.textContent = p ? '播放動態' : '暫停動態';
    });
  }

  // pixel dissolve band
  function hash(a, b) { var x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return x - Math.floor(x); }
  document.querySelectorAll('[data-pixels]').forEach(function (box) {
    var html = '', rows = 5;
    for (var r = 0; r < rows; r++) for (var c = 0; c < 24; c++) {
      if (hash(c, r) < (r + 1) / (rows + 1)) {
        var a = hash(r + 7, c + 3), col = a < 0.06 ? '#EC5A9B' : a < 0.1 ? '#1AA0DC' : '#1E1D1B';
        html += '<span class="px" style="left:' + (c * 100 / 24).toFixed(4) + '%;top:' + (r * 100 / rows) + '%;width:calc(' + (100 / 24).toFixed(4) + '% + 1px);height:calc(' + (100 / rows) + '% + 1px);background:' + col + ';animation-delay:' + Math.round(r * 80 + hash(r, c) * 300) + 'ms"></span>';
      }
    }
    box.innerHTML = html;
  });

  // fixed-size boards: fit the whole chart to the screen width; on phones a text button
  // switches to a zoomed view (about 60% size) that scrolls sideways inside the chart
  document.querySelectorAll('.board').forEach(function (b) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'zoom-btn';
    btn.textContent = '放大圖表';
    btn.setAttribute('aria-pressed', 'false');
    btn.addEventListener('click', function () {
      var z = b.classList.toggle('zoomed');
      btn.textContent = z ? '縮回整張' : '放大圖表';
      btn.setAttribute('aria-pressed', z ? 'true' : 'false');
      fit();
    });
    b.parentElement.insertBefore(btn, b);
  });
  function fit() {
    document.querySelectorAll('.board').forEach(function (b) {
      var inner = b.querySelector('.board-inner');
      var w = +b.dataset.w, h = +b.dataset.h;
      var avail = b.parentElement.clientWidth - 6;
      var s = Math.min(1, avail / w);
      if (b.classList.contains('zoomed')) s = Math.max(s, 0.6);
      inner.style.transform = 'scale(' + s + ')';
      inner.style.width = w + 'px';
      inner.style.height = h + 'px';
      b.style.height = (h * s + 6) + 'px';
      b.style.width = Math.min(avail + 6, w * s + 6) + 'px';
      var wrap = b.querySelector('.board-scale');
      if (wrap) { wrap.style.width = (w * s) + 'px'; wrap.style.height = (h * s) + 'px'; }
    });
  }
  window.addEventListener('resize', fit);
  fit();
})();
