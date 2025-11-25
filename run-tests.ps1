# Script PowerShell para executar testes Playwright
# Como usar: .\run-tests.ps1 [opcao]

param(
    [string]$Opcao = "all"
)

Write-Host "🎭 Playwright Test Runner" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
Write-Host ""

switch ($Opcao) {
    "all" {
        Write-Host "▶️  Executando todos os testes..." -ForegroundColor Green
        npx playwright test
    }
    "ui" {
        Write-Host "🖥️  Abrindo modo UI..." -ForegroundColor Green
        npx playwright test --ui
    }
    "debug" {
        Write-Host "🐛 Executando em modo debug..." -ForegroundColor Green
        npx playwright test --debug
    }
    "report" {
        Write-Host "📊 Abrindo relatório..." -ForegroundColor Green
        npx playwright show-report
    }
    "landing" {
        Write-Host "🏠 Executando testes da Landing Page..." -ForegroundColor Green
        npx playwright test 01-landing-page
    }
    "auth" {
        Write-Host "🔐 Executando testes de Autenticação..." -ForegroundColor Green
        npx playwright test 02-authentication
    }
    "nav" {
        Write-Host "🧭 Executando testes de Navegação..." -ForegroundColor Green
        npx playwright test 03-navigation
    }
    "responsive" {
        Write-Host "📱 Executando testes de Responsividade..." -ForegroundColor Green
        npx playwright test 06-responsive-design
    }
    "performance" {
        Write-Host "⚡ Executando testes de Performance..." -ForegroundColor Green
        npx playwright test 07-performance
    }
    "security" {
        Write-Host "🔒 Executando testes de Segurança..." -ForegroundColor Green
        npx playwright test 08-security
    }
    "api" {
        Write-Host "🔌 Executando testes de API..." -ForegroundColor Green
        npx playwright test 09-api-integration
    }
    "a11y" {
        Write-Host "♿ Executando testes de Acessibilidade..." -ForegroundColor Green
        npx playwright test 13-accessibility
    }
    "regression" {
        Write-Host "🔄 Executando testes de Regressão..." -ForegroundColor Green
        npx playwright test 14-regression
    }
    "chrome" {
        Write-Host "🌐 Executando apenas no Chrome..." -ForegroundColor Green
        npx playwright test --project=chromium
    }
    "firefox" {
        Write-Host "🦊 Executando apenas no Firefox..." -ForegroundColor Green
        npx playwright test --project=firefox
    }
    "safari" {
        Write-Host "🧭 Executando apenas no Safari..." -ForegroundColor Green
        npx playwright test --project=webkit
    }
    "mobile" {
        Write-Host "📱 Executando em Mobile..." -ForegroundColor Green
        npx playwright test --project=mobile-chrome --project=mobile-safari
    }
    "install" {
        Write-Host "📦 Instalando dependências..." -ForegroundColor Green
        npm install --save-dev @axe-core/playwright
        npx playwright install --with-deps
    }
    "help" {
        Write-Host "Opções disponíveis:" -ForegroundColor Yellow
        Write-Host "  all         - Executa todos os testes (padrão)"
        Write-Host "  ui          - Abre modo UI interativo"
        Write-Host "  debug       - Executa em modo debug"
        Write-Host "  report      - Abre o relatório HTML"
        Write-Host "  landing     - Testes da Landing Page"
        Write-Host "  auth        - Testes de Autenticação"
        Write-Host "  nav         - Testes de Navegação"
        Write-Host "  responsive  - Testes de Responsividade"
        Write-Host "  performance - Testes de Performance"
        Write-Host "  security    - Testes de Segurança"
        Write-Host "  api         - Testes de API"
        Write-Host "  a11y        - Testes de Acessibilidade"
        Write-Host "  regression  - Testes de Regressão"
        Write-Host "  chrome      - Executa apenas no Chrome"
        Write-Host "  firefox     - Executa apenas no Firefox"
        Write-Host "  safari      - Executa apenas no Safari"
        Write-Host "  mobile      - Executa em dispositivos móveis"
        Write-Host "  install     - Instala dependências"
        Write-Host "  help        - Mostra esta ajuda"
        Write-Host ""
        Write-Host "Exemplo: .\run-tests.ps1 ui" -ForegroundColor Cyan
    }
    default {
        Write-Host "❌ Opção inválida: $Opcao" -ForegroundColor Red
        Write-Host "Use '.\run-tests.ps1 help' para ver as opções disponíveis" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "✅ Concluído!" -ForegroundColor Green
