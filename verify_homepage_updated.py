import asyncio
from playwright.async_api import async_playwright
import os

ARTIFACT_DIR = r"C:\Users\hmudg\.gemini\antigravity\brain\c05b8590-eca1-44cc-89dd-3e74bc1d079f"

async def verify():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={'width': 1280, 'height': 900})
        
        print('Navigating to Live Home Page #about section...')
        await page.goto('https://ekshala.in/#about', wait_until='domcontentloaded')
        await page.wait_for_timeout(2000)
        
        about_el = page.locator('#about')
        if await about_el.count() > 0:
            await about_el.scroll_into_view_if_needed()
            await page.wait_for_timeout(1000)
            ss_path = os.path.join(ARTIFACT_DIR, 'live_homepage_empowering_section.png')
            await page.screenshot(path=ss_path)
            print(f'OK Saved {ss_path}')

        await browser.close()

asyncio.run(verify())
