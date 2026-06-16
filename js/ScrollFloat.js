/* ScrollFloat — vanilla JS port of the React Bits ScrollFloat component
   Props (via options object):
     animationDuration  number   1       transition duration in seconds
     stagger            number   0.03    delay increment per word (seconds)
     threshold          number   0.2     IntersectionObserver threshold
     className          string   ''      extra class on every .sf-word span  */

function ScrollFloat(selector, options) {
  var o            = options || {};
  var duration     = o.animationDuration !== undefined ? o.animationDuration : 1;
  var stagger      = o.stagger           !== undefined ? o.stagger           : 0.03;
  var threshold    = o.threshold         !== undefined ? o.threshold         : 0.2;
  var extraClass   = o.className         || '';

  var elements = typeof selector === 'string'
    ? Array.prototype.slice.call(document.querySelectorAll(selector))
    : (Array.isArray(selector) ? selector : [selector]);

  elements.forEach(function (el) {
    if (el.dataset.sfReady) return;
    el.dataset.sfReady = '1';

    var wordIndex = 0;

    /* Recursively wrap plain text words in .sf-word spans,
       diving into element children so .accent spans are handled */
    function processNode(node) {
      if (node.nodeType === 3) {           /* text node */
        var parts = node.textContent.split(/(\s+)/);
        var frag  = document.createDocumentFragment();
        parts.forEach(function (part) {
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(part));
          } else if (part) {
            var span = document.createElement('span');
            span.className = 'sf-word' + (extraClass ? ' ' + extraClass : '');
            span.style.setProperty('--sf-dur', duration + 's');
            span.style.transitionDelay = (wordIndex * stagger) + 's';
            span.textContent = part;
            wordIndex++;
            frag.appendChild(span);
          }
        });
        node.parentNode.replaceChild(frag, node);
      } else if (node.nodeType === 1 && node.nodeName !== 'BR') {
        /* Clone child list before iterating (DOM mutates in place) */
        Array.prototype.slice.call(node.childNodes).forEach(processNode);
      }
    }

    Array.prototype.slice.call(el.childNodes).forEach(processNode);

    /* Trigger reveal when heading enters the viewport */
    if (!('IntersectionObserver' in window)) {
      /* Fallback: show immediately */
      el.querySelectorAll('.sf-word').forEach(function (w) { w.classList.add('sf-visible'); });
      return;
    }

    var obs = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      obs.disconnect();
      el.querySelectorAll('.sf-word').forEach(function (w) {
        w.classList.add('sf-visible');
      });
    }, { threshold: threshold });

    obs.observe(el);
  });
}
