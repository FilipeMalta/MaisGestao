import { test, expect } from '@playwright/test';

test.describe('Landing Page - DEBUG', () => {
    const BASE_URL = 'https://app-hml.melhorgestaogrp.com.br/#/landing';

    test('DEBUG - Inspecionar estrutura da página', async ({ page }) => {
        await page.goto(BASE_URL);
        await page.waitForLoadState('domcontentloaded');

        // Capturar toda a estrutura HTML
        const htmlStructure = await page.evaluate(() => {
            return {
                bodyClasses: document.body.className,
                hasFlutterApp: !!document.querySelector('flutter-view, flt-glass-pane, [flt-view]'),
                allFlutterElements: Array.from(document.querySelectorAll('[class*="flt-"], [id*="flt-"]')).map(el => ({
                    tag: el.tagName,
                    classes: el.className,
                    id: el.id
                })),
                allButtons: Array.from(document.querySelectorAll('button, [role="button"], .button, [class*="button"]')).map(el => ({
                    text: el.textContent?.trim(),
                    classes: el.className,
                    tag: el.tagName
                })),
                allLinks: Array.from(document.querySelectorAll('a, [role="link"]')).map(el => ({
                    text: el.textContent?.trim(),
                    href: (el as HTMLAnchorElement).href,
                    classes: el.className
                })),
                allImages: Array.from(document.querySelectorAll('img')).map(el => ({
                    src: (el as HTMLImageElement).src,
                    alt: (el as HTMLImageElement).alt,
                    classes: el.className
                })),
                hasShadowRoot: Array.from(document.querySelectorAll('*')).some(el => !!el.shadowRoot)
            };
        });

        console.log('=== ESTRUTURA DA PÁGINA ===');
        console.log(JSON.stringify(htmlStructure, null, 2));

        // Capturar screenshot
        await page.screenshot({ path: 'debug-screenshots/landing-page-full.png', fullPage: true });

        // Tirar screenshot de elementos específicos
        const buttons = page.locator('button, [role="button"]');
        const buttonCount = await buttons.count();
        console.log(`Total de botões encontrados: ${buttonCount}`);

        for (let i = 0; i < Math.min(buttonCount, 5); i++) {
            const button = buttons.nth(i);
            const text = await button.textContent();
            console.log(`Botão ${i + 1}: "${text}"`);
        }
    });

    test('DEBUG - Localizar botão de login/entrar', async ({ page }) => {
        await page.goto(BASE_URL);
        await page.waitForLoadState('networkidle');

        // Tentar múltiplas estratégias para encontrar o botão
        const strategies = [
            { name: 'Por texto "Entrar"', locator: page.getByText('Entrar', { exact: false }) },
            { name: 'Por texto "Login"', locator: page.getByText('Login', { exact: false }) },
            { name: 'Por texto "Acessar"', locator: page.getByText('Acessar', { exact: false }) },
            { name: 'Por role button + texto', locator: page.getByRole('button', { name: /entrar|login|acessar/i }) },
            { name: 'Por seletor button', locator: page.locator('button').filter({ hasText: /entrar|login|acessar/i }) },
            { name: 'Por role link + texto', locator: page.getByRole('link', { name: /entrar|login|acessar/i }) },
            { name: 'Por class button', locator: page.locator('[class*="button"]').filter({ hasText: /entrar|login|acessar/i }) },
            { name: 'Por aria-label', locator: page.locator('[aria-label*="entrar" i], [aria-label*="login" i]') },
        ];

        console.log('\n=== TESTANDO ESTRATÉGIAS DE SELEÇÃO ===\n');

        for (const strategy of strategies) {
            try {
                const count = await strategy.locator.count();
                console.log(`✓ ${strategy.name}: ${count} elementos encontrados`);

                if (count > 0) {
                    const first = strategy.locator.first();
                    const isVisible = await first.isVisible({ timeout: 1000 }).catch(() => false);
                    console.log(`  - Visível: ${isVisible}`);

                    if (isVisible) {
                        const text = await first.textContent();
                        console.log(`  - Texto: "${text}"`);

                        // Capturar screenshot do elemento
                        await first.screenshot({ path: `debug-screenshots/login-button-${strategy.name.replace(/[^a-z0-9]/gi, '-')}.png` });
                    }
                }
            } catch (error: any) {
                console.log(`✗ ${strategy.name}: Erro - ${error.message}`);
            }
        }
    });

    test('DEBUG - Localizar logo', async ({ page }) => {
        await page.goto(BASE_URL);
        await page.waitForLoadState('networkidle');

        // Estratégias para encontrar logo
        const logoStrategies = [
            { name: 'img com alt logo', locator: page.locator('img[alt*="logo" i]') },
            { name: 'img no header', locator: page.locator('header img, [role="banner"] img') },
            { name: 'class logo', locator: page.locator('[class*="logo" i]') },
            { name: 'todas as imagens', locator: page.locator('img') },
            { name: 'svg logo', locator: page.locator('svg[class*="logo" i]') },
            { name: 'primeira imagem', locator: page.locator('img').first() },
        ];

        console.log('\n=== PROCURANDO LOGO ===\n');

        for (const strategy of logoStrategies) {
            const count = await strategy.locator.count();
            console.log(`${strategy.name}: ${count} elementos`);

            if (count > 0) {
                for (let i = 0; i < Math.min(count, 3); i++) {
                    const el = strategy.locator.nth(i);
                    const isVisible = await el.isVisible({ timeout: 1000 }).catch(() => false);
                    if (isVisible) {
                        console.log(`  - Elemento ${i + 1} é visível`);
                        await el.screenshot({
                            path: `debug-screenshots/logo-${strategy.name.replace(/[^a-z0-9]/gi, '-')}-${i}.png`
                        }).catch(() => { });
                    }
                }
            }
        }
    });

    test('DEBUG - Verificar se é Flutter Web', async ({ page }) => {
        await page.goto(BASE_URL);
        await page.waitForLoadState('domcontentloaded');

        const flutterInfo = await page.evaluate(() => {
            // Verificar sinais de Flutter Web
            return {
                hasFlutterView: !!document.querySelector('flutter-view'),
                hasFlutterGlassPane: !!document.querySelector('flt-glass-pane'),
                hasCanvasKit: !!document.querySelector('[flt-view-id]'),
                hasFlutterLoader: !!(window as any).flutterLoader,
                hasFlutterEngine: !!(window as any).flutter,
                bodyClasses: document.body.className,
                htmlClasses: document.documentElement.className,
                metaViewport: document.querySelector('meta[name="viewport"]')?.getAttribute('content'),
                hasServiceWorker: 'serviceWorker' in navigator,
                // Procurar por elementos específicos do Flutter
                flutterElements: Array.from(document.querySelectorAll('*')).filter(el =>
                    el.tagName.toLowerCase().includes('flt') ||
                    el.className.includes('flt') ||
                    el.id.includes('flt')
                ).length,
                // Verificar aria-labels
                elementsWithAriaLabel: Array.from(document.querySelectorAll('[aria-label]')).map(el => ({
                    tag: el.tagName,
                    ariaLabel: el.getAttribute('aria-label'),
                    text: el.textContent?.trim().substring(0, 50)
                })).slice(0, 10),
                // Pegar estrutura do DOM
                domStructure: {
                    totalElements: document.querySelectorAll('*').length,
                    buttons: document.querySelectorAll('button').length,
                    links: document.querySelectorAll('a').length,
                    images: document.querySelectorAll('img').length,
                    inputs: document.querySelectorAll('input').length,
                }
            };
        });

        console.log('\n=== INFORMAÇÕES FLUTTER ===');
        console.log(JSON.stringify(flutterInfo, null, 2));

        // Se for Flutter, testar estratégias específicas
        if (flutterInfo.hasFlutterView || flutterInfo.hasFlutterGlassPane || flutterInfo.flutterElements > 0) {
            console.log('\n✅ Aplicação Flutter detectada!');
            console.log('Estratégias recomendadas:');
            console.log('1. Usar aria-label para seleção');
            console.log('2. Usar getByText() para texto visível');
            console.log('3. Usar getByRole() com name');
            console.log('4. Evitar seletores de classe CSS');
        } else {
            console.log('\n⚠️ Flutter não detectado claramente. Pode ser renderização HTML padrão.');
        }
    });

    test('DEBUG - Capturar todos os textos visíveis', async ({ page }) => {
        await page.goto(BASE_URL);
        await page.waitForLoadState('networkidle');

        const visibleTexts = await page.evaluate(() => {
            const walker = document.createTreeWalker(
                document.body,
                NodeFilter.SHOW_TEXT,
                null
            );

            const texts: string[] = [];
            let node;

            while (node = walker.nextNode()) {
                const text = node.textContent?.trim();
                if (text && text.length > 0 && text.length < 100) {
                    // Verificar se o elemento pai é visível
                    const parent = node.parentElement;
                    if (parent) {
                        const style = window.getComputedStyle(parent);
                        if (style.display !== 'none' && style.visibility !== 'hidden') {
                            texts.push(text);
                        }
                    }
                }
            }

            return [...new Set(texts)]; // Remover duplicados
        });

        console.log('\n=== TEXTOS VISÍVEIS NA PÁGINA ===');
        console.log(visibleTexts.slice(0, 30).join('\n'));
    });

    test('DEBUG - Capturar navegação e menu', async ({ page }) => {
        await page.goto(BASE_URL);
        await page.waitForLoadState('networkidle');

        const navInfo = await page.evaluate(() => {
            return {
                navElements: Array.from(document.querySelectorAll('nav, [role="navigation"]')).map(el => ({
                    tag: el.tagName,
                    classes: el.className,
                    id: el.id,
                    items: Array.from(el.querySelectorAll('a, button')).map(item => ({
                        text: item.textContent?.trim(),
                        tag: item.tagName,
                        href: (item as HTMLAnchorElement).href
                    }))
                })),
                headerElements: Array.from(document.querySelectorAll('header, [role="banner"]')).map(el => ({
                    tag: el.tagName,
                    classes: el.className,
                    children: Array.from(el.children).map(child => ({
                        tag: child.tagName,
                        classes: child.className,
                        text: child.textContent?.trim().substring(0, 30)
                    }))
                })),
                allAnchors: Array.from(document.querySelectorAll('a[href^="#"]')).map(el => ({
                    text: el.textContent?.trim(),
                    href: (el as HTMLAnchorElement).href
                }))
            };
        });

        console.log('\n=== NAVEGAÇÃO E MENU ===');
        console.log(JSON.stringify(navInfo, null, 2));
    });

    test('DEBUG - Testar responsividade', async ({ page }) => {
        await page.goto(BASE_URL);

        const viewports = [
            { name: 'Mobile', width: 375, height: 667 },
            { name: 'Tablet', width: 768, height: 1024 },
            { name: 'Desktop', width: 1920, height: 1080 },
        ];

        for (const viewport of viewports) {
            await page.setViewportSize({ width: viewport.width, height: viewport.height });
            await page.waitForTimeout(1000);

            const bodyVisible = await page.locator('body').isVisible();
            console.log(`${viewport.name} (${viewport.width}x${viewport.height}): body ${bodyVisible ? 'visível' : 'oculto'}`);

            await page.screenshot({
                path: `debug-screenshots/responsive-${viewport.name.toLowerCase()}.png`,
                fullPage: true
            });
        }
    });
});
