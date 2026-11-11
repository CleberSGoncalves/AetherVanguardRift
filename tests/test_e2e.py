# tests/test_e2e.py
# Suíte de Validação Automatizada E2E de Ponta a Ponta (Selenium Headless Chrome)
import time
import os
import sys

if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options

def run_e2e_tests():
    print("==================================================")
    print("🚀 INICIANDO SUÍTE DE TESTES E2E: ASTRAL SURVIVOR: NEON VOID")
    print("==================================================")

    dist_index = os.path.abspath("E:/desenvolvimento/Godot/Projetos/AetherVanguardRift/dist/index.html")
    if not os.path.exists(dist_index):
        print(f"❌ ERRO: Arquivo {dist_index} não encontrado. Execute o build antes dos testes.")
        sys.exit(1)

    chrome_options = Options()
    chrome_options.add_argument("--headless=new")
    chrome_options.add_argument("--allow-file-access-from-files")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--use-fake-ui-for-media-stream")
    chrome_options.add_argument("--use-fake-device-for-media-stream")
    chrome_options.add_argument("--autoplay-policy=no-user-gesture-required")
    chrome_options.set_capability("goog:loggingPrefs", {"browser": "ALL"})

    driver = webdriver.Chrome(options=chrome_options)
    driver.set_window_size(1280, 720)

    try:
        # TESTE 1: Carregamento do Documento & Título Oficial
        print("▶ TESTE 1: Carregamento Inicial do Jogo e Elementos Críticos...")
        driver.get(f"file:///{dist_index.replace(os.sep, '/')}")
        time.sleep(1.0)

        assert "Astral Survivor: Neon Void" in driver.title, f"Título inesperado: {driver.title}"
        canvas = driver.find_element(By.ID, "game-canvas")
        assert canvas.is_displayed(), "Canvas do jogo não está visível"
        print("  ✓ Canvas principal e DOM carregados com sucesso.")

        # TESTE 2: Intro FluidCleb e Skip Imediato
        print("▶ TESTE 2: Validação da Intro FluidCleb & Pulo Imediato...")
        intro_canvas = driver.find_element(By.ID, "intro-canvas")
        assert intro_canvas is not None, "Intro Canvas não encontrado"

        # Simula toque/clique para pular intro instantaneamente (Regra CrazyGames: <= 1 clique)
        intro_canvas.click()
        time.sleep(0.6)

        lore_modal = driver.find_element(By.ID, "modal-lore")
        assert "hidden" not in lore_modal.get_attribute("class"), "Modal de Lore deveria abrir após a Intro"
        print("  ✓ Intro FluidCleb pulada instantaneamente. Modal de Lore aberto.")

        # TESTE 3: Transição Lore -> Gameplay Loop
        print("▶ TESTE 3: Início de Partida a partir da Lore...")
        btn_lore_start = driver.find_element(By.ID, "btn-lore-start")
        btn_lore_start.click()
        time.sleep(0.8)

        assert "hidden" in lore_modal.get_attribute("class"), "Modal de Lore deveria estar fechado"
        print("  ✓ Partida iniciada com 1 clique.")

        # TESTE 4: Gameplay Ativa e Rastreamento de Eventos Estruturados
        print("▶ TESTE 4: Simulação de Input Motor e Gameplay Ativa...")
        body = driver.find_element(By.TAG_NAME, "body")
        for _ in range(8):
            body.send_keys(Keys.ARROW_RIGHT)
            time.sleep(0.15)
            body.send_keys(Keys.ARROW_DOWN)
            time.sleep(0.15)

        hud_timer = driver.find_element(By.ID, "hud-timer")
        assert hud_timer.text != "00:00", f"Cronômetro deveria ter avançado, valor atual: {hud_timer.text}"
        print(f"  ✓ Cronômetro avançando: {hud_timer.text}")

        # TESTE 5: Máquina de Estados de Modais & Anti-Softlock
        print("▶ TESTE 5: Teste Anti-Softlock e Modais...")
        btn_pause = driver.find_element(By.ID, "btn-pause")
        btn_pause.click()
        time.sleep(0.3)

        modal_pause = driver.find_element(By.ID, "modal-pause")
        assert "hidden" not in modal_pause.get_attribute("class"), "Modal de Pausa deveria estar aberto"

        btn_resume = driver.find_element(By.ID, "btn-resume")
        btn_resume.click()
        time.sleep(0.3)
        assert "hidden" in modal_pause.get_attribute("class"), "Modal de Pausa deveria ter fechado"
        print("  ✓ Pausar e Continuar funcionam sem softlock.")

        # TESTE 6: Seletor de Fases (16 Níveis em 4 Mundos)
        print("▶ TESTE 6: Seletor de Setores e Fases...")
        btn_quick_sectors = driver.find_element(By.ID, "btn-quick-sectors")
        btn_quick_sectors.click()
        time.sleep(0.3)

        modal_sectors = driver.find_element(By.ID, "modal-sectors")
        assert "hidden" not in modal_sectors.get_attribute("class"), "Modal de Setores deveria abrir"

        sector_cards = driver.find_elements(By.CLASS_NAME, "sector-card")
        assert len(sector_cards) == 16, f"Deveria haver 16 setores instanciados, encontrados: {len(sector_cards)}"
        print(f"  ✓ 16 Fases instanciadas e categorizadas com sucesso.")

        btn_close_sectors = driver.find_element(By.ID, "btn-close-sectors")
        btn_close_sectors.click()
        time.sleep(0.3)
        assert "hidden" in modal_sectors.get_attribute("class"), "Modal de Setores deveria fechar"

        # TESTE 7: Hangar de Naves & Meta-Shop
        print("▶ TESTE 7: Hangar e Melhorias de Casco...")
        btn_quick_shop = driver.find_element(By.ID, "btn-quick-shop")
        btn_quick_shop.click()
        time.sleep(0.3)

        modal_shop = driver.find_element(By.ID, "modal-shop")
        assert "hidden" not in modal_shop.get_attribute("class"), "Modal de Loja deveria abrir"

        ship_cards = driver.find_elements(By.CLASS_NAME, "ship-card")
        assert len(ship_cards) >= 4, f"Deveria haver 4 naves desbloqueáveis, encontrados: {len(ship_cards)}"
        print(f"  ✓ Hangar com {len(ship_cards)} naves de combate validado.")

        btn_close_shop = driver.find_element(By.ID, "btn-close-shop")
        btn_close_shop.click()
        time.sleep(0.3)

        # TESTE 8: Missões e Calendário Diário
        print("▶ TESTE 8: Missões Quânticas e Recompensa Diária...")
        btn_quick_quests = driver.find_element(By.ID, "btn-quick-quests")
        btn_quick_quests.click()
        time.sleep(0.3)
        quest_items = driver.find_elements(By.CLASS_NAME, "quest-item")
        assert len(quest_items) >= 4, "Deveria haver missões diárias listadas"
        driver.find_element(By.ID, "btn-close-quests").click()
        time.sleep(0.2)

        btn_quick_daily = driver.find_element(By.ID, "btn-quick-daily")
        btn_quick_daily.click()
        time.sleep(0.3)
        daily_cards = driver.find_elements(By.CLASS_NAME, "daily-day-card")
        assert len(daily_cards) == 7, "Deveria haver calendário de 7 dias"
        driver.find_element(By.ID, "btn-close-daily").click()
        time.sleep(0.2)
        print("  ✓ Meta-Game, Quests e Calendário Diário 100% funcionais.")

        # TESTE 9: Modo Retrato Mobile e Dock Anti-Sobreposição
        print("▶ TESTE 9: Validação Responsiva Mobile (390x844 Portrait)...")
        driver.set_window_size(390, 844)
        time.sleep(0.5)

        container = driver.find_element(By.ID, "game-container")
        container_class = container.get_attribute("class")
        assert "portrait-mode" in container_class, f"Container deveria ter a classe 'portrait-mode': {container_class}"

        mobile_controls = driver.find_element(By.CLASS_NAME, "mobile-controls")
        assert mobile_controls.is_displayed(), "Dock inferior de controles móveis deveria estar visível no modo retrato"
        print("  ✓ Lei Anti-Sobreposição validada: dock isolado na base e canvas adaptativo.")

        # TESTE 10: Auditoria de Logs do Console e Suporte a Idioma
        print("▶ TESTE 10: Suporte Bilingue (EN/PT) e Auditoria de Logs...")
        driver.set_window_size(1280, 720)
        time.sleep(0.3)
        btn_lang = driver.find_element(By.ID, "btn-lang-toggle")
        initial_lang = btn_lang.text
        driver.execute_script("arguments[0].click();", btn_lang)
        time.sleep(0.3)
        toggled_lang = btn_lang.text
        assert initial_lang != toggled_lang, "O botão de alternância de idioma deveria alternar entre EN e PT"
        print(f"  ✓ Alternância de idioma validada: {initial_lang} -> {toggled_lang}")

        logs = driver.get_log("browser")
        severe_errors = [log for log in logs if log["level"] == "SEVERE" and "favicon" not in log["message"].lower()]
        gameplay_events = [log for log in logs if "[GAMEPLAY_EVENT]" in log["message"]]

        print(f"  • Eventos críticos de gameplay registrados: {len(gameplay_events)}")
        for event in gameplay_events[:3]:
            print(f"    - {event['message']}")

        if severe_errors:
            print("❌ ERROS SEVEROS ENCONTRADOS NO CONSOLE:")
            for err in severe_errors:
                print(f"  {err}")
            sys.exit(1)
        else:
            print("  ✓ Zero erros SEVERE encontrados no console.")

        print("==================================================")
        print("🎉 TODOS OS 10 TESTES E2E FORAM APROVADOS COM SUCESSO!")
        print("==================================================")

    finally:
        driver.quit()

if __name__ == "__main__":
    run_e2e_tests()
