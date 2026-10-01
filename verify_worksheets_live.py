import asyncio
from playwright.async_api import async_playwright
import os

ARTIFACT_DIR = r"C:\Users\hmudg\.gemini\antigravity\brain\c05b8590-eca1-44cc-89dd-3e74bc1d079f"

async def verify():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={'width': 1280, 'height': 900})
        
        # 1. Verify CBSE Class 10 Hindi Landing Page Related Resources
        print('1. Checking CBSE Class 10 Hindi Landing Page Related Resources...')
        await page.goto('https://ekshala.in/cbse/class-10/hindi/', wait_until='domcontentloaded')
        await page.wait_for_timeout(2000)
        
        # Scroll to Related Resources
        section = page.locator('text=CBSE Related Resources')
        if await section.count() > 0:
            await section.scroll_into_view_if_needed()
            await page.wait_for_timeout(1000)
            ss_path1 = os.path.join(ARTIFACT_DIR, 'live_cbse_related_resources_2_cards.png')
            await page.screenshot(path=ss_path1)
            print(f'OK Saved {ss_path1}')
        
        # 2. Verify CBSE Muhavare Page Worksheet Modal Viewer
        print('2. Checking CBSE Muhavare Page Worksheet Modal Viewer...')
        await page.goto('https://ekshala.in/hindi-grammar/cbse/muhavare/', wait_until='domcontentloaded')
        await page.wait_for_timeout(2000)
        
        # Switch to Worksheets Sub-tab
        print('Switching to Worksheets sub-tab...')
        await page.evaluate("typeof switchCbseMuhavreSub === 'function' && switchCbseMuhavreSub('sub2')")
        await page.wait_for_timeout(1000)

        # Look for openWorksheetViewer button
        btn = page.locator('button[onclick*="openWorksheetViewer"]').first
        if await btn.count() > 0:
            await btn.scroll_into_view_if_needed()
            await btn.click()
            await page.wait_for_timeout(2500)
            ss_path2 = os.path.join(ARTIFACT_DIR, 'live_muhavare_modal_worksheet_viewer.png')
            await page.screenshot(path=ss_path2)
            print(f'OK Saved {ss_path2}')
        else:
            print('⚠️ View button not found')

        await browser.close()

asyncio.run(verify())
