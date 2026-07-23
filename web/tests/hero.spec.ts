import { test, expect } from '@playwright/test';

test.describe('Savior Hero Section', () => {
  test('Hero section renders correctly on desktop', async ({ page }) => {
    // Navigate to the local development server (English locale)
    await page.goto('http://localhost:4321/en');

    // Wait for the hero section to load
    const heroSection = page.locator('section').first();
    await expect(heroSection).toBeVisible();

    // Verify typography
    // "Next Level Marketing" should be light/normal weight
    const title = heroSection.locator('h1');
    await expect(title).toContainText('Next Level Marketing');
    await expect(title).toContainText('With Almighty Power.');

    // Verify that the second part of the title is in a strong tag
    const strongText = title.locator('strong');
    await expect(strongText).toHaveText('With Almighty Power.');
    
    // Verify subtitle
    const subtitle = heroSection.locator('p').first();
    await expect(subtitle).toContainText('Boost your marketing ROI, attract more job opportunities');

    // Verify Primary CTA
    const primaryCta = heroSection.getByRole('link', { name: "Let's Grow Now" });
    await expect(primaryCta).toBeVisible();
    await expect(primaryCta).toHaveClass(/bg-\[#FF4D1C\]/);

    // Verify Secondary CTA
    const secondaryCta = heroSection.getByRole('link', { name: /Call Now.*1-866-260-3833/i });
    await expect(secondaryCta).toBeVisible();
  });

  test('Hero buttons are responsive and stack correctly on mobile', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('http://localhost:4321/en');

    // Ensure CTAs row behaves as a flex column on mobile
    const ctaRow = page.locator('section').first().locator('.flex.flex-col.sm\\:flex-row');
    await expect(ctaRow).toBeVisible();
  });
});
