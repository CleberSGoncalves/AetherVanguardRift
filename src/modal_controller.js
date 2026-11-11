// src/modal_controller.js
// Gerenciador Central de Modais e Anti-Softlock (Fim do "Trava e Não Volta")
import { crazyGames } from './crazygames.js';

class ModalController {
  constructor() {
    this.modalStack = [];
    this.gameRef = null;
  }

  setGame(game) {
    this.gameRef = game;
  }

  openModal(modalId) {
    const el = document.getElementById(modalId);
    if (!el) {
      console.warn(`[ModalController] Modal não encontrado: ${modalId}`);
      return;
    }

    // Se já está no topo da pilha, apenas garante visibilidade
    const existingIdx = this.modalStack.indexOf(modalId);
    if (existingIdx !== -1) {
      this.modalStack.splice(existingIdx, 1);
    }
    this.modalStack.push(modalId);

    // Oculta modais abaixo na pilha se necessário ou mantém sobreposição limpa
    el.classList.remove('hidden');

    // Pausa a partida e notifica SDK
    if (this.gameRef) {
      this.gameRef.isPaused = true;
    }
    crazyGames.gameplayStop();
  }

  closeModal(modalId) {
    const el = document.getElementById(modalId);
    if (el) {
      el.classList.add('hidden');
    }

    const idx = this.modalStack.indexOf(modalId);
    if (idx !== -1) {
      this.modalStack.splice(idx, 1);
    }

    // Se ainda restam modais na pilha, exibe o anterior
    if (this.modalStack.length > 0) {
      const topModalId = this.modalStack[this.modalStack.length - 1];
      const topEl = document.getElementById(topModalId);
      if (topEl) topEl.classList.remove('hidden');
    } else {
      // Pilha esvaziada: Avalia se pode despausar a partida
      if (this.gameRef) {
        if (this.gameRef.isGameOver || this.gameRef.isVictory) {
          // ANTI-SOFTLOCK: Se o round já acabou (vitória ou derrota), NUNCA despausa no vácuo sem modal!
          // Reabre o modal correspondente para o jogador nunca ficar com tela congelada sem botões
          if (this.gameRef.isVictory) {
            this.openModal('modal-victory');
          } else {
            this.openModal('modal-gameover');
          }
        } else {
          // Gameplay normal pode retomar
          this.gameRef.isPaused = false;
          crazyGames.gameplayStart();
        }
      }
    }
  }

  closeAll() {
    // Fecha todos os elementos modais conhecidos
    const modals = document.querySelectorAll('.game-modal');
    modals.forEach(m => m.classList.add('hidden'));
    this.modalStack = [];
  }

  hasOpenModals() {
    return this.modalStack.length > 0;
  }

  getCurrentModal() {
    return this.modalStack.length > 0 ? this.modalStack[this.modalStack.length - 1] : null;
  }
}

export const modalController = new ModalController();
