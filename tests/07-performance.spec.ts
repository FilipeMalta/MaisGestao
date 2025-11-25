import { test, expect } from '@playwright/test';

test.describe('Performance', () => {
    const BASE_URL = 'https://app-hml.melhorgestaogrp.com.br/#/landing';

    test('7.1 - Deve carregar em menos de 3 segundos', async ({ page }) => {
        const startTime = Date.now();

        await page.goto(BASE_URL);
        await page.waitForLoadState('load');

        const endTime = Date.now();
        const loadTime = endTime - startTime;

        console.log(`Tempo de carregamento: ${loadTime}ms`);
        expect(loadTime).toBeLessThan(3000);
    });

    test('7.2 - Deve ter First Contentful Paint < 1.5s', async ({ page }) => {
        await page.goto(BASE_URL);

        const performanceMetrics = await page.evaluate(() => {
            const paintEntries = performance.getEntriesByType('paint');
            const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
            return {
                fcp: fcp ? fcp.startTime : 0,
            };
        });

        console.log(`First Contentful Paint: ${performanceMetrics.fcp}ms`);
        expect(performanceMetrics.fcp).toBeLessThan(1500);
    });

    test('7.3 - Não deve ter erros 404 de recursos', async ({ page }) => {
        const failed404s: string[] = [];

        page.on('response', response => {
            if (response.status() === 404) {
                failed404s.push(response.url());
            }
        });

        await page.goto(BASE_URL);
        await page.waitForLoadState('networkidle');

        console.log(`Recursos 404 encontrados: ${failed404s.length}`);
        if (failed404s.length > 0) {
            console.log('URLs com 404:', failed404s);
        }

        expect(failed404s.length).toBe(0);
    });

    test('7.4 - Deve ter poucos erros no console', async ({ page }) => {
        const consoleErrors: string[] = [];

        page.on('console', msg => {
            if (msg.type() === 'error') {
                consoleErrors.push(msg.text());
            }
        });

        await page.goto(BASE_URL);
        await page.waitForLoadState('networkidle');

        console.log(`Erros no console: ${consoleErrors.length}`);
        if (consoleErrors.length > 0) {
            console.log('Erros:', consoleErrors.slice(0, 5)); // Primeiros 5
        }

        // Permitir alguns erros menores, mas não muitos
        expect(consoleErrors.length).toBeLessThan(5);
    });

    test('7.5 - Deve ter recursos com tamanho otimizado', async ({ page }) => {
        const largeResources: Array<{ url: string; size: number }> = [];

        page.on('response', async response => {
            const url = response.url();

            // Filtrar apenas JS e CSS
            if (url.endsWith('.js') || url.endsWith('.css')) {
                try {
                    const buffer = await response.body();
                    const sizeKB = buffer.length / 1024;

                    if (sizeKB > 500) { // Arquivos maiores que 500KB
                        largeResources.push({ url, size: Math.round(sizeKB) });
                    }
                } catch (e) {
                    // Ignorar erros de leitura de body
                }
            }
        });

        await page.goto(BASE_URL);
        await page.waitForLoadState('networkidle');

        console.log(`Recursos grandes encontrados: ${largeResources.length}`);
        if (largeResources.length > 0) {
            console.log('Recursos:', largeResources);
        }

        // Não deve ter muitos arquivos grandes
        expect(largeResources.length).toBeLessThan(3);
    });

    test('7.6 - Deve implementar cache de recursos estáticos', async ({ page }) => {
        await page.goto(BASE_URL);
        await page.waitForLoadState('networkidle');

        // Coletar recursos da primeira carga
        const firstLoadResources: string[] = [];
        page.on('response', response => {
            firstLoadResources.push(response.url());
        });

        // Recarregar página
        await page.reload();
        await page.waitForLoadState('networkidle');

        // Verificar se alguns recursos vieram do cache
        const cachedResources = await page.evaluate(() => {
            const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
            return entries.filter(entry =>
                entry.transferSize === 0 && entry.decodedBodySize > 0
            ).length;
        });

        console.log(`Recursos do cache: ${cachedResources}`);
        // Deve ter pelo menos alguns recursos do cache
        expect(cachedResources).toBeGreaterThan(0);
    });
});
