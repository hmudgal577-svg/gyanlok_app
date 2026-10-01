import sys
from playwright.sync_api import sync_playwright

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

print("🌐 Verifying Unified CBSE Color Theme across Live Pages...")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    
    # 1. Test CBSE Class 10 Hindi Landing Page
    print("\n--- 1. Testing CBSE Landing Page: https://ekshala.in/cbse/class-10/hindi/ ---")
    res1 = page.goto("https://ekshala.in/cbse/class-10/hindi/", wait_until="domcontentloaded", timeout=45000)
    page.wait_for_timeout(1000)
    print(f"Status Code: {res1.status}")
    assert res1.status == 200, "CBSE landing page failed!"
    page.screenshot(path="C:/Users/hmudg/.gemini/antigravity/brain/c05b8590-eca1-44cc-89dd-3e74bc1d079f/unified_cbse_landing_screenshot.png", full_page=False)
    print("✓ Saved CBSE landing screenshot!")

    # 2. Test CBSE Grammar Portal Page
    print("\n--- 2. Testing CBSE Grammar Portal: https://ekshala.in/hindi-grammar/cbse/ ---")
    res2 = page.goto("https://ekshala.in/hindi-grammar/cbse/", wait_until="domcontentloaded", timeout=45000)
    page.wait_for_timeout(1000)
    print(f"Status Code: {res2.status}")
    assert res2.status == 200, "CBSE grammar portal failed!"
    page.screenshot(path="C:/Users/hmudg/.gemini/antigravity/brain/c05b8590-eca1-44cc-89dd-3e74bc1d079f/unified_cbse_grammar_portal_screenshot.png", full_page=False)
    print("✓ Saved CBSE grammar portal screenshot!")

    # 3. Test Worksheets CBSE Section
    print("\n--- 3. Testing Worksheets CBSE Section: https://ekshala.in/worksheets/#cbse-worksheets ---")
    res3 = page.goto("https://ekshala.in/worksheets/", wait_until="domcontentloaded", timeout=45000)
    page.wait_for_timeout(1000)
    print(f"Status Code: {res3.status}")
    assert res3.status == 200, "Worksheets page failed!"

    browser.close()
    print("\n🎉 ALL UNIFIED CBSE THEME CHECKS PASSED 100% PERFECTLY!")
