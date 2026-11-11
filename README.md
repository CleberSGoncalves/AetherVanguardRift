# Astral Survivor: Neon Void

[![CrazyGames SDK v3](https://img.shields.io/badge/CrazyGames-SDK_v3_Homologado-00f5ff?style=for-the-badge)](https://sdk.crazygames.com)
[![Build Status](https://img.shields.io/badge/Build-Passing_100%25-22c55e?style=for-the-badge)](https://aethervanguardrift.kinomuse.com.br)
[![E2E QA](https://img.shields.io/badge/E2E_Tests-10_Passed-10b981?style=for-the-badge)](./tests/test_e2e.py)
[![Developer](https://img.shields.io/badge/Studio-FluidCleb_Interactive-38bdf8?style=for-the-badge)](https://kinomuse.com.br)

> **Jogo Web HTML5 / WebGL de Ação e Sobrevivência Quântica (Survivors / Bullet Heaven)** 100% homologado para os padrões comerciais da **CrazyGames**.

- **URL Pública de Entrega**: [https://aethervanguardrift.kinomuse.com.br](https://aethervanguardrift.kinomuse.com.br)
- **Título Comercial**: Astral Survivor: Neon Void
- **Gênero**: Bullet Heaven / Survivors Espacial
- **Stack Tecnológica**: Vite + Canvas 2D Otimizado + Web Audio API Procedural
- **Idiomas**: Inglês (EN) padrão comercial + Português (PT-BR) com detecção automática e alternância instantânea (`🌐 EN` / `🌐 PT`)
- **Tamanho do Bundle**: ~90 KB (Carregamento ultra-rápido em < 1 segundo)
- **Marca**: Desenvolvido sob o selo oficial **FluidCleb Interactive**
- **Portal Oficial**: [kinomuse.com.br](https://kinomuse.com.br)

---

## 🌌 1. Lore & Ambientação

Nas profundezas do **Setor Nebuloso 9**, uma falha catastrófica no núcleo gerou hordas implacáveis de **anomalias sintéticas de matéria escura**. O piloto estelar da nave de vanguarda deve resistir ao cerco quântico utilizando armas de plasma orbitais antes que o motor colapse. Absorva fragmentos de energia quântica, expanda seu arsenal e destrua o colossal **Soberano do Vazio (The Neon Void Overlord)**.

---

## 🕹️ 2. Core Gameplay Loop & Controles

1. **Seleção de Fase**: Navegue entre 16 setores em 4 mundos nebulosos (*Outer Neon Ring*, *Nebular Core*, *Antimatter Abyss*, *Quantum Omega Core*).
2. **Movimentação**: 
   - **Desktop**: Teclas `WASD` ou `Setas do Teclado`.
   - **Mobile**: D-Pad tátil no dock inferior dedicado ou toque virtual no canvas.
3. **Combate Automático**: Canhões e armas orbitais miram e disparam automaticamente nos inimigos mais próximos.
4. **Coleta de Cristais**: Cristais de XP são atraídos pelo campo magnético da nave.
5. **Evolução em Tempo Real**: Escolha 1 entre 3 upgrades aleatórios ao subir de nível (Cadência Quântica, Sobrecarga de Táquions, Canhão Multidirecional, Drones Orbitais, Pulso de Vácuo, Auto-Reparo Nanotec).
6. **Sistema de 1★, 2★ e 3★**:
   - `★ 1 Estrela`: Aprovação da fase imediata, revelando o botão pulsante `✅ CONCLUIR FASE (★) ➔`.
   - `★★ 2 Estrelas`: Meta intermediária de combate e coleta.
   - `★★★ 3 Estrelas`: Vitória Máxima com eliminação do Chefe de Setor e bônus integral.

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
- **Dock Dedicado na Base**: Em modo retrato (`h >= w * 1.05`), o canvas tem altura útil calculada descontando o HUD superior (60px) e o dock de controles inferior (115px), mantendo a área de jogo 100% desobstruída.
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
- ✅ Teste 7: Hangar de Naves com 4 modelos (Astral Vanguard, Chrono Striker, Void Aegis, Valkyrie)
- ✅ Teste 8: Missões Quânticas e Calendário Diário de 7 Dias
- ✅ Teste 9: Adaptação Responsiva Mobile Portrait com Dock Isolado
- ✅ Teste 10: Suporte Bilingue (EN/PT) e Auditoria de Logs (0 Erros SEVERE)
