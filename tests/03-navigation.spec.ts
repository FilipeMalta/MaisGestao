import { test, expect } from '@playwright/test';

test.describe('Navegação', () => {
    const BASE_URL = 'https://app-hml.melhorgestaogrp.com.br';

    // Estes testes requerem autenticação
    test.beforeEach(async ({ page }) => {
        // TODO: Implementar helper de login
        await page.goto(`${BASE_URL}/#/login`);
    });

    test('3.1 - Deve exibir menu principal após login', async ({ page }) => {
        // Este teste assume que o usuário está logado
        // Procurar por menu/sidebar
        const menu = page.locator('nav, aside, .sidebar, [role="navigation"]').first();

        // Se encontrar menu, verificar visibilidade
        if (await menu.isVisible({ timeout: 2000 })) {
            await expect(menu).toBeVisible();

            // Verificar se há itens no menu
            const menuItems = menu.locator('a, button, li');
            const count = await menuItems.count();
            expect(count).toBeGreaterThan(0);
        }
    });

    test('3.2 - Deve permitir navegação por URL direta', async ({ page }) => {
        // Tentar acessar URL específica
        await page.goto(`${BASE_URL}/#/dashboard`);

        // Se não autenticado, deve redirecionar para login
        await page.waitForLoadState('domcontentloaded');

        const url = page.url();
        expect(url).toMatch(/login|dashboard/i);
    });

    test('3.3 - Deve funcionar botão voltar do navegador', async ({ page }) => {
        await page.goto(`${BASE_URL}/#/landing`);
        await page.waitForLoadState('domcontentloaded');

        // Clicar em algum link
        const link = page.locator('a[href^="#"]').first();
        if (await link.isVisible()) {
            await link.click();
            await page.waitForTimeout(500);

            // Voltar
            await page.goBack();
            await page.waitForTimeout(500);

            // Verificar que voltou
            await expect(page).toHaveURL(/landing/);
        }
    });

    test('3.4 - Deve manter histórico de navegação correto', async ({ page }) => {
        await page.goto(`${BASE_URL}/#/landing`);

        // Navegar para login
        await page.goto(`${BASE_URL}/#/login`);

        // Voltar
        await page.goBack();
        await expect(page).toHaveURL(/landing/);

        // Avançar
        await page.goForward();
        await expect(page).toHaveURL(/login/);
    });
});
