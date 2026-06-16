/* ElectricBorder — vanilla JS port of @BalintFerenczy's component
   Full port of the noise algorithm + canvas rendering. No dependencies.

   new ElectricBorder(element, {
     color        '#5227FF'   stroke + glow colour
     speed        1           animation speed multiplier
     chaos        0.12        noise amplitude (displacement amount)
     borderRadius 24          corner radius in px (match your CSS)
     thickness    2           stroke lineWidth
   })                                                              */

class ElectricBorder {
  constructor(element, options) {
    this.el = typeof element === 'string' ? document.querySelector(element) : element;
    if (!this.el) return;

    var o             = options || {};
    this.color        = o.color        !== undefined ? o.color        : '#5227FF';
    this.speed        = o.speed        !== undefined ? o.speed        : 1;
    this.chaos        = o.chaos        !== undefined ? o.chaos        : 0.12;
    this.borderRadius = o.borderRadius !== undefined ? o.borderRadius : 24;
    this.thickness    = o.thickness    !== undefined ? o.thickness    : 2;

    /* Internal constants — match the original exactly */
    this._OCTAVES      = 10;
    this._LACUNARITY   = 1.6;
    this._GAIN         = 0.7;
    this._FREQUENCY    = 10;
    this._BASE_FLAT    = 0;
    this._DISPLACEMENT = 60;
    this._BORDER_OFF   = 60;

    this._time      = 0;
    this._lastTs    = 0;
    this._raf       = null;
    this._dpr       = 1;
    this._W         = 0;
    this._H         = 0;

    this._build();
  }

  /* ── DOM setup ─────────────────────────────────────────────── */
  _build() {
    var pos = getComputedStyle(this.el).position;
    if (pos === 'static') this.el.style.position = 'relative';

    this.el.classList.add('electric-border');
    this.el.style.setProperty('--electric-border-color', this.color);

    /* Canvas wrapper */
    this._wrap = document.createElement('div');
    this._wrap.className = 'eb-canvas-container';
    this._cv = document.createElement('canvas');
    this._cv.className = 'eb-canvas';
    this._wrap.appendChild(this._cv);
    this.el.appendChild(this._wrap);

    /* Glow layers */
    this._layers = document.createElement('div');
    this._layers.className = 'eb-layers';
    ['eb-glow-1', 'eb-glow-2', 'eb-background-glow'].forEach(function (c) {
      var d = document.createElement('div');
      d.className = c;
      this._layers.appendChild(d);
    }, this);
    this.el.appendChild(this._layers);

    this._ctx = this._cv.getContext('2d');
    this._resize();

    var self = this;
    this._ro = new ResizeObserver(function () { self._resize(); });
    this._ro.observe(this.el);

    this._raf = requestAnimationFrame(function (ts) { self._frame(ts); });
  }

  _resize() {
    var rect = this.el.getBoundingClientRect();
    var bo   = this._BORDER_OFF;
    var w    = rect.width  + bo * 2;
    var h    = rect.height + bo * 2;
    var dpr  = Math.min(window.devicePixelRatio || 1, 2);

    this._cv.width  = Math.round(w * dpr);
    this._cv.height = Math.round(h * dpr);
    this._cv.style.width  = w + 'px';
    this._cv.style.height = h + 'px';
    this._ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    this._dpr = dpr;
    this._W   = w;
    this._H   = h;
  }

  /* ── Noise functions (faithful port) ───────────────────────── */
  _rnd(x) {
    /* Returns value in [0, 1) — add 1 and mod again to handle negatives */
    return ((Math.sin(x * 12.9898) * 43758.5453) % 1 + 1) % 1;
  }

  _noise2D(x, y) {
    var i  = Math.floor(x), j  = Math.floor(y);
    var fx = x - i,         fy = y - j;
    var a  = this._rnd(i     + j * 57);
    var b  = this._rnd(i + 1 + j * 57);
    var c  = this._rnd(i     + (j + 1) * 57);
    var d  = this._rnd(i + 1 + (j + 1) * 57);
    var ux = fx * fx * (3.0 - 2.0 * fx);
    var uy = fy * fy * (3.0 - 2.0 * fy);
    return a*(1-ux)*(1-uy) + b*ux*(1-uy) + c*(1-ux)*uy + d*ux*uy;
  }

