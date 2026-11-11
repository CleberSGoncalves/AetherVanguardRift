// src/entities.js
// Definição e Renderização Procedural de Entidades e Naves (Padrão REA & Alta Fidelidade Visual)

export class PlayerShip {
  constructor(config = {}) {
    this.x = 0;
    this.y = 0;
    this.angle = 0;
    this.radius = 20;
    this.speed = config.speed || 280;
    this.hp = config.hp || 100;
    this.maxHp = config.hp || 100;
    this.level = 1;
    this.xp = 0;
    this.neededXp = 10;
    this.model = config.model || 'astraea';
    this.invulnerableTimer = 0;
    this.thrusterTimer = 0;

    // Estatísticas de Combate
    this.attackCooldown = config.attackCooldown || 0.6;
    this.attackTimer = 0;
    this.bulletDamage = config.bulletDamage || 25;
    this.bulletSpeed = config.bulletSpeed || 540;
    this.bulletCount = config.bulletCount || 1;
    this.weaponType = config.weaponType || 'blaster';
    this.penetration = config.penetration || 1;
    this.magnetRadius = config.magnetRadius || 135;
    this.orbitalCount = config.orbitalCount || 0;
    this.regenRate = config.regenRate || 0;
    this.regenTimer = 0;
  }

  render(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    // Escudo Protetor (Invulnerabilidade / Revive)
    if (this.invulnerableTimer > 0) {
      const shieldPulse = Math.sin(Date.now() * 0.015) * 4;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius + 10 + shieldPulse, 0, Math.PI * 2);
      ctx.strokeStyle = '#00f5ff';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#00f5ff';
      ctx.shadowBlur = 14;
      ctx.setLineDash([8, 6]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(0, 245, 255, 0.12)';
      ctx.fill();
    }

    // Desenho Procedural da Nave Conforme Modelo Selecionado
    if (this.model === 'chrono_striker') {
      this.drawChronoStriker(ctx);
    } else if (this.model === 'void_aegis') {
      this.drawVoidAegis(ctx);
    } else if (this.model === 'valkyrie') {
      this.drawValkyrie(ctx);
    } else {
      this.drawAstraea(ctx);
    }

    ctx.restore();
  }

