import asyncio
from playwright.async_api import async_playwright
import os

ARTIFACT_DIR = r"C:\Users\hmudg\.gemini\antigravity\brain\c05b8590-eca1-44cc-89dd-3e74bc1d079f"

async def verify():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={'width': 1280, 'height': 900})
        
        print('Navigating to Live CBSE Hindi Grammar page...')
        await page.goto('https://ekshala.in/hindi-grammar/cbse/', wait_until='domcontentloaded')
        await page.wait_for_timeout(2000)
        
        ss_path = os.path.join(ARTIFACT_DIR, 'live_cbse_grammar_banner_removed.png')
        await page.screenshot(path=ss_path)
        print(f'OK Saved {ss_path}')

        await browser.close()

asyncio.run(verify())
