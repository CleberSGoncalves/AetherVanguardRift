// src/game.js
// Motor Principal de Gameplay Survivors (Padrão REA & CrazyGames Homologado)
import { sound } from './audio.js';
import { juice } from './juice.js';
import { storage } from './storage.js';
import { getSectorById } from './sectors.js';
import { PlayerShip, DarkMatterEntity, Projectile, QuantumCrystal } from './entities.js';

export class SurvivorGame {
  constructor(canvas, ui) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.ui = ui;

    // Estado do Game Loop
    this.isRunning = false;
    this.isPaused = false;
    this.isGameOver = false;
    this.isVictory = false;
    this.lastTime = 0;
    this.elapsedSeconds = 0;

    // Setor Ativo
    this.currentSectorId = 1;
    this.sector = getSectorById(1);
    this.bossEntity = null;
    this.bossSpawned = false;

    // Sistema de 3 Estrelas
    this.starsEarned = 0;
    this.star1Reached = false;
    this.star2Reached = false;
    this.star3Reached = false;

    // Viewport & Câmera
    this.vw = 1280;
    this.vh = 720;
    this.scale = 1;
    this.offsetX = 0;
    this.offsetY = 0;
    this.camera = { x: 0, y: 0 };

    // Estatísticas da Partida
    this.kills = 0;
    this.crystalsCollected = 0;
    this.coinsEarned = 0;

    // Jogador
    this.player = new PlayerShip();
    this.orbitals = [];
    this.bullets = [];
    this.enemyBullets = [];
    this.enemies = [];
    this.crystals = [];

    // Spawner de Hordas
    this.spawnTimer = 0;
    this.shockwaveWeaponTimer = 0;
    this.hasShockwaveUpgrade = false;

    // Input do Teclado e Touch
    this.keys = {};
    this.touchStart = null;
    this.touchCurrent = null;
    this.dpadInput = { x: 0, y: 0 };

    // Catálogo de Upgrades
    this.upgradePool = [
      { id: 'fire_rate', name: 'Cadência Quântica', desc: '+25% cadência de disparos', icon: '⚡', apply: () => { this.player.attackCooldown = Math.max(0.12, this.player.attackCooldown * 0.76); } },
      { id: 'damage', name: 'Dano de Táquions', desc: '+35% de dano em todos os disparos', icon: '💥', apply: () => { this.player.bulletDamage = Math.round(this.player.bulletDamage * 1.35); } },
      { id: 'multi_shot', name: 'Canhão Multidirecional', desc: '+1 projétil simultâneo', icon: '🏹', apply: () => { this.player.bulletCount += 1; } },
      { id: 'swift_boots', name: 'Propulsor de Dobra', desc: '+20% velocidade de movimento', icon: '🚀', apply: () => { this.player.speed = Math.round(this.player.speed * 1.20); } },
      { id: 'magnet', name: 'Vórtice Magnético', desc: '+65% raio de atração de cristais', icon: '🧲', apply: () => { this.player.magnetRadius = Math.round(this.player.magnetRadius * 1.65); } },
      { id: 'orbitals', name: 'Drone Orbital Protetor', desc: '+1 drone com escudo laser rotativo', icon: '🛡️', apply: () => { this.addOrbital(); } },
      { id: 'vitality', name: 'Blindagem de Titânio', desc: '+40 HP Máximo e Restauração Total', icon: '❤️', apply: () => { this.player.maxHp += 40; this.player.hp = this.player.maxHp; } },
      { id: 'regen', name: 'Auto-Reparo Nanotec', desc: '+2.5 HP regenerado por segundo', icon: '🧪', apply: () => { this.player.regenRate += 2.5; } },
      { id: 'plasma', name: 'Feixe de Plasma Penetrante', desc: 'Disparos atravessam inimigos', icon: '🌌', apply: () => { this.player.penetration += 2; this.player.weaponType = 'plasma'; } },
      { id: 'shockwave', name: 'Pulso de Vácuo Periódico', desc: 'Emite onda expansiva a cada 6s', icon: '🌀', apply: () => { this.hasShockwaveUpgrade = true; } }
    ];

