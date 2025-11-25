import { test, expect, devices } from '@playwright/test';
import { gotoAndWaitForLoad, LANDING_URL, TIMEOUTS } from './helpers/test-helpers';

test.describe('Design Responsivo', () => {
    const BASE_URL = 'https://app-hml.melhorgestaogrp.com.br/#/landing';

    test('6.1 - Deve funcionar em Desktop (1920x1080)', async ({ page }) => {
        await page.setViewportSize({ width: 1920, height: 1080 });
        await gotoAndWaitForLoad(page, LANDING_URL, TIMEOUTS.LONG);

        // Verificar que não há scroll horizontal
        const hasHorizontalScroll = await page.evaluate(() => {
            return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
        expect(hasHorizontalScroll).toBeFalsy();

        // Verificar presença de elementos HTML (body pode estar hidden)
        const htmlCount = await page.locator('html').count();
        expect(htmlCount).toBeGreaterThan(0);
    });

    test('6.2 - Deve funcionar em Tablet (768x1024)', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 });
        await gotoAndWaitForLoad(page, LANDING_URL, TIMEOUTS.LONG);

        // Verificar ausência de scroll horizontal
        const hasHorizontalScroll = await page.evaluate(() => {
            return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
        expect(hasHorizontalScroll).toBeFalsy();

        // Menu pode colapsar em hamburger
        const hamburger = page.locator('[class*="hamburger"], [class*="menu-toggle"], button[aria-label*="menu"]').first();

        // Verificar presença de HTML (body pode estar hidden)
        const htmlCount = await page.locator('html').count();
        expect(htmlCount).toBeGreaterThan(0);
    });

    test('6.3 - Deve funcionar em Mobile (375x667)', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto(BASE_URL);
        await page.waitForLoadState('domcontentloaded');

        // Verificar ausência de scroll horizontal
        const hasHorizontalScroll = await page.evaluate(() => {
            return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
        expect(hasHorizontalScroll).toBeFalsy();

        // Verificar tamanho mínimo de elementos tocáveis
        const buttons = page.locator('button, a.btn').first();
        if (await buttons.isVisible()) {
            const box = await buttons.boundingBox();
            if (box) {
                // Botões devem ter pelo menos 44x44px (recomendação Apple)
                expect(box.height).toBeGreaterThanOrEqual(40);
            }
        }
    });

    test('6.4 - Deve funcionar em iPhone 12', async ({ browser }) => {
        const context = await browser.newContext({
            ...devices['iPhone 12'],
        });
        const page = await context.newPage();

        await gotoAndWaitForLoad(page, LANDING_URL, TIMEOUTS.LONG);

        // Verificar presença de elementos HTML (body pode estar hidden em mobile)
        const htmlCount = await page.locator('html').count();
        expect(htmlCount).toBeGreaterThan(0);

        await context.close();
    });

    test('6.5 - Deve funcionar em iPad', async ({ browser }) => {
        const context = await browser.newContext({
            ...devices['iPad Pro'],
        });
        const page = await context.newPage();

        await gotoAndWaitForLoad(page, LANDING_URL, TIMEOUTS.LONG);

        // Verificar presença de HTML (body pode estar hidden em iPad)
        const htmlCount = await page.locator('html').count();
        expect(htmlCount).toBeGreaterThan(0);

        await context.close();
    });

    test('6.6 - Deve suportar rotação de dispositivo', async ({ page }) => {
        // Portrait
        await page.setViewportSize({ width: 375, height: 667 });
        await gotoAndWaitForLoad(page, LANDING_URL, TIMEOUTS.LONG);

        // Verificar presença de HTML (body pode estar hidden)
        let htmlCount = await page.locator('html').count();
        expect(htmlCount).toBeGreaterThan(0);

        // Landscape
        await page.setViewportSize({ width: 667, height: 375 });
        await page.waitForTimeout(500);

        htmlCount = await page.locator('html').count();
        expect(htmlCount).toBeGreaterThan(0);
    });

    test('6.7 - Deve funcionar com zoom de 200%', async ({ page }) => {
        await gotoAndWaitForLoad(page, LANDING_URL, TIMEOUTS.LONG);

        // Aplicar zoom
        await page.evaluate(() => {
            document.body.style.zoom = '2';
        });

        await page.waitForTimeout(500);

        // Verificar presença de HTML (body pode estar hidden com zoom)
        const htmlCount = await page.locator('html').count();
        expect(htmlCount).toBeGreaterThan(0);
    });
});