  _octNoise(x, time, seed) {
    var y    = 0;
    var amp  = this.chaos;
    var freq = this._FREQUENCY;
    for (var i = 0; i < this._OCTAVES; i++) {
      var a = (i === 0) ? amp * this._BASE_FLAT : amp;
      y    += a * this._noise2D(freq * x + seed * 100, time * freq * 0.3);
      freq *= this._LACUNARITY;
      amp  *= this._GAIN;
    }
    return y;
  }

  /* ── Rounded-rect perimeter parameterisation ───────────────── */
  _corner(cx, cy, r, startA, arc, t) {
    var a = startA + t * arc;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  }

  _perimPt(t, L, T, W, H, r) {
    var sw  = W - 2 * r,  sh  = H - 2 * r;
    var ca  = (Math.PI * r) / 2;
    var tot = 2 * sw + 2 * sh + 4 * ca;
    var d   = t * tot, acc = 0;

    /* Top edge */
    if (d <= acc + sw) return { x: L + r + (d - acc) / sw * sw, y: T };
    acc += sw;
    /* Top-right corner */
    if (d <= acc + ca) return this._corner(L+W-r, T+r,   r, -Math.PI/2, Math.PI/2, (d-acc)/ca);
    acc += ca;
    /* Right edge */
    if (d <= acc + sh) return { x: L + W, y: T + r + (d - acc) / sh * sh };
    acc += sh;
    /* Bottom-right corner */
    if (d <= acc + ca) return this._corner(L+W-r, T+H-r, r, 0,          Math.PI/2, (d-acc)/ca);
    acc += ca;
    /* Bottom edge */
    if (d <= acc + sw) return { x: L + W - r - (d - acc) / sw * sw, y: T + H };
    acc += sw;
    /* Bottom-left corner */
    if (d <= acc + ca) return this._corner(L+r,   T+H-r, r, Math.PI/2,  Math.PI/2, (d-acc)/ca);
    acc += ca;
    /* Left edge */
    if (d <= acc + sh) return { x: L, y: T + H - r - (d - acc) / sh * sh };
    acc += sh;
    /* Top-left corner */
    return this._corner(L+r, T+r, r, Math.PI, Math.PI/2, (d - acc) / ca);
  }

  /* ── Animation frame ───────────────────────────────────────── */
  _frame(ts) {
    var self  = this;
    var delta = (ts - this._lastTs) / 1000;
    this._time   += delta * this.speed;
    this._lastTs  = ts;

    var ctx = this._ctx;
    var W   = this._W, H = this._H, dpr = this._dpr;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    var bo  = this._BORDER_OFF;
    var L   = bo, T = bo, bW = W - 2*bo, bH = H - 2*bo;
    var maxR = Math.min(bW, bH) / 2;
    var rad  = Math.min(this.borderRadius, maxR);

    var perim = 2*(bW + bH) + 2*Math.PI*rad;
    var n     = Math.floor(perim / 2);

    ctx.strokeStyle = this.color;
    ctx.lineWidth   = this.thickness;
    ctx.lineCap     = 'round';
    ctx.lineJoin    = 'round';
    ctx.shadowColor = this.color;
    ctx.shadowBlur  = 12;

    ctx.beginPath();
    for (var i = 0; i <= n; i++) {
      var p  = i / n;
      var pt = this._perimPt(p, L, T, bW, bH, rad);
      var xn = this._octNoise(p * 8, this._time, 0) * this._DISPLACEMENT;
      var yn = this._octNoise(p * 8, this._time, 1) * this._DISPLACEMENT;
      if (i === 0) ctx.moveTo(pt.x + xn, pt.y + yn);
      else         ctx.lineTo(pt.x + xn, pt.y + yn);
    }
    ctx.closePath();
    ctx.stroke();

    this._raf = requestAnimationFrame(function (ts2) { self._frame(ts2); });
  }

  /* ── Cleanup ────────────────────────────────────────────────── */
  destroy() {
    if (this._raf) cancelAnimationFrame(this._raf);
    if (this._ro)  this._ro.disconnect();
    this._wrap.remove();
    this._layers.remove();
    this.el.classList.remove('electric-border');
    this.el.style.removeProperty('--electric-border-color');
  }
}
