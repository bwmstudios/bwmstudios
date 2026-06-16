/* TextType — vanilla JS port of the React Bits TextType component
   Same prop API: text, typingSpeed, initialDelay, pauseDuration,
   deletingSpeed, loop, showCursor, hideCursorWhileTyping,
   cursorCharacter, cursorClassName, cursorBlinkDuration,
   textColors, variableSpeed, onSentenceComplete,
   startOnVisible, reverseMode, className                          */

class TextType {
  constructor(element, options) {
    this.el = typeof element === 'string' ? document.querySelector(element) : element;
    if (!this.el) return;

    var o = options || {};
    this.texts               = Array.isArray(o.text) ? o.text : [o.text || ''];
    this.typingSpeed         = o.typingSpeed         !== undefined ? o.typingSpeed         : 50;
    this.initialDelay        = o.initialDelay        !== undefined ? o.initialDelay        : 0;
    this.pauseDuration       = o.pauseDuration       !== undefined ? o.pauseDuration       : 2000;
    this.deletingSpeed       = o.deletingSpeed       !== undefined ? o.deletingSpeed       : 30;
    this.loop                = o.loop                !== undefined ? o.loop                : true;
    this.showCursor          = o.showCursor          !== undefined ? o.showCursor          : true;
    this.hideCursorWhileTyping = o.hideCursorWhileTyping !== undefined ? o.hideCursorWhileTyping : false;
    this.cursorCharacter     = o.cursorCharacter     !== undefined ? o.cursorCharacter     : '|';
    this.cursorClassName     = o.cursorClassName     || '';
    this.cursorBlinkDuration = o.cursorBlinkDuration !== undefined ? o.cursorBlinkDuration : 0.5;
    this.textColors          = o.textColors          || [];
    this.variableSpeed       = o.variableSpeed       || null;
    this.onSentenceComplete  = o.onSentenceComplete  || null;
    this.startOnVisible      = o.startOnVisible      !== undefined ? o.startOnVisible      : false;
    this.reverseMode         = o.reverseMode         !== undefined ? o.reverseMode         : false;
    this.className           = o.className           || '';

    // State
    this._text     = '';
    this._charIdx  = 0;
    this._deleting = false;
    this._textIdx  = 0;
    this._timer    = null;

    // Build inner DOM
    this.el.classList.add('text-type');
    if (this.className) {
      this.className.split(' ').filter(Boolean).forEach(function (c) { this.el.classList.add(c); }, this);
    }
    this.el.innerHTML = '';

    this._contentEl = document.createElement('span');
    this._contentEl.className = 'text-type__content';
    this.el.appendChild(this._contentEl);

    if (this.showCursor) {
      this._cursorEl = document.createElement('span');
      var cClasses = ['text-type__cursor'];
      if (this.cursorClassName) cClasses.push(this.cursorClassName);
      this._cursorEl.className = cClasses.join(' ');
      this._cursorEl.style.setProperty('--tt-blink-dur', this.cursorBlinkDuration + 's');
      this._cursorEl.textContent = this.cursorCharacter;
      this.el.appendChild(this._cursorEl);
    }

    // If initialDelay > 0, pre-fill the first text so there's no empty flash
    if (this.initialDelay > 0) {
      this._text    = this.texts[0];
      this._charIdx = this.texts[0].length;
      this._contentEl.textContent = this._text;
      this._applyColor();
    }

    // Start
    if (this.startOnVisible) {
      var self = this;
      var obs = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          obs.disconnect();
          self._launch();
        }
      }, { threshold: 0.1 });
      obs.observe(this.el);
    } else {
      this._launch();
    }
  }

  _launch() {
    var self = this;
    if (this.initialDelay > 0) {
      // First text is already shown — after delay start the delete/retype cycle
      this._timer = setTimeout(function () {
        self._deleting = true;
        self._tick();
      }, this.initialDelay);
    } else {
      this._timer = setTimeout(function () { self._tick(); }, 0);
    }
  }

  _applyColor() {
    if (!this.textColors.length) return;
    var color = this.textColors[this._textIdx % this.textColors.length];
    if (color) this._contentEl.style.color = color;
  }

  _randomSpeed() {
    var min = this.variableSpeed.min, max = this.variableSpeed.max;
    return Math.random() * (max - min) + min;
  }

  _schedule(ms) {
    var self = this;
    this._timer = setTimeout(function () { self._tick(); }, ms);
  }

  _tick() {
    var self         = this;
    var currentText  = this.texts[this._textIdx];
    var processed    = this.reverseMode ? currentText.split('').reverse().join('') : currentText;

    this._applyColor();

    if (this._cursorEl) {
      var hide = this.hideCursorWhileTyping &&
                 (this._charIdx < currentText.length || this._deleting);
      this._cursorEl.classList.toggle('text-type__cursor--hidden', hide);
    }

    if (this._deleting) {
      if (this._text === '') {
        // Finished deleting
        this._deleting = false;
        var atLast = this._textIdx === this.texts.length - 1;
        if (atLast && !this.loop) return;

        if (this.onSentenceComplete) {
          this.onSentenceComplete(currentText, this._textIdx);
        }
        this._textIdx = (this._textIdx + 1) % this.texts.length;
        this._charIdx = 0;
        // Brief pause before typing next text
        this._schedule(this.pauseDuration * 0.25);
      } else {
        this._text = this._text.slice(0, -1);
        this._contentEl.textContent = this._text;
        this._schedule(this.deletingSpeed);
      }
    } else {
      if (this._charIdx < processed.length) {
        this._text   += processed[this._charIdx];
        this._charIdx++;
        this._contentEl.textContent = this._text;
        var speed = this.variableSpeed ? this._randomSpeed() : this.typingSpeed;
        this._schedule(speed);
      } else {
        // Finished typing — wait pauseDuration then start deleting
        var atLast2 = this._textIdx === this.texts.length - 1;
        if (!this.loop && atLast2) return;
        this._timer = setTimeout(function () {
          self._deleting = true;
          self._tick();
        }, this.pauseDuration);
      }
    }
  }

  destroy() {
    clearTimeout(this._timer);
    this.el.classList.remove('text-type');
    this.el.innerHTML = '';
  }
}
