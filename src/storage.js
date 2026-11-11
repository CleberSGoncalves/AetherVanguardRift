// src/storage.js
// Sistema de Salvamento Versionado e Meta-Game Persistente

const STORAGE_KEY = 'astraea_survivor_save_v1';

const DEFAULT_SAVE = {
  version: 1,
  coins: 50,
  highScoreTime: 0,
  totalKills: 0,
  selectedShip: 'astraea',
  unlockedShips: ['astraea'],
  upgrades: {
    hull: 0,      // +15 Max HP per level (max 5)
    thruster: 0,  // +10% Speed per level (max 5)
    weapons: 0,   // +12% Damage per level (max 5)
    magnet: 0,    // +20% Magnet radius per level (max 5)
    nanotech: 0   // +0.8 HP/s regen per level (max 5)
  },
  // Setor atual liberado (1 a 16)
  unlockedSector: 1,
  // Estrelas por setor: { 1: 3, 2: 2, ... }
  sectorStars: {},
  // Recompensa Diária (7 dias)
  dailyLogin: {
    lastClaimDate: null,
    currentDay: 0, // 0 a 6
    claimedDays: []
  },
  // Missões Diárias
  quests: [
    { id: 'kills_50', title: 'Abater 50 Entidades', target: 50, current: 0, reward: 80, completed: false, claimed: false },
    { id: 'crystals_120', title: 'Coletar 120 Cristais', target: 120, current: 0, reward: 100, completed: false, claimed: false },
    { id: 'survive_90s', title: 'Sobreviver 90 Segundos', target: 90, current: 0, reward: 120, completed: false, claimed: false },
    { id: 'reach_lvl5', title: 'Alcançar Nível 5 de Poder', target: 5, current: 0, reward: 150, completed: false, claimed: false }
  ],
  // Roleta Quântica (Lucky Spin)
  lastSpinTimestamp: 0,
  soundMuted: false,
  locale: 'auto'
};

class StorageManager {
  constructor() {
    this.data = this.load();
    this.checkDailyReset();
  }

  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return JSON.parse(JSON.stringify(DEFAULT_SAVE));
      const parsed = JSON.parse(raw);
      // Mescla com defaults para garantir retrocompatibilidade
      return {
        ...DEFAULT_SAVE,
        ...parsed,
        upgrades: { ...DEFAULT_SAVE.upgrades, ...(parsed.upgrades || {}) },
        dailyLogin: { ...DEFAULT_SAVE.dailyLogin, ...(parsed.dailyLogin || {}) },
        quests: Array.isArray(parsed.quests) && parsed.quests.length === DEFAULT_SAVE.quests.length
          ? parsed.quests
          : DEFAULT_SAVE.quests
      };
    } catch (e) {
      console.warn('[Storage] Erro ao carregar save; recuperando defaults:', e);
      return JSON.parse(JSON.stringify(DEFAULT_SAVE));
    }
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.error('[Storage] Falha ao persistir save:', e);
    }
  }

  get(key) {
    return this.data[key];
  }

  set(key, value) {
    this.data[key] = value;
    this.save();
  }

  addCoins(amount) {
    this.data.coins = Math.max(0, (this.data.coins || 0) + amount);
    this.save();
    return this.data.coins;
  }

  // Registra estrelas e desbloqueia próximo setor
  recordSectorCompletion(sectorId, stars) {
    const prevStars = this.data.sectorStars[sectorId] || 0;
    if (stars > prevStars) {
      this.data.sectorStars[sectorId] = stars;
    }
    if (stars >= 1 && sectorId >= this.data.unlockedSector) {
      this.data.unlockedSector = Math.min(16, sectorId + 1);
    }
    this.save();
  }

  getTotalStars() {
    return Object.values(this.data.sectorStars || {}).reduce((acc, s) => acc + s, 0);
  }

  // Progresso de Missões
  updateQuestProgress(type, amount) {
    let changed = false;
    this.data.quests.forEach(q => {
      if (q.completed) return;
      if (type === 'kills' && q.id === 'kills_50') {
        q.current = Math.min(q.target, q.current + amount);
        if (q.current >= q.target) q.completed = true;
        changed = true;
      } else if (type === 'crystals' && q.id === 'crystals_120') {
        q.current = Math.min(q.target, q.current + amount);
        if (q.current >= q.target) q.completed = true;
        changed = true;
      } else if (type === 'time' && q.id === 'survive_90s') {
        if (amount >= q.target) {
          q.current = q.target;
          q.completed = true;
          changed = true;
        } else if (amount > q.current) {
          q.current = Math.floor(amount);
          changed = true;
        }
      } else if (type === 'level' && q.id === 'reach_lvl5') {
        if (amount >= q.target) {
          q.current = q.target;
          q.completed = true;
          changed = true;
        } else if (amount > q.current) {
          q.current = amount;
          changed = true;
        }
      }
    });
    if (changed) this.save();
  }

  claimQuest(questId, multiplier = 1) {
    const q = this.data.quests.find(item => item.id === questId);
    if (q && q.completed && !q.claimed) {
      q.claimed = true;
      const reward = q.reward * multiplier;
      this.addCoins(reward);
      this.save();
      return reward;
    }
    return 0;
  }

  // Calendário Diário
  checkDailyReset() {
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    const lastClaim = this.data.dailyLogin.lastClaimDate;

    if (!lastClaim) {
      // Primeiro dia de login
      return;
    }

    if (lastClaim !== todayStr) {
      const lastDate = new Date(lastClaim);
      const diffDays = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        // Dia consecutivo: avança se não passou de 6
        if (this.data.dailyLogin.currentDay < 6) {
          this.data.dailyLogin.currentDay += 1;
        } else {
          this.data.dailyLogin.currentDay = 0; // Reinicia ciclo de 7 dias
          this.data.dailyLogin.claimedDays = [];
        }
      } else if (diffDays > 1) {
        // Quebrou sequência: reinicia para o dia 0
        this.data.dailyLogin.currentDay = 0;
        this.data.dailyLogin.claimedDays = [];
      }
      this.save();
    }
  }

  isDailyClaimable() {
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    return this.data.dailyLogin.lastClaimDate !== todayStr;
  }

  claimDailyReward(multiplier = 1) {
    if (!this.isDailyClaimable()) return null;
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    const day = this.data.dailyLogin.currentDay;
    const rewards = [50, 80, 120, 160, 200, 250, 400];
    const baseReward = rewards[day] || 50;
    const finalReward = baseReward * multiplier;

    this.data.dailyLogin.lastClaimDate = todayStr;
    if (!this.data.dailyLogin.claimedDays.includes(day)) {
      this.data.dailyLogin.claimedDays.push(day);
    }
    this.addCoins(finalReward);
    this.save();
    return { day: day + 1, reward: finalReward };
  }

  // Roleta Quântica (Spin)
  isSpinAvailable() {
    const cooldownMs = 12 * 60 * 60 * 1000; // 12 horas
    const now = Date.now();
    return now - (this.data.lastSpinTimestamp || 0) >= cooldownMs;
  }

  getTimeUntilSpin() {
    const cooldownMs = 12 * 60 * 60 * 1000;
    const now = Date.now();
    const remaining = cooldownMs - (now - (this.data.lastSpinTimestamp || 0));
    return Math.max(0, remaining);
  }

  recordSpin() {
    this.data.lastSpinTimestamp = Date.now();
    this.save();
  }
}

export const storage = new StorageManager();
