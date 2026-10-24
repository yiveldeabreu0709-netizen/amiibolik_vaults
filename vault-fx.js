/* =========================================================
   Vault FX — sonidos y micro-animaciones sutiles
   Mismo estilo que la captura del llavero: estrellitas doradas,
   anillo cian, notas triangulares suaves estilo Nintendo.

   - Un solo AudioContext compartido (antes se creaba uno por sonido).
   - Botón de silencio en la cabecera (se recuerda en localStorage).
   - Respeta "reducir movimiento" del sistema: sin animaciones, solo sonido.
   - Se engancha por delegación de eventos: no toca la lógica de la app.
   ========================================================= */
(function () {
  'use strict';

  const GOLD = '#f2c230', CYAN = '#29b6f0', ROSE = '#f43f5e', CREAM = '#fff3a6';
  const STAR_PATH = 'M12 1.5l3.1 6.6 7.2.9-5.3 5 1.4 7.1L12 17.6 5.6 21.1 7 14 1.7 9l7.2-.9z';
  const HEART_PATH = 'M12 21s-7.5-4.6-9.6-9.2C.9 8.4 2.7 4.5 6.3 4.5c2 0 3.7 1.1 5.7 3.3 2-2.2 3.7-3.3 5.7-3.3 3.6 0 5.4 3.9 3.9 7.3C19.5 16.4 12 21 12 21z';

  const reduceMotion = () => window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = () => typeof window.gsap !== 'undefined';

  /* ---------------- SONIDO ---------------- */
  let ctx = null;
  let muted = false;
  try { muted = localStorage.getItem('amiibo_vault_sound_muted') === '1'; } catch (e) {}

  function audio() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    return ctx;
  }

  // Nota con envolvente suave. `to` permite un pequeño glissando.
  function note(c, { f, to, t = 0, d = 0.25, type = 'triangle', g = 0.06 }) {
    const o = c.createOscillator(), v = c.createGain(), s = c.currentTime + t;
    o.type = type;
    o.frequency.setValueAtTime(f, s);
    if (to) o.frequency.exponentialRampToValueAtTime(to, s + d * 0.8);
    v.gain.setValueAtTime(0.0001, s);
    v.gain.exponentialRampToValueAtTime(g, s + 0.012);
    v.gain.exponentialRampToValueAtTime(0.0001, s + d);
    o.connect(v); v.connect(c.destination);
    o.start(s); o.stop(s + d + 0.02);
  }

  // "Shh" corto de ruido filtrado (para cambiar de franquicia)
  function swoosh(c) {
    const len = Math.floor(c.sampleRate * 0.18);
    const buf = c.createBuffer(1, len, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.sin(i * 12.9898) * 43758.5453 % 1) * 2 - 1; // ruido determinista
    const src = c.createBufferSource(); src.buffer = buf;
    const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 1.2;
    bp.frequency.setValueAtTime(500, c.currentTime);
    bp.frequency.exponentialRampToValueAtTime(2200, c.currentTime + 0.16);
    const v = c.createGain();
    v.gain.setValueAtTime(0.0001, c.currentTime);
    v.gain.exponentialRampToValueAtTime(0.05, c.currentTime + 0.04);
    v.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.17);
    src.connect(bp); bp.connect(v); v.connect(c.destination);
    src.start(); src.stop(c.currentTime + 0.18);
  }

  const SOUNDS = {
    // los tres originales (mismos valores que antes)
    success(c) { [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => note(c, { f, t: i * 0.08, d: 0.35, g: 0.12 })); },
    error(c)   { [783.99, 523.25, 392.0].forEach((f, i) => note(c, { f, t: i * 0.12, d: 0.3, g: 0.12 })); },
    tick(c)    { note(c, { f: 220, d: 0.08, type: 'square', g: 0.05 }); },
    // nuevos, más suaves
    open(c)    { note(c, { f: 380, to: 640, d: 0.11, type: 'sine', g: 0.06 }); },
    close(c)   { note(c, { f: 540, to: 300, d: 0.11, type: 'sine', g: 0.05 }); },
    fav(c)     { note(c, { f: 1318.5, d: 0.22, g: 0.07 }); note(c, { f: 1760, t: 0.07, d: 0.3, g: 0.07 }); note(c, { f: 2637, t: 0.14, d: 0.22, type: 'sine', g: 0.025 }); },
    unfav(c)   { note(c, { f: 520, to: 330, d: 0.14, type: 'sine', g: 0.05 }); },
    swoosh(c)  { swoosh(c); },
    connect(c) { note(c, { f: 880, d: 0.18, g: 0.07 }); note(c, { f: 1318.5, t: 0.1, d: 0.3, g: 0.07 }); }
  };

  function play(type) {
    if (muted) return;
    try {
      const c = audio();
      if (c && SOUNDS[type]) SOUNDS[type](c);
    } catch (e) {}
  }
  window.vaultSound = { play, isMuted: () => muted };
  // La app ya llama a playAudioTone('success' | 'tick' | 'error'): ahora usan el contexto compartido y el silencio.
  window.playAudioTone = play;

  /* ---------------- BOTÓN DE SILENCIO ---------------- */
  function mountMuteButton() {
    const label = document.getElementById('headerBtLabel');
    const btBtn = label && label.closest('button');
    if (!btBtn || document.getElementById('soundToggleBtn')) return;
    const b = document.createElement('button');
    b.id = 'soundToggleBtn';
    b.type = 'button';
    b.className = 'w-10 h-10 shrink-0 rounded-full border border-gray-200 bg-white flex items-center justify-center text-[#4F5A78] hover:bg-[#D0E7F9]/40 transition-colors cursor-pointer';
    const paint = () => {
      b.innerHTML = `<span class="material-symbols-outlined text-[20px]">${muted ? 'volume_off' : 'volume_up'}</span>`;
      b.title = muted ? 'Activar sonidos' : 'Silenciar sonidos';
      b.setAttribute('aria-label', b.title);
      b.setAttribute('aria-pressed', String(muted));
    };
    paint();
    b.addEventListener('click', () => {
      muted = !muted;
      try { localStorage.setItem('amiibo_vault_sound_muted', muted ? '1' : '0'); } catch (e) {}
      paint();
      if (!muted) play('open');
    });
    btBtn.parentNode.insertBefore(b, btBtn);
  }

  /* ---------------- RÁFAGA DE ESTRELLAS ---------------- */
  // Overlay fijo en pantalla: sobrevive al re-render de las tarjetas.
  function burst(x, y, kind) {
    if (!hasGsap() || reduceMotion()) return;
    const isFav = kind === 'fav';
    const layer = document.createElement('div');
    layer.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:0;height:0;pointer-events:none;z-index:2000`;
    document.body.appendChild(layer);

    const ring = document.createElement('div');
    const rc = isFav ? ROSE : CYAN;
    ring.style.cssText = `position:absolute;width:34px;height:34px;left:-17px;top:-17px;border-radius:50%;border:3px solid ${rc};box-shadow:0 0 14px ${rc}`;
    layer.appendChild(ring);

    const dirs = [-90, -40, -140, -65, -115, 0, 180];
    const items = dirs.map((a, i) => {
      const el = document.createElement('div');
      const heart = isFav && i % 3 === 1;
      const color = heart ? ROSE : [GOLD, CREAM, CYAN][i % 3];
      el.style.cssText = 'position:absolute;width:15px;height:15px;left:-7.5px;top:-7.5px';
      el.innerHTML = `<svg viewBox="0 0 24 24" width="100%" height="100%" style="display:block;filter:drop-shadow(0 0 5px ${color})"><path d="${heart ? HEART_PATH : STAR_PATH}" fill="${color}"/></svg>`;
      layer.appendChild(el);
      return { el, a, d: 36 + (i % 3) * 14 };
    });

    const tl = gsap.timeline({ onComplete: () => layer.remove() });
    tl.fromTo(ring, { scale: 0.3, opacity: 0.95 }, { scale: 2.3, opacity: 0, duration: 0.5, ease: 'power2.out' }, 0);
    items.forEach(({ el, a, d }, i) => {
      const r = a * Math.PI / 180;
      tl.fromTo(el,
        { x: 0, y: 0, scale: 0.2, opacity: 1, rotation: 0 },
        { x: Math.cos(r) * d, y: Math.sin(r) * d - 10, scale: 1.05, rotation: (i % 2 ? 1 : -1) * 70, duration: 0.42, ease: 'power2.out' }, 0);
      tl.to(el, { y: '+=18', scale: 0, opacity: 0, duration: 0.3, ease: 'power1.in' }, 0.4);
    });
  }

  /* ---------------- FAVORITOS (captura antes de que la app re-dibuje) ---------------- */
  document.addEventListener('click', (e) => {
    const btn = e.target.closest && e.target.closest('.btn-card-fav, #modalFavBtn');
    if (!btn) return;
    const wasFav = btn.className.indexOf('bg-rose-500') !== -1;
    const r = btn.getBoundingClientRect();
    if (wasFav) { play('unfav'); return; }
    play('fav');
    burst(r.left + r.width / 2, r.top + r.height / 2, 'fav');
    if (hasGsap() && !reduceMotion()) {
      gsap.fromTo(btn, { scale: 0.8 }, { scale: 1, duration: 0.5, ease: 'elastic.out(1.2,0.4)', clearProps: 'transform' });
    }
  }, true);

  /* ---------------- ABRIR TARJETA / NAVEGAR ---------------- */
  document.addEventListener('click', (e) => {
    const t = e.target;
    if (!t.closest) return;
    if (t.closest('.btn-card-fav, .btn-card-edit, #modalFavBtn')) return;
    if (t.closest('.nav-filter')) { play('swoosh'); return; }
    if (t.closest('.amiibo-card')) play('open');
  }, true);

  /* ---------------- MODALES: entrada con rebote suave ---------------- */
  function watchModals() {
    document.querySelectorAll('[role="dialog"]').forEach((m) => {
      let wasHidden = m.classList.contains('hidden');
      new MutationObserver(() => {
        const hidden = m.classList.contains('hidden');
        if (hidden === wasHidden) return;
        wasHidden = hidden;
        if (hidden) { play('close'); return; }
        const panel = m.firstElementChild;
        if (hasGsap() && panel && !reduceMotion()) {
          gsap.fromTo(panel, { y: 16, scale: 0.95, opacity: 0 },
            { y: 0, scale: 1, opacity: 1, duration: 0.42, ease: 'back.out(1.5)', clearProps: 'transform,opacity' });
        }
      }).observe(m, { attributes: true, attributeFilter: ['class'] });
    });
  }

  /* ---------------- TARJETAS: entrada escalonada al cambiar de lista ---------------- */
  let lastKey = null;
  function wrapRender() {
    const orig = window.renderCards;
    if (typeof orig !== 'function') return;
    window.renderCards = function () {
      const out = orig.apply(this, arguments);
      try {
        const q = (document.getElementById('globalSearchInput') || {}).value || '';
        const f = (typeof currentFilter !== 'undefined') ? currentFilter : '';
        const key = f + '|' + q;
        const cards = Array.from(document.querySelectorAll('#amiiboGrid .amiibo-card')).slice(0, 24);
        // Solo anima cuando cambia la lista (no al marcar un favorito)
        if (key !== lastKey && hasGsap() && !reduceMotion() && cards.length) {
          gsap.from(cards, { y: 18, autoAlpha: 0, duration: 0.4, ease: 'power2.out', stagger: 0.035, clearProps: 'transform,opacity,visibility' });
        }
        lastKey = key;
      } catch (e) {}
      return out;
    };
  }

  /* ---------------- BANNER: cambio de franquicia ---------------- */
  function watchBanner() {
    const img = document.getElementById('franchiseHeroImg');
    const badge = document.getElementById('bannerFranchiseBadgeContainer');
    if (!img || !hasGsap()) return;
    new MutationObserver(() => {
      if (reduceMotion()) return;
      // Solo opacidad: el transform del banner lo gestiona el reposicionamiento
      gsap.fromTo(img, { opacity: 0.15 }, { opacity: 1, duration: 0.6, ease: 'power1.out', clearProps: 'opacity' });
      if (badge) gsap.fromTo(badge, { x: -14, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, delay: 0.1, ease: 'power2.out', clearProps: 'transform,opacity' });
    }).observe(img, { attributes: true, attributeFilter: ['src'] });
  }

  /* ---------------- BLUETOOTH CONECTADO ---------------- */
  function watchBluetooth() {
    const label = document.getElementById('headerBtLabel');
    const btn = label && label.closest('button');
    if (!btn) return;
    new MutationObserver(() => {
      if (/\(En espera\)|conectado/i.test(label.textContent)) {
        play('connect');
        const r = btn.getBoundingClientRect();
        burst(r.left + 22, r.top + r.height / 2, 'connect');
      }
    }).observe(label, { childList: true, characterData: true, subtree: true });
  }

  function init() {
    mountMuteButton();
    watchModals();
    watchBanner();
    watchBluetooth();
  }

  // Se instala ya, antes de que la app dibuje la lista por primera vez
  wrapRender();

  if (document.readyState === 'loading') window.addEventListener('DOMContentLoaded', () => setTimeout(init, 0));
  else setTimeout(init, 0);
})();
