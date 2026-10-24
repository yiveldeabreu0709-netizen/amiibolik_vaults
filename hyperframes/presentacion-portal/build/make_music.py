"""Música original para el video (chiptune suave), generada en código.
Determinista: sin aleatoriedad (el ruido usa una semilla fija). Licencia: propia, sin atribución."""
import numpy as np, subprocess
SR = 44100
DUR = 33.0
BEAT = DUR / 64.0           # 16 compases de 4 tiempos = 33 s (~116 BPM)
N = int(SR * DUR)
t_all = np.arange(N) / SR
rng = np.random.default_rng(7)

def midi(n): return 440.0 * 2 ** ((n - 69) / 12)
def env(length, a=0.005, d=0.1, s=0.6, r=0.05, hold=None):
    n = int(length * SR); e = np.ones(n)
    a_n = max(1, int(a * SR)); d_n = int(d * SR); r_n = max(1, int(r * SR))
    e[:a_n] = np.linspace(0, 1, a_n)
    if d_n > 0 and a_n + d_n < n: e[a_n:a_n + d_n] = np.linspace(1, s, d_n); e[a_n + d_n:] = s
    e[-r_n:] *= np.linspace(1, 0, r_n)
    return e
def pulse(f, n, duty=0.25):
    ph = (np.arange(n) / SR * f) % 1.0
    return np.where(ph < duty, 1.0, -1.0)
def tri(f, n):
    ph = (np.arange(n) / SR * f) % 1.0
    return 4 * np.abs(ph - 0.5) - 1
def add(buf, start, sig, gain, pan=0.0):
    i = int(start * SR); j = min(N, i + len(sig))
    if i >= N or j <= i: return
    seg = sig[:j - i] * gain
    buf[0, i:j] += seg * (1 - max(0, pan)); buf[1, i:j] += seg * (1 + min(0, pan))

mix = np.zeros((2, N))
# Acordes: C - G - Am - F (x4). Notas MIDI
chords = [(48, [60, 64, 67]), (43, [55, 59, 62]), (45, [57, 60, 64]), (41, [53, 57, 60])]
for bar in range(16):
    root, tones = chords[bar % 4]
    t0 = bar * 4 * BEAT
    # Pad suave (triángulo) todo el tiempo
    for k, m in enumerate(tones):
        d = 4 * BEAT; n = int(d * SR)
        add(mix, t0, tri(midi(m - 12), n) * env(d, a=0.15, d=0.3, s=0.7, r=0.3), 0.045, pan=(k - 1) * 0.3)
    # Bajo desde el compás 3: corcheas
    if bar >= 2:
        for e in range(8):
            ts = t0 + e * BEAT / 2; d = BEAT / 2 * 0.9; n = int(d * SR)
            note = root if e % 4 != 3 else root + 12
            add(mix, ts, tri(midi(note - 12), n) * env(d, a=0.004, d=0.05, s=0.7, r=0.03), 0.20)
    # Arpegio (pulso 25%) desde el compás 5: semicorcheas
    if bar >= 4:
        pat = [0, 1, 2, 1, 0, 1, 2, 1, 0, 1, 2, 1, 2, 1, 0, 1]
        for s in range(16):
            ts = t0 + s * BEAT / 4; d = BEAT / 4 * 0.85; n = int(d * SR)
            m = tones[pat[s]] + (12 if s % 8 >= 4 else 0)
            g = 0.050 if bar < 8 else 0.062
            add(mix, ts, pulse(midi(m), n, 0.25) * env(d, a=0.003, d=0.04, s=0.5, r=0.02), g, pan=0.25 if s % 2 else -0.25)
    # Melodía (pulso 50%) compases 9-16
    if 8 <= bar < 16:
        mel = {0: [(0, 79, 1), (1.5, 76, 0.5), (2, 79, 1), (3, 83, 1)],
               1: [(0, 79, 1), (1.5, 74, 0.5), (2, 79, 1), (3, 74, 1)],
               2: [(0, 76, 1), (1.5, 72, 0.5), (2, 76, 1), (3, 81, 1)],
               3: [(0, 77, 1.5), (2, 72, 1), (3, 77, 1)]}[bar % 4]
        for (bt, m, ln) in mel:
            ts = t0 + bt * BEAT; d = ln * BEAT * 0.92; n = int(d * SR)
            add(mix, ts, pulse(midi(m), n, 0.5) * env(d, a=0.006, d=0.08, s=0.65, r=0.05), 0.065)
    # Percusión suave desde el compás 5
    if bar >= 4:
        for b in range(4):
            tb = t0 + b * BEAT
            if b in (0, 2):  # bombo
                n = int(0.16 * SR); tt = np.arange(n) / SR
                f = 110 * np.exp(-tt * 28) + 45
                add(mix, tb, np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 18), 0.34)
            for h in (0.5,):  # contratiempo
                th = tb + h * BEAT; n = int(0.05 * SR)
                nz = rng.uniform(-1, 1, n) * np.exp(-np.arange(n) / SR * 90)
                add(mix, th, nz, 0.030, pan=0.2)
            if bar >= 8 and b in (1, 3):  # caja
                n = int(0.12 * SR); tt = np.arange(n) / SR
                nz = rng.uniform(-1, 1, n) * np.exp(-tt * 38)
                add(mix, tb, nz * 0.8 + np.sin(2 * np.pi * 190 * tt) * np.exp(-tt * 30) * 0.4, 0.10)
# Cierre: acorde final largo en Do y fundido
d = 2.4; n = int(d * SR)
for m in (60, 64, 67, 72):
    add(mix, 60 * BEAT, tri(midi(m), n) * env(d, a=0.01, d=1.0, s=0.4, r=1.0), 0.05)
# Fundido de salida en el último 1.6 s
fade = np.clip((DUR - t_all) / 1.6, 0, 1)
mix *= fade
# Normaliza a pico -3 dBFS
peak = np.max(np.abs(mix)); mix = mix / peak * 10 ** (-3 / 20)
pcm = (mix.T * 32767).astype(np.int16)
import wave
with wave.open('music_raw.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', 'music_raw.wav', '-codec:a', 'libmp3lame', '-b:a', '192k', 'assets/music.mp3'], check=True)
print('ok', DUR, 'beat', round(BEAT, 4))
