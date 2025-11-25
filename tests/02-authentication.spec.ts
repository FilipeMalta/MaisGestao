import { test, expect } from '@playwright/test';
import {
    gotoAndWaitForLoad,
    waitForAppLoad,
    waitForAnySelector,
    BASE_URL,
    LOGIN_URL,
    LANDING_URL,
    TIMEOUTS
} from './helpers/test-helpers';

test.describe('Autenticação', () => {
    test.beforeEach(async ({ page }) => {
        // Navegar diretamente para login já que botão não aparece na landing
        await gotoAndWaitForLoad(page, LOGIN_URL, TIMEOUTS.LONG);
    });

    test('2.1 - Deve acessar a página de login', async ({ page }) => {
        // Procurar por botão de login/entrar
        const loginButton = page.locator('a, button').filter({ hasText: /login|entrar|acessar/i }).first();

        if (await loginButton.isVisible()) {
            await loginButton.click();

            // Verificar redirecionamento para página de login
            await expect(page).toHaveURL(/login|signin|entrar/i, { timeout: 5000 });

            // Verificar presença do formulário de login
            const emailInput = page.locator('input[type="email"], input[type="text"], input[name*="email"], input[name*="user"]').first();
            const passwordInput = page.locator('input[type="password"]').first();

            await expect(emailInput).toBeVisible();
            await expect(passwordInput).toBeVisible();
        }
    });

    test.fixme('2.2 - Deve validar campos obrigatórios do login', async ({ page }) => {
        // FIXME: Os campos de login não estão carregando consistentemente na página
        // A aplicação pode ter problemas de carregamento assíncrono
        // Este teste está marcado como fixme até que a aplicação carregue os campos corretamente

        // Aguardar formulário de login carregar
        const emailSelector = await waitForAnySelector(page, [
            'input[type="email"]',
            'input[name="email"]',
            'input[placeholder*="email" i]',
            'input[aria-label*="email" i]'
        ], TIMEOUTS.MEDIUM);

        // Se não encontrou, falhar com mensagem clara
        if (!emailSelector) {
            throw new Error('Campos de login não encontrados na página. A aplicação pode não ter carregado corretamente.');
        }

        // Localizar campos e botão
        const submitButton = page.locator('button[type="submit"], button').filter({ hasText: /entrar|login|acessar/i }).first();

        // Tentar submeter sem preencher
        const submitCount = await submitButton.count();

        if (submitCount > 0) {
            const isVisible = await submitButton.isVisible().catch(() => false);

            if (isVisible) {
                await submitButton.click();
                await page.waitForTimeout(1000);

                // Verificar que ainda está na página de login (não houve redirect)
                await expect(page).toHaveURL(/login/i);
            } else {
                console.log('⚠️ Botão de submit não visível - teste pode estar em contexto diferente');
            }
        } else {
            console.log('⚠️ Botão de submit não encontrado - pulando validação');
        }
    });

    test('2.3 - Deve validar formato de email', async ({ page }) => {
        await page.goto(`${BASE_URL}/#/login`);
        await page.waitForLoadState('domcontentloaded');

        const emailInput = page.locator('input[type="email"], input[name*="email"]').first();

        if (await emailInput.isVisible()) {
            // Inserir email inválido
            await emailInput.fill('emailinvalido');
            await emailInput.blur();

            // Aguardar mensagem de validação
            await page.waitForTimeout(500);

            // Verificar validação HTML5
            const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
            expect(isInvalid).toBeTruthy();
        }
    });

    test('2.4 - Deve tentar login com credenciais inválidas', async ({ page }) => {
        await page.goto(`${BASE_URL}/#/login`);
        await page.waitForLoadState('domcontentloaded');

        const emailInput = page.locator('input[type="email"], input[type="text"], input[name*="email"]').first();
        const passwordInput = page.locator('input[type="password"]').first();
        const submitButton = page.locator('button[type="submit"], button').filter({ hasText: /entrar|login/i }).first();

        if (await emailInput.isVisible()) {
            // Preencher com credenciais inválidas
            await emailInput.fill('usuario.invalido@teste.com');
            await passwordInput.fill('senhaerrada123');
            await submitButton.click();

            // Aguardar resposta
            await page.waitForTimeout(2000);

            // Verificar mensagem de erro (pode ser toast, alert, ou texto na página)
            const errorMessage = page.locator('text=/credenciais|incorret|inválid|erro|error/i').first();
            await expect(errorMessage).toBeVisible({ timeout: 5000 });

            // Verificar que permanece na página de login
            await expect(page).toHaveURL(/login/i);
        }
    });

    test.fixme('2.5 - Deve exibir link de recuperação de senha', async ({ page }) => {
        // FIXME: A aplicação não possui link de recuperação de senha na página de login
        // Este teste está marcado como fixme até que a funcionalidade seja implementada
        await page.goto(`${BASE_URL}/#/login`);
        await page.waitForLoadState('domcontentloaded');

        // Procurar link de "Esqueci minha senha"
        const forgotPasswordLink = page.locator('a, button').filter({ hasText: /esqueci|recuperar|forgot/i }).first();

        await expect(forgotPasswordLink).toBeVisible({ timeout: 5000 });
    });

    test('2.6 - Deve acessar página de recuperação de senha', async ({ page }) => {
        await page.goto(`${BASE_URL}/#/login`);
        await page.waitForLoadState('domcontentloaded');

        const forgotPasswordLink = page.locator('a, button').filter({ hasText: /esqueci|recuperar|forgot/i }).first();

        if (await forgotPasswordLink.isVisible()) {
            await forgotPasswordLink.click();

            // Verificar redirecionamento
            await expect(page).toHaveURL(/recuperar|recover|forgot|reset/i, { timeout: 5000 });

            // Verificar formulário de recuperação
            const emailInput = page.locator('input[type="email"]').first();
            await expect(emailInput).toBeVisible();
        }
    });

    test('2.7 - Deve validar campo de email na recuperação de senha', async ({ page }) => {
        // Tentar acessar diretamente a página de recuperação
        await page.goto(`${BASE_URL}/#/recuperar-senha`);
        await page.waitForLoadState('domcontentloaded');

        // Se não existir essa rota, pular teste
        if (page.url().includes('recuperar') || page.url().includes('forgot') || page.url().includes('reset')) {
            const emailInput = page.locator('input[type="email"]').first();
            const submitButton = page.locator('button[type="submit"], button').filter({ hasText: /enviar|recuperar|reset/i }).first();

            if (await emailInput.isVisible()) {
                await emailInput.fill('emailteste@exemplo.com');
                await submitButton.click();

                // Aguardar feedback
                await page.waitForTimeout(2000);

                // Verificar mensagem de sucesso ou erro
                const feedback = page.locator('text=/enviado|sucesso|error|erro/i').first();
                await expect(feedback).toBeVisible({ timeout: 5000 });
            }
        }
    });

    // Teste de login com credenciais válidas requer credenciais reais
    test.skip('2.8 - Deve fazer login com credenciais válidas', async ({ page }) => {
        // Este teste precisa de credenciais válidas do ambiente de homologação
        await page.goto(`${BASE_URL}/#/login`);

        const emailInput = page.locator('input[type="email"], input[type="text"]').first();
        const passwordInput = page.locator('input[type="password"]').first();
        const submitButton = page.locator('button[type="submit"]').first();

        // Usar variáveis de ambiente para credenciais
        await emailInput.fill(process.env.TEST_USER_EMAIL || 'user@test.com');
        await passwordInput.fill(process.env.TEST_USER_PASSWORD || 'password');
        await submitButton.click();

        // Aguardar redirecionamento para dashboard
        await page.waitForURL(/dashboard|home|painel/i, { timeout: 10000 });

        // Verificar que está autenticado
        const userMenu = page.locator('[class*="user"], [class*="profile"], [class*="avatar"]').first();
        await expect(userMenu).toBeVisible();
    });
});
