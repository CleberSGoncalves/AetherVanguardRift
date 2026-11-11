// src/i18n.js
// Sistema de Internacionalização: Inglês (EN) por padrão com detecção e suporte a PT-BR

const TRANSLATIONS = {
  en: {
    gameTitle: 'Astral Survivor: Neon Void',
    subtitle: 'Survive the Synthetic Siege in Nebula Sector 9',
    level: 'LVL',
    kills: 'KILLS',
    crystals: 'CRYSTALS',
    coins: 'COINS',
    hp: 'HP',
    time: 'TIME',
    target: 'TARGET',
    earlyFinish: '✅ COMPLETE STAGE (★) ➔',
    autoFire: 'AUTO-FIRING ACTIVE',
    moveHint: 'WASD / Arrow Keys to Move • Auto-Aim Weapons',
    footerLink: 'kinomuse.com.br',

    // Lore Modal
    protocol: 'NEBULA PROTOCOL 0-9',
    loreTitle: 'ASTRAL SURVIVOR: NEON VOID',
    loreP1: 'Deep in Nebula Sector 9, a catastrophic core failure has unleashed swarms of synthetic dark matter anomalies. The star pilot must survive the quantum siege using orbital plasma weapons before the starship engine collapses.',
    lorePoint1Title: 'Maneuver Starship:',
    lorePoint1Desc: 'Evade 360° polar swarms and vacuum hazards.',
    lorePoint2Title: 'Collect XP Shards:',
    lorePoint2Desc: 'Absorb quantum energy dropped by anomalies to level up.',
    lorePoint3Title: 'Defeat Sector Bosses:',
    lorePoint3Desc: 'Survive the countdown and destroy the Void Overlord for 3-Star glory!',
    startBattle: 'START MISSION ➔',
    skipIntro: 'SKIP INTRO',

    // Level Up Modal
    powerSurge: '⚡ QUANTUM POWER EVOLUTION!',
    chooseUpgrade: 'Choose 1 enhancement for your starship build:',

    // Pause Modal
    paused: 'SYSTEM PAUSED',
    resume: 'RESUME',
    restartStage: 'RESTART SECTOR',
    sectorMap: 'SECTOR MAP',
    shipHangar: 'SHIP HANGAR',

    // Victory Modal
    sectorCleared: 'SECTOR PURGED WITH SUCCESS',
    victoryTitle: 'SECTOR VICTORY!',
    timeSurvived: 'Survival Time',
    anomaliesDefeated: 'Anomalies Defeated',
    crystalsEarned: 'Quantum Shards',
    doubleRewards: '🎬 DOUBLE REWARDS (+100%)',
    nextSector: 'PROCEED TO NEXT SECTOR ➔',
    stageSelector: 'SECTOR SELECTOR',

    // Game Over Modal
    hullBreach: 'CRITICAL HULL COLLAPSE',
    defeatTitle: 'FALLEN TO THE NEON VOID',
    defeatSubtitle: 'The synthetic swarm breached your perimeter shields!',
    reviveBtn: '🎬 REVIVE WITH SHIELD (3.5s)',
    tryAgain: 'TRY AGAIN',
    hangarUpgrades: 'HANGAR & UPGRADES',

    // Sectors Modal
    sectorsTitle: 'NEON VOID SECTOR NAVIGATOR',
    sectorLocked: '🔒 LOCKED',
    stageLabel: 'SECTOR',

    // Hangar / Shop
    hangarTitle: 'FLEET HANGAR & QUANTUM ENGINEERING',
    balance: 'Available Balance:',
    shipsSection: 'COMBAT STARSHIP FLEET',
    systemsSection: 'FLEET SYSTEM UPGRADES',
    equipped: 'EQUIPPED',
    select: 'EQUIP',
    maxLevel: 'MAXED',

    // Quests
    questsTitle: 'ACTIVE QUANTUM QUESTS',
    progress: 'Progress:',
    reward: 'Reward:',
    claim: 'CLAIM',
    inProgress: 'IN PROGRESS',
    claimed: 'CLAIMED',

    // Daily
    dailyTitle: 'DAILY QUANTUM LOGIN (7 DAYS)',
    claimDaily: 'CLAIM REWARD',
    claimDailyDouble: '🎬 DOUBLE CLAIM (+100%)',
    dayLabel: 'DAY',

    // Spin
    spinTitle: 'QUANTUM LUCKY WHEEL',
    spinFree: 'SPIN WHEEL (FREE)',
    spinAd: '🎬 EXTRA SPIN WITH AD',
    spinAvailable: 'Free Spin Available!',
    spinCooldown: 'Cooldown active or spin via Ad!',
    spinWon: 'You won',

    // Boss Alert
    bossAlert: 'QUANTUM ANOMALY DETECTED',

    // Upgrades Catalog
    up_fire_rate: 'Quantum Cadence',
    up_fire_rate_desc: '+25% Weapon Attack Speed',
    up_damage: 'Tachyon Overcharge',
    up_damage_desc: '+35% Damage to all Weapons',
    up_multi_shot: 'Multi-Directional Blaster',
    up_multi_shot_desc: '+1 Simultaneous Projectile',
    up_swift_boots: 'Warp Thrusters',
    up_swift_boots_desc: '+20% Movement Speed',
    up_magnet: 'Magnetic Core',
    up_magnet_desc: '+65% Crystal Collection Radius',
    up_orbitals: 'Orbital Defense Drone',
    up_orbitals_desc: '+1 Rotating Laser Shield Drone',
    up_vitality: 'Titanium Armor Plating',
    up_vitality_desc: '+40 Max HP and Full Shield Heal',
    up_regen: 'Nanotech Auto-Repair',
    up_regen_desc: '+2.5 HP Regenerated per Second',
    up_plasma: 'Piercing Plasma Wave',
    up_plasma_desc: 'Projectiles Pierce Multiple Anomalies',
    up_shockwave: 'Void Shockwave Pulse',
    up_shockwave_desc: 'Releases Periodic Shockwave every 6s',

    // Ships
    ship_astraea: 'Astral Vanguard',
    ship_astraea_desc: 'Balanced Core • Quantum Blaster',
    ship_chrono: 'Chrono Striker',
    ship_chrono_desc: '+70 Speed • Rapid Tachyon Pulse',
    ship_aegis: 'Void Aegis',
    ship_aegis_desc: '+60 HP • Piercing Plasma Beam',
    ship_valkyrie: 'Valkyrie Solar',
    ship_valkyrie_desc: 'Dual Blasters • Super Magnetism',

    // Fleet Upgrades
    perm_hull: 'Titanium Hull Reinforcement',
    perm_hull_desc: '+15 HP per level',
    perm_thruster: 'Sub-Light Plasma Injector',
    perm_thruster_desc: '+10% Speed per level',
    perm_weapons: 'Tachyon Overclocking',
    perm_weapons_desc: '+12% Damage per level',
    perm_magnet: 'Gravitational Harvester',
    perm_magnet_desc: '+20% Magnet radius per level',
    perm_nanotech: 'Nanotech Repair Matrix',
    perm_nanotech_desc: '+0.8 HP/s Regen per level'
  },
  pt: {
    gameTitle: 'Astral Survivor: Neon Void',
    subtitle: 'Sobreviva ao Cerco Sintético no Setor Nebuloso 9',
    level: 'NVL',
    kills: 'ABATES',
    crystals: 'CRISTAIS',
    coins: 'MOEDAS',
    hp: 'HP',
    time: 'TEMPO',
    target: 'ALVO',
    earlyFinish: '✅ CONCLUIR FASE (★) ➔',
    autoFire: 'DISPARO AUTOMÁTICO ATIVO',
    moveHint: 'WASD / Setas para Mover • Armas com Mira Automática',
    footerLink: 'kinomuse.com.br',

    // Lore Modal
    protocol: 'PROTOCOLO NEBULA 0-9',
    loreTitle: 'ASTRAL SURVIVOR: NEON VOID',
    loreP1: 'Nas profundezas do setor nebuloso 9, uma falha crítica no núcleo gerou hordas de anomalias sintéticas de matéria escura. O piloto estelar deve sobreviver ao cerco quântico utilizando armas de plasma orbitais antes que o motor colapse.',
    lorePoint1Title: 'Pilote sua Nave:',
    lorePoint1Desc: 'Desvie de enxames em 360° e perigos no vácuo.',
    lorePoint2Title: 'Colete Fragmentos de XP:',
    lorePoint2Desc: 'Absorva energia quântica para subir de nível e desbloquear armas.',
    lorePoint3Title: 'Derrote os Chefes do Setor:',
    lorePoint3Desc: 'Sobreviva ao cronômetro e destrua o Soberano do Vazio para alcançar as 3 Estrelas!',
    startBattle: 'INICIAR COMBATE ➔',
    skipIntro: 'PULAR INTRO',

    // Level Up Modal
    powerSurge: '⚡ EVOLUÇÃO DE PODER QUÂNTICO!',
    chooseUpgrade: 'Escolha 1 aprimoramento para sua build estelar:',

    // Pause Modal
    paused: 'SISTEMA PAUSADO',
    resume: 'CONTINUAR',
    restartStage: 'REINICIAR SETOR',
    sectorMap: 'MAPA DE SETORES',
    shipHangar: 'HANGAR DE NAVES',

    // Victory Modal
    sectorCleared: 'SETOR EXPURGADO COM SUCESSO',
    victoryTitle: 'VITÓRIA NO SETOR!',
    timeSurvived: 'Tempo Sobrevivido',
    anomaliesDefeated: 'Anomalias Abatidas',
    crystalsEarned: 'Fragmentos Quânticos',
    doubleRewards: '🎬 DOBRAR RECOMPENSAS (+100%)',
    nextSector: 'AVANÇAR AO PRÓXIMO SETOR ➔',
    stageSelector: 'SELEÇÃO DE FASES',

    // Game Over Modal
    hullBreach: 'COLAPSO CRÍTICO DO CASCO',
    defeatTitle: 'DERROTADO PELO VÁZIO NEON',
    defeatSubtitle: 'O enxame sintético sobrepujou seus escudos perimetrais!',
    reviveBtn: '🎬 REVIVER COM ESCUDO (3.5s)',
    tryAgain: 'TENTAR NOVAMENTE',
    hangarUpgrades: 'HANGAR & MELHORIAS',

    // Sectors Modal
    sectorsTitle: 'NAVEGADOR DE SETORES NEON VOID',
    sectorLocked: '🔒 BLOQUEADO',
    stageLabel: 'FASE',

    // Hangar / Shop
    hangarTitle: 'HANGAR DA FROTA & ENGENHARIA QUÂNTICA',
    balance: 'Saldo Disponível:',
    shipsSection: 'FROTA DE NAVES DE COMBATE',
    systemsSection: 'MELHORIAS DE SISTEMAS DA FROTA',
    equipped: 'EQUIPADA',
    select: 'EQUIPAR',
    maxLevel: 'MÁXIMO',

    // Quests
    questsTitle: 'MISSÕES QUÂNTICAS ATIVAS',
    progress: 'Progresso:',
    reward: 'Recompensa:',
    claim: 'COLETAR',
    inProgress: 'EM ANDAMENTO',
    claimed: 'RESGATADO',

    // Daily
    dailyTitle: 'CALENDÁRIO DE RECOMPENSA DIÁRIA (7 DIAS)',
    claimDaily: 'COLETAR RECOMPENSA',
    claimDailyDouble: '🎬 DOBRAR RECOMPENSA (+100%)',
    dayLabel: 'DIA',

    // Spin
    spinTitle: 'ROLETA QUÂNTICA DA SORTE',
    spinFree: 'GIRAR ROLETA (GRÁTIS)',
    spinAd: '🎬 GIRO EXTRA COM ANÚNCIO',
    spinAvailable: 'Giro Grátis Disponível!',
    spinCooldown: 'Aguarde o tempo de recarga ou gire com anúncio!',
    spinWon: 'Você ganhou',

    // Boss Alert
    bossAlert: 'ANOMALIA QUÂNTICA DETECTADA',

    // Upgrades Catalog
    up_fire_rate: 'Cadência Quântica',
    up_fire_rate_desc: '+25% de Velocidade de Disparo',
    up_damage: 'Sobrecarga de Táquions',
    up_damage_desc: '+35% de Dano em Todas as Armas',
    up_multi_shot: 'Canhão Multidirecional',
    up_multi_shot_desc: '+1 Projétil Simultâneo',
    up_swift_boots: 'Propulsores de Dobra',
    up_swift_boots_desc: '+20% de Velocidade de Movimento',
    up_magnet: 'Núcleo Magnético',
    up_magnet_desc: '+65% de Raio de Coleta de Cristais',
    up_orbitals: 'Drone de Defesa Orbital',
    up_orbitals_desc: '+1 Drone Giratório com Escudo Laser',
    up_vitality: 'Blindagem de Titânio',
    up_vitality_desc: '+40 HP Máximo e Cura Completa do Casco',
    up_regen: 'Auto-Reparo Nanotec',
    up_regen_desc: '+2.5 HP Regenerado a cada Segundo',
    up_plasma: 'Feixe de Plasma Penetrante',
    up_plasma_desc: 'Projéteis Atravessam Múltiplas Anomalias',
    up_shockwave: 'Pulso de Vácuo Periódico',
    up_shockwave_desc: 'Emite Onda de Choque Expansiva a cada 6s',

    // Ships
    ship_astraea: 'Astral Vanguard',
    ship_astraea_desc: 'Núcleo Balanceado • Blaster Quântico',
    ship_chrono: 'Chrono Striker',
    ship_chrono_desc: '+70 Velocidade • Pulso Táquion Rápido',
    ship_aegis: 'Void Aegis',
    ship_aegis_desc: '+60 HP • Feixe de Plasma Penetrante',
    ship_valkyrie: 'Valkyrie Solar',
    ship_valkyrie_desc: 'Disparo Duplo • Magnetismo Extremo',

    // Fleet Upgrades
    perm_hull: 'Blindagem de Titânio Reforçada',
    perm_hull_desc: '+15 HP por nível',
    perm_thruster: 'Injetor de Plasma Sub-Luz',
    perm_thruster_desc: '+10% Velocidade por nível',
    perm_weapons: 'Overclock de Reator de Táquions',
    perm_weapons_desc: '+12% Dano por nível',
    perm_magnet: 'Vórtice Coletor Gravitacional',
    perm_magnet_desc: '+20% Raio Magnético por nível',
    perm_nanotech: 'Matriz Nanotec de Auto-Reparo',
    perm_nanotech_desc: '+0.8 HP/s Regeneração por nível'
  }
};

