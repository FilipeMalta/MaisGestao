import { Page, expect } from '@playwright/test';

/**
 * Aguarda o carregamento completo da aplicação SPA
 * Garante que o conteúdo foi carregado (não aguarda "Processando" desaparecer pois pode ficar permanente)
 */
export async function waitForAppLoad(page: Page, timeout: number = 30000) {
    // Aguardar network idle
    await page.waitForLoadState('networkidle', { timeout });

    // Aguardar um pouco para renderização
    await page.waitForTimeout(2000);

    // Verificar se há pelo menos o logo carregado (indica que app inicializou)
    try {
        await page.waitForSelector('img[alt="Logo Mais Gestão"], img[src*="logo"]', {
            timeout: Math.min(timeout, 10000),
            state: 'visible'
        });
    } catch (e) {
        // Se logo não aparecer, apenas continuar
        console.log('Logo não encontrado, continuando...');
    }
}

/**
 * Navega para uma URL e aguarda carregamento completo
 */
export async function gotoAndWaitForLoad(page: Page, url: string, timeout: number = 30000) {
    await page.goto(url, { timeout, waitUntil: 'domcontentloaded' });
    await waitForAppLoad(page, timeout);
}

/**
 * Aguarda elemento aparecer e ser visível
 */
export async function waitForElement(page: Page, selector: string, timeout: number = 15000) {
    await page.waitForSelector(selector, {
        state: 'visible',
        timeout
    });
}

/**
 * Tenta múltiplas estratégias para encontrar um elemento
 * Útil quando não sabemos exatamente como o elemento será renderizado
 */
export async function findElementWithStrategies(
    page: Page,
    strategies: Array<{ name: string; locator: any }>,
    timeout: number = 10000
): Promise<{ strategy: string; locator: any } | null> {
    for (const strategy of strategies) {
        try {
            const count = await strategy.locator.count();
            if (count > 0) {
                const isVisible = await strategy.locator.first().isVisible({ timeout: 2000 });
                if (isVisible) {
                    return { strategy: strategy.name, locator: strategy.locator.first() };
                }
            }
        } catch (error) {
            // Continue para próxima estratégia
        }
    }
    return null;
}

/**
 * Aguarda que um dos seletores apareça (útil para elementos que podem ter IDs/classes diferentes)
 */
export async function waitForAnySelector(
    page: Page,
    selectors: string[],
    timeout: number = 15000
): Promise<string | null> {
    const startTime = Date.now();
    const checkInterval = 500;

    while (Date.now() - startTime < timeout) {
        for (const selector of selectors) {
            try {
                const element = page.locator(selector).first();
                const count = await element.count();

                if (count > 0) {
                    // Verificar visibilidade com timeout curto
                    const isVisible = await element.isVisible({ timeout: 500 }).catch(() => false);
                    if (isVisible) {
                        return selector;
                    }
                }
            } catch (error) {
                // Continuar tentando outros seletores
            }
        }

        // Verificar se ainda há tempo antes de esperar
        const elapsed = Date.now() - startTime;
        if (elapsed + checkInterval < timeout) {
            await page.waitForTimeout(checkInterval);
        } else {
            break; // Sair se não houver tempo suficiente para outra iteração
        }
    }

    // Retornar null ao invés de continuar indefinidamente
    console.log(`⚠️ Nenhum dos seletores encontrado após ${timeout}ms: ${selectors.join(', ')}`);
    return null;
}

/**
 * Login helper - faz login na aplicação
 * Útil para testes que precisam de autenticação
 */
