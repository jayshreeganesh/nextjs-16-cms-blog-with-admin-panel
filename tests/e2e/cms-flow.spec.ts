import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('CMS E2E Flow with Screenshots', () => {
  test('Home Page and Login Page flow', async ({ page }) => {
    // 1. Visit Home Page
    await page.goto('/');
    
    // Check that we are on the Home Page
    await expect(page.locator('h1').first()).toContainText('My Blog');
    
    // Take a high-definition screenshot of the Home Page
    await page.screenshot({ 
      path: path.join(__dirname, '..', 'screenshots', 'home-page.png'),
      fullPage: true 
    });

    // 2. Navigate to Login Page
    await page.click('text=Login');
    
    // Wait for navigation and the login form to load
    await page.waitForURL('**/auth/login', { timeout: 15000 });
    await expect(page.locator('form')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('h2').first()).toContainText('Login');
    
    // Take a high-definition screenshot of the Login Page
    await page.screenshot({ 
      path: path.join(__dirname, '..', 'screenshots', 'login-page.png'),
      fullPage: true 
    });

    // 3. (Optional) Check a specific post if it exists
    await page.goto('/');
    const firstPostLink = page.locator('article h2').first();
    if (await firstPostLink.isVisible()) {
      await firstPostLink.click();
      await page.waitForLoadState('networkidle');
      
      // Take a high-definition screenshot of the Post Page
      await page.screenshot({ 
        path: path.join(__dirname, '..', 'screenshots', 'post-page.png'),
        fullPage: true 
      });
    }
  });
});
