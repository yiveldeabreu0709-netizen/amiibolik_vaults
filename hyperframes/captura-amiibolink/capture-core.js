/* =========================================================
   AmiiboLink Capture — animación estilo "captura Pokémon"
   El llavero Sheikah absorbe el Amiibo, se mueve 3 veces y,
   al quedar "atrapado", suelta estrellitas de éxito.

   Lo usan dos sitios:
   - index.html de esta carpeta (composición HyperFrames → video)
   - index.html de la app (modal de escritura, sincronizado con
     el progreso real de la transferencia Bluetooth)

   Todo es determinista (sin Math.random / Date.now) para que
   HyperFrames pueda renderizar fotograma a fotograma.
   ========================================================= */
(function (global) {
  'use strict';

  const CYAN = '#29b6f0';
  const GOLD = '#f2c230';
  const STAR_COLORS = [GOLD, '#fff3a6', CYAN, '#ead6ef', GOLD, '#7fe3ff', '#fff3a6'];
  // Ángulos (grados, 0 = derecha, -90 = arriba) y distancia relativa al tamaño del llavero
  const STAR_DIRS = [
    { a: -90, d: 1.0 }, { a: -35, d: 0.85 }, { a: -145, d: 0.85 },
    { a: -62, d: 1.15 }, { a: -118, d: 1.15 }, { a: 5, d: 0.7 }, { a: 175, d: 0.7 }
  ];
  const SPARK_DIRS = [-80, -20, -160, -50, -130, -100, 15, 165];

  const BODY = 'M100 14 C138 14 158 44 166 92 C175 146 190 182 190 214 C190 262 152 290 100 290 C48 290 10 262 10 214 C10 182 25 146 34 92 C42 44 62 14 100 14 Z';
  const HOLE = 'M80 58 A20 20 0 1 0 120 58 A20 20 0 1 0 80 58 Z';
  const STAR_PATH = 'M12 1.5l3.1 6.6 7.2.9-5.3 5 1.4 7.1L12 17.6 5.6 21.1 7 14 1.7 9l7.2-.9z';

  let uidCounter = 0;
  let cssInjected = false;

  function arc(cx, cy, r, a0, a1) {
    const rad = d => d * Math.PI / 180;
    const p = a => `${(cx + r * Math.cos(rad(a))).toFixed(1)} ${(cy + r * Math.sin(rad(a))).toFixed(1)}`;
    return `M${p(a0)} A${r} ${r} 0 0 1 ${p(a1)}`;
  }

  function deviceSVG(u) {
    const ripples = [34, 44, 54].map(r =>
      `<path d="${arc(100, 58, r, 140, 220)}"/><path d="${arc(100, 58, r, -40, 40)}"/>`
    ).join('');
    const nodes = [-150, -30, 165, 15, 132, 48].map(a => {
      const x = (100 + 64 * Math.cos(a * Math.PI / 180)).toFixed(1);
      const y = (212 + 64 * Math.sin(a * Math.PI / 180)).toFixed(1);
      return `<circle cx="${x}" cy="${y}" r="5" fill="#0b0b0e" stroke="${CYAN}" stroke-width="2"/>`;
    }).join('');

    return `
<svg class="abc-svg" viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="abcBody${u}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#2c2c34"/><stop offset=".45" stop-color="#111116"/><stop offset="1" stop-color="#050506"/>
    </linearGradient>
    <radialGradient id="abcGlow${u}">
      <stop offset="0" stop-color="#bdf1ff" stop-opacity=".95"/><stop offset=".55" stop-color="${CYAN}" stop-opacity=".5"/><stop offset="1" stop-color="${CYAN}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="abcGold${u}">
      <stop offset="0" stop-color="#fff7c2" stop-opacity="1"/><stop offset=".55" stop-color="${GOLD}" stop-opacity=".6"/><stop offset="1" stop-color="${GOLD}" stop-opacity="0"/>
    </radialGradient>
    <clipPath id="abcClip${u}"><path d="${BODY}"/></clipPath>
  </defs>

  <path d="${BODY} ${HOLE}" fill-rule="evenodd" fill="url(#abcBody${u})" stroke="#34353d" stroke-width="2"/>
  <g clip-path="url(#abcClip${u})" fill="none" stroke="${CYAN}" stroke-width="3.2" stroke-linecap="round">${ripples}</g>
  <circle cx="100" cy="58" r="23" fill="none" stroke="#5f636e" stroke-width="7"/>

  <!-- Escudo Hyliano + Espada Maestra -->
  <g fill="#d4a72c">
    <polygon points="100,100 106,110 94,110"/>
    <path d="M97 120 C88 108 76 104 62 106 C70 110 72 113 70 116 C76 115 80 117 80 120 C84 119 88 121 88 124 C92 122 95 123 97 126 Z"/>
    <path transform="translate(200 0) scale(-1 1)" d="M97 120 C88 108 76 104 62 106 C70 110 72 113 70 116 C76 115 80 117 80 120 C84 119 88 121 88 124 C92 122 95 123 97 126 Z"/>
  </g>
  <g fill="${CYAN}">
    <circle cx="100" cy="95" r="3"/>
    <rect x="98.5" y="97" width="3" height="15" rx="1"/>
    <rect x="89" y="112" width="22" height="4" rx="2"/>
    <path d="M98 116 L102 116 L102 150 L100 156 L98 150 Z"/>
  </g>

  <!-- Circuito Sheikah -->
  <circle cx="100" cy="212" r="64" fill="none" stroke="${CYAN}" stroke-width="2.5"/>
  ${nodes}

  <!-- Botón central con el ojo Sheikah -->
  <g class="abc-btn">
    <circle cx="100" cy="212" r="46" fill="#0a0a0d" stroke="#26262d" stroke-width="4"/>
    <circle class="abc-glow" cx="100" cy="212" r="58" fill="url(#abcGlow${u})" opacity="0"/>
    <circle class="abc-gold" cx="100" cy="212" r="62" fill="url(#abcGold${u})" opacity="0"/>
    <g fill="none" stroke="${CYAN}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
      <path d="M74 206 Q100 184 126 206 Q100 226 74 206 Z"/>
      <path d="M100 186 L100 178 M88 189 L83 182 M112 189 L117 182"/>
    </g>
    <circle class="abc-iris" cx="100" cy="206" r="9" fill="#f5d327" stroke="${CYAN}" stroke-width="3"/>
    <path d="M100 220 C95 230 93 238 100 246 C107 238 105 230 100 220 Z" fill="${CYAN}"/>
    <circle class="abc-alert" cx="100" cy="212" r="46" fill="#ef4444" opacity="0"/>
  </g>

  <path d="M40 100 C46 60 64 34 88 26" fill="none" stroke="#ffffff" stroke-opacity=".13" stroke-width="6" stroke-linecap="round"/>
</svg>`;
  }

  function injectCSS() {
    if (cssInjected || typeof document === 'undefined') return;
    cssInjected = true;
    const css = `
.abc-stage{position:absolute;inset:0;pointer-events:none;visibility:hidden;--abc-size:120px;--abc-top:56%}
.abc-stage.abc-on{visibility:visible}
.abc-anchor{opacity:0;position:absolute;left:50%;top:var(--abc-top);width:calc(var(--abc-size)*2/3);height:var(--abc-size);
  margin-left:calc(var(--abc-size)/-3);margin-top:calc(var(--abc-size)/-2)}
.abc-device{position:absolute;inset:0;will-change:transform}
.abc-svg{width:100%;height:100%;display:block;overflow:visible;filter:drop-shadow(0 10px 18px rgba(20,10,30,.35))}
.abc-shadow{position:absolute;left:10%;right:10%;bottom:-5%;height:9%;border-radius:50%;background:rgba(40,20,50,.45);filter:blur(4px);opacity:0}
.abc-fx{position:absolute;left:50%;top:70.7%;width:0;height:0}
.abc-ring{position:absolute;width:calc(var(--abc-size)*.6);height:calc(var(--abc-size)*.6);left:calc(var(--abc-size)*-.3);top:calc(var(--abc-size)*-.3);
  border-radius:50%;border:3px solid ${CYAN};box-shadow:0 0 18px ${CYAN};opacity:0}
.abc-star{position:absolute;width:calc(var(--abc-size)*.2);height:calc(var(--abc-size)*.2);left:calc(var(--abc-size)*-.1);top:calc(var(--abc-size)*-.1);opacity:0}
.abc-star svg{width:100%;height:100%;display:block;filter:drop-shadow(0 0 6px rgba(255,230,120,.9))}
.abc-spark{position:absolute;width:6px;height:6px;left:-3px;top:-3px;border-radius:50%;background:#fff6c8;box-shadow:0 0 8px ${GOLD};opacity:0}`;
    const style = document.createElement('style');
    style.setAttribute('data-abc', '');
    style.textContent = css;
    document.head.appendChild(style);
  }

  // Monta el llavero dentro de `stage` y devuelve las referencias a sus piezas.
  function mount(stage, opts) {
    opts = opts || {};
    injectCSS();
    const u = ++uidCounter;
    stage.classList.add('abc-stage');
    if (opts.size) stage.style.setProperty('--abc-size', opts.size + 'px');
    if (opts.top) stage.style.setProperty('--abc-top', opts.top);
    if (opts.visible) stage.classList.add('abc-on');

    const stars = STAR_DIRS.map((_, i) =>
      `<div class="abc-star"><svg viewBox="0 0 24 24"><path d="${STAR_PATH}" fill="${STAR_COLORS[i]}"/></svg></div>`
    ).join('');
    const sparks = SPARK_DIRS.map(() => '<div class="abc-spark"></div>').join('');

    stage.innerHTML = `
      <div class="abc-anchor">
        <div class="abc-shadow"></div>
        <div class="abc-device">${deviceSVG(u)}</div>
        <div class="abc-fx"><div class="abc-ring"></div>${sparks}${stars}</div>
      </div>`;

    const q = s => stage.querySelector(s);
    return {
      stage,
      size: opts.size || 120,
      anchor: q('.abc-anchor'),
      device: q('.abc-device'),
      shadow: q('.abc-shadow'),
      ring: q('.abc-ring'),
      glow: q('.abc-glow'),
      gold: q('.abc-gold'),
      alert: q('.abc-alert'),
      btn: q('.abc-btn'),
      iris: q('.abc-iris'),
      stars: Array.from(stage.querySelectorAll('.abc-star')),
      sparks: Array.from(stage.querySelectorAll('.abc-spark'))
    };
  }

  // Distancia (en px sin escalar) desde el centro de `target` hasta el punto donde flota el llavero.
  function absorbDelta(refs, target) {
    const sr = refs.stage.getBoundingClientRect();
    const scale = refs.stage.offsetWidth ? sr.width / refs.stage.offsetWidth : 1;
    const ar = refs.anchor.getBoundingClientRect();
    const tr = target.getBoundingClientRect();
    const hoverX = ar.left + ar.width / 2;
    const hoverY = ar.top + ar.height / 2 - refs.size * 0.55 * scale;
    return {
      x: (hoverX - (tr.left + tr.width / 2)) / scale,
      y: (hoverY - (tr.top + tr.height / 2)) / scale
    };
  }

  // 1) Lanzamiento: el llavero entra girando, destella, absorbe al Amiibo y cae rebotando.
  function enter(refs, target) {
    const S = refs.size;
    const tl = gsap.timeline();
    tl.set(refs.anchor, { autoAlpha: 1 }, 0);
    tl.set(refs.device, { x: -S * 1.3, y: -S * 1.05, rotation: -320, scale: 0.55, autoAlpha: 1, transformOrigin: '50% 50%' }, 0);
    tl.set(refs.shadow, { autoAlpha: 0, scale: 0.4 }, 0);

    tl.to(refs.device, { x: 0, duration: 0.55, ease: 'power1.out' }, 0);
    tl.to(refs.device, { y: -S * 0.55, rotation: 0, scale: 0.8, duration: 0.55, ease: 'power2.out' }, 0);

    tl.addLabel('open', 0.55);
    tl.to(refs.glow, { opacity: 1, duration: 0.12 }, 'open');
    tl.fromTo(refs.ring, { y: -S * 0.55, scale: 0.2, autoAlpha: 0.95, borderColor: CYAN },
      { immediateRender: false, scale: 2.6, autoAlpha: 0, duration: 0.5, ease: 'power2.out' }, 'open');

    if (target) {
      const d = absorbDelta(refs, target);
      tl.to(target, { filter: 'brightness(3.5) saturate(0)', duration: 0.15 }, 'open');
      tl.to(target, { x: d.x, y: d.y, scale: 0, autoAlpha: 0, duration: 0.4, ease: 'power3.in' }, 'open+=0.12');
    }

    tl.to(refs.glow, { opacity: 0, duration: 0.25 }, 'open+=0.5');
    tl.set(refs.ring, { y: 0 }, 'open+=0.55');
    tl.to(refs.device, { y: 0, scale: 1, duration: 0.5, ease: 'bounce.out' }, 'open+=0.55');
    tl.to(refs.shadow, { autoAlpha: 0.35, scale: 1, duration: 0.45, ease: 'power2.out' }, 'open+=0.6');
    tl.set(refs.device, { transformOrigin: '50% 96%' });
    return tl;
  }

  // 2) Un meneo (se llama 3 veces: i = 0, 1, 2). Incluye la pausa de suspenso posterior.
  function wobble(refs, i) {
    const dir = i % 2 === 0 ? -1 : 1;
    const tl = gsap.timeline();
    tl.set(refs.device, { transformOrigin: '50% 96%' }, 0);
    tl.to(refs.device, { rotation: 22 * dir, x: 6 * dir, duration: 0.16, ease: 'power2.out' }, 0)
      .to(refs.device, { rotation: -16 * dir, x: -5 * dir, duration: 0.2, ease: 'power2.inOut' })
      .to(refs.device, { rotation: 7 * dir, x: 2 * dir, duration: 0.14, ease: 'power1.inOut' })
      .to(refs.device, { rotation: 0, x: 0, duration: 0.16, ease: 'power2.out' });
    tl.to(refs.shadow, { scaleX: 0.85, duration: 0.18, yoyo: true, repeat: 1 }, 0);
    tl.fromTo(refs.glow, { opacity: 0 }, { immediateRender: false, opacity: 0.9, duration: 0.12, yoyo: true, repeat: 1 }, 0.05);
    tl.to({}, { duration: 0.5 });
    return tl;
  }

  // 3) ¡Atrapado! Clic del botón, destello dorado y estrellitas.
  function success(refs) {
    const S = refs.size;
    const tl = gsap.timeline();
    tl.set(refs.device, { transformOrigin: '50% 100%' }, 0);
    tl.to(refs.device, { scaleY: 0.9, scaleX: 1.06, duration: 0.08, ease: 'power2.in' }, 0)
      .to(refs.device, { scaleY: 1, scaleX: 1, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    tl.to(refs.btn, { scale: 0.9, svgOrigin: '100 212', duration: 0.08, yoyo: true, repeat: 1 }, 0);
    tl.fromTo(refs.gold, { opacity: 0 }, { immediateRender: false, opacity: 1, duration: 0.1 }, 0.04);
    tl.to(refs.gold, { opacity: 0.35, duration: 0.9, ease: 'power1.out' }, 0.4);
    tl.fromTo(refs.ring, { scale: 0.2, autoAlpha: 1, borderColor: GOLD },
      { immediateRender: false, scale: 2.4, autoAlpha: 0, duration: 0.6, ease: 'power2.out' }, 0.05);

    refs.sparks.forEach((el, i) => {
      const a = SPARK_DIRS[i] * Math.PI / 180;
      const dist = S * (0.55 + (i % 3) * 0.12);
      tl.fromTo(el, { x: 0, y: 0, scale: 1, autoAlpha: 1 },
        { immediateRender: false, x: Math.cos(a) * dist, y: Math.sin(a) * dist, scale: 0.3, autoAlpha: 0, duration: 0.55, ease: 'power2.out' }, 0.08);
    });

    refs.stars.forEach((el, i) => {
      const a = STAR_DIRS[i].a * Math.PI / 180;
      const dist = S * STAR_DIRS[i].d;
      const t = 0.12 + i * 0.035;
      tl.fromTo(el, { x: 0, y: 0, scale: 0, rotation: 0, autoAlpha: 1 },
        { immediateRender: false, x: Math.cos(a) * dist, y: Math.sin(a) * dist, scale: 1, rotation: i % 2 ? 200 : -200, duration: 0.65, ease: 'power3.out' }, t);
      tl.to(el, { y: '+=' + (S * 0.08), scale: 0.5, autoAlpha: 0, duration: 0.45, ease: 'power1.in' }, t + 0.75);
    });

    tl.to(refs.iris, { attr: { r: 11 }, duration: 0.18, yoyo: true, repeat: 1 }, 0.1);
    return tl;
  }

  // 4) Error: el llavero tiembla en rojo, se abre y el Amiibo "escapa".
  function fail(refs, target) {
    const S = refs.size;
    const tl = gsap.timeline();
    tl.set(refs.device, { transformOrigin: '50% 96%' }, 0);
    tl.to(refs.device, { x: -8, rotation: -6, duration: 0.05, repeat: 7, yoyo: true, ease: 'none' }, 0);
    tl.to(refs.alert, { opacity: 0.65, duration: 0.08, repeat: 5, yoyo: true }, 0);

    tl.addLabel('burst', 0.5);
    tl.set(refs.device, { transformOrigin: '50% 50%' }, 'burst');
    tl.to(refs.device, { y: -S * 0.35, rotation: -25, duration: 0.25, ease: 'power2.out' }, 'burst');
    tl.fromTo(refs.ring, { scale: 0.2, autoAlpha: 1, borderColor: '#ef4444' },
      { immediateRender: false, scale: 2.8, autoAlpha: 0, duration: 0.55, ease: 'power2.out' }, 'burst');
    if (target) {
      tl.to(target, { x: 0, y: 0, scale: 1, autoAlpha: 1, duration: 0.45, ease: 'back.out(1.6)' }, 'burst');
      tl.to(target, { filter: 'brightness(1) saturate(1)', duration: 0.4 }, 'burst+=0.2');
      tl.set(target, { clearProps: 'filter' });
    }
    tl.to(refs.device, { y: 0, rotation: 0, scale: 0.6, autoAlpha: 0, duration: 0.35, ease: 'power2.in' }, 'burst+=0.25');
    tl.to(refs.shadow, { autoAlpha: 0, duration: 0.3 }, 'burst+=0.25');
    tl.set(refs.alert, { opacity: 0 });
    return tl;
  }

  function resetVisuals(refs, target) {
    const parts = [refs.anchor, refs.device, refs.shadow, refs.ring, refs.glow, refs.gold, refs.alert, refs.btn, refs.iris]
      .concat(refs.stars, refs.sparks);
    gsap.killTweensOf(parts);
    gsap.set([refs.device, refs.shadow, refs.ring].concat(refs.stars, refs.sparks), { clearProps: 'all' });
    gsap.set([refs.glow, refs.gold, refs.alert], { opacity: 0 });
    gsap.set(refs.iris, { attr: { r: 9 } });
    gsap.set(refs.btn, { clearProps: 'transform' });
    if (target) {
      gsap.killTweensOf(target);
      gsap.set(target, { clearProps: 'transform,opacity,visibility,filter' });
    }
  }

  /* ---------------------------------------------------------
     Controlador en vivo para la app: encadena las fases y
     reparte los 3 meneos según el progreso real (%).
     Si GSAP no cargó (sin internet), todo resuelve al instante
     y la app sigue funcionando con la barra de progreso normal.
     --------------------------------------------------------- */
  function createController(stage, opts) {
    opts = opts || {};
    const thresholds = opts.thresholds || [40, 65, 90];
    const hasGsap = () => typeof global.gsap !== 'undefined';
    const reduced = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

    let refs = null;
    let target = null;
    let chain = Promise.resolve();
    let gen = 0;
    let wobbles = 0;
    let idle = null;
    let current = null;
    let currentResolve = null;

    function ensureMounted() {
      if (!refs) refs = mount(stage, opts);
      return refs;
    }

    function stopIdle() {
      if (idle) { idle.kill(); idle = null; }
      if (refs) gsap.set(refs.glow, { opacity: 0 });
    }

    function startIdle() {
      stopIdle();
      idle = gsap.to(refs.glow, { opacity: 0.55, duration: 0.8, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    }

    function run(build, after) {
      const myGen = gen;
      chain = chain.then(() => new Promise(resolve => {
        if (myGen !== gen) return resolve();
        stopIdle();
        const tl = build();
        current = tl;
        currentResolve = resolve;
        tl.eventCallback('onComplete', () => {
          current = null;
          currentResolve = null;
          if (myGen === gen && after) after();
          resolve();
        });
        if (reduced) tl.progress(1);
      }));
      return chain;
    }

    function queueWobble() {
      const i = wobbles++;
      run(() => {
        if (opts.onWobble) opts.onWobble(i);
        return wobble(refs, i);
      }, startIdle);
    }

    return {
      start(targetEl) {
        if (!hasGsap()) return Promise.resolve();
        this.reset();
        ensureMounted();
        target = targetEl || null;
        stage.classList.add('abc-on');
        return run(() => enter(refs, target), startIdle);
      },
      progress(pct) {
        if (!refs || !hasGsap()) return;
        while (wobbles < 3 && pct >= thresholds[wobbles]) queueWobble();
      },
      succeed() {
        if (!refs || !hasGsap()) return Promise.resolve();
        while (wobbles < 3) queueWobble();
        return run(() => {
          if (opts.onCatch) opts.onCatch();
          return success(refs);
        });
      },
      fail() {
        if (!refs || !hasGsap()) return Promise.resolve();
        return run(() => fail(refs, target)).then(() => stage.classList.remove('abc-on'));
      },
      reset() {
        gen++;
        wobbles = 0;
        if (current) { current.kill(); current = null; }
        if (currentResolve) { currentResolve(); currentResolve = null; }
        chain = Promise.resolve();
        if (!refs || !hasGsap()) return;
        stopIdle();
        resetVisuals(refs, target);
        stage.classList.remove('abc-on');
        target = null;
      }
    };
  }

  global.AmiiboCapture = { mount, enter, wobble, success, fail, createController };
})(typeof window !== 'undefined' ? window : this);
