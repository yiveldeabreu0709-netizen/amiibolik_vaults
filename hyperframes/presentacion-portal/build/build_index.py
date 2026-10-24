# Genera index.html a partir de la lista de eventos de sonido (tiempos en segundos del video)
PEAK = {'whoosh': .16, 'whoosh-short': .16, 'pop': .12, 'click': .05, 'click-soft': .05, 'sparkle': .10,
        'chime': .42, 'ping': .33, 'notification': .23, 'key-press': .08}
DUR = {'whoosh': .57, 'whoosh-short': .57, 'pop': .72, 'click': .37, 'click-soft': .37, 'sparkle': 1.8,
       'chime': 2.5, 'ping': 1.32, 'notification': 2.4, 'key-press': .4, 'impact-bass-1': 2.1}
FRAME = 1 / 30
def at(kind, t, vol, note):            # el pico del sonido cae un fotograma después de la imagen
    return (kind, round(max(0, t + FRAME - PEAK[kind]), 3), vol, note)
S1, S2, S3, S4, S5, S6 = 0.0, 3.5, 9.4, 15.4, 20.6, 29.0
ev = []
# 1 · Logo
ev += [at('pop', .5, .45, 'La marca salta'), at('sparkle', .57, .35, 'Estrellitas del logo'),
       at('whoosh', 3.3, .35, 'La marca crece y se vuelve el fondo')]
# 2 · Franquicias
ev += [at('pop', S2 + .3, .30, 'Entra el marco')]
for i in range(1, 8):
    ev.append(at('whoosh-short' if i % 2 else 'whoosh', S2 + .8 + .65 * i, .20, f'Barrido del banner {i + 1}'))
# 3 · Dashboard
ev += [at('whoosh', S3 + .1, .40, 'Barrido de entrada')]
for i in range(4):
    ev.append(at('pop', S3 + .85 + .22 * i, .35, f'Aparece la tarjeta {i + 1}'))
ev += [at('click', S3 + 2.75, .55, 'Clic en Sephiroth'), at('whoosh-short', S3 + 3.45, .20, 'Zoom de cámara'),
       at('click', S3 + 4.15, .55, 'Clic en el corazón'), at('sparkle', S3 + 4.2, .40, 'Ráfaga de favorito'),
       at('ping', S3 + 4.2, .25, 'Campanita de favorito')]
# 4 · Registro
ev += [at('whoosh', S4 + .1, .40, 'Empuje vertical'), at('click', S4 + .95, .55, 'Clic en Registrar Amiibo'),
       at('pop', S4 + 1.3, .45, 'Nace la ventana'), at('pop', S4 + 3.0, .40, 'Aterriza la foto'),
       at('pop', S4 + 3.45, .40, 'Aterriza el .bin'), at('click', S4 + 4.15, .55, 'Clic en Guardar'),
       at('whoosh-short', S4 + 4.35, .20, 'Se guarda la ventana'), at('notification', S4 + 4.6, .30, 'Aviso: registrada')]
# 5 · Captura del llavero
ev += [at('whoosh', S5 + .25, .35, 'Iris desde el clic'), at('pop', S5 + .5, .30, 'Entra la tarjeta'),
       at('whoosh-short', S5 + 1.25, .35, 'El llavero entra girando'), at('whoosh', S5 + 1.8, .35, 'Absorbe a Sephiroth'),
       at('pop', S5 + 2.25, .35, 'El llavero cae y rebota')]
for k, w in enumerate((2.3, 3.46, 4.62)):
    ev.append(('click-soft', round(S5 + w + .043, 3), .50, f'Tic del meneo {k + 1}'))
ev += [('impact-bass-1', round(S5 + 5.78, 3), .32, '¡Atrapado!: golpe grave'), at('chime', S5 + 5.78, .60, '¡Atrapado!: campanita'),
       at('sparkle', S5 + 5.9, .40, 'Brillo de las estrellitas')]
# 6 · Cierre
ev += [at('pop', S6 + .5, .40, 'La marca salta'), at('sparkle', S6 + .45, .30, 'Estrellitas del cierre'),
       at('key-press', S6 + 1.0, .30, 'Entra la primera línea'), at('key-press', S6 + 1.6, .30, 'Entra la segunda línea'),
       at('whoosh-short', S6 + 2.25, .25, 'Barre el subrayado')]
ev.sort(key=lambda e: e[1])

# Riser hacia el momento de captura (su pico cae a 3.04 s del archivo)
ev.append(('riser', round(S5 + 5.78 + FRAME - 3.04, 3), 0.22, 'Tensión antes de atrapar'))
DUR['riser'] = 4.6
ev.sort(key=lambda e: e[1])
# Reparte los sonidos en pistas para que ninguno se solape con otro de su misma pista
ends = []   # fin del último clip de cada pista
tags = []
for n, (kind, start, vol, note) in enumerate(ev, 1):
    end = start + DUR[kind]
    lane = next((i for i, e in enumerate(ends) if e <= start), None)
    if lane is None: ends.append(end); lane = len(ends) - 1
    else: ends[lane] = end
    extra = ' data-fade-out="0.8"' if kind == 'riser' else ''
    tags.append(f'      <audio id="fx{n:02d}" class="clip" src="assets/sfx/{kind}.mp3" data-start="{start}" data-duration="{DUR[kind]}" data-track-index="{3 + lane}" data-volume="{vol}"{extra}></audio> <!-- {note} -->')

html = open('build/index.template.html', encoding='utf-8').read().replace('<!--AUDIO-->', '\n'.join(tags))
open('index.html', 'w', encoding='utf-8').write(html)
print(len(ev) + 1, 'sonidos')
