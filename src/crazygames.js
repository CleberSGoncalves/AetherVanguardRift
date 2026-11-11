// src/crazygames.js
// CrazyGames SDK v3 — Integração Blindada com Watchdog de 2.5s e Anti-Freeze
import { sound } from './audio.js';

class CrazyGamesManager {
  constructor() {
    this.sdk = null;
    this.isInitialized = false;
    this.lastMidgameTime = 0;
    this.midgameIntervalMs = 180000; // 3 minutos de intervalo seguro
    this.isGameplayActive = false;
  }

  async init() {
    if (this.isInitialized) return;
    try {
      if (typeof window !== 'undefined' && window.CrazyGames && window.CrazyGames.SDK) {
        const sdkInstance = window.CrazyGames.SDK;
        await Promise.race([
          sdkInstance.init(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('init timeout')), 400))
        ]);
        this.sdk = sdkInstance;
        this.isInitialized = true;
        console.log('[CrazyGames] SDK v3 inicializado com sucesso.');
      } else {
        setTimeout(async () => {
          if (typeof window !== 'undefined' && window.CrazyGames && window.CrazyGames.SDK && !this.isInitialized) {
            try {
              const sdkInstance = window.CrazyGames.SDK;
              await sdkInstance.init();
              this.sdk = sdkInstance;
              this.isInitialized = true;
              console.log('[CrazyGames] SDK v3 inicializado em segundo plano.');
            } catch (err) {
              this.sdk = null;
              this.isInitialized = false;
            }
          }
        }, 300);
      }
    } catch (e) {
      this.sdk = null;
      this.isInitialized = false;
      console.warn('[CrazyGames] SDK em modo local/fallback (zero latência):', e.message);
    }
  }

  canRequestLiveAds() {
    if (!this.isInitialized || !this.sdk || !this.sdk.ad) return false;
    if (typeof this.sdk.ad.requestAd !== 'function') return false;
    if (this.sdk.environment && this.sdk.environment !== 'disabled') {
      return true;
    }
    const host = typeof window !== 'undefined' ? window.location.hostname : '';
    if (host.includes('crazygames.com') || host.includes('1001juegos.com')) {
      return true;
    }
    return false;
  }

  gameplayStart() {
    if (this.isGameplayActive || !this.isInitialized || !this.sdk) return;
    this.isGameplayActive = true;
    try {
      if (this.sdk.game && typeof this.sdk.game.gameplayStart === 'function') {
        this.sdk.game.gameplayStart();
      }
    } catch (e) {}
  }

  gameplayStop() {
    if (!this.isGameplayActive || !this.isInitialized || !this.sdk) return;
    this.isGameplayActive = false;
    try {
      if (this.sdk.game && typeof this.sdk.game.gameplayStop === 'function') {
        this.sdk.game.gameplayStop();
      }
    } catch (e) {}
  }

  requestMidgameAd(onComplete) {
    const now = Date.now();
    const isQA = this.sdk && (this.sdk.environment === 'qa' || this.sdk.environment === 'local' || (typeof window !== 'undefined' && window.location.hostname.includes('crazygames.com')));
    const minInterval = isQA ? 0 : this.midgameIntervalMs;

    if (!this.canRequestLiveAds() || (this.lastMidgameTime > 0 && (now - this.lastMidgameTime < minInterval))) {
      if (onComplete) onComplete();
      return;
    }

    this.gameplayStop();
    sound.setAdMuted(true);

    let finished = false;
    const finish = () => {
      if (!finished) {
        finished = true;
        clearTimeout(watchdog);
        this.lastMidgameTime = Date.now();
        sound.setAdMuted(false);
        if (onComplete) onComplete();
      }
    };

    const watchdog = setTimeout(() => {
      console.warn('[CrazyGames] Watchdog de 2.5s disparado para Midgame Ad.');
      finish();
    }, 2500);

    try {
      this.sdk.ad.requestAd('midgame', {
        adStarted: () => console.log('[CrazyGames] Midgame Ad iniciado.'),
        adFinished: () => {
          console.log('[CrazyGames] Midgame Ad finalizado.');
          finish();
        },
        adError: (error) => {
          console.warn('[CrazyGames] Erro ao carregar Midgame Ad:', error);
          finish();
        }
      });
    } catch (err) {
      console.warn('[CrazyGames] Exceção em requestMidgameAd:', err);
      finish();
    }
  }

  requestRewardedAd(callbacks) {
    const { onReward, onError, onComplete } = callbacks || {};

    if (!this.canRequestLiveAds()) {
      console.log('[CrazyGames] Bypass local: Concedendo recompensa em ambiente dev.');
      if (onReward) onReward();
      if (onComplete) onComplete();
      return;
    }

    this.gameplayStop();
    sound.setAdMuted(true);

    let finished = false;
    const finish = () => {
      if (!finished) {
        finished = true;
        clearTimeout(watchdog);
        sound.setAdMuted(false);
        if (onComplete) onComplete();
      }
    };

    const watchdog = setTimeout(() => {
      console.warn('[CrazyGames] Watchdog de 2.5s disparado para Rewarded Ad.');
      if (onError) onError('Watchdog Timeout');
      finish();
    }, 2500);

    try {
      this.sdk.ad.requestAd('rewarded', {
        adStarted: () => console.log('[CrazyGames] Rewarded Ad iniciado.'),
        adFinished: () => {
          console.log('[CrazyGames] Rewarded Ad concluído.');
          if (onReward) onReward();
          finish();
        },
        adError: (error) => {
          console.warn('[CrazyGames] Erro no Rewarded Ad (AdBlock / Falha):', error);
          if (onError) onError(error);
          finish();
        }
      });
    } catch (err) {
      console.warn('[CrazyGames] Exceção em requestRewardedAd:', err);
      if (onError) onError(err);
      finish();
    }
  }
}

export const crazyGames = new CrazyGamesManager();