class I18nManager {
  constructor() {
    this.currentLocale = this.detectLocale();
  }

  detectLocale() {
    // 1. Verifica preferência salva
    try {
      const saved = localStorage.getItem('astral_survivor_locale');
      if (saved && (saved === 'en' || saved === 'pt')) return saved;
    } catch (e) {}

    // 2. Detecção automática do navegador: Se for português ('pt', 'pt-BR'), adota 'pt'; caso contrário 'en' (default)
    const browserLang = (typeof navigator !== 'undefined' ? (navigator.language || navigator.userLanguage || '') : '').toLowerCase();
    if (browserLang.startsWith('pt')) {
      return 'pt';
    }
    return 'en'; // Inglês como padrão comercial CrazyGames
  }

  setLocale(locale) {
    if (locale !== 'en' && locale !== 'pt') locale = 'en';
    this.currentLocale = locale;
    try {
      localStorage.setItem('astral_survivor_locale', locale);
    } catch (e) {}
    this.updateDom();
  }

  toggleLocale() {
    const next = this.currentLocale === 'en' ? 'pt' : 'en';
    this.setLocale(next);
    return next;
  }

  t(key, fallback = '') {
    const dict = TRANSLATIONS[this.currentLocale] || TRANSLATIONS.en;
    if (dict[key] !== undefined) return dict[key];
    const enDict = TRANSLATIONS.en;
    if (enDict[key] !== undefined) return enDict[key];
    return fallback || key;
  }

  updateDom() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key) {
        el.textContent = this.t(key, el.textContent);
      }
    });

    const langBtn = document.getElementById('btn-lang-toggle');
    if (langBtn) {
      langBtn.textContent = this.currentLocale === 'en' ? '🌐 EN' : '🌐 PT';
    }
  }
}

export const i18n = new I18nManager();