export async function login(
    page: Page,
    email: string = process.env.TEST_USER_EMAIL || 'test@example.com',
    password: string = process.env.TEST_USER_PASSWORD || 'password',
    timeout: number = 30000
) {
    // Navegar para login
    await gotoAndWaitForLoad(page, 'https://app-hml.melhorgestaogrp.com.br/#/login', timeout);

    // Aguardar formulário de login
    await waitForAnySelector(page, [
        'input[type="email"]',
        'input[type="text"]',
        'input[name*="email"]',
        'input[name*="user"]'
    ], timeout);

    // Preencher credenciais
    const emailInput = page.locator('input[type="email"], input[type="text"]').first();
    const passwordInput = page.locator('input[type="password"]').first();

    await emailInput.fill(email);
    await passwordInput.fill(password);

    // Clicar em entrar
    const submitButton = page.locator('button[type="submit"], button').filter({
        hasText: /entrar|login|acessar/i
    }).first();

    await submitButton.click();

    // Aguardar redirecionamento
    await page.waitForTimeout(3000);
    await waitForAppLoad(page, timeout);
}

/**
 * Logout helper
 */
export async function logout(page: Page, timeout: number = 15000) {
    // Procurar menu do usuário
    const userMenu = page.locator('[class*="user"], [class*="profile"], [class*="avatar"]').first();

    if (await userMenu.isVisible({ timeout: 2000 })) {
        await userMenu.click();
        await page.waitForTimeout(500);
    }

    // Procurar botão de logout
    const logoutButton = page.locator('button, a').filter({
        hasText: /sair|logout|desconectar/i
    }).first();

    if (await logoutButton.isVisible({ timeout: 2000 })) {
        await logoutButton.click();
        await page.waitForTimeout(1000);
    }
}

/**
 * Verifica se está autenticado
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
    // Verificar se há token no localStorage
    const hasToken = await page.evaluate(() => {
        return !!(
            localStorage.getItem('token') ||
            localStorage.getItem('authToken') ||
            localStorage.getItem('auth') ||
            localStorage.getItem('access_token')
        );
    });

    return hasToken;
}

/**
 * Captura screenshot com nome descritivo
 */
export async function takeScreenshot(page: Page, name: string, fullPage: boolean = false) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await page.screenshot({
        path: `test-results/screenshots/${name}-${timestamp}.png`,
        fullPage
    });
}

/**
 * Aguarda e verifica que não há erros de console
 */
export function setupConsoleErrorListener(page: Page): string[] {
    const errors: string[] = [];

    page.on('console', msg => {
        if (msg.type() === 'error') {
            errors.push(msg.text());
        }
    });

    page.on('pageerror', error => {
        errors.push(`Page error: ${error.message}`);
    });

    return errors;
}

/**
 * Aguarda que não haja requisições pendentes
 */
export async function waitForNetworkIdle(page: Page, timeout: number = 10000) {
    await page.waitForLoadState('networkidle', { timeout });
}

/**
 * Scroll até elemento estar visível
 */
export async function scrollToElement(page: Page, selector: string) {
    const element = page.locator(selector).first();
    await element.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
}

/**
 * Preenche formulário com retry
 */
export async function fillFormField(
    page: Page,
    selector: string,
    value: string,
    retries: number = 3
) {
    for (let i = 0; i < retries; i++) {
        try {
            const field = page.locator(selector).first();
            await field.clear();
            await field.fill(value);

            // Verificar se foi preenchido
            const currentValue = await field.inputValue();
            if (currentValue === value) {
                return;
            }
        } catch (error) {
            if (i === retries - 1) throw error;
            await page.waitForTimeout(1000);
        }
    }
}

/**
 * Constantes úteis
 */
export const BASE_URL = 'https://app-hml.melhorgestaogrp.com.br';
export const LANDING_URL = `${BASE_URL}/#/landing`;
export const LOGIN_URL = `${BASE_URL}/#/login`;

export const TIMEOUTS = {
    SHORT: 5000,
    MEDIUM: 15000,
    LONG: 30000,
    NETWORK: 30000,
};

export const VIEWPORTS = {
    MOBILE: { width: 375, height: 667 },
    TABLET: { width: 768, height: 1024 },
    DESKTOP: { width: 1920, height: 1080 },
};
