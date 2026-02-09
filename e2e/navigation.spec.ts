import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/');
    // Use more specific selector - the header logo
    await expect(page.getByRole('banner').getByRole('link', { name: 'Ghanadaworks' })).toBeVisible();
  });

  test('should navigate to gallery page', async ({ page }) => {
    await page.goto('/');
    // On desktop, use the nav link; on mobile, use the mobile menu
    const isMobile = (await page.viewportSize())?.width ?? 1280;
    if (isMobile < 768) {
      await page.click('button[aria-label="Open menu"]');
      // Gallery has a dropdown, click to expand then click "All Categories"
      await page.click('#mobile-menu button:has-text("Gallery")');
      await page.click('#mobile-menu >> text=All Categories');
    } else {
      await page.click('nav >> text=Gallery');
    }
    await expect(page).toHaveURL('/gallery');
    await expect(page.locator('h1')).toContainText('Gallery');
  });

  test('should navigate to about page', async ({ page }) => {
    await page.goto('/');
    const isMobile = (await page.viewportSize())?.width ?? 1280;
    if (isMobile < 768) {
      await page.click('button[aria-label="Open menu"]');
      await page.click('#mobile-menu >> text=About');
    } else {
      await page.click('nav >> text=About');
    }
    await expect(page).toHaveURL('/about');
    await expect(page.locator('h1')).toContainText('About');
  });

  test('should navigate to contact page', async ({ page }) => {
    await page.goto('/');
    const isMobile = (await page.viewportSize())?.width ?? 1280;
    if (isMobile < 768) {
      await page.click('button[aria-label="Open menu"]');
      await page.click('#mobile-menu >> text=Contact');
    } else {
      await page.click('nav >> text=Contact');
    }
    await expect(page).toHaveURL('/contact');
    await expect(page.locator('h1')).toContainText('Contact');
  });

  test('should navigate to livestream page', async ({ page }) => {
    await page.goto('/');
    const isMobile = (await page.viewportSize())?.width ?? 1280;
    if (isMobile < 768) {
      await page.click('button[aria-label="Open menu"]');
      await page.click('#mobile-menu >> text=Livestream');
    } else {
      await page.click('nav >> text=Livestream');
    }
    await expect(page).toHaveURL('/livestream');
    await expect(page.locator('text=Coming Soon')).toBeVisible();
  });

  test('should show 404 page for invalid routes', async ({ page }) => {
    // Multi-segment paths should show the NotFound page
    await page.goto('/invalid/route/that/does/not/exist');
    await expect(page.locator('h1:has-text("404")')).toBeVisible();
    await expect(page.locator('text=Page not found')).toBeVisible();
  });
});

test.describe('Gallery', () => {
  test('should display category cards', async ({ page }) => {
    await page.goto('/gallery');
    // Check that categories are visible
    await expect(page.locator('text=Weddings')).toBeVisible();
    await expect(page.locator('text=Glamour')).toBeVisible();
    await expect(page.locator('text=Family')).toBeVisible();
  });

  test('should navigate to category page', async ({ page }) => {
    await page.goto('/gallery');
    await page.click('text=Weddings');
    await expect(page).toHaveURL('/gallery/weddings');
    await expect(page.locator('h1')).toContainText('Weddings');
  });
});

test.describe('Responsive', () => {
  test('should show mobile menu button on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Mobile menu button should be visible
    await expect(page.locator('button[aria-label="Open menu"]')).toBeVisible();
  });

  test('should open and close mobile menu', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Open menu
    await page.click('button[aria-label="Open menu"]');
    await expect(page.locator('#mobile-menu')).toBeVisible();

    // Close menu by pressing Escape key
    await page.keyboard.press('Escape');
    await expect(page.locator('#mobile-menu')).toBeHidden();
  });
});