    this.bindEvents();
    this.initResize();
  }

  bindEvents() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      sound.init();
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    // Touch Virtual Joystick no Canvas
    this.canvas.addEventListener('touchstart', (e) => {
      sound.init();
      const t = e.touches[0];
      this.touchStart = { x: t.clientX, y: t.clientY };
      this.touchCurrent = { x: t.clientX, y: t.clientY };
    }, { passive: false });

    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (!this.touchStart) return;
      const t = e.touches[0];
      this.touchCurrent = { x: t.clientX, y: t.clientY };
    }, { passive: false });

    const clearTouch = () => {
      this.touchStart = null;
      this.touchCurrent = null;
    };
    this.canvas.addEventListener('touchend', clearTouch);
    this.canvas.addEventListener('touchcancel', clearTouch);
  }

  setDpadInput(x, y) {
    this.dpadInput.x = x;
    this.dpadInput.y = y;
  }

  initResize() {
    const container = this.canvas.parentElement;
    if (!container) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const dpr = window.devicePixelRatio || 1;

      // Detecção de Modo Retrato Mobile (h >= w * 1.05) — Padrão Arquitetural Obrigatório
      const isPortrait = h >= w * 1.05;

      if (isPortrait) {
        container.classList.add('portrait-mode');
        const hudH = 60;
        const ctrlH = 120;
        const availH = Math.max(160, h - hudH - ctrlH);

        this.scale = Math.min(w / this.vw, availH / this.vh);
        this.offsetX = Math.floor((w - this.vw * this.scale) / 2);
        this.offsetY = Math.floor(hudH + (availH - this.vh * this.scale) / 2);
      } else {
        container.classList.remove('portrait-mode');
        this.scale = Math.min(w / this.vw, h / this.vh);
        this.offsetX = Math.floor((w - this.vw * this.scale) / 2);
        this.offsetY = Math.floor((h - this.vh * this.scale) / 2);
      }

      this.canvas.width = w * dpr;
      this.canvas.height = h * dpr;
      this.ctx.resetTransform?.();
      this.ctx.scale(dpr, dpr);
      this.currentWidth = w;
      this.currentHeight = h;
    };

    window.addEventListener('resize', resize);
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();
  }

  loadSector(sectorId) {
    // RESET INCONDICIONAL ANTI-SOFTLOCK
    this.currentSectorId = sectorId;
    this.sector = getSectorById(sectorId);
    this.isGameOver = false;
    this.isVictory = false;
    this.isPaused = false;
    sound.setAdMuted(false);

    this.elapsedSeconds = 0;
    this.kills = 0;
    this.crystalsCollected = 0;
    this.coinsEarned = 0;
    this.starsEarned = 0;
    this.star1Reached = false;
    this.star2Reached = false;
    this.star3Reached = false;
    this.bossSpawned = false;
    this.bossEntity = null;

    // Aplica melhorias permanentes compradas no Hangar
    const upgrades = storage.get('upgrades') || {};
    const selectedShip = storage.get('selectedShip') || 'astraea';

    let baseHp = 100 + (upgrades.hull || 0) * 15;
    let baseSpeed = 270 + (upgrades.thruster || 0) * 20;
    let baseDamage = 25 + (upgrades.weapons || 0) * 4;
    let baseMagnet = 135 + (upgrades.magnet || 0) * 25;
    let baseRegen = (upgrades.nanotech || 0) * 0.8;
    let baseWeapon = 'blaster';
    let baseBulletCount = 1;

    // Modificadores de modelo de nave
    if (selectedShip === 'chrono_striker') {
      baseSpeed += 70;
      baseHp -= 20;
      baseWeapon = 'tachyon';
    } else if (selectedShip === 'void_aegis') {
      baseHp += 60;
      baseSpeed -= 35;
      baseWeapon = 'plasma';
    } else if (selectedShip === 'valkyrie') {
      baseBulletCount = 2;
      baseMagnet += 50;
    }

    this.player = new PlayerShip({
      hp: baseHp,
      speed: baseSpeed,
      bulletDamage: baseDamage,
      magnetRadius: baseMagnet,
      regenRate: baseRegen,
      model: selectedShip,
      weaponType: baseWeapon,
      bulletCount: baseBulletCount
    });

    if (selectedShip === 'void_aegis') {
      this.addOrbital();
    }

    this.bullets = [];
    this.enemyBullets = [];
    this.enemies = [];
    this.crystals = [];
    this.orbitals = [];
    juice.clear();

    console.info('[GAMEPLAY_EVENT]', {
      type: 'STATE_CHANGE',
      state: 'SECTOR_START',
      sectorId: this.sector.id,
      sectorName: this.sector.name
    });

    this.updateHUD();
  }

  start(sectorId = 1) {
    this.loadSector(sectorId);
    this.isRunning = true;
    this.lastTime = performance.now();
    sound.startBgm();
    requestAnimationFrame((t) => this.loop(t));
  }

  addOrbital() {
    this.player.orbitalCount += 1;
    this.orbitals = [];
    for (let i = 0; i < this.player.orbitalCount; i++) {
      this.orbitals.push({
        angle: (Math.PI * 2 / this.player.orbitalCount) * i,
        distance: 70,
        radius: 11,
        damage: 24
      });
    }
  }

  revive() {
    this.player.hp = this.player.maxHp;
    this.player.invulnerableTimer = 3.5;
    this.isGameOver = false;
    this.isPaused = false;
    juice.addTrauma(0.5);
    juice.emitShockwave(this.player.x, this.player.y, 220, '#00f5ff');

    // Empurra e atordoa inimigos próximos
    this.enemies.forEach(en => {
      const dx = en.x - this.player.x;
      const dy = en.y - this.player.y;
      const dist = Math.hypot(dx, dy) || 1;
      en.x += (dx / dist) * 320;
      en.y += (dy / dist) * 320;
    });

    this.updateHUD();
    console.info('[GAMEPLAY_EVENT]', { type: 'PLAYER_REVIVE', sectorId: this.sector.id });
  }

  loop(currentTime) {
    if (!this.isRunning) return;

    // Timestep determinístico protegido contra picos (máximo 50ms por frame)
    const dt = Math.min((currentTime - this.lastTime) / 1000, 0.05);
    this.lastTime = currentTime;

    if (!this.isPaused && !this.isGameOver && !this.isVictory) {
      const freeze = juice.update(dt);
      if (!freeze) {
        this.update(dt);
      }
    }

    this.render();
    requestAnimationFrame((t) => this.loop(t));
  }

  update(dt) {
    this.elapsedSeconds += dt;

    // Atualização de Missões
    storage.updateQuestProgress('time', this.elapsedSeconds);

    // Sistema de Regeneração
    if (this.player.regenRate > 0 && this.player.hp < this.player.maxHp) {
      this.player.regenTimer += dt;
      if (this.player.regenTimer >= 1.0) {
        this.player.regenTimer = 0;
        this.player.hp = Math.min(this.player.maxHp, this.player.hp + this.player.regenRate);
        this.updateHUD();
      }
    }

    if (this.player.invulnerableTimer > 0) {
      this.player.invulnerableTimer -= dt;
    }

    // 1. Movimentação do Jogador (Teclado + Touch + Dpad)
    let mx = 0, my = 0;
    if (this.keys['KeyW'] || this.keys['ArrowUp']) my -= 1;
    if (this.keys['KeyS'] || this.keys['ArrowDown']) my += 1;
    if (this.keys['KeyA'] || this.keys['ArrowLeft']) mx -= 1;
    if (this.keys['KeyD'] || this.keys['ArrowRight']) mx += 1;

    // Touch Virtual Joystick
    if (this.touchStart && this.touchCurrent) {
      const tdx = this.touchCurrent.x - this.touchStart.x;
      const tdy = this.touchCurrent.y - this.touchStart.y;
      const tdist = Math.hypot(tdx, tdy);
      if (tdist > 12) {
        mx = tdx / tdist;
        my = tdy / tdist;
      }
    }

    // Touch D-Pad no dock inferior
    if (this.dpadInput.x !== 0 || this.dpadInput.y !== 0) {
      mx = this.dpadInput.x;
      my = this.dpadInput.y;
    }

    const mlen = Math.hypot(mx, my);
    if (mlen > 0) {
      const nx = mx / mlen;
      const ny = my / mlen;
      this.player.x += nx * this.player.speed * dt;
      this.player.y += ny * this.player.speed * dt;
      this.player.angle = Math.atan2(ny, nx);

      // Partículas de exaustão do propulsor
      this.player.thrusterTimer += dt;
      if (this.player.thrusterTimer >= 0.04) {
        this.player.thrusterTimer = 0;
        juice.emitThruster(this.player.x, this.player.y, this.player.angle, '#00f5ff');
      }
    }

    // Câmera suave
    this.camera.x += (this.player.x - this.camera.x) * 8 * dt;
    this.camera.y += (this.player.y - this.camera.y) * 8 * dt;

    // 2. Disparo Automático
    this.player.attackTimer += dt;
    if (this.player.attackTimer >= this.player.attackCooldown && this.enemies.length > 0) {
      this.player.attackTimer = 0;
      this.fireWeapon();
    }

    // Upgrade: Pulso Periódico de Vácuo
    if (this.hasShockwaveUpgrade) {
      this.shockwaveWeaponTimer += dt;
      if (this.shockwaveWeaponTimer >= 5.5) {
        this.shockwaveWeaponTimer = 0;
        this.triggerQuantumShockwave();
      }
    }

    // 3. Atualização dos Drones Orbitais
    this.orbitals.forEach((orb) => {
      orb.angle += dt * 3.6;
      const ox = this.player.x + Math.cos(orb.angle) * orb.distance;
      const oy = this.player.y + Math.sin(orb.angle) * orb.distance;

      this.enemies.forEach(en => {
        const d = Math.hypot(en.x - ox, en.y - oy);
        if (d < en.radius + orb.radius) {
          this.damageEnemy(en, orb.damage * dt * 3.5, ox, oy);
        }
      });
    });

    // 4. Projéteis do Jogador
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i];
      b.update(dt);

      let hit = false;
      for (const en of this.enemies) {
        const d = Math.hypot(en.x - b.x, en.y - b.y);
        if (d < en.radius + b.radius) {
          this.damageEnemy(en, b.damage, b.x, b.y);
          b.penetration -= 1;
          hit = true;
          if (b.penetration <= 0) break;
        }
      }

      if (b.life <= 0 || (hit && b.penetration <= 0)) {
        this.bullets.splice(i, 1);
      }
    }

    // 5. Projéteis Inimigos
    for (let i = this.enemyBullets.length - 1; i >= 0; i--) {
      const eb = this.enemyBullets[i];
      eb.update(dt);

      const d = Math.hypot(this.player.x - eb.x, this.player.y - eb.y);
      if (d < this.player.radius + eb.radius) {
        if (this.player.invulnerableTimer <= 0) {
          this.takeDamage(eb.damage);
        }
        this.enemyBullets.splice(i, 1);
        continue;
      }

      if (eb.life <= 0) {
        this.enemyBullets.splice(i, 1);
      }
    }

    // 6. Spawn de Inimigos e Boss do Setor
    this.spawnTimer += dt;
    const spawnRate = Math.max(0.25, 0.95 - (this.elapsedSeconds / this.sector.targetTime) * 0.55);
    if (this.spawnTimer >= spawnRate) {
      this.spawnTimer = 0;
      this.spawnEnemy();
    }

    // Spawner do Chefe de Setor
    if (this.sector.isBossLevel && !this.bossSpawned && this.elapsedSeconds >= this.sector.targetTime * 0.45) {
      this.spawnBoss();
    }

    // 7. Atualização das Entidades Inimigas
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const en = this.enemies[i];
      en.update(dt, this.player.x, this.player.y);

      // Inimigos com disparo (Spitter e Boss)
      if (en.canShoot) {
        en.shootTimer = (en.shootTimer || 0) + dt;
        if (en.shootTimer >= en.shootCooldown) {
          en.shootTimer = 0;
          this.fireEnemyBullet(en);
        }
      }

      // Colisão com Jogador
      const dist = Math.hypot(this.player.x - en.x, this.player.y - en.y);
      if (dist < this.player.radius + en.radius) {
        if (this.player.invulnerableTimer <= 0) {
          this.takeDamage(en.damage);
        }
      }

      // Repulsão mútua entre inimigos
      for (let j = i - 1; j >= 0; j--) {
        const other = this.enemies[j];
        const sepX = en.x - other.x;
        const sepY = en.y - other.y;
        const sepDist = Math.hypot(sepX, sepY);
        const minDist = en.radius + other.radius;
        if (sepDist < minDist && sepDist > 0) {
          const push = (minDist - sepDist) * 0.45;
          en.x += (sepX / sepDist) * push;
          en.y += (sepY / sepDist) * push;
          other.x -= (sepX / sepDist) * push;
          other.y -= (sepY / sepDist) * push;
        }
      }
    }

    // 8. Coleta de Cristais Quânticos
    for (let i = this.crystals.length - 1; i >= 0; i--) {
      const c = this.crystals[i];
      c.update(dt);

      const dx = this.player.x - c.x;
      const dy = this.player.y - c.y;
      const dist = Math.hypot(dx, dy);

      if (dist < this.player.magnetRadius) {
        const pullSpeed = 520 * (1 - dist / this.player.magnetRadius) + 140;
        c.x += (dx / dist) * pullSpeed * dt;
        c.y += (dy / dist) * pullSpeed * dt;
      }

      if (dist < this.player.radius + c.radius) {
        this.collectCrystal(c);
        this.crystals.splice(i, 1);
      }
    }

    // 9. Avaliação em Tempo Real do Sistema de 3 Estrelas
    this.evaluateStars();

    // 10. Condição de Vitória Automática ao Fim do Tempo
    if (this.elapsedSeconds >= this.sector.targetTime) {
      if (this.sector.isBossLevel) {
        if (this.bossEntity && this.bossEntity.hp <= 0) {
          this.winSector();
        }
      } else {
        if (this.starsEarned >= 1) {
          this.winSector();
        } else {
          this.gameOver();
        }
      }
    }

    this.updateHUD();
  }

  evaluateStars() {
    let stars = 0;
    // Estrela 1: Sobreviver pelo menos ao tempo base de aprovação
    if (this.elapsedSeconds >= this.sector.star1Time || this.kills >= this.sector.star1Kills) {
      stars = 1;
      if (!this.star1Reached) {
        this.star1Reached = true;
        this.ui.showEarlyFinishButton();
        juice.emitShockwave(this.player.x, this.player.y, 160, '#22c55e');
      }
    }

    // Estrela 2: Atingir meta de abates intermediária
    if (this.kills >= this.sector.star2Kills) {
      stars = 2;
      this.star2Reached = true;
    }

    // Estrela 3: Sobreviver 100% do tempo e abater meta máxima (ou derrotar o chefe)
    if (this.sector.isBossLevel) {
      if (this.bossSpawned && (!this.bossEntity || this.bossEntity.hp <= 0)) {
        stars = 3;
        this.star3Reached = true;
      }
    } else {
      if (this.elapsedSeconds >= this.sector.star3Time && this.kills >= this.sector.star3Kills) {
        stars = 3;
        this.star3Reached = true;
      }
    }

    this.starsEarned = stars;
  }

  fireWeapon() {
    // Mira nos inimigos mais próximos
    const sorted = [...this.enemies].sort((a, b) => {
      const da = Math.hypot(a.x - this.player.x, a.y - this.player.y);
      const db = Math.hypot(b.x - this.player.x, b.y - this.player.y);
      return da - db;
    });

    const targets = sorted.slice(0, this.player.bulletCount);
    targets.forEach((target, idx) => {
      const dx = target.x - this.player.x;
      const dy = target.y - this.player.y;
      const baseAngle = Math.atan2(dy, dx);
      const spread = (idx - (this.player.bulletCount - 1) / 2) * 0.16;
      const angle = baseAngle + spread;

      this.bullets.push(new Projectile({
        x: this.player.x,
        y: this.player.y,
        vx: Math.cos(angle) * this.player.bulletSpeed,
        vy: Math.sin(angle) * this.player.bulletSpeed,
        damage: this.player.bulletDamage,
        penetration: this.player.penetration,
        type: this.player.weaponType,
        color: this.player.weaponType === 'plasma' ? '#a855f7' : (this.player.weaponType === 'tachyon' ? '#f43f5e' : '#00f5ff'),
        radius: this.player.weaponType === 'plasma' ? 10 : 6
      }));
    });

    sound.playShoot(this.player.weaponType);
  }

  triggerQuantumShockwave() {
    juice.addTrauma(0.4);
    juice.emitShockwave(this.player.x, this.player.y, 260, '#ffd700');
    sound.playBossAlarm();

    this.enemies.forEach(en => {
      const dx = en.x - this.player.x;
      const dy = en.y - this.player.y;
      const d = Math.hypot(dx, dy);
      if (d < 260) {
        this.damageEnemy(en, this.player.bulletDamage * 1.8, en.x, en.y);
        en.x += (dx / (d || 1)) * 120;
        en.y += (dy / (d || 1)) * 120;
      }
    });
  }

  fireEnemyBullet(enemy) {
    const dx = this.player.x - enemy.x;
    const dy = this.player.y - enemy.y;
    const angle = Math.atan2(dy, dx);
    const speed = enemy.isBoss ? 240 : 200;

    this.enemyBullets.push(new Projectile({
      x: enemy.x,
      y: enemy.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      damage: enemy.damage * 0.8,
      radius: enemy.isBoss ? 8 : 6,
      isEnemy: true,
      color: '#ff0055'
    }));
  }

  spawnEnemy() {
    const angle = Math.random() * Math.PI * 2;
    const spawnDist = Math.max(this.vw, this.vh) * 0.65;
    const sx = this.player.x + Math.cos(angle) * spawnDist;
    const sy = this.player.y + Math.sin(angle) * spawnDist;

    // Sorteia tipo entre os permitidos no setor
    const allowed = this.sector.allowedEnemies;
    const type = allowed[Math.floor(Math.random() * allowed.length)] || 'stalker';

    // Dificuldade com escala progressiva
    const hpMult = 1.0 + (this.elapsedSeconds / 100) * 0.7;
    const speedMult = 1.0 + Math.min(0.4, (this.elapsedSeconds / 150) * 0.4);

    const baseEnemy = new DarkMatterEntity(type, sx, sy, {
      hp: Math.round(35 * hpMult),
      speed: Math.round(95 * speedMult)
    });
    this.enemies.push(baseEnemy);
  }

  spawnBoss() {
    this.bossSpawned = true;
    sound.playBossAlarm();
    juice.addTrauma(0.65);
    this.ui.showBossBanner(this.sector.bossName);

    const angle = Math.random() * Math.PI * 2;
    const spawnDist = 450;
    const bx = this.player.x + Math.cos(angle) * spawnDist;
    const by = this.player.y + Math.sin(angle) * spawnDist;

    this.bossEntity = new DarkMatterEntity('boss', bx, by, {
      hp: this.sector.bossHp,
      bossName: this.sector.bossName,
      bossType: this.sector.bossType,
      radius: 46,
      color: '#ff0055',
      speed: 60
    });
    this.enemies.push(this.bossEntity);

    console.info('[GAMEPLAY_EVENT]', {
      type: 'BOSS_SPAWN',
      bossName: this.sector.bossName,
      sectorId: this.sector.id
    });
  }

  damageEnemy(enemy, amount, hitX, hitY) {
    enemy.hp -= amount;
    sound.playHit();

    // Hit-Stop em impactos críticos ou no Chefe
    if (enemy.isBoss || amount > 45) {
      juice.triggerHitStop(0.045);
      juice.addTrauma(0.2);
    }

    const isCrit = amount > 35;
    juice.addFloatingText(enemy.x, enemy.y, Math.round(amount), isCrit ? '#ffd700' : '#ffffff', isCrit);

    if (enemy.hp <= 0) {
      this.killEnemy(enemy);
    }
  }

  killEnemy(enemy) {
    const idx = this.enemies.indexOf(enemy);
    if (idx !== -1) this.enemies.splice(idx, 1);
    this.kills += 1;

    // Atualiza progresso de missões
    storage.updateQuestProgress('kills', 1);

    // Drop de Cristal Quântico
    this.crystals.push(new QuantumCrystal(enemy.x, enemy.y, enemy.xpValue, enemy.color));

    // Moedas quânticas concedidas
    this.coinsEarned += enemy.isBoss ? 50 : 1;

    // Explosão rica
    juice.emitExplosion(enemy.x, enemy.y, enemy.color, enemy.isBoss ? 35 : 12);
    juice.addTrauma(enemy.isBoss ? 0.5 : 0.12);

    if (enemy.isBoss) {
      this.bossEntity = null;
      console.info('[GAMEPLAY_EVENT]', { type: 'BOSS_DEFEATED', sectorId: this.sector.id });
      // Vitória Máxima ao derrotar o chefe
      this.starsEarned = 3;
      setTimeout(() => this.winSector(), 600);
    }
  }

  collectCrystal(crystal) {
    this.player.xp += crystal.value;
    this.crystalsCollected += 1;
    sound.playGem(1.0 + (this.crystalsCollected % 15) * 0.05);

    storage.updateQuestProgress('crystals', 1);

    if (this.player.xp >= this.player.neededXp) {
      this.levelUp();
    }
  }

  levelUp() {
    this.player.xp -= this.player.neededXp;
    this.player.level += 1;
    this.player.neededXp = Math.round(this.player.neededXp * 1.45 + 6);
    sound.playLevelUp();
    juice.addTrauma(0.35);

    storage.updateQuestProgress('level', this.player.level);

    // Sorteia 3 opções do catálogo
    const shuffled = [...this.upgradePool].sort(() => 0.5 - Math.random());
    const choices = shuffled.slice(0, 3);

    this.isPaused = true;
    this.ui.showLevelUp(choices, (chosenUpgrade) => {
      chosenUpgrade.apply();
      sound.playUpgradeSelect();
      this.isPaused = false;
      this.ui.hideLevelUp();
      this.updateHUD();
    });
  }

  takeDamage(amount) {
    this.player.hp -= amount;
    juice.addTrauma(0.45);
    sound.playHurt();
    this.ui.flashDamage();

    if (this.player.hp <= 0) {
      this.player.hp = 0;
      this.gameOver();
    }
  }

  gameOver() {
    this.isGameOver = true;
    sound.playGameOver();
    console.info('[GAMEPLAY_EVENT]', {
      type: 'PLAYER_DEATH',
      sectorId: this.sector.id,
      time: this.elapsedSeconds,
      kills: this.kills
    });
    this.ui.showGameOver({
      time: this.formatTime(this.elapsedSeconds),
      kills: this.kills,
      level: this.player.level,
      crystals: this.crystalsCollected,
      coins: this.coinsEarned
    });
  }

  winSector() {
    this.isVictory = true;
    this.starsEarned = Math.max(1, this.starsEarned);
    sound.playVictory();

    // Salva estrelas e moedas
    const totalCoins = this.sector.rewardCoins + this.coinsEarned;
    storage.addCoins(totalCoins);
    storage.recordSectorCompletion(this.sector.id, this.starsEarned);

    console.info('[GAMEPLAY_EVENT]', {
      type: 'STAGE_WIN',
      sectorId: this.sector.id,
      stars: this.starsEarned,
      coins: totalCoins
    });

    this.ui.showVictory({
      sectorName: this.sector.name,
      time: this.formatTime(this.elapsedSeconds),
      kills: this.kills,
      stars: this.starsEarned,
      rewardCoins: totalCoins
    });
  }

  formatTime(totalSeconds) {
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  updateHUD() {
    const xpPercent = Math.min(100, Math.round((this.player.xp / this.player.neededXp) * 100));
    const timeRatio = Math.min(1.0, this.elapsedSeconds / this.sector.targetTime);

    this.ui.update({
      sectorTitle: this.sector.name,
      level: this.player.level,
      kills: this.kills,
      timer: this.formatTime(this.elapsedSeconds),
      targetTimer: this.formatTime(this.sector.targetTime),
      timeProgressPercent: Math.round(timeRatio * 100),
      hp: Math.max(0, Math.round(this.player.hp)),
      maxHp: this.player.maxHp,
      xpPercent,
      starsEarned: this.starsEarned,
      coinsEarned: this.coinsEarned
    });
  }

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.currentWidth || 1280, this.currentHeight || 720);

    const shake = juice.getShakeOffset();
    const cx = (this.currentWidth || 1280) / 2 + shake.x;
    const cy = (this.currentHeight || 720) / 2 + shake.y;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(this.scale, this.scale);
    ctx.translate(-this.camera.x, -this.camera.y);

    // 1. Grade Espacial Quântica
    this.renderSpaceGrid(ctx);

    // 2. Cristais de XP
    this.crystals.forEach(c => c.render(ctx));

    // 3. Projéteis do Jogador
    this.bullets.forEach(b => b.render(ctx));

    // 4. Projéteis Inimigos
    this.enemyBullets.forEach(eb => eb.render(ctx));

    // 5. Inimigos
    this.enemies.forEach(en => en.render(ctx));

    // 6. Drones Orbitais
    this.orbitals.forEach(orb => {
      const ox = this.player.x + Math.cos(orb.angle) * orb.distance;
      const oy = this.player.y + Math.sin(orb.angle) * orb.distance;

      // Laser tether
      ctx.save();
      ctx.strokeStyle = 'rgba(0, 245, 255, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(this.player.x, this.player.y);
      ctx.lineTo(ox, oy);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(ox, oy, orb.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#00f5ff';
      ctx.shadowColor = '#00f5ff';
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.restore();
    });

    // 7. Nave do Jogador
    this.player.render(ctx);

    // 8. Partículas e Textos de Combate
    juice.render(ctx);

    ctx.restore();
  }

  renderSpaceGrid(ctx) {
    const gridSize = 100;
    const halfW = (this.vw / 2) / this.scale + 200;
    const halfH = (this.vh / 2) / this.scale + 200;

    const startX = Math.floor((this.camera.x - halfW) / gridSize) * gridSize;
    const endX = startX + halfW * 2 + gridSize;
    const startY = Math.floor((this.camera.y - halfH) / gridSize) * gridSize;
    const endY = startY + halfH * 2 + gridSize;

    ctx.save();
    ctx.strokeStyle = 'rgba(0, 245, 255, 0.05)';
    ctx.lineWidth = 1;

    for (let x = startX; x <= endX; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, startY);
      ctx.lineTo(x, endY);
      ctx.stroke();
    }

    for (let y = startY; y <= endY; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(startX, y);
      ctx.lineTo(endX, y);
      ctx.stroke();
    }
    ctx.restore();
  }
}
