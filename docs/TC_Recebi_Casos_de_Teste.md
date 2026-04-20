# Plano de Testes — Sistema Recebi

**Versão do Documento:** 1.0
**Data de Criação:** Abril 2026
**Sistema:** Recebi — Gerador de Recibos Online
**Tipo:** Aplicação Web Client-Side
**Critério de Qualidade:** ISO 29119 / IEEE 829

---

## Índice

1. [Introdução e Objetivos](#1-introdução-e-objetivos)
2. [Escopo dos Testes](#2-escopo-dos-testes)
3. [Abordagem de Testes](#3-abordagem-de-testes)
4. [Casos de Teste por Módulo](#4-casos-de-teste-por-módulo)
   - 4.1 [Formulário Principal](#41-módulo-formulário-principal)
   - 4.2 [Informações do Recibo](#42-módulo-informações-do-recibo)
   - 4.3 [Upload de Logo](#43-módulo-upload-de-logo)
   - 4.4 [Dados do Cliente](#44-módulo-dados-do-cliente)
   - 4.5 [Dados do Beneficiário](#45-módulo-dados-do-beneficiário)
   - 4.6 [Dados do Veículo](#46-módulo-dados-do-veículo)
   - 4.7 [Dados do Estabelecimento](#47-módulo-dados-do-estabelecimento)
   - 4.8 [Serviços e Produtos](#48-módulo-serviços-e-produtos)
   - 4.9 [Observações](#49-módulo-observações)
   - 4.10 [Geração do Recibo](#410-módulo-geração-do-recibo)
   - 4.11 [Validação de Campos](#411-módulo-validação-de-campos)
   - 4.12 [Máscaras de Input](#412-módulo-máscaras-de-input)
5. [Testes de Segurança e Privacidade](#5-testes-de-segurança-e-privacidade)
6. [Testes de Interface e Acessibilidade](#6-testes-de-interface-e-acessibilidade)
7. [Testes de Impressão e PDF](#7-testes-de-impressão-e-pdf)
8. [Testes de Navegadores e Dispositivos](#8-testes-de-navegadores-e-dispositivos)
9. [Critérios de Aceite](#9-critérios-de-aceite)
10. [Histórico de Revisões](#10-histórico-de-revisões)

---

## 1. Introdução e Objetivos

### 1.1 Propósito

Este documento apresenta o plano detalhado de casos de teste para o sistema **Recebi**, uma aplicação web client-side para geração de recibos, orçamentos, ordens de serviço e comprovantes de pagamento. O objetivo é garantir que todas as funcionalidades especificadas no SDD v1.0 estejam implementadas corretamente e operem conforme esperado.

### 1.2 Objetivos dos Testes

| Objetivo | Descrição |
|----------|-----------|
| Verificação Funcional | Assegurar que todas as funcionalidades funcionam conforme especificado |
| Validação de Regras de Negócio | Confirmar que as regras de validação são aplicadas corretamente |
| Teste de Segurança | Garantir que nenhum dado é transmitido a servidores externos |
| Usabilidade | Verificar que a interface é intuitiva e acessível |
| Compatibilidade | Confirmar funcionamento em múltiplos navegadores e dispositivos |
| Impressão/PDF | Validar a geração correta de documentos para impressão |

### 1.3 Critérios de Entrada

- [ ] SDD v1.0 aprovado e congelado
- [ ] Ambiente de testes configurado
- [ ] Navegadores de teste instalados (Chrome, Firefox, Safari, Edge)
- [ ] Dados de teste 준비됨 (fixtures)

---

## 2. Escopo dos Testes

### 2.1 Escopo Incluído

| Área | Módulos | Prioridade |
|------|---------|------------|
| Funcionalidade Core | Formulário, Geração de Recibo, Validação | Alta |
| Entrada de Dados | Logo, Cliente, Beneficiário, Veículo, Estabelecimento | Alta |
| Cálculos | Serviços/Produtos, Totalização | Alta |
| Interface | Layout, Responsividade, Acessibilidade | Média |
| Impressão | Preview, CSS @media print, PDF | Alta |
| Segurança | CSP, Transmissão Zero, Privacidade | Alta |
| Performance | Tempo de carregamento, Lighthouse | Média |

### 2.2 Escopo Excluído

| Área | Motivo |
|------|--------|
| Backend/API | Sistema é 100% client-side |
| Banco de Dados | Não há persistência de dados |
| Autenticação | Sistema não requer login |
| Service Worker | Testado na Fase 5 do roadmap |

---

## 3. Abordagem de Testes

### 3.1 Tipos de Teste Aplicados

| Tipo de Teste | Aplicação no Recebi |
|---------------|---------------------|
| Teste Unitário | Funções de validação (CPF/CNPJ), máscaras, cálculos |
| Teste de Integração | Fluxo completo: formulário → validação → geração |
| Teste de Sistema | Geração de todos os tipos de documento |
| Teste de Regressão | Validação após cada sprint |
| Teste de Acessibilidade | Navegação por teclado, leitores de tela |
| Teste de Cross-Browser | Chrome, Firefox, Safari, Edge |
| Teste de Responsividade | Mobile, Tablet, Desktop |
| Teste de Impressão | Preview, PDF, qualidade de impressão |

### 3.2 Ambiente de Teste

| Componente | Especificação |
|------------|---------------|
| Chrome | Versão mais recente (2 últimos anos) |
| Firefox | Versão mais recente (2 últimos anos) |
| Safari | Versão mais recente (macOS/iOS) |
| Edge | Versão mais recente (Chromium-based) |
| Dispositivos Móveis | iOS Safari, Chrome Android |

### 3.3 Legenda de Prioridade

| Prioridade | Descrição | SLA |
|------------|-----------|-----|
| Crítica (P1) | Funcionalidade core, impede uso | 100% devem passar |
| Alta (P2) | Funcionalidade importante | >95% devem passar |
| Média (P3) | Melhoria de UX | >80% devem passar |
| Baixa (P4) | Funcionalidade secundária | >60% devem passar |

---

## 4. Casos de Teste por Módulo

---

### 4.1 Módulo: Formulário Principal

#### TC-FRM-001: Carregamento Inicial do Formulário

| Campo | Valor |
|-------|-------|
| **ID do Caso de Teste** | TC-FRM-001 |
| **Módulo** | Formulário Principal (form.js) |
| **Título** | Carregamento inicial do formulário |
| **Prioridade** | P1 — Crítica |
| **Pré-condições** | Página carregada sem erros |

**Caso de Teste:**

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Abrir a aplicação no navegador | URL: localhost:3000 | Página carrega completamente |
| 2 | Verificar campos visíveis | — | Todos os campos do formulário estão visíveis |
| 3 | Verificar estado inicial do botão | — | Botão "Gerar Recibo" está desabilitado |
| 4 | Verificar estado do checkbox | — | Checkbox de privacidade está desmarcado |
| 5 | Verificar quantidade de linhas de serviço | — | 1 linha de serviço pré-adicionada |
| 6 | Verificar data de emissão | — | Campo pré-preenchido com data atual |

**Critério de Aceite:** Página carrega em <3 segundos, todos os elementos visíveis, estado inicial correto.

---

#### TC-FRM-002: Habilitação do Botão ao Marcar Privacidade

| Campo | Valor |
|-------|-------|
| **ID do Caso de Teste** | TC-FRM-002 |
| **Módulo** | Formulário Principal (form.js) |
| **Título** | Habilitar botão ao marcar checkbox de privacidade |
| **Prioridade** | P1 — Crítica |
| **Pré-condições** | Formulário carregado, botão desabilitado |

**Caso de Teste:**

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Localizar checkbox de privacidade | — | Checkbox visível e desmarcado |
| 2 | Clicar no checkbox | — | Checkbox fica marcado |
| 3 | Verificar estado do botão | — | Botão continua desabilitado (campos obrigatórios não preenchidos) |
| 4 | Preencher todos os campos obrigatórios | Dados válidos completos | — |
| 5 | Verificar estado do botão | — | Botão habilitado e clicável |

**Critério de Aceite:** Botão permanece desabilitado até que checkbox E campos obrigatórios estejam válidos.

---

#### TC-FRM-003: Submissão de Formulário Válido

| Campo | Valor |
|-------|-------|
| **ID do Caso de Teste** | TC-FRM-003 |
| **Módulo** | Formulário Principal (form.js) |
| **Título** | Submissão de formulário com dados válidos |
| **Prioridade** | P1 — Crítica |
| **Pré-condições** | Todos os campos obrigatórios preenchidos, checkbox marcado |

**Caso de Teste:**

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Preencher dados mínimos obrigatórios | Cliente: João Silva, Cel: (11) 99999-9999, Benef.: Maria Ltda, Estabelecimento: completo, 1 serviço | Formulário completo |
| 2 | Marcar checkbox de privacidade | — | Checkbox marcado |
| 3 | Clicar em "Gerar Recibo Agora" | — | Botão mostra loading (spinner) |
| 4 | Aguardar processamento | — | Recibo gerado e renderizado |
| 5 | Verificar abertura do diálogo de impressão | — | window.print() acionado |

**Critério de Aceite:** Recibo gerado corretamente, diálogo de impressão aberto.

---

#### TC-FRM-004: Reset do Formulário

| Campo | Valor |
|-------|-------|
| **ID do Caso de Teste** | TC-FRM-004 |
| **Módulo** | Formulário Principal (form.js) |
| **Título** | Reset do formulário após geração |
| **Prioridade** | P3 — Média |
| **Pré-condições** | Recibo gerado com sucesso |

**Caso de Teste:**

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Após geração, confirmar reset | Modal: "Deseja criar outro documento?" | Modal exibido |
| 2 | Confirmar reset | Clicar em "Sim" | Formulário limpo, 1 linha de serviço |
| 3 | Cancelar reset | Clicar em "Não" | Formulário mantém dados |

**Critério de Aceite:** Reset limpa todos os campos, mantém estado inicial do botão.

---

### 4.2 Módulo: Informações do Recibo

#### TC-INF-001: Seleção de Tipo de Recibo

| Campo | Valor |
|-------|-------|
| **ID do Caso de Teste** | TC-INF-001 |
| **Módulo** | Informações do Recibo |
| **Título** | Seleção de tipo de documento |
| **Prioridade** | P1 — Crítica |
| **Pré-condições** | Campo select visível |

**Caso de Teste:**

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Verificar opções disponíveis | — | 4 opções: Recibo, Orçamento, Ordem de Serviço, Comprovante de Pagamento |
| 2 | Selecionar "Recibo" | Recibo | Título no documento: "RECIBO" |
| 3 | Selecionar "Orçamento" | Orçamento | Título no documento: "ORÇAMENTO" |
| 4 | Selecionar "Ordem de Serviço" | Ordem de Serviço | Título no documento: "ORDEM DE SERVIÇO" |
| 5 | Selecionar "Comprovante de Pagamento" | Comprovante de Pagamento | Título no documento: "COMPROVANTE DE PAGAMENTO" |
| 6 | Não selecionar nenhuma opção | Valor padrão | Erro: "Selecione o tipo de documento" |

**Critério de Aceite:** Cada tipo gera título correspondente no documento.

---

#### TC-INF-002: Data de Emissão

| Campo | Valor |
|-------|-------|
| **ID do Caso de Teste** | TC-INF-002 |
| **Módulo** | Informações do Recibo |
| **Título** | Preenchimento e formatação de data |
| **Prioridade** | P2 — Alta |
| **Pré-condições** | Campo date visível |

**Caso de Teste:**

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Verificar valor inicial | — | Data atual pré-preenchida (AAAA-MM-DD) |
| 2 | Alterar data para passado | 2020-01-15 | Campo aceita valor |
| 3 | Gerar recibo | — | Data formatada em português: "15 de janeiro de 2020" |
| 4 | Alterar data para futuro | 2030-06-20 | Campo aceita valor |
| 5 | Gerar recibo | — | Data formatada em português: "20 de junho de 2030" |

**Critério de Aceite:** Data formatada corretamente em português no recibo gerado.

---

### 4.3 Módulo: Upload de Logo

#### TC-LOG-001: Upload de Imagem via Drag and Drop

| Campo | Valor |
|-------|-------|
| **ID do Caso de Teste** | TC-LOG-001 |
| **Módulo** | Upload de Logo (logo.js) |
| **Título** | Upload de logo via drag and drop |
| **Prioridade** | P2 — Alta |
| **Pré-condições** | Dropzone visível, arquivo PNG <2MB preparado |

**Caso de Teste:**

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Verificar estado inicial da dropzone | — | Ícone upload + instruções visíveis |
| 2 | Arrastar arquivo PNG válido sobre a dropzone | logo.png (500KB) | Borda destacada + overlay visual |
| 3 | Soltar arquivo | — | Miniatura da logo exibida |
| 4 | Verificar botão "Remover" | — | Botão visível |
| 5 | Clicar em "Remover" | — | Logo removida, estado inicial restaurado |

**Critério de Aceite:** Upload funciona via drag and drop, preview exibido, remoção funcional.

---

#### TC-LOG-002: Upload de Imagem via Clique

| Campo | Valor |
|-------|-------|
| **ID do Caso de Teste** | TC-LOG-002 |
| **Módulo** | Upload de Logo (logo.js) |
| **Título** | Upload de logo via clique no input file |
| **Prioridade** | P2 — Alta |
| **Pré-condições** | Dropzone visível |

**Caso de Teste:**

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Clicar na dropzone | — | File picker do sistema abre |
| 2 | Selecionar arquivo JPG válido | logo.jpg (1MB) | Miniatura da logo exibida |
| 3 | Gerar recibo com logo | — | Logo impressa no documento |

**Critério de Aceite:** File picker abre, arquivo carregado, logo impressa.

---

#### TC-LOG-003: Validação de Formato de Arquivo

| Campo | Valor |
|-------|-------|
| **ID do Caso de Teste** | TC-LOG-003 |
| **Módulo** | Upload de Logo (logo.js) |
| **Título** | Rejeição de formatos não suportados |
| **Prioridade** | P2 — Alta |
| **Pré-condições** | Dropzone visível |

**Caso de Teste:**

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Tentar upload de PDF | documento.pdf | Erro: "Formato não suportado" |
| 2 | Tentar upload de EXE | app.exe | Erro: "Formato não suportado" |
| 3 | Tentar upload de TXT | readme.txt | Erro: "Formato não suportado" |
| 4 | Upload de PNG válido | logo.png | Sucesso, sem erro |

**Critério de Aceite:** Apenas PNG, JPG, SVG, WEBP aceitos.

---

#### TC-LOG-004: Validação de Tamanho de Arquivo

| Campo | Valor |
|-------|-------|
| **ID do Caso de Teste** | TC-LOG-004 |
| **Módulo** | Upload de Logo (logo.js) |
| **Título** | Rejeição de arquivos maiores que 2MB |
| **Prioridade** | P2 — Alta |
| **Pré-condições** | Dropzone visível |

**Caso de Teste:**

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Upload de arquivo PNG de 2.5MB | logo_grande.png (2.5MB) | Erro: "Arquivo deve ter no máximo 2MB" |
| 2 | Upload de arquivo PNG de 2MB | logo_ok.png (2MB) | Sucesso, miniatura exibida |
| 3 | Upload de arquivo PNG de 1.99MB | logo_quase.png (1.99MB) | Sucesso, miniatura exibida |

**Critério de Aceite:** Arquivos >2MB rejeitados com mensagem clara.

---

#### TC-LOG-005: Inserção de Logo via URL

| Campo | Valor |
|-------|-------|
| **ID do Caso de Teste** | TC-LOG-005 |
| **Módulo** | Upload de Logo (logo.js) |
| **Título** | Inserção de logo via URL externa |
| **Prioridade** | P3 — Média |
| **Pré-condições** | Campo URL visível |

**Caso de Teste:**

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Inserir URL válida de imagem | https://exemplo.com/logo.png | Prévia exibida com sucesso |
| 2 | Inserir URL inválida | https://exemplo.com/404.png | Erro: "Não foi possível carregar a imagem" |
| 3 | Inserir texto que não é URL | logo-exemplo | Erro: "URL inválida" |

**Critério de Aceite:** URLs válidas carregam prévia, URLs inválidas mostram erro.

---

#### TC-LOG-006: Sanitização de SVG

| Campo | Valor |
|-------|-------|
| **ID do Caso de Teste** | TC-LOG-006 |
| **Módulo** | Upload de Logo (logo.js) |
| **Título** | Remoção de scripts maliciosos em SVG |
| **Prioridade** | P1 — Crítica |
| **Pré-condições** | Dropzone visível |

**Caso de Teste:**

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Upload de SVG com script | logo_maliciosa.svg (com `<script>`) | Script removido, logo processada |
| 2 | Upload de SVG com onload | logo_onload.svg (com `onload="..."`) | Evento removido |
| 3 | Upload de SVG com javascript:href | logo_js_href.svg (com `href="javascript:..."`) | href sanitizado |

**Critério de Aceite:** Elementos potencialmente maliciosos removidos do SVG.

---

### 4.4 Módulo: Dados do Cliente

#### TC-CLI-001: Preenchimento de Dados Obrigatórios

| Campo | Valor |
|-------|-------|
| **ID do Caso de Teste** | TC-CLI-001 |
| **Módulo** | Dados do Cliente |
| **Título** | Preenchimento correto de campos obrigatórios |
| **Prioridade** | P1 — Crítica |
| **Pré-condições** | Campos visíveis |

**Caso de Teste:**

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Preencher Nome Completo | João Carlos da Silva | Nome aceito, sem erro |
| 2 | Preencher Celular | 11999998888 | Máscara aplicada: (11) 99999-8888 |
| 3 | Deixar CPF/CNPJ vazio | — | Campo opcional, sem erro |
| 4 | Submeter formulário | — | Campos válidos |

**Critério de Aceite:** Nome aceito com 3+ caracteres, celular formatado corretamente.

---

#### TC-CLI-002: Validação de Nome Mínimo

| Campo | Valor |
|-------|-------|
| **ID do Caso de Teste** | TC-CLI-002 |
| **Módulo** | Dados do Cliente |
| **Título** | Rejeição de nomes com menos de 3 caracteres |
| **Prioridade** | P2 — Alta |
| **Pré-condições** | Campo nome visível |

**Caso de Teste:**

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Inserir 1 caractere | A | Erro: "Nome deve ter no mínimo 3 caracteres" |
| 2 | Inserir 2 caracteres | AB | Erro: "Nome deve ter no mínimo 3 caracteres" |
| 3 | Inserir 3 caracteres | ABC | Nome aceito, erro removido |

**Critério de Aceite:** Nomes com <3 caracteres rejeitados com mensagem clara.

---

#### TC-CLI-003: Validação de CPF Válido

| Campo | Valor |
|-------|-------|
| **ID do Caso de Teste** | TC-CLI-003 |
| **Módulo** | Dados do Cliente |
| **Título** | Aceitação de CPF com dígitos verificadores válidos |
| **Prioridade** | P2 — Alta |
| **Pré-condições** | Campo CPF visível |

**Caso de Teste:**

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Inserir CPF válido | 529.982.247-62 | CPF aceito, máscara aplicada |
| 2 | Inserir outro CPF válido | 111.444.777-35 | CPF aceito, máscara aplicada |
| 3 | Verificar formatação no recibo | — | CPF impresso com máscara |

**Critério de Aceite:** CPFs válidos aceitos e formatados corretamente.

---

#### TC-CLI-004: Validação de CPF Inválido

| Campo | Valor |
|-------|-------|
| **ID do Caso de Teste** | TC-CLI-004 |
| **Módulo** | Dados do Cliente |
| **Título** | Rejeição de CPF com dígitos verificadores inválidos |
| **Prioridade** | P2 — Alta |
| **Pré-condições** | Campo CPF visível |

**Caso de Teste:**

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Inserir CPF com dígito errado | 529.982.247-63 | Erro: "CPF inválido" |
| 2 | Inserir CPF com zeros | 000.000.000-00 | Erro: "CPF inválido" |
| 3 | Inserir CPF com números sequenciais | 123.456.789-09 | Erro: "CPF inválido" |
| 4 | Corrigir para CPF válido | 529.982.247-62 | Erro removido, CPF aceito |

**Critério de Aceite:** CPFs inválidos rejeitados, dígitos verificadores validados.

---

#### TC-CLI-005: Validação de Celular

| Campo | Valor |
|-------|-------|
| **ID do Caso de Teste** | TC-CLI-005 |
| **Módulo** | Dados do Cliente |
| **Título** | Validação de formato de celular |
| **Prioridade** | P2 — Alta |
| **Pré-condições** | Campo celular visível |

**Caso de Teste:**

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Inserir número com 8 dígitos | 99998888 | Erro: "Celular inválido" |
| 2 | Inserir número com formato correto | 11999998888 | Máscara: (11) 99999-8888 |
| 3 | Inserir DDD inválido (00) | 00999998888 | Erro: "DDD inválido" |
| 4 | Inserir DDD inválido (99) | 99999998888 | Erro: "DDD inválido" |

**Critério de Aceite:** Celular deve ter DDD válido + 9 dígitos.

---

### 4.5 Módulo: Dados do Beneficiário

#### TC-BEN-001: Preenchimento de Dados Obrigatórios

| Campo | Valor |
|-------|-------|
| **ID do Caso de Teste** | TC-BEN-001 |
| **Módulo** | Dados do Beneficiário |
| **Título** | Preenchimento correto de campos |
| **Prioridade** | P1 — Crítica |
| **Pré-condições** | Campos visíveis |

**Caso de Teste:**

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Preencher Nome Completo | Empresa XYZ Ltda | Nome aceito |
| 2 | Preencher Celular | (21) 98765-4321 | Máscara aplicada |
| 3 | Preencher CPF/CNPJ | 12.345.678/0001-90 | Máscara e validação CNPJ |
| 4 | Deixar Celular vazio | — | Campo opcional, sem erro |

**Critério de Aceite:** Nome obrigatório aceito, campos opcionais funcionais.

---

#### TC-BEN-002: Validação de CNPJ Válido

| Campo | Valor |
|-------|-------|
| **ID do Caso de Teste** | TC-BEN-002 |
| **Módulo** | Dados do Beneficiário |
| **Título** | Aceitação de CNPJ com dígitos verificadores válidos |
| **Prioridade** | P2 — Alta |
| **Pré-condições** | Campo CNPJ visível |

**Caso de Teste:**

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Inserir CNPJ válido | 11.444.777/0001-61 | CNPJ aceito, máscara aplicada |
| 2 | Inserir outro CNPJ válido | 55.773.812/0001-55 | CNPJ aceito, máscara aplicada |

**Critério de Aceite:** CNPJs válidos aceitos e formatados.

---

#### TC-BEN-003: Validação de CNPJ Inválido

| Campo | Valor |
|-------|-------|
| **ID do Caso de Teste** | TC-BEN-003 |
| **Módulo** | Dados do Beneficiário |
| **Título** | Rejeição de CNPJ com dígitos verificadores inválidos |
| **Prioridade** | P2 — Alta |
| **Pré-condições** | Campo CNPJ visível |

**Caso de Teste:**

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Inserir CNPJ com dígito errado | 11.444.777/0001-62 | Erro: "CNPJ inválido" |
| 2 | Inserir CNPJ com menos dígitos | 11.444.777/0001-6 | Erro: "CNPJ incompleto" |

**Critério de Aceite:** CNPJs inválidos rejeitados.

---

### 4.6 Módulo: Dados do Veículo

#### TC-VEI-001: Preenchimento de Campos Obrigatórios

| Campo | Valor |
|-------|-------|
| **ID do Caso de Teste** | TC-VEI-001 |
| **Módulo** | Dados do Veículo |
| **Título** | Preenchimento completo de dados do veículo |
| **Prioridade** | P2 — Alta |
| **Pré-condições** | Seção veículo visível |

**Caso de Teste:**

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Preencher Modelo | Fiat Strada | Modelo aceito |
| 2 | Preencher Placa (Mercosul) | ABC-1D23 | Máscara aplicada |
| 3 | Preencher Ano | 2024 | Ano aceito |
| 4 | Gerar recibo | — | Seção veículo impressa |

**Critério de Aceite:** Campos aceitos, seção impressa no recibo.

---

#### TC-VEI-002: Validação de Placa Mercosul

| Campo | Valor |
|-------|-------|
| **ID do Caso de Teste** | TC-VEI-002 |
| **Módulo** | Dados do Veículo |
| **Título** | Validação de placa no formato Mercosul |
| **Prioridade** | P3 — Média |
| **Pré-condições** | Campo placa visível |

**Caso de Teste:**

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Inserir placa Mercosul | ABC-1D23 | Placa aceita |
| 2 | Inserir placa antiga | ABC-1234 | Placa aceita |
| 3 | Inserir placa incompleta | ABC-12 | Erro: "Placa incompleta" |
| 4 | Inserir placa com caracteres inválidos | ABD-1X23 | Erro: "Placa inválida" |

**Critério de Aceite:** Ambos formatos (Mercosul e antigo) aceitos.

---

#### TC-VEI-003: Validação de Ano do Veículo

| Campo | Valor |
|-------|-------|
| **ID do Caso de Teste** | TC-VEI-003 |
| **Módulo** | Dados do Veículo |
| **Título** | Validação de ano do veículo |
| **Prioridade** | P2 — Alta |
| **Pré-condições** | Campo ano visível |

**Caso de Teste:**

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Inserir ano válido | 2024 | Ano aceito |
| 2 | Inserir ano futuro (+1) | 2027 | Ano aceito |
| 3 | Inserir ano muito antigo | 1800 | Erro: "Ano deve ser entre 1900 e ano atual + 1" |
| 4 | Inserir ano futuro distante | 2050 | Erro: "Ano deve ser entre 1900 e ano atual + 1" |
| 5 | Inserir 3 dígitos | 999 | Erro: "Ano deve ter 4 dígitos" |

**Critério de Aceite:** Anos válidos (1900 a ano+1) aceitos.

---

#### TC-VEI-004: Visibilidade Condicional da Seção

| Campo | Valor |
|-------|-------|
| **ID do Caso de Teste** | TC-VEI-004 |
| **Módulo** | Dados do Veículo |
| **Título** | Seção veículo exibida conforme preenchimento |
| **Prioridade** | P3 — Média |
| **Pré-condições** | Recibo sendo gerado |

**Caso de Teste:**

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Deixar todos os campos vazios | — | Seção veículo não aparece no recibo |
| 2 | Preencher apenas Modelo | Fiat Strada | Seção veículo aparece no recibo |
| 3 | Preencher Modelo e Ano | Fiat Strada, 2024 | Seção veículo aparece no recibo |

**Critério de Aceite:** Seção impressa se ao menos um campo preenchido.

---

### 4.7 Módulo: Dados do Estabelecimento

#### TC-EST-001: Preenchimento Completo de Endereço

| Campo | Valor |
|-------|-------|
| **ID do Caso de Teste** | TC-EST-001 |
| **Módulo** | Dados do Estabelecimento |
| **Título** | Preenchimento de todos os campos de endereço |
| **Prioridade** | P1 — Crítica |
| **Pré-condições** | Campos visíveis |

**Caso de Teste:**

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Preencher Nome da Empresa | Lava-jato Express | Nome aceito |
| 2 | Selecionar Estado | São Paulo | Estado selecionado |
| 3 | Selecionar Cidade | São Paulo | Cidade populada e selecionada |
| 4 | Preencher Bairro | Centro | Bairro aceito |
| 5 | Preencher CEP | 01310-100 | Máscara aplicada |
| 6 | Preencher Rua/Logradouro | Av. Paulista | Rua aceita |
| 7 | Preencher Número | 1000 | Número aceito |

**Critério de Aceite:** Todos os campos aceitos, cidade populada após estado.

---

#### TC-EST-002: Carregamento Dinâmico de Cidades

| Campo | Valor |
|-------|-------|
| **ID do Caso de Teste** | TC-EST-002 |
| **Módulo** | Dados do Estabelecimento (location.js) |
| **Título** | População de cidades ao selecionar estado |
| **Prioridade** | P2 — Alta |
| **Pré-condições** | Campos estado e cidade visíveis |

**Caso de Teste:**

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Verificar estado inicial da cidade | — | Campo desabilitado com "Selecione o estado primeiro" |
| 2 | Selecionar Estado | Rio de Janeiro | Campo cidade habilitado, cidades do RJ listadas |
| 3 | Selecionar Estado | Minas Gerais | Campo cidade habilitado, cidades de MG listadas |
| 4 | Selecionar Estado | Amazonas | Campo cidade habilitado, cidades do AM listadas |
| 5 | Alterar Estado | De MG para SP | Campo cidade limpa e repopula com cidades de SP |

**Critério de Aceite:** Cidades populadas dinamicamente, correspondentes ao estado.

---

#### TC-EST-003: Validação de CEP

| Campo | Valor |
|-------|-------|
| **ID do Caso de Teste** | TC-EST-003 |
| **Módulo** | Dados do Estabelecimento |
| **Título** | Validação de formato de CEP |
| **Prioridade** | P2 — Alta |
| **Pré-condições** | Campo CEP visível |

**Caso de Teste:**

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Inserir CEP completo | 01310100 | Máscara: 01310-100 |
| 2 | Inserir CEP incompleto | 01310 | Erro: "CEP incompleto" |
| 3 | Inserir CEP com letras | 01310-ABC | Erro: "CEP deve conter apenas números" |

**Critério de Aceite:** CEP aceito apenas no formato 00000-000.

---

### 4.8 Módulo: Serviços e Produtos

#### TC-SRV-001: Adição de Serviço

| Campo | Valor |
|-------|-------|
| **ID do Caso de Teste** | TC-SRV-001 |
| **Módulo** | Serviços/Produtos (services.js) |
| **Título** | Adicionar novo serviço à lista |
| **Prioridade** | P1 — Crítica |
| **Pré-condições** | Lista de serviços visível |

**Caso de Teste:**

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Verificar linha inicial | — | 1 linha presente com campos vazios |
| 2 | Preencher primeiro serviço | Lavagem completa, 50.00 | Linha preenchida |
| 3 | Clicar em "+ Adicionar serviço" | — | Nova linha adicionada ao final |
| 4 | Verificar total | — | Total atualizado: R$ 50,00 |
| 5 | Preencher segundo serviço | Cera, 30.00 | Total atualizado: R$ 80,00 |

**Critério de Aceite:** Serviços adicionados, total recalculado em tempo real.

---

#### TC-SRV-002: Remoção de Serviço

| Campo | Valor |
|-------|-------|
| **ID do Caso de Teste** | TC-SRV-002 |
| **Módulo** | Serviços/Produtos (services.js) |
| **Título** | Remover serviço da lista |
| **Prioridade** | P1 — Crítica |
| **Pré-condições** | Lista com 2+ serviços |

**Caso de Teste:**

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Verificar 2 serviços na lista | S1: 50, S2: 30 | Total: R$ 80,00 |
| 2 | Clicar em "×" do segundo serviço | — | Segunda linha removida |
| 3 | Verificar total | — | Total atualizado: R$ 50,00 |

**Critério de Aceite:** Serviço removido, total recalculado.

---

#### TC-SRV-003: Restrição de Remoção da Única Linha

| Campo | Valor |
|-------|-------|
| **ID do Caso de Teste** | TC-SRV-003 |
| **Módulo** | Serviços/Produtos (services.js) |
| **Título** | Primeira linha não pode ser removida se for única |
| **Prioridade** | P2 — Alta |
| **Pré-condições** | Apenas 1 serviço na lista |

**Caso de Teste:**

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Verificar 1 serviço na lista | — | Botão "×" oculto ou desabilitado |
| 2 | Tentar remover (se botão visível) | — | Linha não removida |
| 3 | Adicionar serviço | — | 2 serviços presentes |
| 4 | Agora botão "×" visível | — | Remoção permitida |

**Critério de Aceite:** Última linha não pode ser removida.

---

#### TC-SRV-004: Cálculo de Total com Múltiplos Serviços

| Campo | Valor |
|-------|-------|
| **ID do Caso de Teste** | TC-SRV-004 |
| **Módulo** | Serviços/Produtos (services.js) |
| **Título** | Cálculo correto de total com decimais |
| **Prioridade** | P1 — Crítica |
| **Pré-condições** | Lista de serviços visível |

**Caso de Teste:**

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Adicionar 3 serviços | 10.50, 20.30, 15.20 | — |
| 2 | Verificar total | — | R$ 46,00 (formato BRL) |
| 3 | Alterar valor do primeiro | De 10.50 para 15.00 | Total atualizado: R$ 50,50 |
| 4 | Inserir valor com muitas casas | 10.999 | Arredondado ou truncado para 2 casas |

**Critério de Aceite:** Total calcula corretamente, formatação BRL.

---

#### TC-SRV-005: Validação de Serviço Obrigatório

| Campo | Valor |
|-------|-------|
| **ID do Caso de Teste** | TC-SRV-005 |
| **Módulo** | Serviços/Produtos (services.js) |
| **Título** | Ao menos um serviço deve estar preenchido |
| **Prioridade** | P1 — Crítica |
| **Pré-condições** | Formulário completo exceto serviços |

**Caso de Teste:**

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Deixar todos os campos de serviço vazios | — | Erro ao submeter: "Adicione ao menos um serviço" |
| 2 | Preencher apenas descrição | Lavagem | Erro: "Informe o valor do serviço" |
| 3 | Preencher apenas valor | 50.00 | Erro: "Informe a descrição do serviço" |
| 4 | Preencher descrição e valor | Lavagem, 50.00 | Sem erro |

**Critério de Aceite:** Erro claro quando nenhum serviço completo presente.

---

#### TC-SRV-006: Formatação de Valor Monetário

| Campo | Valor |
|-------|-------|
| **ID do Caso de Teste** | TC-SRV-006 |
| **Módulo** | Serviços/Produtos (services.js) |
| **Título** | Valores formatados em Real brasileiro |
| **Prioridade** | P2 — Alta |
| **Pré-condições** | Campo de valor visível |

**Caso de Teste:**

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Inserir valor sem separador | 1000 | Exibido como: R$ 1.000,00 |
| 2 | Inserir valor com separador | 1.500,50 | Exibido como: R$ 1.500,50 |
| 3 | Inserir valor negativo | -50 | Erro: "Valor deve ser positivo" |
| 4 | Inserir valor zero | 0 | Erro: "Valor deve ser positivo" |

**Critério de Aceite:** Valores positivos aceitos, formato BRL consistente.

---

### 4.9 Módulo: Observações

#### TC-OBS-001: Campo de Observações Opcional

| Campo | Valor |
|-------|-------|
| **ID do Caso de Teste** | TC-OBS-001 |
| **Módulo** | Observações |
| **Título** | Inserção de texto em observações |
| **Prioridade** | P3 — Média |
| **Pré-condições** | Campo textarea visível |

**Caso de Teste:**

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Deixar campo vazio | — | Campo opcional, sem erro |
| 2 | Inserir texto curto | "Pagamento em dinheiro" | Texto aceito |
| 3 | Inserir texto longo | 500 caracteres | Texto aceito |
| 4 | Inserir mais de 500 caracteres | 550 caracteres | Campo impede ou corta |

**Critério de Aceite:** Campo opcional, limite de 500 caracteres respeitado.

---

#### TC-OBS-002: Exibição Condicional no Recibo

| Campo | Valor |
|-------|-------|
| **ID do Caso de Teste** | TC-OBS-002 |
| **Módulo** | Observações |
| **Título** | Observações impressas apenas se preenchidas |
| **Prioridade** | P3 — Média |
| **Pré-condições** | Gerando recibo |

**Caso de Teste:**

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Deixar observações vazias | — | Seção observações não impressa |
| 2 | Preencher observações | "Garantia de 30 dias" | Seção observações impressa |

**Critério de Aceite:** Seção visível apenas se observações preenchidas.

---

### 4.10 Módulo: Geração do Recibo

#### TC-GER-001: Geração Completa de Recibo

| Campo | Valor |
|-------|-------|
| **ID do Caso de Teste** | TC-GER-001 |
| **Módulo** | Geração do Recibo (receipt-builder.js) |
| **Título** | Geração de recibo com todos os campos |
| **Prioridade** | P1 — Crítica |
| **Pré-condições** | Formulário completamente preenchido |

**Caso de Teste:**

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Preencher todos os campos | Dados completos | Formulário válido |
| 2 | Marcar checkbox de privacidade | — | Checkbox marcado |
| 3 | Clicar em "Gerar Recibo Agora" | — | Recibo renderizado na div preview |
| 4 | Verificar título | — | Título correto baseado no tipo |
| 5 | Verificar data | — | Data formatada em português |
| 6 | Verificar cliente | — | Nome e celular impressos |
| 7 | Verificar beneficiário | — | Nome e dados impressos |
| 8 | Verificar veículo | — | Modelo, placa, ano impressos |
| 9 | Verificar estabelecimento | — | Endereço completo impresso |
| 10 | Verificar serviços | — | Lista com valores e total |
| 11 | Verificar total | — | Soma correta |

**Critério de Aceite:** Recibo contém todos os dados inseridos, formatados corretamente.

---

#### TC-GER-002: Visibilidade Condicional no Recibo

| Campo | Valor |
|-------|-------|
| **ID do Caso de Teste** | TC-GER-002 |
| **Módulo** | Geração do Recibo (receipt-builder.js) |
| **Título** | Seções opcionais exibidas conforme preenchimento |
| **Prioridade** | P2 — Alta |
| **Pré-condições** | Gerando recibo |

**Caso de Teste:**

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Gerar sem logo | — | Recibo sem logo |
| 2 | Gerar sem veículo | — | Recibo sem seção veículo |
| 3 | Gerar sem estabelecimento | — | Recibo sem seção estabelecimento |
| 4 | Gerar sem observações | — | Recibo sem seção observações |

**Critério de Aceite:** Seções opcionais ausentes se campos vazios.

---

#### TC-GER-003: Geração via window.print()

| Campo | Valor |
|-------|-------|
| **ID do Caso de Teste** | TC-GER-003 |
| **Módulo** | Geração do Recibo (receipt-builder.js) |
| **Título** | Acionamento do diálogo de impressão |
| **Prioridade** | P1 — Crítica |
| **Pré-condições** | Recibo gerado |

**Caso de Teste:**

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Clicar em "Imprimir / Salvar PDF" | — | window.print() executado |
| 2 | Verificar diálogo do navegador | — | Diálogo nativo aberto |
| 3 | Cancelar impressão | — | Formulário permanece intacto |

**Critério de Aceite:** Diálogo de impressão abre corretamente.

---

### 4.11 Módulo: Validação de Campos

#### TC-VAL-001: Validação em Tempo Real (on-blur)

| Campo | Valor |
|-------|-------|
| **ID do Caso de Teste** | TC-VAL-001 |
| **Módulo** | Validação (validator.js) |
| **Título** | Erros exibidos ao sair do campo |
| **Prioridade** | P2 — Alta |
| **Pré-condições** | Campo com erro |

**Caso de Teste:**

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Digitar nome inválido e sair do campo | A | Erro inline aparece |
| 2 | Corrigir para nome válido | João | Erro removido |
| 3 | Tocar em outro campo sem digitar | — | Erro persiste se campo continua inválido |

**Critério de Aceite:** Erros aparecem/removem em tempo real.

---

#### TC-VAL-002: Scroll até Primeiro Erro

| Campo | Valor |
|-------|-------|
| **ID do Caso de Teste** | TC-VAL-002 |
| **Módulo** | Validação (validator.js) |
| **Título** | Scroll automático até campo inválido |
| **Prioridade** | P3 — Média |
| **Pré-condições** | Múltiplos erros de validação |

**Caso de Teste:**

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Preencher formulário com erros | Nome: "", Cel: "" | Erros visíveis |
| 2 | Submeter formulário | — | Scroll até primeiro campo inválido |
| 3 | Verificar foco | — | Primeiro campo inválido em foco |

**Critério de Aceite:** Scroll suave até primeiro campo inválido.

---

#### TC-VAL-003: Classe CSS de Erro

| Campo | Valor |
|-------|-------|
| **ID do Caso de Teste** | TC-VAL-003 |
| **Módulo** | Validação (validator.js) |
| **Título** | Aplicação de estilos visuais de erro |
| **Prioridade** | P2 — Alta |
| **Pré-condições** | Campo inválido |

**Caso de Teste:**

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Deixar campo obrigatório vazio | — | Classe .field-error aplicada |
| 2 | Verificar estilo visual | — | Borda vermelha no campo |
| 3 | Corrigir campo | — | Classe .field-error removida |

**Critério de Aceite:** Estilos aplicados/removidos corretamente.

---

### 4.12 Módulo: Máscaras de Input

#### TC-MSK-001: Máscara de CPF

| Campo | Valor |
|-------|-------|
| **ID do Caso de Teste** | TC-MSK-001 |
| **Módulo** | Máscaras (masks.js) |
| **Título** | Aplicação de máscara de CPF |
| **Prioridade** | P2 — Alta |
| **Pré-condições** | Campo CPF visível |

**Caso de Teste:**

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Digitar 9 primeiros dígitos | 529982247 | Exibido: 529.982.247-__ |
| 2 | Digitar dígito verificador | 62 | Exibido: 529.982.247-62 |

**Critério de Aceite:** Máscara 000.000.000-00 aplicada automaticamente.

---

#### TC-MSK-002: Máscara de CNPJ

| Campo | Valor |
|-------|-------|
| **ID do Caso de Teste** | TC-MSK-002 |
| **Módulo** | Máscaras (masks.js) |
| **Título** | Aplicação de máscara de CNPJ |
| **Prioridade** | P2 — Alta |
| **Pré-condições** | Campo CNPJ visível |

**Caso de Teste:**

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Digitar 12 primeiros dígitos | 114447770001 | Exibido: 11.444.777/0001-__ |
| 2 | Digitar dígitos verificadores | 61 | Exibido: 11.444.777/0001-61 |

**Critério de Aceite:** Máscara 00.000.000/0000-00 aplicada automaticamente.

---

#### TC-MSK-003: Máscara de Celular

| Campo | Valor |
|-------|-------|
| **ID do Caso de Teste** | TC-MSK-003 |
| **Módulo** | Máscaras (masks.js) |
| **Título** | Aplicação de máscara de celular brasileiro |
| **Prioridade** | P2 — Alta |
| **Pré-condições** | Campo celular visível |

**Caso de Teste:**

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Digitar DDD + 8 dígitos | 1199998888 | Exibido: (11) 99999-8888 |
| 2 | Digitar número com 9 dígitos direto | 999998888 | Exibido: (99) 99998-8888 |

**Critério de Aceite:** Máscara (00) 00000-0000 aplicada automaticamente.

---

#### TC-MSK-004: Máscara de CEP

| Campo | Valor |
|-------|-------|
| **ID do Caso de Teste** | TC-MSK-004 |
| **Módulo** | Máscaras (masks.js) |
| **Título** | Aplicação de máscara de CEP |
| **Prioridade** | P2 — Alta |
| **Pré-condições** | Campo CEP visível |

**Caso de Teste:**

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Digitar 5 primeiros dígitos | 01310 | Exibido: 01310-___ |
| 2 | Digitar dígitos finais | 100 | Exibido: 01310-100 |

**Critério de Aceite:** Máscara 00000-000 aplicada automaticamente.

---

#### TC-MSK-005: Máscara de Placa

| Campo | Valor |
|-------|-------|
| **ID do Caso de Teste** | TC-MSK-005 |
| **Módulo** | Máscaras (masks.js) |
| **Título** | Aplicação de máscara de placa Mercosul e antiga |
| **Prioridade** | P3 — Média |
| **Pré-condições** | Campo placa visível |

**Caso de Teste:**

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Digitar placa Mercosul | ABC1D23 | Exibido: ABC-1D23 |
| 2 | Digitar placa antiga | ABC1234 | Exibido: ABC-1234 |

**Critério de Aceite:** Ambos formatos suportados com máscara AAA-0000 ou AAA-0A00.

---

## 5. Testes de Segurança e Privacidade

#### TC-SEG-001: Transmissão Zero de Dados

| Campo | Valor |
|-------|-------|
| **ID do Caso de Teste** | TC-SEG-001 |
| **Módulo** | Segurança |
| **Título** | Nenhum dado enviado a servidores externos |
| **Prioridade** | P1 — Crítica |
| **Pré-condições** | DevTools aberto na aba Network |

**Caso de Teste:**

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Preencher todos os campos com dados sensíveis | CPF, CNPJ, nomes, valores | Dados no formulário |
| 2 | Clicar em "Gerar Recibo" | — | Nenhuma requisição fetch/XHR vista |
| 3 | Verificar Network tab | — | Zero requisições de rede |
| 4 | Gerar PDF | — | Nenhuma requisição POST/PUT |

**Critério de Aceite:** Zero requisições de rede com dados do formulário.

---

#### TC-SEG-002: CSP Headers

| Campo | Valor |
|-------|-------|
| **ID do Caso de Teste** | TC-SEG-002 |
| **Módulo** | Segurança |
| **Título** | Content Security Policy configurada |
| **Prioridade** | P2 — Alta |
| **Pré-condições** | DevTools aberto |

**Caso de Teste:**

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Verificar headers HTTP | — | CSP header presente |
| 2 | Verificar connect-src | — | connect-src: 'none' |
| 3 | Tentar fetch manual | fetch('https://exemplo.com') | Bloqueado pelo CSP |

**Critério de Aceite:** CSP configurada conforme especificação, requisições bloqueadas.

---

#### TC-SEG-003: Sem Cookies de Rastreamento

| Campo | Valor |
|-------|-------|
| **ID do Caso de Teste** | TC-SEG-003 |
| **Módulo** | Segurança |
| **Título** | Nenhum cookie de terceiros ou rastreamento |
| **Prioridade** | P2 — Alta |
| **Pré-condições** | DevTools aberto na aba Application |

**Caso de Teste:**

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Verificar cookies | — | Nenhum cookie criado |
| 2 | Verificar localStorage | — | Nenhum dado persistente |
| 3 | Verificar sessionStorage | — | Nenhum dado persistente |

**Critério de Aceite:** Zero cookies, dados não persistidos.

---

#### TC-SEG-004: Consentimento de Privacidade

| Campo | Valor |
|-------|-------|
| **ID do Caso de Teste** | TC-SEG-004 |
| **Módulo** | Segurança |
| **Título** | Checkbox de privacidade obrigatório |
| **Prioridade** | P1 — Crítica |
| **Pré-condições** | Checkbox visível |

**Caso de Teste:**

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Tentar gerar sem marcar | — | Botão desabilitado |
| 2 | Marcar checkbox | — | Botão habilitado |
| 3 | Desmarcar checkbox após gerar | — | Sem efeito (geração já concluída) |

**Critério de Aceite:** Checkbox obrigatório para habilitar geração.

---

## 6. Testes de Interface e Acessibilidade

#### TC-A11-001: Labels Associados aos Campos

| Campo | Valor |
|-------|-------|
| **ID do Caso de Teste** | TC-A11-001 |
| **Módulo** | Acessibilidade |
| **Título** | Todos os campos possuem label correto |
| **Prioridade** | P2 — Alta |
| **Pré-condições** | Inspecionar elemento |

**Caso de Teste:**

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Inspecionar cada campo | — | Cada campo tem `<label for="id_campo">` |
| 2 | Verificar input sem label | — | Nenhum campo órfão |
| 3 | Testar clique no label | — | Input recebe foco |

**Critério de Aceite:** WCAG 2.1 — 1.3.1 Info and Relationships.

---

#### TC-A11-002: Navegação por Teclado

| Campo | Valor |
|-------|-------|
| **ID do Caso de Teste** | TC-A11-002 |
| **Módulo** | Acessibilidade |
| **Título** | Navegação completa por teclado |
| **Prioridade** | P2 — Alta |
| **Pré-condições** | Página focada |

**Caso de Teste:**

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Pressionar Tab | — | Primeiro campo recebe foco |
| 2 | Navegar com Tab | — | Campos focados em ordem lógica |
| 3 | Pressionar Enter em select | — | Opções abertas |
| 4 | Pressionar Enter no botão | — | Ação executada |
| 5 | Pressionar Space no checkbox | — | Toggle executado |

**Critério de Aceite:** WCAG 2.1 — 2.1.1 Keyboard.

---

#### TC-A11-003: Contraste de Cores

| Campo | Valor |
|-------|-------|
| **ID do Caso de Teste** | TC-A11-003 |
| **Módulo** | Acessibilidade |
| **Título** | Contraste mínimo WCAG AA (4.5:1) |
| **Prioridade** | P2 — Alta |
| **Pré-condições** | Extensão de contraste instalada ou DevTools |

**Caso de Teste:**

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Verificar texto principal | — | Contraste ≥ 4.5:1 |
| 2 | Verificar texto pequeno | — | Contraste ≥ 4.5:1 |
| 3 | Verificar campos de erro | — | Contraste adequado |
| 4 | Testar tema escuro | — | Contraste mantido |

**Critério de Aceite:** WCAG 2.1 — 1.4.3 Contrast (Minimum).

---

#### TC-A11-004: Campos Obrigatórios Marcados

| Campo | Valor |
|-------|-------|
| **ID do Caso de Teste** | TC-A11-004 |
| **Módulo** | Acessibilidade |
| **Título** | Indicadores visuais e ARIA para campos obrigatórios |
| **Prioridade** | P3 — Média |
| **Pré-condições** | Inspecionar elementos |

**Caso de Teste:**

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Verificar marcador visual | — | Asterisco (*) nos obrigatórios |
| 2 | Verificar aria-required | — | aria-required="true" nos campos |
| 3 | Leitor de tela anuncia | — | "obrigatório" após label |

**Critério de Aceite:** WCAG 2.1 — 3.3.2 Labels or Instructions.

---

## 7. Testes de Impressão e PDF

#### TC-IMP-001: CSS @media print — Formulário Oculto

| Campo | Valor |
|-------|-------|
| **ID do Caso de Teste** | TC-IMP-001 |
| **Módulo** | Impressão |
| **Título** | Formulário não impresso |
| **Prioridade** | P1 — Crítica |
| **Pré-condições** | Preview do recibo aberto |

**Caso de Teste:**

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Abrir DevTools, tab Styles | — | @media print visível |
| 2 | Simular impressão | Ctrl+P / Cmd+P | Preview mostra apenas recibo |
| 3 | Verificar elements impressos | — | Formulário: display: none |

**Critério de Aceite:** Apenas recibo visível na preview de impressão.

---

#### TC-IMP-002: CSS @media print — Recibo Visível

| Campo | Valor |
|-------|-------|
| **ID do Caso de Teste** | TC-IMP-002 |
| **Módulo** | Impressão |
| **Título** | Recibo renderizado para impressão |
| **Prioridade** | P1 — Crítica |
| **Pré-condições** | Preview do recibo aberto |

**Caso de Teste:**

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Simular impressão | Ctrl+P | Recibo ocupa página completa |
| 2 | Verificar margins | — | Margens de 15mm aplicadas |
| 3 | Verificar fonte | — | Fonte ajustada para 11pt |

**Critério de Aceite:** Recibo formatado para impressão A4.

---

#### TC-IMP-003: Impressão Monocromática

| Campo | Valor |
|-------|-------|
| **ID do Caso de Teste** | TC-IMP-003 |
| **Módulo** | Impressão |
| **Título** | Cores adaptadas para impressão |
| **Prioridade** | P3 — Média |
| **Pré-condições** | Impressora monocromática ou simular impressão |

**Caso de Teste:**

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Verificar cores no print | — | Bordas em cinza, sem fundos coloridos |
| 2 | Verificar logo | — | Logo legível em preto e branco |
| 3 | Verificar texto | — | Texto com bom contraste |

**Critério de Aceite:** Impressão legível sem cores.

---

#### TC-IMP-004: Salvar como PDF

| Campo | Valor |
|-------|-------|
| **ID do Caso de Teste** | TC-IMP-004 |
| **Módulo** | Impressão |
| **Título** | PDF gerado corretamente via diálogo do navegador |
| **Prioridade** | P1 — Crítica |
| **Pré-condições** | Diálogo de impressão aberto |

**Caso de Teste:**

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Selecionar "Salvar como PDF" | — | Destino PDF disponível |
| 2 | Salvar PDF | — | PDF salvo localmente |
| 3 | Abrir PDF salvo | — | Recibo completo e legível |
| 4 | Verificar logo no PDF | — | Logo renderizada corretamente |

**Critério de Aceite:** PDF contém todos os dados, formato A4.

---

## 8. Testes de Navegadores e Dispositivos

#### TC-BRW-001: Compatibilidade Chrome

| Campo | Valor |
|-------|-------|
| **ID do Caso de Teste** | TC-BRW-001 |
| **Módulo** | Cross-Browser |
| **Título** | Funcionamento completo no Google Chrome |
| **Prioridade** | P1 — Crítica |
| **Pré-condições** | Chrome instalado |

**Caso de Teste:**

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Abrir aplicação no Chrome | Chrome (latest) | Página carrega corretamente |
| 2 | Preencher e gerar | Fluxo completo | Funciona sem erros |
| 3 | Imprimir | Ctrl+P | Diálogo funciona |

**Critério de Aceite:** 100% funcionalidade no Chrome.

---

#### TC-BRW-002: Compatibilidade Firefox

| Campo | Valor |
|-------|-------|
| **ID do Caso de Teste** | TC-BRW-002 |
| **Módulo** | Cross-Browser |
| **Título** | Funcionamento no Mozilla Firefox |
| **Prioridade** | P2 — Alta |
| **Pré-condições** | Firefox instalado |

**Caso de Teste:**

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Abrir aplicação no Firefox | Firefox (latest) | Página carrega corretamente |
| 2 | Preencher e gerar | Fluxo completo | Funciona sem erros |
| 3 | Imprimir | Ctrl+P | Diálogo funciona |

**Critério de Aceite:** 100% funcionalidade no Firefox.

---

#### TC-BRW-003: Compatibilidade Safari

| Campo | Valor |
|-------|-------|
| **ID do Caso de Teste** | TC-BRW-003 |
| **Módulo** | Cross-Browser |
| **Título** | Funcionamento no Safari (macOS/iOS) |
| **Prioridade** | P2 — Alta |
| **Pré-condições** | Safari instalado (macOS ou iOS simulator) |

**Caso de Teste:**

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Abrir aplicação no Safari | Safari (latest) | Página carrega corretamente |
| 2 | Testar @media print | Simular impressão | Layout não quebrado |
| 3 | Preencher e gerar | Fluxo completo | Funciona sem erros |

**Critério de Aceite:** Layout de impressão não quebrado no Safari.

---

#### TC-BRW-004: Compatibilidade Microsoft Edge

| Campo | Valor |
|-------|-------|
| **ID do Caso de Teste** | TC-BRW-004 |
| **Módulo** | Cross-Browser |
| **Título** | Funcionamento no Microsoft Edge (Chromium) |
| **Prioridade** | P2 — Alta |
| **Pré-condições** | Edge instalado |

**Caso de Teste:**

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Abrir aplicação no Edge | Edge (latest) | Página carrega corretamente |
| 2 | Preencher e gerar | Fluxo completo | Funciona sem erros |
| 3 | Imprimir | Ctrl+P | Diálogo funciona |

**Critério de Aceite:** 100% funcionalidade no Edge.

---

#### TC-BRW-005: Responsividade Mobile (iOS)

| Campo | Valor |
|-------|-------|
| **ID do Caso de Teste** | TC-BRW-005 |
| **Módulo** | Responsividade |
| **Título** | Layout responsivo em dispositivos iOS |
| **Prioridade** | P2 — Alta |
| **Pré-condições** | iPhone simulator ou dispositivo real |

**Caso de Teste:**

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Abrir no iPhone Safari | Viewport: 375x667 | Layout em coluna única |
| 2 | Preencher formulário | — | Campos acessíveis, scroll funcional |
| 3 | Testar dropzone | — | Upload funcional |
| 4 | Gerar recibo | — | Recibo legível |

**Critério de Aceite:** Layout mobile funcional.

---

#### TC-BRW-006: Responsividade Mobile (Android)

| Campo | Valor |
|-------|-------|
| **ID do Caso de Teste** | TC-BRW-006 |
| **Módulo** | Responsividade |
| **Título** | Layout responsivo em dispositivos Android |
| **Prioridade** | P2 — Alta |
| **Pré-condições** | Android emulator ou dispositivo real |

**Caso de Teste:**

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Abrir no Chrome Android | Viewport: 360x640 | Layout em coluna única |
| 2 | Preencher formulário | — | Campos acessíveis, scroll funcional |
| 3 | Testar dropzone | — | Upload funcional |
| 4 | Gerar recibo | — | Recibo legível |

**Critério de Aceite:** Layout mobile funcional.

---

#### TC-BRW-007: Responsividade Tablet

| Campo | Valor |
|-------|-------|
| **ID do Caso de Teste** | TC-BRW-007 |
| **Módulo** | Responsividade |
| **Título** | Layout responsivo em tablets |
| **Prioridade** | P3 — Média |
| **Pré-condições** | Tablet ou DevTools |

**Caso de Teste:**

| Step | Descrição | Dados de Teste | Resultado Esperado |
|------|-----------|----------------|-------------------|
| 1 | Simular viewport tablet | 768x1024 | Grid 2 colunas para endereço |
| 2 | Preencher formulário | — | Layout otimizado |
| 3 | Verificar espaçamento | — | Padding lateral adequado |

**Critério de Aceite:** Layout adaptado para tablet.

---

## 9. Critérios de Aceite

### 9.1 Critérios de Aceite para Fase 1 (MVP)

| ID | Critério | Método de Verificação |
|----|----------|----------------------|
| CA-01 | Recibo gerado com dados completos | TC-GER-001 |
| CA-02 | Impressão funciona em todos navegadores | TC-IMP-001, TC-IMP-004 |
| CA-03 | Zero requisições de rede com dados | TC-SEG-001 |
| CA-04 | Campos obrigatórios validados | TC-VAL-001, TC-VAL-002 |

### 9.2 Critérios de Aceite para Fase 2 (Qualidade)

| ID | Critério | Método de Verificação |
|----|----------|----------------------|
| CA-05 | CPF/CNPJ validados corretamente | TC-CLI-003, TC-CLI-004, TC-BEN-002, TC-BEN-003 |
| CA-06 | Máscaras aplicadas corretamente | TC-MSK-001 a TC-MSK-005 |
| CA-07 | Erros exibidos inline | TC-VAL-001, TC-VAL-003 |

### 9.3 Critérios de Aceite para Fase 3 (Logo e Visual)

| ID | Critério | Método de Verificação |
|----|----------|----------------------|
| CA-08 | Upload de logo funciona | TC-LOG-001, TC-LOG-002 |
| CA-09 | Logos validadas e sanitizadas | TC-LOG-003, TC-LOG-004, TC-LOG-006 |
| CA-10 | URL de logo funcional | TC-LOG-005 |

### 9.4 Critérios de Aceite para Fase 4 (Localização)

| ID | Critério | Método de Verificação |
|----|----------|----------------------|
| CA-11 | Cidades carregadas por estado | TC-EST-002 |

### 9.5 Critérios de Aceite para Fase 5 (PWA e SEO)

| ID | Critério | Método de Verificação |
|----|----------|----------------------|
| CA-12 | Manifest.json funcional | Inspeção visual |
| CA-13 | Metadados SEO corretos | Inspeção de <head> |
| CA-14 | JSON-LD válido | Teste em Google Rich Results |

### 9.6 Critérios de Aceite para Fase 6 (Polimento)

| ID | Critério | Método de Verificação |
|----|----------|----------------------|
| CA-15 | Tema escuro funcional | Inspeção visual |
| CA-16 | Score Lighthouse > 90 | Lighthouse audit |
| CA-17 | Acessibilidade WCAG AA | TC-A11-001 a TC-A11-004 |

---

## 10. Histórico de Revisões

| Versão | Data | Autor | Descrição |
|--------|------|-------|-----------|
| 1.0 | Abril 2026 | QA Team | Versão inicial do plano de testes |

---

_Fim do Documento — Recebi — Plano de Casos de Teste v1.0_
