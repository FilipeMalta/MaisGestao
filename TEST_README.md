# 🎭 Testes End-to-End - Melhor Gestão GRP

Suíte completa de testes automatizados usando Playwright para a aplicação **Melhor Gestão GRP** (Ambiente HML).

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Estrutura de Testes](#estrutura-de-testes)
- [Executando os Testes](#executando-os-testes)
- [Relatórios](#relatórios)
- [Casos de Teste](#casos-de-teste)
- [Configuração de CI/CD](#configuração-de-cicd)

## 🎯 Visão Geral

Este projeto contém **52 testes automatizados** organizados em 9 arquivos, cobrindo:

- ✅ Funcionalidades da Landing Page
- 🔐 Autenticação e Segurança
- 🧭 Navegação
- 📱 Responsividade
- ⚡ Performance
- 🔒 Segurança
- 🔌 Integração com APIs
- ♿ Acessibilidade
- 🔄 Regressão

## 📦 Pré-requisitos

- **Node.js**: versão 18.x ou superior
- **npm** ou **yarn**
- Navegadores suportados serão instalados automaticamente pelo Playwright

## 🚀 Instalação

### 1. Clone o repositório (se ainda não o fez)

```powershell
git clone <url-do-repositorio>
cd MaisG
```

### 2. Instale as dependências

```powershell
npm install
```

### 3. Instale os navegadores do Playwright

```powershell
npx playwright install
```

### 4. (Opcional) Instale a biblioteca de acessibilidade

```powershell
npm install --save-dev @axe-core/playwright
```

## 📁 Estrutura de Testes

```
tests/
├── 01-landing-page.spec.ts      # Testes da página inicial (4 testes)
├── 02-authentication.spec.ts    # Testes de autenticação (8 testes)
├── 03-navigation.spec.ts        # Testes de navegação (4 testes)
├── 06-responsive-design.spec.ts # Testes responsivos (7 testes)
├── 07-performance.spec.ts       # Testes de performance (6 testes)
├── 08-security.spec.ts          # Testes de segurança (6 testes)
├── 09-api-integration.spec.ts   # Testes de API (4 testes)
├── 13-accessibility.spec.ts     # Testes de acessibilidade (8 testes)
└── 14-regression.spec.ts        # Testes de regressão (5 testes)
```

## ▶️ Executando os Testes

### Executar todos os testes

```powershell
npx playwright test
```

### Executar testes específicos

```powershell
# Executar apenas testes da landing page
npx playwright test 01-landing-page

# Executar apenas testes de autenticação
npx playwright test 02-authentication

# Executar apenas testes de performance
npx playwright test 07-performance
```

### Executar em modo UI (interativo)

```powershell
npx playwright test --ui
```

### Executar em modo debug

```powershell
npx playwright test --debug
```

### Executar apenas em um navegador específico

```powershell
# Apenas no Chrome
npx playwright test --project=chromium

# Apenas no Firefox
npx playwright test --project=firefox

# Apenas no Safari (WebKit)
npx playwright test --project=webkit

# Apenas em Mobile Chrome
npx playwright test --project=mobile-chrome

# Apenas em Mobile Safari
npx playwright test --project=mobile-safari
```

### Executar com relatório em tempo real

```powershell
npx playwright test --reporter=list
```

### Executar testes que falharam anteriormente

```powershell
npx playwright test --last-failed
```

## 📊 Relatórios

### Visualizar relatório HTML

Após executar os testes, visualize o relatório:

```powershell
npx playwright show-report
```

### Formatos de Relatório

Os testes geram relatórios em múltiplos formatos:

- **HTML**: `playwright-report/index.html` - Relatório interativo visual
- **JSON**: `test-results/results.json` - Dados estruturados para integração
- **JUnit**: `test-results/junit.xml` - Formato para CI/CD

### Artefatos de Falha

Em caso de falha, o Playwright captura automaticamente:

- 📸 **Screenshots**: Captura a tela no momento da falha
- 🎥 **Vídeos**: Grava a sessão completa do teste
- 📋 **Traces**: Registra todas as ações para debug

Acesse em: `test-results/`

## 🧪 Casos de Teste

### 1. Landing Page (01-landing-page.spec.ts)

#### 1.1 - Carregamento Inicial
- ✅ Verifica carregamento completo da página
- ✅ Valida tempo de carregamento < 3 segundos
- ✅ Confirma ausência de erros no console

#### 1.2 - Elementos Principais
- ✅ Logo da empresa visível
- ✅ Menu de navegação presente
- ✅ Botões de call-to-action funcionais

#### 1.3 - Navegação Interna
- ✅ Links de âncora funcionam
- ✅ Scroll suave entre seções

#### 1.4 - Responsividade
- ✅ Funciona em mobile (375x667)
- ✅ Funciona em tablet (768x1024)
- ✅ Funciona em desktop (1920x1080)

### 2. Autenticação (02-authentication.spec.ts)

#### 2.1 - Acesso ao Login
- ✅ Redirecionamento para página de login
- ✅ Formulário de login visível

#### 2.2 - Validação de Campos
- ✅ Campos obrigatórios validados
- ✅ Formato de email validado

#### 2.3 - Credenciais Inválidas
- ✅ Mensagem de erro exibida
- ✅ Permanece na página de login

#### 2.4 - Recuperação de Senha
- ✅ Link "Esqueci minha senha" presente
- ✅ Página de recuperação acessível
- ✅ Validação de email funcional

### 3. Navegação (03-navigation.spec.ts)

#### 3.1 - Menu Principal
- ✅ Menu visível após login
- ✅ Itens de menu presentes

#### 3.2 - Navegação por URL
- ✅ URLs diretas protegidas
- ✅ Redirecionamento para login quando não autenticado

#### 3.3 - Histórico do Navegador
- ✅ Botão voltar funciona
- ✅ Botão avançar funciona

### 4. Design Responsivo (06-responsive-design.spec.ts)

#### 4.1 - Desktop (1920x1080)
- ✅ Sem scroll horizontal
- ✅ Layout utiliza espaço adequadamente

#### 4.2 - Tablet (768x1024)
- ✅ Menu adaptado
- ✅ Elementos responsivos

#### 4.3 - Mobile (375x667)
- ✅ Layout em coluna
- ✅ Botões com tamanho adequado para toque

#### 4.4 - Dispositivos Específicos
- ✅ iPhone 12
- ✅ iPad Pro

#### 4.5 - Rotação
- ✅ Portrait e landscape funcionam

#### 4.6 - Zoom
- ✅ Funciona com zoom de 200%

### 5. Performance (07-performance.spec.ts)

#### 5.1 - Tempo de Carregamento
- ✅ Carrega em menos de 3 segundos

#### 5.2 - Métricas Web Vitals
- ✅ First Contentful Paint < 1.5s

#### 5.3 - Recursos
- ✅ Sem erros 404
- ✅ Poucos erros no console
- ✅ Recursos otimizados (< 500KB)

#### 5.4 - Cache
- ✅ Cache de recursos implementado

### 6. Segurança (08-security.spec.ts)

#### 6.1 - Proteção de Rotas
- ✅ Rotas protegidas redirecionam para login

#### 6.2 - HTTPS
- ✅ Aplicação usa HTTPS

#### 6.3 - Armazenamento Local
- ✅ Sem informações sensíveis expostas

#### 6.4 - Proteção XSS
- ✅ Inputs sanitizados

#### 6.5 - Headers de Segurança
- ✅ Headers apropriados presentes

### 7. Integração com API (09-api-integration.spec.ts)

#### 7.1 - Requisições GET
- ✅ Retornam status 200

#### 7.2 - Headers
- ✅ Headers apropriados incluídos

#### 7.3 - Tratamento de Erros
- ✅ Erros de API tratados graciosamente

#### 7.4 - Requisições POST
- ✅ Payload correto enviado

### 8. Acessibilidade (13-accessibility.spec.ts)

#### 8.1 - WCAG Compliance
- ✅ Sem violações críticas

#### 8.2 - Navegação por Teclado
- ✅ Tab funciona em todos os elementos
- ✅ Focus visível

#### 8.3 - Screen Readers
- ✅ Imagens com alt text
- ✅ Formulários com labels
- ✅ Estrutura de headings correta

#### 8.4 - Contraste
- ✅ Contraste adequado WCAG AA

#### 8.5 - Zoom
- ✅ Funciona com zoom de 200%

### 9. Regressão (14-regression.spec.ts)

#### 9.1 - Smoke Tests
- ✅ Aplicação está acessível
- ✅ Login é acessível
- ✅ Assets principais carregam

#### 9.2 - Estabilidade
- ✅ Sem erros JavaScript críticos
- ✅ Links não estão quebrados

## ⚙️ Configuração de CI/CD

### GitHub Actions

Crie `.github/workflows/playwright.yml`:

```yaml
name: Playwright Tests
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright Browsers
        run: npx playwright install --with-deps
      - name: Run Playwright tests
        run: npx playwright test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

### Azure DevOps

```yaml
trigger:
  - main
  - develop

pool:
  vmImage: 'ubuntu-latest'

steps:
  - task: NodeTool@0
    inputs:
      versionSpec: '18.x'
    displayName: 'Install Node.js'

  - script: npm ci
    displayName: 'Install dependencies'

  - script: npx playwright install --with-deps
    displayName: 'Install Playwright browsers'

  - script: npx playwright test
    displayName: 'Run Playwright tests'

  - task: PublishTestResults@2
    condition: always()
    inputs:
      testResultsFormat: 'JUnit'
      testResultsFiles: 'test-results/junit.xml'
      failTaskOnFailedTests: true
```

## 🔧 Variáveis de Ambiente

Para testes de login com credenciais reais, crie um arquivo `.env`:

```env
TEST_USER_EMAIL=usuario@exemplo.com
TEST_USER_PASSWORD=senha_segura
```

**IMPORTANTE**: Nunca commite o arquivo `.env` com credenciais reais!

## 🐛 Troubleshooting

### Testes estão falhando por timeout

Aumente o timeout no `playwright.config.ts`:

```typescript
use: {
  actionTimeout: 15000, // Aumentar para 15 segundos
}
```

### Erro ao instalar navegadores

Execute com privilégios de administrador:

```powershell
npx playwright install --with-deps
```

### Testes de acessibilidade falhando

Instale a dependência necessária:

```powershell
npm install --save-dev @axe-core/playwright
```

## 📝 Contribuindo

1. Crie uma branch para sua feature: `git checkout -b feature/nova-funcionalidade`
2. Escreva seus testes
3. Execute os testes: `npx playwright test`
4. Commit suas mudanças: `git commit -m 'Adiciona novos testes'`
5. Push para a branch: `git push origin feature/nova-funcionalidade`
6. Abra um Pull Request

## 📚 Recursos Adicionais

- [Documentação do Playwright](https://playwright.dev/)
- [Seletores do Playwright](https://playwright.dev/docs/selectors)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [API Reference](https://playwright.dev/docs/api/class-playwright)

## 📄 Licença

Este projeto está sob a licença MIT.

---

**Desenvolvido com ❤️ para Melhor Gestão GRP**
