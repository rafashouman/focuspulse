"use client";

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

class ArcadeSoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  // Inicialização preguiçosa (Lazy Init) para evitar erros no SSR do Next.js
  // e destravar o AudioContext apenas após interação do usuário
  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;

    if (!this.ctx) {
      const AudioCtx = window.AudioContext ?? window.webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
    }

    if (this.ctx && this.ctx.state === "suspended") {
      void this.ctx.resume().catch((error: unknown) => {
        console.error("Unable to resume arcade audio context.", error);
      });
    }

    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public unlock() {
    if (!this.isMuted) this.getContext();
  }

  // ==========================================
  // 1. COIN UP (Inserção de Ficha / Troca de Cartucho)
  // Duas notas rápidas em onda quadrada: Si5 (987.77Hz) -> Mi6 (1318.51Hz)
  // ==========================================
  public playCoinUp() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "square";
    osc.frequency.setValueAtTime(987.77, now); // B5
    osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.45);
  }

  // ==========================================
  // 2. LASER SHOOT (Disparo do VoxelVaders 3D)
  // Varredura rápida de frequência descendente (Pitch Drop)
  // ==========================================
  public playLaser() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(920, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.16);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.16);
  }

  // ==========================================
  // 3. BOUNCE / PADDLE HIT (Rebate do Arkanoid)
  // Aceita variante para diferenciar parede, barra e tijolo
  // ==========================================
  public playBounce(type: "paddle" | "wall" | "brick" = "paddle") {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const freqMap = {
      wall: 260,   // Som mais grave para a borda
      paddle: 440, // Lá central para a barra
      brick: 660,  // Mais agudo e brilhante ao quebrar bloco
    };

    osc.type = type === "brick" ? "square" : "triangle";
    osc.frequency.setValueAtTime(freqMap[type], now);

    if (type === "brick") {
      // Pequeno salto harmônico ao pontuar no tijolo
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.09);
    }

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  // ==========================================
  // 4. EXPLOSION (Abate de Invasor 3D ou Perda de Vida)
  // Ruído branco filtrado com passa-baixa (Lowpass Filter)
  // ==========================================
  public playExplosion() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const duration = 0.32;
    const bufferSize = Math.ceil(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Preenche o buffer com estática pura
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // Filtro para deixar o estrondo grave e abafado (estilo arcade clássico)
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(750, now);
    filter.frequency.linearRampToValueAtTime(80, now + duration);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + duration);
  }

  public playCartridgeInsert() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const thudOsc = ctx.createOscillator();
    const thudGain = ctx.createGain();
    thudOsc.type = "triangle";
    thudOsc.frequency.setValueAtTime(130, now);
    thudOsc.frequency.exponentialRampToValueAtTime(32, now + 0.09);
    thudGain.gain.setValueAtTime(0.35, now);
    thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    thudOsc.connect(thudGain);
    thudGain.connect(ctx.destination);
    thudOsc.start(now);
    thudOsc.stop(now + 0.09);

    const romOsc = ctx.createOscillator();
    const romGain = ctx.createGain();
    romOsc.type = "square";
    romOsc.frequency.setValueAtTime(880, now + 0.11);
    romOsc.frequency.setValueAtTime(1760, now + 0.17);
    romGain.gain.setValueAtTime(0.12, now + 0.11);
    romGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
    romOsc.connect(romGain);
    romGain.connect(ctx.destination);
    romOsc.start(now + 0.11);
    romOsc.stop(now + 0.28);
  }
}

export const arcadeSynth = new ArcadeSoundEngine();