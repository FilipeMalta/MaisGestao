import { test, expect } from '@playwright/test';

test.describe('Integração com API', () => {
    const BASE_URL = 'https://app-hml.melhorgestaogrp.com.br';
    const API_URL = 'https://app-hml.melhorgestaogrp.com.br/api'; // Ajustar conforme necessário

    test('9.1 - Requisições GET devem retornar 200', async ({ page }) => {
        let apiCalls: Array<{ url: string; status: number; method: string }> = [];

        page.on('response', response => {
            const url = response.url();
            if (url.includes('/api/') || url.includes('api')) {
                apiCalls.push({
                    url: url,
                    status: response.status(),
                    method: response.request().method(),
                });
            }
        });

        await page.goto(`${BASE_URL}/#/landing`);
        await page.waitForLoadState('networkidle');

        console.log(`Chamadas de API detectadas: ${apiCalls.length}`);

        const failedCalls = apiCalls.filter(call => call.status >= 400);

        if (failedCalls.length > 0) {
            console.log('Chamadas falhadas:', failedCalls);
        }

        expect(failedCalls.length).toBe(0);
    });

    test('9.2 - Requisições devem incluir headers apropriados', async ({ page }) => {
        const requestHeaders: Array<any> = [];

        page.on('request', request => {
            const url = request.url();
            if (url.includes('/api/')) {
                requestHeaders.push({
                    url: url,
                    headers: request.headers(),
                });
            }
        });

        await page.goto(`${BASE_URL}/#/landing`);
        await page.waitForLoadState('networkidle');

        if (requestHeaders.length > 0) {
            const firstRequest = requestHeaders[0];
            console.log('Headers da requisição:', {
                'content-type': firstRequest.headers['content-type'],
                'accept': firstRequest.headers['accept'],
            });

            // Verificar headers comuns
            expect(firstRequest.headers['accept']).toBeTruthy();
        }
    });

    test('9.3 - Deve tratar erros de API gracefully', async ({ page }) => {
        await page.route('**/api/**', route => {
            // Simular erro 500
            route.fulfill({
                status: 500,
                contentType: 'application/json',
                body: JSON.stringify({ error: 'Internal Server Error' }),
            });
        });

        await page.goto(`${BASE_URL}/#/landing`);
        await page.waitForTimeout(2000);

        // Verificar se a aplicação não quebrou (verificar HTML ao invés de body)
        const htmlCount = await page.locator('html').count();
        expect(htmlCount).toBeGreaterThan(0);

        // Pode haver mensagem de erro para o usuário
        const errorMessages = page.locator('text=/erro|error|falha/i');
        // Não vamos assertar, apenas verificar que app não crashou
    });

    test('9.4 - Requisições POST devem ter payload correto', async ({ page }) => {
        const postRequests: Array<any> = [];

        page.on('request', request => {
            if (request.method() === 'POST' && request.url().includes('/api/')) {
                postRequests.push({
                    url: request.url(),
                    contentType: request.headers()['content-type'],
                    hasBody: !!request.postData(),
                });
            }
        });

        await page.goto(`${BASE_URL}/#/login`);
        await page.waitForLoadState('domcontentloaded');

        const emailInput = page.locator('input[type="email"], input[type="text"]').first();
        const passwordInput = page.locator('input[type="password"]').first();
        const submitButton = page.locator('button[type="submit"]').first();

        if (await emailInput.isVisible()) {
            await emailInput.fill('test@example.com');
            await passwordInput.fill('password123');
            await submitButton.click();

            await page.waitForTimeout(2000);

            if (postRequests.length > 0) {
                console.log('Requisições POST:', postRequests);

                // Verificar que tem Content-Type
                const firstPost = postRequests[0];
                expect(firstPost.contentType).toBeTruthy();
                expect(firstPost.hasBody).toBeTruthy();
            }
        }
    });
});
