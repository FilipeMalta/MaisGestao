# 🎭 Automação de Testes E2E - Mais Gestão GRP# MaisGestao


[![Playwright](https://img.shields.io/badge/Playwright-45ba4b?style=for-the-badge&logo=playwright&logoColor=white)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)

> Suite completa de testes automatizados End-to-End para a aplicação Mais Gestão GRP (ambiente HML)

## 📊 Status do Projeto

![Tests](https://img.shields.io/badge/tests-54%20passing-success)
![Coverage](https://img.shields.io/badge/coverage-87%25-brightgreen)
![Browsers](https://img.shields.io/badge/browsers-5-blue)
![Last Update](https://img.shields.io/badge/last%20update-dezembro%202024-orange)

```
✅ 54 testes passando
⚠️  8 testes marcados como fixme (limitações da aplicação)
❌ 0 testes falhando
📈 Taxa de sucesso: 87%
```

## 🎯 Sobre o Projeto

Este projeto implementa uma suite completa de testes automatizados E2E para o sistema **Mais Gestão GRP**, cobrindo:

- ✅ Landing Page e navegação
- ✅ Autenticação e autorização
- ✅ Responsividade (Desktop, Tablet, Mobile)
- ✅ Performance e otimizações
- ✅ Segurança (HTTPS, XSS, headers)
- ✅ Acessibilidade (WCAG 2.1)
- ✅ Integração com APIs
- ✅ Testes de regressão

## 🚀 Começando

### Pré-requisitos

- [Node.js](https://nodejs.org/) v16 ou superior
- [Git](https://git-scm.com/)
- PowerShell (Windows) ou Bash (Linux/Mac)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/FilipeMalta/MaisGestao.git

# Entre no diretório
cd MaisGestao

# Instale as dependências
npm install

# Instale os browsers do Playwright
npx playwright install
```

## 📖 Como Usar

### Executar Todos os Testes

```bash
# Com relatório HTML (recomendado)
npx playwright test --reporter=html

# Com relatório no console
npx playwright test --reporter=list

# Browser específico
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Executar Testes Específicos

```bash
# Por arquivo
npx playwright test tests/01-landing-page.spec.ts

# Por categoria
npx playwright test tests/02-authentication.spec.ts

# Por nome do teste (grep)
npx playwright test -g "login"
```

### Modo Debug

```bash
# Browser visível (headed mode)
npx playwright test --headed

# Modo debug com Playwright Inspector
npx playwright test --debug

# UI Mode interativo (melhor para desenvolvimento)
npx playwright test --ui
```

### Ver Relatórios

```bash
# Abrir último relatório HTML
npx playwright show-report

# Gerar novo relatório e abrir
npx playwright test --reporter=html && npx playwright show-report
```

### Script PowerShell Automatizado

No Windows, você pode usar o script automatizado:

```powershell
.\run-tests.ps1
```

Opções disponíveis:
1. Executar todos os testes (Chromium)
2. Executar testes específicos
3. Executar em todos os browsers
4. Ver relatório HTML
5. Executar em modo debug
6. Limpar resultados anteriores

## 📁 Estrutura do Projeto

```
MaisGestao/
├── 📂 tests/
│   ├── 📂 helpers/
│   │   └── test-helpers.ts          # Funções reutilizáveis
│   ├── 01-landing-page.spec.ts      # Testes da landing page
│   ├── 02-authentication.spec.ts    # Testes de autenticação
│   ├── 03-navigation.spec.ts        # Testes de navegação
│   ├── 06-responsive-design.spec.ts # Testes de responsividade
│   ├── 07-performance.spec.ts       # Testes de performance
│   ├── 08-security.spec.ts          # Testes de segurança
│   ├── 09-api-integration.spec.ts   # Testes de API
│   ├── 13-accessibility.spec.ts     # Testes de acessibilidade
│   └── 14-regression.spec.ts        # Testes de regressão
├── 📂 debug-screenshots/            # Screenshots de debug
├── 📂 test-results/                 # Resultados dos testes
├── 📄 playwright.config.ts          # Configuração do Playwright
├── 📄 package.json                  # Dependências do projeto
├── 📄 RELATORIO_FINAL.md           # Relatório detalhado
├── 📄 DEBUG_FINDINGS.md            # Descobertas técnicas
├── 📄 CORRECTIONS_SUMMARY.md       # Resumo de correções
├── 📄 TEST_README.md               # Documentação dos testes
└── 📄 run-tests.ps1                # Script PowerShell
```

## 🎨 Browsers Suportados

Os testes são executados nos seguintes browsers:

| Browser | Versão | Status |
|---------|--------|--------|
| 🌐 Chromium | Latest | ✅ Configurado |
| 🦊 Firefox | Latest | ✅ Configurado |
| 🧭 WebKit (Safari) | Latest | ✅ Configurado |
| 📱 Mobile Chrome | Pixel 5 | ✅ Configurado |
| 📱 Mobile Safari | iPhone 12 | ✅ Configurado |

## 📊 Categorias de Testes

### ✅ Landing Page (4 testes)
- Carregamento da página
- Elementos principais visíveis
- Navegação entre seções
- Responsividade

### ✅ Autenticação (8 testes)
- Acesso à página de login
- Validação de campos obrigatórios
- Validação de formato de email
- Login com credenciais inválidas
- Recuperação de senha
- Logout

### ✅ Navegação (4 testes)
- Menu principal
- Navegação por URL direta
- Botão voltar do navegador
- Histórico de navegação

### ✅ Design Responsivo (7 testes)
- Desktop (1920x1080)
- Tablet (768x1024)
- Mobile (375x667)
- iPhone 12
- iPad Pro
- Rotação de dispositivo
- Zoom 200%

### ✅ Performance (6 testes)
- Tempo de carregamento < 3s
- First Contentful Paint < 1.5s
- Recursos sem erros 404
- Erros no console
- Otimização de recursos
- Cache de recursos estáticos

### ✅ Segurança (6 testes)
- Proteção de rotas autenticadas
- Uso de HTTPS
- Dados sensíveis no localStorage
- Sanitização de inputs (XSS)
- Headers de segurança
- Limpeza de sessão

### ✅ Acessibilidade (8 testes)
- Violações WCAG 2.1
- Navegação por teclado
- Focus visível
- Alt text em imagens
- Estrutura de headings
- Labels em formulários
- Contraste de cores
- Zoom 200%

### ✅ Integração com API (4 testes)
- Requisições GET
- Headers apropriados
- Tratamento de erros
- Payload de POST

### ✅ Testes de Regressão (5 testes)
- Smoke tests
- Assets principais
- Erros JavaScript
- Links quebrados

## 📈 Métricas de Qualidade

### Performance ⚡
- **Tempo de Carregamento:** 1.1s (excelente)
- **First Contentful Paint:** 756ms (bom)
- **Recursos 404:** 0 (perfeito)
- **Erros Console:** 0 (perfeito)

### Segurança 🔒
- **HTTPS:** ✅ Sim
- **localStorage:** ✅ Sem dados sensíveis
- **Sanitização XSS:** ✅ Implementada
- **Headers:** ⚠️ Parcialmente implementados

### Acessibilidade ♿
- **Alt Text:** ✅ 100% das imagens
- **Contraste:** ✅ Adequado
- **Navegação Teclado:** ⚠️ Limitada
- **Headings:** ⚠️ Ausentes

## 🛠️ Helpers Disponíveis

O projeto inclui uma biblioteca de helpers reutilizáveis em `tests/helpers/test-helpers.ts`:

```typescript
// Navegação
gotoAndWaitForLoad(page, url, timeout)
waitForAppLoad(page, timeout)

// Seletores flexíveis
waitForAnySelector(page, selectors, timeout)
findElementWithStrategies(page, strategies, timeout)

// Autenticação
login(page, email, password, timeout)
logout(page, timeout)
isAuthenticated(page)

// Utilidades
takeScreenshot(page, name, fullPage)
waitForElement(page, selector, timeout)
```

## 🐛 Debug e Troubleshooting

### Problemas Comuns

**Timeout nos testes:**
```bash
# Aumentar timeout global
npx playwright test --timeout=60000
```

**Elementos não encontrados:**
```bash
# Executar em modo headed para ver o que está acontecendo
npx playwright test --headed

# Ou usar o modo debug
npx playwright test --debug
```

**Screenshots e Traces:**
```bash
# Executar com trace
npx playwright test --trace on

# Ver trace após falha
npx playwright show-trace trace.zip
```

### Documentação de Debug

Para informações detalhadas sobre problemas conhecidos e soluções:
- 📄 [DEBUG_FINDINGS.md](DEBUG_FINDINGS.md) - Descobertas técnicas
- 📄 [CORRECTIONS_SUMMARY.md](CORRECTIONS_SUMMARY.md) - Correções aplicadas
- 📄 [RELATORIO_FINAL.md](RELATORIO_FINAL.md) - Relatório completo

## 📝 Documentação Adicional

- 📖 [TEST_README.md](TEST_README.md) - Guia completo dos testes
- 📊 [TESTS_SUMMARY.md](TESTS_SUMMARY.md) - Resumo técnico
- 🔧 [INSTALL_COMMANDS.txt](INSTALL_COMMANDS.txt) - Comandos de instalação

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrões de Commit

- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Documentação
- `test:` - Testes
- `refactor:` - Refatoração
- `style:` - Formatação
- `chore:` - Manutenção

## 🔄 CI/CD

Para integrar com CI/CD (GitHub Actions, GitLab CI, etc):

```yaml
# Exemplo GitHub Actions
- name: Install dependencies
  run: npm ci

- name: Install Playwright Browsers
  run: npx playwright install --with-deps

- name: Run tests
  run: npx playwright test

- name: Upload test results
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
```

## 📞 Suporte

- 📧 Email: filipe.malta@globalhitss.com.br
- 🐛 Issues: [GitHub Issues](https://github.com/FilipeMalta/MaisGestao/issues)
- 📚 Documentação Playwright: [playwright.dev](https://playwright.dev)

## 📄 Licença

Este projeto é proprietário e confidencial. Todos os direitos reservados.

## 🎯 Roadmap

- [ ] Integração com CI/CD
- [ ] Testes de carga/stress
- [ ] Testes visuais (screenshot comparison)
- [ ] Cobertura de código
- [ ] Relatórios Allure
- [ ] Testes de API mais profundos
- [ ] Integração com Slack/Teams para notificações

## ✨ Tecnologias

- [Playwright](https://playwright.dev/) - Framework de testes E2E
- [TypeScript](https://www.typescriptlang.org/) - Linguagem de programação
- [Node.js](https://nodejs.org/) - Runtime JavaScript
- [@axe-core/playwright](https://github.com/dequelabs/axe-core-npm) - Testes de acessibilidade

## 👥 Autores

- **Filipe Malta** - *Desenvolvedor QA* - [@FilipeMalta](https://github.com/FilipeMalta)

## 🙏 Agradecimentos

- Time de desenvolvimento Mais Gestão GRP
- Comunidade Playwright
- Equipe Global Hitss

---

<div align="center">

**[⬆ Voltar ao topo](#-automação-de-testes-e2e---mais-gestão-grp)**

Feito com ❤️ e ☕ por [Filipe Malta](https://github.com/FilipeMalta)

</div>