  // Modelo Astraea: Interceptor Ciano com Asas Delta e Núcleo Quântico
  drawAstraea(ctx) {
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#00f5ff';

    // Asas
    ctx.fillStyle = '#0f2942';
    ctx.strokeStyle = '#00f5ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(22, 0);
    ctx.lineTo(-14, -18);
    ctx.lineTo(-8, -6);
    ctx.lineTo(-16, 0);
    ctx.lineTo(-8, 6);
    ctx.lineTo(-14, 18);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Fuselagem Central
    ctx.fillStyle = '#1e40af';
    ctx.beginPath();
    ctx.moveTo(26, 0);
    ctx.lineTo(-6, -7);
    ctx.lineTo(-12, 0);
    ctx.lineTo(-6, 7);
    ctx.closePath();
    ctx.fill();

    // Cockpit / Núcleo
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(4, 0, 8, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Modelo Chrono Striker: Lança Dupla com Núcleo Violeta e Táquions
  drawChronoStriker(ctx) {
    ctx.shadowBlur = 16;
    ctx.shadowColor = '#c084fc';

    // Lâminas Duplas
    ctx.fillStyle = '#2e1065';
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(28, -6);
    ctx.lineTo(-12, -16);
    ctx.lineTo(-6, -4);
    ctx.lineTo(14, -3);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(28, 6);
    ctx.lineTo(-12, 16);
    ctx.lineTo(-6, 4);
    ctx.lineTo(14, 3);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Núcleo Táquion
    ctx.fillStyle = '#f43f5e';
    ctx.shadowColor = '#f43f5e';
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  // Modelo Void Aegis: Bastião Hexagonal com Esmalte Esmeralda
  drawVoidAegis(ctx) {
    ctx.shadowBlur = 16;
    ctx.shadowColor = '#10b981';

    ctx.fillStyle = '#064e3b';
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 2.5;

    ctx.beginPath();
    ctx.moveTo(20, 0);
    ctx.lineTo(6, -18);
    ctx.lineTo(-14, -14);
    ctx.lineTo(-18, 0);
    ctx.lineTo(-14, 14);
    ctx.lineTo(6, 18);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Placas de Blindagem
    ctx.fillStyle = '#047857';
    ctx.beginPath();
    ctx.arc(0, 0, 9, 0, Math.PI * 2);
    ctx.fill();

    // Núcleo de Matriz de Escudo
    ctx.fillStyle = '#a7f3d0';
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Modelo Valkyrie: Tri-Wing Dourado com Canhões Quânticos
  drawValkyrie(ctx) {
    ctx.shadowBlur = 18;
    ctx.shadowColor = '#fbbf24';

    ctx.fillStyle = '#78350f';
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2.5;

    ctx.beginPath();
    ctx.moveTo(26, 0);
    ctx.lineTo(-10, -22);
    ctx.lineTo(-4, -8);
    ctx.lineTo(-16, 0);
    ctx.lineTo(-4, 8);
    ctx.lineTo(-10, 22);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Canhões nas Pontas das Asas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-8, -23, 14, 3);
    ctx.fillRect(-8, 20, 14, 3);

    // Núcleo Solar
    ctx.fillStyle = '#fef08a';
    ctx.shadowColor = '#fef08a';
    ctx.beginPath();
    ctx.arc(3, 0, 6, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Entidade Inimiga de Matéria Escura
export class DarkMatterEntity {
  constructor(type, x, y, options = {}) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.shootTimer = 0;
    this.pulse = Math.random() * Math.PI * 2;

    switch (type) {
      case 'swarmer':
        this.radius = 11;
        this.hp = options.hp || 22;
        this.maxHp = this.hp;
        this.speed = options.speed || 165;
        this.color = '#38bdf8';
        this.damage = 10;
        this.xpValue = 3;
        break;
      case 'tank':
        this.radius = 24;
        this.hp = options.hp || 190;
        this.maxHp = this.hp;
        this.speed = options.speed || 60;
        this.color = '#a855f7';
        this.damage = 26;
        this.xpValue = 10;
        break;
      case 'spitter':
        this.radius = 16;
        this.hp = options.hp || 65;
        this.maxHp = this.hp;
        this.speed = options.speed || 85;
        this.color = '#e11d48';
        this.damage = 14;
        this.xpValue = 6;
        this.canShoot = true;
        this.shootCooldown = 2.4;
        break;
      case 'leaper':
        this.radius = 15;
        this.hp = options.hp || 50;
        this.maxHp = this.hp;
        this.speed = options.speed || 110;
        this.dashTimer = 0;
        this.isDashing = false;
        this.color = '#f59e0b';
        this.damage = 18;
        this.xpValue = 5;
        break;
      case 'boss':
        this.radius = options.radius || 42;
        this.hp = options.hp || 600;
        this.maxHp = this.hp;
        this.speed = options.speed || 55;
        this.color = options.color || '#ff0055';
        this.damage = 35;
        this.xpValue = 50;
        this.isBoss = true;
        this.bossName = options.bossName || 'Chefe Quântico';
        this.bossType = options.bossType || 'guardian';
        this.canShoot = true;
        this.shootCooldown = 1.8;
        this.specialTimer = 0;
        break;
      default: // stalker
        this.radius = 14;
        this.hp = options.hp || 35;
        this.maxHp = this.hp;
        this.speed = options.speed || 95;
        this.color = '#10b981';
        this.damage = 12;
        this.xpValue = 3;
    }
  }

  update(dt, playerX, playerY) {
    this.pulse += dt * 3.5;

    // Comportamento do Leaper: Carga em arrancada
    if (this.type === 'leaper') {
      this.dashTimer += dt;
      if (this.dashTimer >= 2.5) {
        this.dashTimer = 0;
        this.isDashing = true;
        const dx = playerX - this.x;
        const dy = playerY - this.y;
        const dist = Math.hypot(dx, dy) || 1;
        this.vx = (dx / dist) * 320;
        this.vy = (dy / dist) * 320;
      }
      if (this.isDashing) {
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.vx *= 0.94;
        this.vy *= 0.94;
        if (Math.hypot(this.vx, this.vy) < 40) {
          this.isDashing = false;
        }
        return;
      }
    }

    // Movimentação padrão perseguindo o jogador
    const dx = playerX - this.x;
    const dy = playerY - this.y;
    const dist = Math.hypot(dx, dy) || 1;

    let targetSpeed = this.speed;
    // Spitter tenta manter distância média de 240px
    if (this.type === 'spitter' && dist < 240) {
      targetSpeed = -this.speed * 0.5; // Recua sutilmente se o jogador chegar perto
    }

    this.x += (dx / dist) * targetSpeed * dt;
    this.y += (dy / dist) * targetSpeed * dt;
  }

  render(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    const breath = Math.sin(this.pulse) * 1.5;

    // Núcleo de Matéria Escura
    ctx.shadowBlur = this.isBoss ? 24 : 12;
    ctx.shadowColor = this.color;
    ctx.fillStyle = '#0a0a14';
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.isBoss ? 3.5 : 2;

    if (this.type === 'swarmer') {
      // Forma de Dardo Angular
      ctx.beginPath();
      ctx.moveTo(this.radius + breath, 0);
      ctx.lineTo(-this.radius, -this.radius * 0.7);
      ctx.lineTo(-this.radius * 0.4, 0);
      ctx.lineTo(-this.radius, this.radius * 0.7);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (this.type === 'tank') {
      // Estrela Jagged com 6 Pontas
      ctx.beginPath();
      const points = 6;
      for (let i = 0; i < points * 2; i++) {
        const rad = (i % 2 === 0) ? (this.radius + breath) : (this.radius * 0.65);
        const ang = (Math.PI / points) * i;
        const px = Math.cos(ang) * rad;
        const py = Math.sin(ang) * rad;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (this.isBoss) {
      // Chefe Cósmico: Núcleo Gigante com Anéis Orbitais de Defesa
      ctx.beginPath();
      ctx.arc(0, 0, this.radius + breath, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Anel Giratório
      ctx.beginPath();
      ctx.arc(0, 0, this.radius + 12 + breath * 1.5, 0, Math.PI * 2);
      ctx.setLineDash([14, 8]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Olho do Vácuo Central
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius * 0.45, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Stalker / Spitter / Leaper: Losango Quântico
      ctx.beginPath();
      ctx.moveTo(0, -this.radius - breath);
      ctx.lineTo(this.radius + breath, 0);
      ctx.lineTo(0, this.radius + breath);
      ctx.lineTo(-this.radius - breath, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Pupila Brilhante
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Barra de Vida Acima da Entidade (quando ferido)
    if (this.hp < this.maxHp) {
      const bw = Math.max(28, this.radius * 2);
      const bh = this.isBoss ? 6 : 4;
      const bx = -bw / 2;
      const by = -this.radius - 12;

      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillRect(bx, by, bw, bh);

      ctx.fillStyle = this.isBoss ? '#ffd700' : '#ff3366';
      ctx.fillRect(bx, by, Math.max(0, (this.hp / this.maxHp) * bw), bh);
    }

    ctx.restore();
  }
}

// Projétil do Jogador ou Inimigo
export class Projectile {
  constructor(config) {
    this.x = config.x;
    this.y = config.y;
    this.vx = config.vx;
    this.vy = config.vy;
    this.radius = config.radius || 6;
    this.damage = config.damage || 25;
    this.penetration = config.penetration || 1;
    this.life = config.life || 2.2;
    this.isEnemy = config.isEnemy || false;
    this.color = config.color || (this.isEnemy ? '#ff0055' : '#00f5ff');
    this.type = config.type || 'blaster';
  }

  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.life -= dt;
  }

  render(ctx) {
    ctx.save();
    ctx.shadowBlur = 10;
    ctx.shadowColor = this.color;
    ctx.fillStyle = this.color;

    if (this.type === 'plasma') {
      // Onda curva penetrante
      const angle = Math.atan2(this.vy, this.vx);
      ctx.translate(this.x, this.y);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.arc(0, 0, this.radius * 2, -Math.PI * 0.4, Math.PI * 0.4);
      ctx.lineWidth = 4;
      ctx.strokeStyle = this.color;
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

// Cristal de XP Quântico
export class QuantumCrystal {
  constructor(x, y, value = 3, color = '#00f5ff') {
    this.x = x;
    this.y = y;
    this.value = value;
    this.color = color;
    this.radius = value >= 10 ? 8 : (value >= 5 ? 6 : 4.5);
    this.rot = Math.random() * Math.PI;
  }

  update(dt) {
    this.rot += dt * 3.5;
  }

  render(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rot);
    ctx.shadowBlur = 10;
    ctx.shadowColor = this.color;
    ctx.fillStyle = this.color;

    // Cristal Hexagonal Brilhante
    ctx.beginPath();
    ctx.moveTo(0, -this.radius);
    ctx.lineTo(this.radius * 0.8, -this.radius * 0.4);
    ctx.lineTo(this.radius * 0.8, this.radius * 0.4);
    ctx.lineTo(0, this.radius);
    ctx.lineTo(-this.radius * 0.8, this.radius * 0.4);
    ctx.lineTo(-this.radius * 0.8, -this.radius * 0.4);
    ctx.closePath();
    ctx.fill();

    // Reflexo Interior Branco
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, this.radius * 0.35, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
