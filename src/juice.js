// src/juice.js
// Game Juice, Screen Shake (Trauma²), Hit-Stop e Partículas Procedurais Ricas

export class JuiceManager {
  constructor() {
    this.trauma = 0;
    this.maxShake = 28;
    this.hitStopTimer = 0;
    this.particles = [];
    this.floatingTexts = [];
    this.shockwaves = [];
  }

  addTrauma(amount) {
    this.trauma = Math.min(1.0, this.trauma + amount);
  }

  triggerHitStop(durationSec = 0.05) {
    this.hitStopTimer = durationSec;
  }

  update(dt) {
    // Decaimento de Trauma
    if (this.trauma > 0) {
      this.trauma = Math.max(0, this.trauma - dt * 2.0);
    }

    // Processamento do Hit-Stop (se ativo, pausa tempo motriz)
    if (this.hitStopTimer > 0) {
      this.hitStopTimer -= dt;
      return true; // Indica que o frame deve ser congelado para hit-stop
    }

    // Atualização de Partículas
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      if (p.friction) {
        p.vx *= Math.pow(p.friction, dt * 60);
        p.vy *= Math.pow(p.friction, dt * 60);
      }
      if (p.shrink) {
        p.radius = Math.max(0.5, p.initialRadius * (p.life / p.maxLife));
      }
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // Atualização de Textos Flutuantes
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y -= ft.vy * dt;
      ft.life -= dt;
      if (ft.life <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }

    // Atualização de Ondas de Choque
    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      sw.radius += sw.speed * dt;
      sw.life -= dt;
      if (sw.life <= 0) {
        this.shockwaves.splice(i, 1);
      }
    }

    return false;
  }

  getShakeOffset() {
    if (this.trauma <= 0) return { x: 0, y: 0 };
    const shake = this.trauma * this.trauma * this.maxShake;
    const angle = Math.random() * Math.PI * 2;
    return {
      x: Math.cos(angle) * shake,
      y: Math.sin(angle) * shake
    };
  }

  // Emissão de Partículas de Explosão com Físicas e Detritos
  emitExplosion(x, y, color = '#00f5ff', count = 14) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 80 + Math.random() * 260;
      const life = 0.35 + Math.random() * 0.45;
      const radius = 2 + Math.random() * 4;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        initialRadius: radius,
        radius,
        maxLife: life,
        life,
        color,
        friction: 0.92,
        shrink: true
      });
    }
  }

  // Rastro do Motor da Nave
  emitThruster(x, y, angle, color = '#00f5ff') {
    const spread = (Math.random() - 0.5) * 0.6;
    const speed = 90 + Math.random() * 120;
    const backAngle = angle + Math.PI + spread;
    this.particles.push({
      x,
      y,
      vx: Math.cos(backAngle) * speed,
      vy: Math.sin(backAngle) * speed,
      initialRadius: 3.5,
      radius: 3.5,
      maxLife: 0.22,
      life: 0.22,
      color,
      friction: 0.95,
      shrink: true
    });
  }

  // Texto Flutuante de Dano / Crítico
  addFloatingText(x, y, text, color = '#ffffff', isCrit = false) {
    this.floatingTexts.push({
      x: x + (Math.random() - 0.5) * 16,
      y: y - 10,
      vy: 42,
      text,
      color,
      isCrit,
      maxLife: 0.65,
      life: 0.65
    });
  }

  // Anel de Onda de Choque Quântico
  emitShockwave(x, y, maxRadius = 140, color = '#00f5ff') {
    this.shockwaves.push({
      x,
      y,
      radius: 10,
      maxRadius,
      speed: 380,
      maxLife: 0.35,
      life: 0.35,
      color
    });
  }

  render(ctx) {
    // 1. Partículas
    this.particles.forEach(p => {
      const alpha = Math.max(0, p.life / p.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // 2. Ondas de Choque
    this.shockwaves.forEach(sw => {
      const alpha = Math.max(0, sw.life / sw.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = sw.color;
      ctx.lineWidth = 3;
      ctx.shadowColor = sw.color;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    });

    // 3. Textos Flutuantes
    this.floatingTexts.forEach(ft => {
      const alpha = Math.max(0, ft.life / ft.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.textAlign = 'center';
      ctx.font = ft.isCrit ? '900 17px Orbitron, sans-serif' : '700 13px Orbitron, sans-serif';
      ctx.fillStyle = ft.color;
      ctx.shadowColor = ft.color;
      ctx.shadowBlur = ft.isCrit ? 10 : 4;
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    });
  }

  clear() {
    this.particles = [];
    this.floatingTexts = [];
    this.shockwaves = [];
    this.trauma = 0;
    this.hitStopTimer = 0;
  }
}

export const juice = new JuiceManager();
