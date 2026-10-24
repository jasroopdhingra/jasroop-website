/* Character globe for travels.html.
   Drag, touch, or arrow keys rotate it. It spins until you grab it.
   Places come from /data/travels.js. Coasts come from /assets/landmask.js.
   The visible list under the canvas is the text alternative. */
(function () {
  var places = Array.isArray(window.TRAVELS) ? window.TRAVELS : [];
  var mask = window.LAND_MASK;
  var canvas = document.getElementById("globe");
  var countEl = document.getElementById("country-count");
  var listEl = document.getElementById("place-list");
  var labelEl = document.getElementById("globe-label");

  var OCEAN = 1;
  var LAND = 2;
  var VISITED = 3;
  var ARC = 4;
  var HEAD = 5;
  var CITY = 6;
  var HOME = 7;

  var GLYPH = {};
  GLYPH[OCEAN] = ".";
  GLYPH[LAND] = "+";
  GLYPH[VISITED] = "+";
  GLYPH[ARC] = "-";
  GLYPH[HEAD] = ">";
  GLYPH[CITY] = "*";
  GLYPH[HOME] = "@";

  var COLOR = {};
  COLOR[OCEAN] = "#6d97bf";
  COLOR[LAND] = "#1f6b43";
  COLOR[VISITED] = "#c9840a";
  COLOR[ARC] = "#FF2D95";
  COLOR[HEAD] = "#FF1493";
  COLOR[CITY] = "#FF1493";
  COLOR[HOME] = "#FF1493";

  function placeLabel(p) {
    var where = p.name === p.country ? p.name : p.name + ", " + p.country;
    return p.home ? where + " (home)" : where;
  }

  var countries = {};
  for (var i = 0; i < places.length; i++) {
    if (places[i].country) countries[places[i].country] = true;
    places[i]._lat = places[i].lat * Math.PI / 180;
    places[i]._lon = places[i].lon * Math.PI / 180;
  }
  var countryCount = Object.keys(countries).length;
  if (countEl) {
    countEl.textContent = countryCount + (countryCount === 1 ? " country." : " countries.");
  }
  if (listEl) {
    listEl.textContent = "";
    for (var n = 0; n < places.length; n++) {
      var li = document.createElement("li");
      li.textContent = placeLabel(places[n]);
      listEl.appendChild(li);
    }
  }

  if (!canvas || !mask || !places.length || !canvas.getContext) return;

  var ctx = canvas.getContext("2d", { alpha: false });
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var home = null;
  for (var h = 0; h < places.length; h++) {
    if (places[h].home) home = places[h];
  }

  var maskBytes = Uint8Array.from(atob(mask.bits), function (c) { return c.charCodeAt(0); });

  function isLand(lat, lon) {
    var x = Math.floor(((lon + 180) / 360) * mask.w);
    var y = Math.floor(((90 - lat) / 180) * mask.h);
    if (x < 0) x = 0;
    if (x >= mask.w) x = mask.w - 1;
    if (y < 0) y = 0;
    if (y >= mask.h) y = mask.h - 1;
    var idx = y * mask.w + x;
    return (maskBytes[idx >> 3] >> (7 - (idx & 7))) & 1;
  }

  var visitLimit = Math.sin((8 * Math.PI / 180) / 2);
  visitLimit = visitLimit * visitLimit;

  function nearVisit(lat, lon) {
    var latR = lat * Math.PI / 180;
    var lonR = lon * Math.PI / 180;
    var cosLat = Math.cos(latR);
    for (var i = 0; i < places.length; i++) {
      var dLat = latR - places[i]._lat;
      var dLon = lonR - places[i]._lon;
      var sLat = Math.sin(dLat / 2);
      var sLon = Math.sin(dLon / 2);
      var a = sLat * sLat + cosLat * Math.cos(places[i]._lat) * sLon * sLon;
      if (a < visitLimit) return true;
    }
    return false;
  }

  var yaw = (-32 * Math.PI) / 180;
  var pitch = 0.22;
  var dragging = false;
  var lastX = 0;
  var lastY = 0;
  var resumeAt = 0;
  var running = false;
  var visible = true;
  var frame = 0;
  var laidWidth = 0;
  var cssSize = 0;
  var cols = 0;
  var rows = 0;
  var charW = 8;
  var charH = 14;
  var dpr = 1;
  var fontSize = 12;
  var ox = 0;
  var oy = 0;
  var radius = 100;
  var cityHits = [];

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  function latLonVec(lat, lon) {
    var p = lat * Math.PI / 180;
    var l = lon * Math.PI / 180;
    var cp = Math.cos(p);
    return [cp * Math.sin(l), Math.sin(p), cp * Math.cos(l)];
  }

  function rot(v) {
    var cy = Math.cos(yaw);
    var sy = Math.sin(yaw);
    var x1 = v[0] * cy + v[2] * sy;
    var z1 = -v[0] * sy + v[2] * cy;
    var cp = Math.cos(pitch);
    var sp = Math.sin(pitch);
    return [x1, v[1] * cp - z1 * sp, v[1] * sp + z1 * cp];
  }

  function unrot(v) {
    var cp = Math.cos(pitch);
    var sp = Math.sin(pitch);
    var y1 = v[1] * cp + v[2] * sp;
    var z1 = -v[1] * sp + v[2] * cp;
    var cy = Math.cos(yaw);
    var sy = Math.sin(yaw);
    return [v[0] * cy - z1 * sy, y1, v[0] * sy + z1 * cy];
  }

  function slerp(a, b, t) {
    var d = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    if (d > 1) d = 1;
    if (d < -1) d = -1;
    var om = Math.acos(d);
    if (om < 0.001) return a;
    var s = Math.sin(om);
    var p = Math.sin((1 - t) * om) / s;
    var q = Math.sin(t * om) / s;
    return [a[0] * p + b[0] * q, a[1] * p + b[1] * q, a[2] * p + b[2] * q];
  }

  var homeV = home ? latLonVec(home.lat, home.lon) : null;
  var arcs = [];
  if (homeV) {
    for (var a = 0; a < places.length; a++) {
      if (places[a].home) continue;
      var dest = latLonVec(places[a].lat, places[a].lon);
      var steps = 28;
      var pts = [];
      for (var s = 0; s <= steps; s++) pts.push(slerp(homeV, dest, s / steps));
      arcs.push({ pts: pts, phase: (a * 3) % steps });
    }
  }

  function layout() {
    var width = canvas.clientWidth;
    if (width < 40) return false;
    laidWidth = width;
    cssSize = Math.floor(width);
    dpr = Math.min(2, window.devicePixelRatio || 1);
    fontSize = cssSize < 380 ? 11 : 12;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.font = fontSize + 'px "Courier New", ui-monospace, monospace';
    charW = ctx.measureText("M").width || fontSize * 0.62;
    charH = Math.ceil(fontSize * 1.12);
    cols = Math.max(20, Math.floor(cssSize / charW));
    rows = Math.max(12, Math.floor(cssSize / charH));
    var gridW = cols * charW;
    var gridH = rows * charH;
    ox = (cssSize - gridW) / 2;
    oy = (cssSize - gridH) / 2;
    radius = Math.min(gridW, gridH) * 0.46;
    canvas.width = Math.floor(cssSize * dpr);
    canvas.height = Math.floor(cssSize * dpr);
    return true;
  }

  function project(world, lift) {
    var v = rot(world);
    if (v[2] <= 0.04) return null;
    var scale = 1 + (lift || 0);
    var sx = v[0] * radius * scale + cssSize / 2;
    var sy = cssSize / 2 - v[1] * radius * scale;
    var c = Math.floor((sx - ox) / charW);
    var r = Math.floor((sy - oy) / charH);
    if (c < 0 || r < 0 || c >= cols || r >= rows) return null;
    return { c: c, r: r };
  }

  function stamp(cells, kinds, pri, c, r, kind, pr) {
    if (c < 0 || r < 0 || c >= cols || r >= rows) return false;
    var i = r * cols + c;
    if (pri[i] > pr) return false;
    cells[i] = GLYPH[kind];
    kinds[i] = kind;
    pri[i] = pr;
    return true;
  }

  function renderFrame() {
    if (Math.abs(canvas.clientWidth - laidWidth) > 1) {
      if (!layout()) return;
    }
    var cells = new Array(rows * cols);
    var kinds = new Uint8Array(rows * cols);
    var pri = new Uint8Array(rows * cols);

    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var sx = ox + (c + 0.5) * charW - cssSize / 2;
        var sy = cssSize / 2 - (oy + (r + 0.5) * charH);
        var rr = sx * sx + sy * sy;
        if (rr > radius * radius) continue;
        var x = sx / radius;
        var y = sy / radius;
        var z = Math.sqrt(Math.max(0, 1 - x * x - y * y));
        var world = unrot([x, y, z]);
        var lat = Math.asin(Math.max(-1, Math.min(1, world[1]))) * 180 / Math.PI;
        var lon = Math.atan2(world[0], world[2]) * 180 / Math.PI;
        var i = r * cols + c;
        if (!isLand(lat, lon)) {
          if (((r + c) & 1) === 0) {
            cells[i] = GLYPH[OCEAN];
            kinds[i] = OCEAN;
            pri[i] = 1;
          }
          continue;
        }
        var kind = nearVisit(lat, lon) ? VISITED : LAND;
        cells[i] = GLYPH[kind];
        kinds[i] = kind;
        pri[i] = 1;
      }
    }

    var headStep = reduce ? -1 : (frame + Math.floor(performance.now() / 70));
    for (var ai = 0; ai < arcs.length; ai++) {
      var arc = arcs[ai];
      var head = headStep < 0 ? -1 : (headStep + arc.phase) % arc.pts.length;
      for (var s = 0; s < arc.pts.length; s++) {
        var hit = project(arc.pts[s], 0.08);
        if (!hit) continue;
        if (s === head) stamp(cells, kinds, pri, hit.c, hit.r, HEAD, 3);
        else if ((s & 1) === 0) stamp(cells, kinds, pri, hit.c, hit.r, ARC, 2);
      }
    }

    cityHits = [];
    for (var p = 0; p < places.length; p++) {
      var spot = project(latLonVec(places[p].lat, places[p].lon), 0);
      if (!spot) continue;
      var kind = places[p].home ? HOME : CITY;
      var priority = places[p].home ? 5 : 4;
      var placed = stamp(cells, kinds, pri, spot.c, spot.r, kind, priority);
      if (!placed) {
        var neighbors = [[1, 0], [-1, 0], [0, 1], [0, -1]];
        for (var k = 0; k < neighbors.length; k++) {
          if (stamp(cells, kinds, pri, spot.c + neighbors[k][0], spot.r + neighbors[k][1], kind, priority)) {
            spot = { c: spot.c + neighbors[k][0], r: spot.r + neighbors[k][1] };
            placed = true;
            break;
          }
        }
      }
      if (placed) cityHits.push({ c: spot.c, r: spot.r, place: places[p] });
    }

    var cx = cssSize / 2;
    var cy = cssSize / 2;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, cssSize, cssSize);
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = "#e5f2fa";
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
    ctx.font = fontSize + 'px "Courier New", ui-monospace, monospace';
    ctx.textBaseline = "top";
    for (var row = 0; row < rows; row++) {
      var col = 0;
      while (col < cols) {
        var kindAt = kinds[row * cols + col];
        if (!kindAt) {
          col++;
          continue;
        }
        var start = col;
        var text = cells[row * cols + col];
        col++;
        while (col < cols && kinds[row * cols + col] === kindAt) {
          text += cells[row * cols + col];
          col++;
        }
        ctx.fillStyle = COLOR[kindAt];
        ctx.fillText(text, ox + start * charW, oy + row * charH);
      }
    }

    function screenOf(world, lift) {
      var v = rot(world);
      if (v[2] <= 0.05) return null;
      var scale = 1 + (lift || 0);
      return {
        x: v[0] * radius * scale + cssSize / 2,
        y: cssSize / 2 - v[1] * radius * scale
      };
    }

    ctx.lineWidth = 1.8;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#FF1493";
    for (var bi = 0; bi < arcs.length; bi++) {
      var route = arcs[bi];
      ctx.beginPath();
      var pen = false;
      for (var t = 0; t < route.pts.length; t++) {
        var sp = screenOf(route.pts[t], 0.08);
        if (!sp) {
          if (pen) {
            ctx.stroke();
            ctx.beginPath();
            pen = false;
          }
          continue;
        }
        if (!pen) {
          ctx.moveTo(sp.x, sp.y);
          pen = true;
        } else ctx.lineTo(sp.x, sp.y);
      }
      if (pen) ctx.stroke();
      if (headStep >= 0) {
        var hi = (headStep + route.phase) % route.pts.length;
        var hp = screenOf(route.pts[hi], 0.08);
        if (hp) {
          ctx.fillStyle = "#FF2D95";
          ctx.beginPath();
          ctx.arc(hp.x, hp.y, 2.7, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    for (var q = 0; q < places.length; q++) {
      var pin = screenOf(latLonVec(places[q].lat, places[q].lon), 0);
      if (!pin) continue;
      ctx.fillStyle = places[q].home ? "#FF1493" : "#FF2D95";
      ctx.beginPath();
      ctx.arc(pin.x, pin.y, places[q].home ? 3.5 : 2.7, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "#16324f";
    ctx.lineWidth = 1.6;
    ctx.stroke();

    if (!reduce && !dragging && performance.now() > resumeAt) yaw += 0.0042;
    frame++;
  }

  function pointerCell(e) {
    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    return {
      c: Math.floor((x - ox) / charW),
      r: Math.floor((y - oy) / charH)
    };
  }

  function showHover(e) {
    if (!labelEl || dragging) return;
    var cell = pointerCell(e);
    var best = null;
    var bestD = 2.4;
    for (var i = 0; i < cityHits.length; i++) {
      var d = Math.hypot(cityHits[i].c - cell.c, cityHits[i].r - cell.r);
      if (d < bestD) {
        best = cityHits[i];
        bestD = d;
      }
    }
    labelEl.textContent = best ? placeLabel(best.place) : "";
  }

  canvas.addEventListener("pointerdown", function (e) {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    canvas.classList.add("is-grabbing");
    if (canvas.setPointerCapture) canvas.setPointerCapture(e.pointerId);
  });

  canvas.addEventListener("pointermove", function (e) {
    if (!dragging) {
      showHover(e);
      return;
    }
    var dx = e.clientX - lastX;
    var dy = e.clientY - lastY;
    yaw += dx * 0.012;
    pitch = clamp(pitch + dy * 0.008, -1.05, 1.05);
    lastX = e.clientX;
    lastY = e.clientY;
    if (reduce) renderFrame();
  });

  function endDrag() {
    if (!dragging) return;
    dragging = false;
    resumeAt = performance.now() + 1600;
    canvas.classList.remove("is-grabbing");
  }
  canvas.addEventListener("pointerup", endDrag);
  canvas.addEventListener("pointercancel", endDrag);
  canvas.addEventListener("pointerleave", function () {
    if (!dragging && labelEl) labelEl.textContent = "";
  });

  canvas.addEventListener("keydown", function (e) {
    var step = 0.14;
    if (e.key === "ArrowLeft") yaw -= step;
    else if (e.key === "ArrowRight") yaw += step;
    else if (e.key === "ArrowUp") pitch = clamp(pitch + step * 0.7, -1.05, 1.05);
    else if (e.key === "ArrowDown") pitch = clamp(pitch - step * 0.7, -1.05, 1.05);
    else return;
    e.preventDefault();
    resumeAt = performance.now() + 1600;
    if (reduce) renderFrame();
  });

  function loop() {
    if (!visible || document.hidden) {
      running = false;
      return;
    }
    renderFrame();
    if (reduce) {
      running = false;
      return;
    }
    requestAnimationFrame(loop);
  }

  function start() {
    if (running) return;
    running = true;
    requestAnimationFrame(loop);
  }

  document.addEventListener("visibilitychange", function () {
    if (!document.hidden && visible) start();
  });

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible) start();
    }, { threshold: 0.05 });
    io.observe(canvas);
  }

  window.addEventListener("resize", function () {
    laidWidth = 0;
    if (reduce) renderFrame();
  });

  layout();
  renderFrame();
  start();
})();
