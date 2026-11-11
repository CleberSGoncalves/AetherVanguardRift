# Astraea: Sobreviventes do Abismo Quântico

[![CrazyGames SDK v3](https://img.shields.io/badge/CrazyGames-SDK_v3_Homologado-00f5ff?style=for-the-badge)](https://sdk.crazygames.com)
[![Build Status](https://img.shields.io/badge/Build-Passing_100%25-22c55e?style=for-the-badge)](https://aethervanguardrift.kinomuse.com.br)
[![E2E QA](https://img.shields.io/badge/E2E_Tests-10_Passed-10b981?style=for-the-badge)](./tests/test_e2e.py)
[![Developer](https://img.shields.io/badge/Studio-FluidCleb_Interactive-38bdf8?style=for-the-badge)](https://kinomuse.com.br)

> **Jogo Web HTML5 / WebGL de Ação e Sobrevivência Quântica (Survivors / Bullet Heaven)** 100% homologado para os padrões comerciais da **CrazyGames**.

- **URL Pública de Entrega**: [https://aethervanguardrift.kinomuse.com.br](https://aethervanguardrift.kinomuse.com.br)
- **Título Comercial**: Astraea: Sobreviventes do Abismo Quântico
- **Gênero**: Bullet Heaven / Survivors Espacial
- **Stack Tecnológica**: Vite + Canvas 2D Otimizado + Web Audio API Procedural
- **Tamanho do Bundle**: ~80 KB (Carregamento ultra-rápido em < 1 segundo)
- **Marca**: Desenvolvido sob o selo oficial **FluidCleb Interactive**
- **Portal Oficial**: [kinomuse.com.br](https://kinomuse.com.br)

---

## 🌌 1. Lore & Ambientação

Nas profundezas do setor estelar esquecido, naves colonizadoras lutam contra enxames de entidades de matéria escura que ameaçam colapsar o contínuo espaço-tempo. Como comandante da vanguarda estelar, pilote naves experimentais, absorva cristais de energia quântica e expanda seu arsenal para derrotar os Antigos Titãs e o colossal **Devorador de Éter**.

---

## 🕹️ 2. Core Gameplay Loop & Controles

1. **Seleção de Fase**: Escolha entre 16 setores progressivos em 4 mundos estelares.
2. **Movimentação**: 
   - **Desktop**: Teclas `WASD` ou `Setas do Teclado`.
   - **Mobile**: D-Pad tátil no dock inferior dedicado ou toque virtual no canvas.
3. **Combate Automático**: Canhões e armas orbitais miram e disparam automaticamente nos inimigos mais próximos.
4. **Coleta de Cristais**: Cristais atraídos pelo campo magnético do propulsor.
5. **Evolução em Tempo Real**: Escolha 1 entre 3 upgrades aleatórios ao subir de nível (Cadência, Dano, Disparo Duplo, Drones Orbitais, Pulso de Vácuo, Regeneração).
6. **Sistema de 1★, 2★ e 3★**:
   - `★ 1 Estrela`: Aprovação da fase imediata, revelando o botão pulsante `✅ CONCLUIR FASE (★) ➔`.
   - `★★ 2 Estrelas`: Meta intermediária de combate.
   - `★★★ 3 Estrelas`: Vitória Máxima com bônus e eliminação do Chefe de Setor.

---

## 💎 3. Estratégia de Monetização (CrazyGames SDK v3)

- **Watchdog de 2.5s**: Previne softlock caso o SDK ou bloqueadores de anúncios (AdBlock) atrasem.
- **Rewarded Ad 1**: Reviver 1x por partida com **Escudo Protetor de 3.5s** e onda de choque de repulsão.
- **Rewarded Ad 2**: Dobrar cristais quânticos (+100%) na tela de vitória.
- **Rewarded Ad 3**: Dobrar recompensa diária do calendário de 7 dias.
- **Rewarded Ad 4**: Giro extra na Roleta Quântica da Sorte (Lucky Spin).
- **Midgame Ads**: Exibidos a cada 3 minutos exclusivamente em telas de transição (vitória ou derrota), nunca durante a ação motora ativa.
- **Ciclo de Gameplay**: `gameplayStart()` na primeira ação motora e `gameplayStop()` em pausas, modais ou mortes.

---

## 📱 4. Arquitetura Mobile Anti-Sobreposição (Lei Anti-Sobreposição)

- **Canvas Edge-to-Edge**: Redimensionado dinamicamente via `ResizeObserver` com `window.devicePixelRatio`.
- **Dock Dedicado na Base**: Em telas móveis (`h >= w * 1.05`), o canvas é descontado e posicionado entre o Top HUD (60px) e a barra inferior de controles (115px), garantindo que **nenhum botão touch cubra o chão, o jogador ou os inimigos**.
- **Top HUD Compacto**: Título abreviado com elipse, ícones secundários movidos para atalhos pills nos modais em telas `<= 768px`.

---

## 🛠️ 5. Execução e Build Local

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento local
npm run dev

# Gerar build de produção otimizado com hashes únicos
npm run build

# Executar suíte de testes automatizados E2E (Selenium Headless Chrome)
python tests/test_e2e.py
```

---

## 🏆 6. Resultados dos Testes E2E (10/10 Aprovados)

- ✅ Teste 1: Carregamento do DOM e Canvas Edge-to-Edge
- ✅ Teste 2: Intro FluidCleb Procedural com Pulo Instantâneo (<= 1 clique)
- ✅ Teste 3: Transição Lore para Partida Ativa
- ✅ Teste 4: Físicas determinísticas com delta time e avanço de timer
- ✅ Teste 5: Máquina de Estados Anti-Softlock nos Modais (Pausa/Resume)
- ✅ Teste 6: Instanciação dos 16 Setores Progressivos
- ✅ Teste 7: Hangar de Naves com 4 modelos (Astraea, Chrono Striker, Void Aegis, Valkyrie)
- ✅ Teste 8: Missões Quânticas e Calendário Diário de 7 Dias
- ✅ Teste 9: Adaptação Responsiva Mobile Portrait com Dock Isolado
- ✅ Teste 10: Auditoria de Logs do Console (0 Erros SEVERE)
