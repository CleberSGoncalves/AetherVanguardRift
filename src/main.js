// src/main.js
// Orquestrador Principal do Jogo: Intro FluidCleb, Lore, Modais, CrazyGames SDK v3 e Meta-Game
import { SurvivorGame } from './game.js';
import { sound } from './audio.js';
import { storage } from './storage.js';
import { i18n } from './i18n.js';
import { crazyGames } from './crazygames.js';
import { modalController } from './modal_controller.js';
import { SECTORS } from './sectors.js';

// Safe DOM Helper — Previne Exceções Fatais de TypeError: null.textContent
function safeSetText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

window.addEventListener('DOMContentLoaded', async () => {
  i18n.updateDom();
  const canvas = document.getElementById('game-canvas');
  const introCanvas = document.getElementById('intro-canvas');
  const damageFlash = document.getElementById('damage-flash');
  const bossBanner = document.getElementById('boss-banner');
  const bossBannerName = document.getElementById('boss-banner-name');

  // Elementos do Top HUD
  const hudLevel = document.getElementById('hud-level');
  const hudKills = document.getElementById('hud-kills');
  const hudCoins = document.getElementById('hud-coins');
  const hudSectorTitle = document.getElementById('hud-sector-title');
  const hudTimer = document.getElementById('hud-timer');
  const hudTargetTimer = document.getElementById('hud-target-timer');
  const hudXpFill = document.getElementById('hud-xp-fill');
  const hudXpText = document.getElementById('hud-xp-text');
  const hudHp = document.getElementById('hud-hp');
  const hudMaxHp = document.getElementById('hud-max-hp');
  const btnEarlyFinish = document.getElementById('btn-early-finish');
  const star1Icon = document.getElementById('star-1');
  const star2Icon = document.getElementById('star-2');
  const star3Icon = document.getElementById('star-3');

  // Botões de Áudio e Pausa
  const btnSound = document.getElementById('btn-sound-toggle');
  const btnLang = document.getElementById('btn-lang-toggle');
  const btnPause = document.getElementById('btn-pause');

  // Atalhos Rápidos (Desktop)
  const btnQuickSectors = document.getElementById('btn-quick-sectors');
  const btnQuickShop = document.getElementById('btn-quick-shop');
  const btnQuickQuests = document.getElementById('btn-quick-quests');
  const btnQuickDaily = document.getElementById('btn-quick-daily');
  const btnQuickSpin = document.getElementById('btn-quick-spin');

  // Botões Mobile Dock
  const btnMobileSectors = document.getElementById('btn-mobile-sectors');
  const btnMobileShop = document.getElementById('btn-mobile-shop');
  const dpadUp = document.getElementById('dpad-up');
  const dpadDown = document.getElementById('dpad-down');
  const dpadLeft = document.getElementById('dpad-left');
  const dpadRight = document.getElementById('dpad-right');

  // Modais
  const upgradeCardsContainer = document.getElementById('upgrade-cards-container');
  const pauseTimer = document.getElementById('pause-timer');
  const pauseKills = document.getElementById('pause-kills');
  const pauseLevel = document.getElementById('pause-level');
  const btnResume = document.getElementById('btn-resume');
  const btnRestartPause = document.getElementById('btn-restart-pause');
  const btnPauseSectors = document.getElementById('btn-pause-sectors');
  const btnPauseShop = document.getElementById('btn-pause-shop');

  // Vitória
  const victoryStars = document.getElementById('victory-stars');
  const vicTime = document.getElementById('vic-time');
  const vicKills = document.getElementById('vic-kills');
  const vicReward = document.getElementById('vic-reward');
  const btnVictoryNext = document.getElementById('btn-victory-next');
  const btnVictoryDouble = document.getElementById('btn-victory-double-coins');
  const btnVictorySectors = document.getElementById('btn-victory-sectors');

  // Game Over
  const goTime = document.getElementById('go-time');
  const goKills = document.getElementById('go-kills');
  const goLevel = document.getElementById('go-level');
  const btnRevive = document.getElementById('btn-revive');
  const btnRestart = document.getElementById('btn-restart');
  const btnGameoverShop = document.getElementById('btn-gameover-shop');
  const btnGameoverSectors = document.getElementById('btn-gameover-sectors');

  // Seletor de Fases
  const sectorsGridContainer = document.getElementById('sectors-grid-container');
  const btnCloseSectors = document.getElementById('btn-close-sectors');
  const pillShop = document.getElementById('pill-shop');
  const pillQuests = document.getElementById('pill-quests');
  const pillDaily = document.getElementById('pill-daily');
  const pillSpin = document.getElementById('pill-spin');

  // Hangar / Loja
  const shopCoinsDisplay = document.getElementById('shop-coins-display');
  const shipsGridContainer = document.getElementById('ships-grid-container');
  const permanentUpgradesContainer = document.getElementById('permanent-upgrades-container');
  const btnCloseShop = document.getElementById('btn-close-shop');

  // Missões
  const questsListContainer = document.getElementById('quests-list-container');
  const btnCloseQuests = document.getElementById('btn-close-quests');

  // Recompensa Diária
  const dailyCalendarContainer = document.getElementById('daily-calendar-container');
  const btnClaimDaily = document.getElementById('btn-claim-daily');
  const btnClaimDailyDouble = document.getElementById('btn-claim-daily-double');
  const btnCloseDaily = document.getElementById('btn-close-daily');

  // Roleta Quântica
  const wheelCanvas = document.getElementById('wheel-canvas');
  const spinStatusText = document.getElementById('spin-status-text');
  const btnDoSpin = document.getElementById('btn-do-spin');
  const btnAdSpin = document.getElementById('btn-ad-spin');
  const btnCloseSpin = document.getElementById('btn-close-spin');

  // Lore / Intro
  const btnLoreStart = document.getElementById('btn-lore-start');
  const btnLoreSkip = document.getElementById('btn-lore-skip');

  let currentVictoryData = null;

  // Interface do Usuário Integrada ao Game Loop
  const ui = {
    update(stats) {
      safeSetText('hud-level', stats.level);
      safeSetText('hud-kills', stats.kills);
      safeSetText('hud-coins', storage.get('coins') || 0);
      safeSetText('hud-sector-title', stats.sectorTitle);
      safeSetText('hud-timer', stats.timer);
      safeSetText('hud-target-timer', stats.targetTimer);
      safeSetText('hud-hp', stats.hp);
      safeSetText('hud-max-hp', stats.maxHp);

      if (hudXpFill) hudXpFill.style.width = `${stats.xpPercent}%`;
      safeSetText('hud-xp-text', `${stats.xpPercent}%`);

      // Atualização das Estrelas no Top HUD
      if (star1Icon) star1Icon.classList.toggle('achieved', stats.starsEarned >= 1);
      if (star2Icon) star2Icon.classList.toggle('achieved', stats.starsEarned >= 2);
      if (star3Icon) star3Icon.classList.toggle('achieved', stats.starsEarned >= 3);
    },

    flashDamage() {
      if (!damageFlash) return;
      damageFlash.classList.remove('hidden');
      damageFlash.style.opacity = '1';
      setTimeout(() => {
        damageFlash.style.opacity = '0';
        setTimeout(() => damageFlash.classList.add('hidden'), 100);
      }, 100);
    },

    showBossBanner(bossName) {
      if (!bossBanner) return;
      safeSetText('boss-banner-name', bossName);
      bossBanner.classList.remove('hidden');
      setTimeout(() => {
        bossBanner.classList.add('hidden');
      }, 4200);
    },

    showEarlyFinishButton() {
      if (btnEarlyFinish) {
        btnEarlyFinish.classList.remove('hidden');
      }
    },

    hideEarlyFinishButton() {
      if (btnEarlyFinish) {
        btnEarlyFinish.classList.add('hidden');
      }
    },

    showLevelUp(choices, onSelect) {
      if (!upgradeCardsContainer) return;
      upgradeCardsContainer.innerHTML = '';
      choices.forEach(ch => {
        const card = document.createElement('div');
        card.className = 'upgrade-card';
        card.innerHTML = `
          <div class="upgrade-icon">${ch.icon}</div>
          <div class="upgrade-info">
            <div class="upgrade-name">${ch.name}</div>
            <div class="upgrade-desc">${ch.desc}</div>
          </div>
        `;
        card.onclick = () => onSelect(ch);
        upgradeCardsContainer.appendChild(card);
      });
      modalController.openModal('modal-levelup');
    },

    hideLevelUp() {
      modalController.closeModal('modal-levelup');
    },

    showVictory(data) {
      currentVictoryData = data;
      this.hideEarlyFinishButton();
      safeSetText('victory-title', `VITÓRIA: ${data.sectorName.toUpperCase()}`);
      safeSetText('vic-time', data.time);
      safeSetText('vic-kills', data.kills);
      safeSetText('vic-reward', `+${data.rewardCoins} 💎`);

      if (victoryStars) {
        const starsSpans = victoryStars.querySelectorAll('.v-star');
        starsSpans.forEach((s, idx) => {
          s.classList.toggle('earned', idx < data.stars);
        });
      }

      modalController.openModal('modal-victory');
      crazyGames.requestMidgameAd();
    },

    showGameOver(stats) {
      this.hideEarlyFinishButton();
      safeSetText('go-time', stats.time);
      safeSetText('go-kills', stats.kills);
      safeSetText('go-level', stats.level);
      modalController.openModal('modal-gameover');
      crazyGames.requestMidgameAd();
    }
  };

  const game = new SurvivorGame(canvas, ui);
  modalController.setGame(game);

  // Inicialização do CrazyGames SDK v3
  await crazyGames.init();

  // D-Pad Touch Listeners
  const bindDpadButton = (btn, x, y) => {
    if (!btn) return;
    const start = (e) => {
      e.preventDefault();
      game.setDpadInput(x, y);
    };
    const end = (e) => {
      e.preventDefault();
      game.setDpadInput(0, 0);
    };
    btn.addEventListener('touchstart', start, { passive: false });
    btn.addEventListener('touchend', end);
    btn.addEventListener('mousedown', start);
    btn.addEventListener('mouseup', end);
  };
  bindDpadButton(dpadUp, 0, -1);
  bindDpadButton(dpadDown, 0, 1);
  bindDpadButton(dpadLeft, -1, 0);
  bindDpadButton(dpadRight, 1, 0);

  // Botão Concluir Fase Cedo (★ Aprovada)
  if (btnEarlyFinish) {
    btnEarlyFinish.addEventListener('click', () => {
      sound.playClick();
      game.winSector();
    });
  }

  // Controle de Áudio
  btnSound.addEventListener('click', () => {
    const muted = !sound.isMuted;
    sound.setMuted(muted);
    btnSound.textContent = muted ? '🔇' : '🔊';
  });

  // Seletor de Idioma
  if (btnLang) {
    btnLang.addEventListener('click', () => {
      i18n.toggleLocale();
      sound.playClick();
      game.updateHUD();
    });
  }

  // Botão de Pausa
  btnPause.addEventListener('click', () => {
    safeSetText('pause-timer', hudTimer ? hudTimer.textContent : '00:00');
    safeSetText('pause-kills', hudKills ? hudKills.textContent : '0');
    safeSetText('pause-level', hudLevel ? hudLevel.textContent : '1');
    modalController.openModal('modal-pause');
  });

  btnResume.addEventListener('click', () => {
    sound.playClick();
    modalController.closeModal('modal-pause');
  });

  btnRestartPause.addEventListener('click', () => {
    sound.playClick();
    modalController.closeModal('modal-pause');
    game.loadSector(game.currentSectorId);
    crazyGames.gameplayStart();
  });

  // Rewarded Video: Reviver com Escudo de 3.5s
  btnRevive.addEventListener('click', () => {
    sound.playClick();
    crazyGames.requestRewardedAd({
      onReward: () => {
        modalController.closeModal('modal-gameover');
        game.revive();
        crazyGames.gameplayStart();
      },
      onError: (err) => {
        console.warn('[CrazyGames] Rewarded Ad bloqueado ou falhou:', err);
      }
    });
  });

  btnRestart.addEventListener('click', () => {
    sound.playClick();
    modalController.closeModal('modal-gameover');
    game.loadSector(game.currentSectorId);
    crazyGames.gameplayStart();
  });

  // Vitória: Avançar ou Dobrar
  btnVictoryNext.addEventListener('click', () => {
    sound.playClick();
    modalController.closeModal('modal-victory');
    const nextSector = Math.min(16, game.currentSectorId + 1);
    game.loadSector(nextSector);
    crazyGames.gameplayStart();
  });

  btnVictoryDouble.addEventListener('click', () => {
    sound.playClick();
    if (!currentVictoryData) return;
    crazyGames.requestRewardedAd({
      onReward: () => {
        const bonus = currentVictoryData.rewardCoins;
        storage.addCoins(bonus);
        safeSetText('vic-reward', `+${bonus * 2} 💎 (DOBRADO!)`);
        btnVictoryDouble.style.display = 'none';
        sound.playLevelUp();
      }
    });
  });

  btnVictorySectors.addEventListener('click', () => {
    sound.playClick();
    modalController.closeModal('modal-victory');
    openSectorsModal();
  });

  // Modal de Fases / Setores
  const openSectorsModal = () => {
    if (!sectorsGridContainer) return;
    sectorsGridContainer.innerHTML = '';

    const unlocked = storage.get('unlockedSector') || 1;
    const starsMap = storage.get('sectorStars') || {};

    SECTORS.forEach(sec => {
      const isUnlocked = sec.id <= unlocked;
      const stars = starsMap[sec.id] || 0;
      const card = document.createElement('div');
      card.className = `sector-card ${isUnlocked ? 'unlocked' : 'locked'}`;
      card.innerHTML = `
        <div class="sector-card-num">FASE ${sec.id}</div>
        <div class="sector-card-name">${sec.name}</div>
        <div class="sector-card-stars">${isUnlocked ? '★'.repeat(stars) + '☆'.repeat(3 - stars) : '🔒 BLOQUEADO'}</div>
      `;

      if (isUnlocked) {
        card.onclick = () => {
          sound.playClick();
          modalController.closeModal('modal-sectors');
          game.loadSector(sec.id);
          crazyGames.gameplayStart();
        };
      }
      sectorsGridContainer.appendChild(card);
    });

    modalController.openModal('modal-sectors');
  };

  btnQuickSectors.addEventListener('click', openSectorsModal);
  if (btnMobileSectors) btnMobileSectors.addEventListener('click', openSectorsModal);
  btnPauseSectors.addEventListener('click', openSectorsModal);
  btnGameoverSectors.addEventListener('click', openSectorsModal);
  btnCloseSectors.addEventListener('click', () => {
    sound.playClick();
    modalController.closeModal('modal-sectors');
  });

  // Modal de Hangar / Loja de Naves
  const openShopModal = () => {
    safeSetText('shop-coins-display', storage.get('coins') || 0);

    // Lista de Naves
    if (shipsGridContainer) {
      shipsGridContainer.innerHTML = '';
      const ships = [
        { id: 'astraea', name: 'Astraea Vanguard', desc: 'Equilibrada • Blaster Quântico', cost: 0 },
        { id: 'chrono_striker', name: 'Chrono Striker', desc: '+70 Vel • Pulso Táquion', cost: 200 },
        { id: 'void_aegis', name: 'Void Aegis', desc: '+60 HP • Feixe de Plasma', cost: 350 },
        { id: 'valkyrie', name: 'Valkyrie Solar', desc: 'Disparo Duplo • Super Ímã', cost: 500 }
      ];

      const unlockedShips = storage.get('unlockedShips') || ['astraea'];
      const selectedShip = storage.get('selectedShip') || 'astraea';

      ships.forEach(s => {
        const isUnlocked = unlockedShips.includes(s.id);
        const isSelected = selectedShip === s.id;
        const card = document.createElement('div');
        card.className = `ship-card ${isSelected ? 'selected' : ''}`;
        card.innerHTML = `
          <div class="ship-card-title">${s.name}</div>
          <div class="ship-card-desc">${s.desc}</div>
          <button class="upgrade-buy-btn ${isSelected ? 'maxed' : ''}">
            ${isSelected ? 'SELECIONADA' : (isUnlocked ? 'EQUIPAR' : `${s.cost} 💎`)}
          </button>
        `;

        const btn = card.querySelector('button');
        btn.onclick = () => {
          sound.playClick();
          if (isSelected) return;
          if (isUnlocked) {
            storage.set('selectedShip', s.id);
            openShopModal();
          } else {
            const coins = storage.get('coins') || 0;
            if (coins >= s.cost) {
              storage.addCoins(-s.cost);
              unlockedShips.push(s.id);
              storage.set('unlockedShips', unlockedShips);
              storage.set('selectedShip', s.id);
              sound.playUpgradeSelect();
              openShopModal();
            }
          }
        };

        shipsGridContainer.appendChild(card);
      });
    }

    // Melhorias Permanentes
    if (permanentUpgradesContainer) {
      permanentUpgradesContainer.innerHTML = '';
      const upDefs = [
        { key: 'hull', name: 'Blindagem Reforçada do Casco', desc: '+15 HP por nível', baseCost: 60 },
        { key: 'thruster', name: 'Injetor de Plasma Sub-Luz', desc: '+10% Velocidade por nível', baseCost: 75 },
        { key: 'weapons', name: 'Overclock de Reator de Táquions', desc: '+12% Dano por nível', baseCost: 90 },
        { key: 'magnet', name: 'Vórtice Coletor Gravitacional', desc: '+20% Raio Magnético por nível', baseCost: 50 },
        { key: 'nanotech', name: 'Módulos Nanotec de Auto-Reparo', desc: '+0.8 HP/s Regeneração por nível', baseCost: 120 }
      ];

      const currentUps = storage.get('upgrades') || {};

      upDefs.forEach(def => {
        const lvl = currentUps[def.key] || 0;
        const isMax = lvl >= 5;
        const cost = Math.round(def.baseCost * Math.pow(1.5, lvl));

        const row = document.createElement('div');
        row.className = 'upgrade-row';
        row.innerHTML = `
          <div class="upgrade-row-info">
            <div class="upgrade-row-name">${def.name}</div>
            <div class="upgrade-row-level">Nível ${lvl}/5 • ${def.desc}</div>
          </div>
          <button class="upgrade-buy-btn ${isMax ? 'maxed' : ''}">
            ${isMax ? 'MÁXIMO' : `${cost} 💎`}
          </button>
        `;

        const btn = row.querySelector('button');
        if (!isMax) {
          btn.onclick = () => {
            sound.playClick();
            const coins = storage.get('coins') || 0;
            if (coins >= cost) {
              storage.addCoins(-cost);
              currentUps[def.key] = lvl + 1;
              storage.set('upgrades', currentUps);
              sound.playUpgradeSelect();
              openShopModal();
            }
          };
        }

        permanentUpgradesContainer.appendChild(row);
      });
    }

    modalController.openModal('modal-shop');
  };

  btnQuickShop.addEventListener('click', openShopModal);
  if (btnMobileShop) btnMobileShop.addEventListener('click', openShopModal);
  btnPauseShop.addEventListener('click', openShopModal);
  btnGameoverShop.addEventListener('click', openShopModal);
  btnCloseShop.addEventListener('click', () => {
    sound.playClick();
    modalController.closeModal('modal-shop');
  });

  // Pills Rápidos dentro do modal de fases
  pillShop.addEventListener('click', () => {
    modalController.closeModal('modal-sectors');
    openShopModal();
  });
  pillQuests.addEventListener('click', () => {
    modalController.closeModal('modal-sectors');
    openQuestsModal();
  });
  pillDaily.addEventListener('click', () => {
    modalController.closeModal('modal-sectors');
    openDailyModal();
  });
  pillSpin.addEventListener('click', () => {
    modalController.closeModal('modal-sectors');
    openSpinModal();
  });

  // Modal de Missões
  const openQuestsModal = () => {
    if (!questsListContainer) return;
    questsListContainer.innerHTML = '';
    const quests = storage.get('quests') || [];

    quests.forEach(q => {
      const item = document.createElement('div');
      item.className = 'quest-item';
      item.innerHTML = `
        <div class="quest-info">
          <div class="quest-title">${q.title}</div>
          <div class="quest-progress-text">Progresso: ${q.current}/${q.target} • Recompensa: ${q.reward} 💎</div>
        </div>
        <button class="quest-claim-btn ${q.claimed ? 'maxed' : ''}" ${q.claimed || !q.completed ? 'disabled' : ''}>
          ${q.claimed ? 'RESGATADO' : (q.completed ? 'COLETAR' : 'EM ANDAMENTO')}
        </button>
      `;

      const btn = item.querySelector('button');
      if (q.completed && !q.claimed) {
        btn.onclick = () => {
          sound.playClick();
          const earned = storage.claimQuest(q.id);
          sound.playLevelUp();
          openQuestsModal();
        };
      }

      questsListContainer.appendChild(item);
    });

    modalController.openModal('modal-quests');
  };

  btnQuickQuests.addEventListener('click', openQuestsModal);
  btnCloseQuests.addEventListener('click', () => {
    sound.playClick();
    modalController.closeModal('modal-quests');
  });

  // Modal de Recompensa Diária (7 Dias)
  const openDailyModal = () => {
    if (!dailyCalendarContainer) return;
    dailyCalendarContainer.innerHTML = '';
    const daily = storage.get('dailyLogin') || { currentDay: 0, claimedDays: [] };
    const rewards = [50, 80, 120, 160, 200, 250, 400];

    rewards.forEach((rew, idx) => {
      const isClaimed = daily.claimedDays.includes(idx);
      const isCurrent = daily.currentDay === idx;
      const card = document.createElement('div');
      card.className = `daily-day-card ${isCurrent ? 'active' : ''} ${isClaimed ? 'claimed' : ''}`;
      card.innerHTML = `
        <div class="daily-day-num">DIA ${idx + 1}</div>
        <div class="daily-day-reward">+${rew} 💎</div>
      `;
      dailyCalendarContainer.appendChild(card);
    });

    const canClaim = storage.isDailyClaimable();
    if (btnClaimDaily) btnClaimDaily.disabled = !canClaim;
    if (btnClaimDailyDouble) btnClaimDailyDouble.disabled = !canClaim;

    modalController.openModal('modal-daily');
  };

  btnQuickDaily.addEventListener('click', openDailyModal);
  btnCloseDaily.addEventListener('click', () => {
    sound.playClick();
    modalController.closeModal('modal-daily');
  });

  if (btnClaimDaily) {
    btnClaimDaily.addEventListener('click', () => {
      sound.playClick();
      const res = storage.claimDailyReward(1);
      if (res) {
        sound.playLevelUp();
        openDailyModal();
      }
    });
  }

  if (btnClaimDailyDouble) {
    btnClaimDailyDouble.addEventListener('click', () => {
      sound.playClick();
      crazyGames.requestRewardedAd({
        onReward: () => {
          const res = storage.claimDailyReward(2);
          if (res) {
            sound.playLevelUp();
            openDailyModal();
          }
        }
      });
    });
  }

  // Modal de Roleta Quântica (Lucky Spin)
  let wheelAngle = 0;
  let isSpinning = false;
  const wheelSlices = [
    { label: '50 💎', reward: 50 },
    { label: '100 💎', reward: 100 },
    { label: '75 💎', reward: 75 },
    { label: '250 💎', reward: 250 },
    { label: '80 💎', reward: 80 },
    { label: '500 💎', reward: 500 },
    { label: '60 💎', reward: 60 },
    { label: '150 💎', reward: 150 }
  ];

  const drawWheel = () => {
    if (!wheelCanvas) return;
    const ctx = wheelCanvas.getContext('2d');
    const cx = 140, cy = 140, radius = 130;
    const sliceAngle = (Math.PI * 2) / wheelSlices.length;

    ctx.clearRect(0, 0, 280, 280);
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(wheelAngle);

    wheelSlices.forEach((slice, i) => {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, i * sliceAngle, (i + 1) * sliceAngle);
      ctx.fillStyle = i % 2 === 0 ? '#0f172a' : '#1e293b';
      ctx.fill();
      ctx.strokeStyle = '#00f5ff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.save();
      ctx.rotate(i * sliceAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 12px Orbitron, monospace';
      ctx.fillText(slice.label, radius - 15, 5);
      ctx.restore();
    });

    ctx.restore();
  };

  const spinWheel = (onFinish) => {
    if (isSpinning) return;
    isSpinning = true;
    const targetSlice = Math.floor(Math.random() * wheelSlices.length);
    const sliceAngle = (Math.PI * 2) / wheelSlices.length;
    // O ponteiro aponta para o topo (-Math.PI / 2)
    const targetAngle = (Math.PI * 2 * 5) + (Math.PI * 1.5 - (targetSlice * sliceAngle + sliceAngle / 2));
    const startAngle = wheelAngle;
    const duration = 3200;
    const startTime = performance.now();

    const anim = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Easing out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      wheelAngle = startAngle + (targetAngle - startAngle) * ease;
      drawWheel();

      if (Math.floor(elapsed / 120) !== Math.floor((elapsed - 16) / 120)) {
        sound.playSpinTick();
      }

      if (progress < 1) {
        requestAnimationFrame(anim);
      } else {
        isSpinning = false;
        const reward = wheelSlices[targetSlice].reward;
        storage.addCoins(reward);
        storage.recordSpin();
        sound.playLevelUp();
        if (onFinish) onFinish(reward);
      }
    };
    requestAnimationFrame(anim);
  };

  const openSpinModal = () => {
    drawWheel();
    const canSpin = storage.isSpinAvailable();
    if (spinStatusText) {
      spinStatusText.textContent = canSpin
        ? 'Giro Grátis Disponível!'
        : `Aguarde a recarga ou gire com anúncio!`;
    }
    if (btnDoSpin) btnDoSpin.disabled = !canSpin;
    modalController.openModal('modal-spin');
  };

  btnQuickSpin.addEventListener('click', openSpinModal);
  btnCloseSpin.addEventListener('click', () => {
    sound.playClick();
    modalController.closeModal('modal-spin');
  });

  if (btnDoSpin) {
    btnDoSpin.addEventListener('click', () => {
      sound.playClick();
      btnDoSpin.disabled = true;
      spinWheel((reward) => {
        if (spinStatusText) spinStatusText.textContent = `Você ganhou +${reward} 💎 Cristais!`;
      });
    });
  }

  if (btnAdSpin) {
    btnAdSpin.addEventListener('click', () => {
      sound.playClick();
      crazyGames.requestRewardedAd({
        onReward: () => {
          spinWheel((reward) => {
            if (spinStatusText) spinStatusText.textContent = `BÔNUS ANÚNCIO: +${reward} 💎 Cristais!`;
          });
        }
      });
    });
  }

  // Lore / Início da Ação
  const startGameplayFromLore = () => {
    sound.init();
    sound.playClick();
    modalController.closeModal('modal-lore');
    game.start(1);
    crazyGames.gameplayStart();
  };

  if (btnLoreStart) btnLoreStart.addEventListener('click', startGameplayFromLore);
  if (btnLoreSkip) btnLoreSkip.addEventListener('click', startGameplayFromLore);

  // INTRO PROCEDURAL FLUIDCLEB INTERACTIVE (0.0s a 2.8s com Pulo Imediato)
  let introCompleted = false;

  const proceedToGameplay = () => {
    if (introCompleted) return;
    introCompleted = true;
    if (introCanvas) {
      introCanvas.style.opacity = '0';
      setTimeout(() => {
        introCanvas.classList.add('hidden');
      }, 250);
    }
    // Abre a Lore Inicial dinâmica com botão Pular Imediato
    modalController.openModal('modal-lore');
  };

  const runFluidClebIntro = () => {
    if (!introCanvas) {
      proceedToGameplay();
      return;
    }

    const ctx = introCanvas.getContext('2d');
    const w = window.innerWidth;
    const h = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;
    introCanvas.width = w * dpr;
    introCanvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const instantSkip = () => {
      sound.init();
      proceedToGameplay();
    };

    introCanvas.addEventListener('click', instantSkip, { once: true });
    introCanvas.addEventListener('touchstart', instantSkip, { passive: true, once: true });
    window.addEventListener('keydown', instantSkip, { once: true });

    try {
      sound.playFluidClebIntro();
    } catch (e) {}

    const startTime = performance.now();
    const duration = 2800; // Duração: até 2.8s

    const orbs = [];
    for (let i = 0; i < 24; i++) {
      orbs.push({
        x: w / 2 + (Math.random() - 0.5) * 260,
        y: h + Math.random() * 60,
        targetY: h / 2 - 25,
        radius: 3 + Math.random() * 7,
        color: ['#00f5ff', '#38bdf8', '#0284c7'][Math.floor(Math.random() * 3)],
        alpha: 0.8
      });
    }

    const animateIntro = (now) => {
      if (introCompleted) return;
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);

      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, w, h);

      // Orbes ascendentes em convergência
      orbs.forEach(orb => {
        orb.y += (orb.targetY - orb.y) * 0.08;
        ctx.save();
        ctx.globalAlpha = Math.min(1, (1 - progress) * 1.5);
        ctx.fillStyle = orb.color;
        ctx.shadowColor = orb.color;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Emblema Central e Logo
      const logoAlpha = Math.min(1, progress * 1.8);
      ctx.save();
      ctx.globalAlpha = logoAlpha;
      ctx.translate(w / 2, h / 2 - 25);

      // Gota metálica central e anel cósmico
      ctx.fillStyle = '#0284c7';
      ctx.shadowColor = '#00f5ff';
      ctx.shadowBlur = 22;
      ctx.beginPath();
      ctx.arc(0, -32, 20, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.arc(0, -32, 9, 0, Math.PI * 2);
      ctx.fill();

      ctx.textAlign = 'center';
      ctx.fillStyle = '#00f5ff';
      ctx.font = '900 36px Orbitron, sans-serif';
      ctx.fillText('FLUIDCLEB', 0, 24);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '700 13px Orbitron, sans-serif';
      ctx.letterSpacing = '5px';
      ctx.fillText('I N T E R A C T I V E', 0, 46);
      ctx.restore();

      // Barra de progresso sutil
      const barW = Math.min(240, w * 0.65);
      const barH = 3;
      const barX = (w - barW) / 2;
      const barY = h * 0.72;

      ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
      ctx.fillRect(barX, barY, barW, barH);
      ctx.fillStyle = '#00f5ff';
      ctx.shadowColor = '#00f5ff';
      ctx.shadowBlur = 8;
      ctx.fillRect(barX, barY, barW * progress, barH);

      // Dica de Pular
      ctx.fillStyle = 'rgba(148, 163, 184, 0.75)';
      ctx.font = '600 11px Orbitron, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('TOQUE PARA PULAR (TAP TO SKIP)', w / 2, barY + 26);

      if (progress < 1) {
        requestAnimationFrame(animateIntro);
      } else {
        proceedToGameplay();
      }
    };

    requestAnimationFrame(animateIntro);
  };

  runFluidClebIntro();
});
