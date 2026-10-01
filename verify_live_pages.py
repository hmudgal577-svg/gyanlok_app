import asyncio
from playwright.async_api import async_playwright

async def verify():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        # CBSE page
        print("Navigating to CBSE page...")
        await page.goto("https://ekshala.in/cbse/class-10/hindi/", wait_until="domcontentloaded", timeout=60000)
        await asyncio.sleep(3)
        await page.screenshot(path="live_cbse_grammar_card.png", full_page=True)
        print("CBSE page screenshot saved.")

        # ICSE page
        print("Navigating to ICSE page...")
        await page.goto("https://ekshala.in/icse/class-10/hindi/", wait_until="domcontentloaded", timeout=60000)
        await asyncio.sleep(3)
        await page.screenshot(path="live_icse_grammar_card.png", full_page=True)
        print("ICSE page screenshot saved.")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(verify())
