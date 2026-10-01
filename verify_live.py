import asyncio
from playwright.async_api import async_playwright

async def verify():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={'width': 1280, 'height': 900})
        
        # 1. Main CBSE Landing Page
        print('Navigating to CBSE landing page...')
        await page.goto('https://ekshala.in/cbse/class-10/hindi/', wait_until='domcontentloaded')
        await page.wait_for_timeout(2000)
        await page.screenshot(path='live_cbse_landing.png', full_page=False)
        print('Saved live_cbse_landing.png')
        
        # Click View Syllabus modal button
        print('Testing View Syllabus modal button...')
        await page.click('text=View Syllabus')
        await page.wait_for_timeout(1000)
        await page.screenshot(path='live_syllabus_modal.png')
        print('Saved live_syllabus_modal.png')
        
        # Close modal
        await page.keyboard.press('Escape')
        await page.wait_for_timeout(500)
        
        # 2. Dedicated Syllabus Page
        print('Navigating to Dedicated Syllabus Page...')
        await page.goto('https://ekshala.in/cbse/class-10/hindi/syllabus/', wait_until='domcontentloaded')
        await page.wait_for_timeout(1500)
        await page.screenshot(path='live_dedicated_syllabus_page.png', full_page=False)
        print('Saved live_dedicated_syllabus_page.png')

        # 3. Dedicated Marking Scheme Page
        print('Navigating to Dedicated Marking Scheme Page...')
        await page.goto('https://ekshala.in/cbse/class-10/hindi/marking-scheme/', wait_until='domcontentloaded')
        await page.wait_for_timeout(1500)
        await page.screenshot(path='live_dedicated_marking_scheme_page.png', full_page=False)
        print('Saved live_dedicated_marking_scheme_page.png')

        await browser.close()

asyncio.run(verify())
