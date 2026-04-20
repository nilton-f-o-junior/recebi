# Recebi

**Versão:** 1.0 (Draft Inicial)
**Status:** Em desenvolvimento
**Data:** Abril 2026
**Tipo:** Aplicação Web Client-Side

---

## Sumário

1. [Introdução e Visão Geral](#1-introdução-e-visão-geral)
2. [Arquitetura do Sistema](#2-arquitetura-do-sistema)
3. [Especificação dos Módulos](#3-especificação-dos-módulos)
4. [Segurança e Privacidade](#4-segurança-e-privacidade)
5. [Design de Interface (UI/UX)](#5-design-de-interface-uiux)
6. [SEO, PWA e Performance](#6-seo-pwa-e-performance)
7. [Roadmap de Implementação](#7-roadmap-de-implementação)
8. [Riscos e Mitigações](#8-riscos-e-mitigações)
9. [Referências Técnicas](#9-referências-técnicas)

---

## 1. Introdução e Visão Geral

### 1.1 Objetivo do Documento

Este SDD (Software Design Document) descreve a arquitetura, os componentes, os módulos e as decisões de design do **Recebi** — uma aplicação web para geração de recibos, orçamentos, ordens de serviço e comprovantes de pagamento personalizados, executada inteiramente no navegador do usuário (client-side), sem envio de dados para servidores externos.

### 1.2 Escopo do Sistema

O Recebi é uma página HTML única e autossuficiente que permite ao usuário preencher um formulário estruturado, visualizar o documento gerado em tempo real e imprimir ou salvar como PDF diretamente pelo navegador. O sistema realiza todo o processamento localmente via JavaScript vanilla, garantindo privacidade total dos dados do usuário.

> **Princípio Fundamental de Design**
> Todo o processamento ocorre no navegador (client-side). Nenhum dado é transmitido a servidores. A aplicação não requer backend, banco de dados, autenticação ou cadastro. O usuário abre, preenche e gera — sem fricção.

### 1.3 Público-Alvo

Pequenos negócios do setor automotivo — lava-jatos, estéticas automotivas e oficinas — que precisam gerar recibos, orçamentos ou ordens de serviço de forma rápida e profissional, sem depender de softwares pagos ou contas em plataformas externas.

### 1.4 Proposta de Valor

| Funcionalidade                    | Descrição                                                                          |
| --------------------------------- | ---------------------------------------------------------------------------------- |
| 🧾 Recibos personalizados         | Criação de recibos completos em poucos cliques                                     |
| 🚗 Registro de serviços           | Descrição detalhada de serviços e valores com soma automática                      |
| 🏢 Dados do negócio e do cliente  | Cadastro completo de beneficiário, cliente e estabelecimento                       |
| 🖼️ Logo personalizada            | Upload de logotipo para identidade visual profissional                             |
| 📄 Múltiplos tipos de documento   | Recibo, orçamento, ordem de serviço, comprovante de pagamento e outros             |

### 1.5 Definições e Acrônimos

| Termo      | Definição                                                                    |
| ---------- | ---------------------------------------------------------------------------- |
| SPA        | Single Page Application — aplicação de página única                          |
| CSP        | Content Security Policy — política de segurança de conteúdo HTTP             |
| PWA        | Progressive Web App — app web instalável no dispositivo                      |
| Blob URL   | URL temporária criada no navegador para download de arquivo gerado           |
| JSON-LD    | JSON for Linked Data — formato de dados estruturados para SEO                |
| FOUT       | Flash of Unstyled Text — carregamento visível de fontes não estilizadas      |
| CPF/CNPJ   | Cadastro de Pessoa Física / Cadastro Nacional de Pessoa Jurídica             |
| `@media print` | Regra CSS para estilização específica de impressão                      |

---

## 2. Arquitetura do Sistema

### 2.1 Visão Arquitetural

A arquitetura segue o padrão de **página HTML autônoma** (single-file application). Não há roteamento, estado persistido em servidor ou framework SPA. Toda a lógica de formulário, validação, geração de documento e impressão reside em um único arquivo HTML com CSS e JavaScript inline ou em arquivos estáticos adjacentes.

**Camadas:**

- **Apresentação:** HTML5 + CSS3 (tema, responsividade, layout de impressão)
- **Lógica:** JavaScript Vanilla (validação, cálculo de totais, geração do recibo, manipulação de logo)
- **I/O:** File API do navegador (upload de logo), `window.print()` (geração de PDF via impressão)
- **Segurança:** CSP headers, processamento local, sem requisições externas de dados do usuário

### 2.2 Estrutura de Arquivos

```
recebi/
├── index.html                  # Aplicação completa — formulário + geração do recibo
├── manifest.json               # Configuração PWA
├── robots.txt                  # Instruções para crawlers
├── sitemap.xml                 # URL para indexação
└── assets/
    ├── css/
    │   ├── global.css          # Estilos globais, reset e variáveis CSS
    │   ├── themes.css          # Tokens de cores (tema claro/escuro)
    │   ├── form.css            # Estilos do formulário e seus componentes
    │   ├── receipt.css         # Estilos do recibo gerado (tela e impressão)
    │   └── print.css           # Regras @media print exclusivas
    ├── js/
    │   ├── form.js             # Controle do formulário (campos dinâmicos, máscaras)
    │   ├── services.js         # Lógica de adição/remoção de serviços e cálculo de total
    │   ├── logo.js             # Upload, validação e leitura de logo (File API + URL)
    │   ├── receipt-builder.js  # Montagem do HTML do recibo a partir dos dados do form
    │   ├── location.js         # Carregamento dinâmico de cidades por estado (IBGE API ou JSON local)
    │   ├── validator.js        # Validação de campos obrigatórios, CPF/CNPJ e formato
    │   ├── masks.js            # Máscaras de input: CPF, CNPJ, CEP, celular, placa, valor
    │   └── utils.js            # Funções utilitárias (formatação de moeda, data, strings)
    ├── icons/
    │   ├── favicon.ico
    │   ├── icon-192.png
    │   └── icon-512.png
    └── og/
        └── recebi-og.jpg       # Imagem Open Graph (1200×630px)
```

### 2.3 Fluxo Principal da Aplicação

```
[Usuário abre a página]
        ↓
[Preenche o formulário]
   ├── Informações do recibo (tipo, data)
   ├── Upload de logo (opcional)
   ├── Dados do cliente
   ├── Dados do beneficiário
   ├── Dados do veículo (opcional)
   ├── Dados do estabelecimento
   └── Serviços/produtos (dinâmico, N itens)
        ↓
[Aceita a Política de Privacidade]
        ↓
[Clica em "Gerar Recibo Agora"]
        ↓
[Validação client-side]
   ├── Campos obrigatórios preenchidos?
   ├── CPF/CNPJ válidos?
   └── Ao menos um serviço adicionado?
        ↓ (se válido)
[receipt-builder.js monta o HTML do recibo]
        ↓
[Recibo renderizado em área de prévia (ou nova janela)]
        ↓
[Usuário clica em "Imprimir / Salvar como PDF"]
        ↓
[window.print() → navegador abre diálogo de impressão]
        ↓
[Usuário salva como PDF ou imprime]
```

### 2.4 Dependências

A aplicação é desenvolvida com **JavaScript Vanilla puro**, sem frameworks ou bibliotecas pesadas, garantindo máxima performance e controle.

| Recurso                     | Tipo              | Finalidade                                                      |
| --------------------------- | ----------------- | --------------------------------------------------------------- |
| File API (nativa)           | Browser API       | Leitura do arquivo de logo enviado pelo usuário                 |
| `window.print()`            | Browser API       | Acionamento do diálogo de impressão/PDF do navegador            |
| `@media print` (CSS nativo) | CSS               | Estilização exclusiva do recibo para impressão                  |
| `FileReader.readAsDataURL`  | Browser API       | Conversão da logo para Base64 (embeber no recibo)               |
| `fetch` (opcional)          | Browser API       | Carregamento de cidades por estado via JSON local               |
| `Intl.NumberFormat`         | JS Nativo         | Formatação de valores monetários em BRL (R$)                    |
| Google Fonts (CDN)          | Recurso externo   | Tipografia do recibo (carregada na inicialização, não em dados) |

---

## 3. Especificação dos Módulos

### 3.1 Módulo: Formulário Principal (`form.js`)

Responsável pelo controle geral do formulário: inicialização dos campos, gerenciamento de estado do formulário e coordenação dos demais módulos.

**Responsabilidades:**
- Inicializar máscaras de input ao carregar a página
- Gerenciar o estado de habilitação do botão "Gerar Recibo" (habilitado apenas se checkbox de privacidade estiver marcado)
- Capturar o evento de submit e acionar validação + geração do recibo
- Resetar o formulário após geração (opcional, com confirmação do usuário)

**Estados do formulário:**

| Estado       | Comportamento                                                    |
| ------------ | ---------------------------------------------------------------- |
| Inicial      | Campos vazios, botão desabilitado, checkbox desmarcado           |
| Em preenchimento | Campos sendo preenchidos, validação em tempo real (on-blur)  |
| Pronto       | Checkbox marcado, botão habilitado, todos os obrigatórios válidos |
| Com erro     | Campos inválidos destacados, mensagens de erro inline visíveis   |
| Gerando      | Botão em estado de loading, feedback visual ao usuário           |

---

### 3.2 Módulo: Informações do Recibo

**Campos:**

| Campo           | Tipo       | Obrigatório | Regras                                                          |
| --------------- | ---------- | ----------- | --------------------------------------------------------------- |
| Tipo do Recibo  | `select`   | Sim         | Opções: Recibo, Orçamento, Ordem de Serviço, Comprovante de Pagamento |
| Data de Emissão | `date`     | Sim         | Pré-preenchido com a data atual; editável pelo usuário          |

**Comportamento:**
- O valor selecionado no campo "Tipo do Recibo" torna-se o título principal do documento gerado (ex: "ORDEM DE SERVIÇO").
- A data de emissão é formatada em português (ex: "16 de abril de 2026") no documento final.

---

### 3.3 Módulo: Logo da Empresa (`logo.js`)

Permite ao usuário inserir a logo do negócio por dois métodos distintos.

**Métodos de inserção:**

| Método          | Implementação                                            | Formatos aceitos       | Limite   |
| --------------- | -------------------------------------------------------- | ---------------------- | -------- |
| Upload de arquivo | `<input type="file">` + drag-and-drop na dropzone     | PNG, JPG, SVG, WEBP    | 2 MB     |
| Inserir URL      | Campo `<input type="url">` para link externo da imagem  | Qualquer URL de imagem | —        |

**Fluxo (upload de arquivo):**
1. Usuário arrasta arquivo ou clica na dropzone
2. `file-validator` verifica MIME type e tamanho (≤ 2 MB)
3. `FileReader.readAsDataURL` converte para Base64
4. Pré-visualização renderizada na dropzone
5. Base64 armazenado em variável de estado para uso no `receipt-builder`

**Fluxo (inserir URL):**
1. Usuário cola a URL no campo
2. Uma tag `<img>` testa o carregamento da URL
3. Se carregada com sucesso: pré-visualização exibida e URL armazenada
4. Se falhar: mensagem de erro "Não foi possível carregar a imagem"

**Estados da dropzone:**

| Estado         | Visual                                                    |
| -------------- | --------------------------------------------------------- |
| Vazia          | Ícone de upload + instruções de texto + legenda de formatos |
| Arrastando     | Borda destacada + overlay semitransparente com instrução  |
| Com imagem     | Miniatura da logo + botão "Remover"                       |
| Erro de validação | Borda vermelha + mensagem de erro inline               |

---

### 3.4 Módulo: Dados do Cliente

**Campos:**

| Campo         | Tipo    | Obrigatório | Máscara / Validação                        |
| ------------- | ------- | ----------- | ------------------------------------------ |
| Nome Completo | `text`  | Sim         | Mínimo 3 caracteres                        |
| CPF/CNPJ      | `text`  | Não         | Máscara e validação de dígitos verificadores |
| Celular       | `tel`   | Sim         | Máscara: `(XX) XXXXX-XXXX`                 |

---

### 3.5 Módulo: Dados do Beneficiário

**Campos:**

| Campo         | Tipo    | Obrigatório | Máscara / Validação                         |
| ------------- | ------- | ----------- | ------------------------------------------- |
| Nome Completo | `text`  | Sim         | Mínimo 3 caracteres                         |
| CPF/CNPJ      | `text`  | Não         | Máscara e validação de dígitos verificadores |
| Celular       | `tel`   | Não         | Máscara: `(XX) XXXXX-XXXX`                  |

> O beneficiário é a parte que **recebe** o pagamento. O nome é obrigatório pois confere validade legal ao documento.

---

### 3.6 Módulo: Dados do Veículo

Seção destinada a lava-jatos e estéticas automotivas para identificação do veículo atendido.

**Campos:**

| Campo  | Tipo   | Obrigatório | Validação / Máscara                                        |
| ------ | ------ | ----------- | ---------------------------------------------------------- |
| Modelo | `text` | Sim         | Ex: "Fiat Strada"                                          |
| Placa  | `text` | Não         | Máscara: formato Mercosul `ABC-1D23` ou antigo `ABC-1234`  |
| Ano    | `text` | Sim         | 4 dígitos, entre 1900 e ano atual + 1                      |

**Comportamento:** A seção é sempre renderizada no recibo gerado, dado que Modelo e Ano são obrigatórios.

---

### 3.7 Módulo: Dados do Estabelecimento

**Campos:**

| Campo            | Tipo     | Obrigatório | Fonte de dados / Validação                      |
| ---------------- | -------- | ----------- | ----------------------------------------------- |
| Nome da Empresa  | `text`   | Sim         | —                                               |
| Estado           | `select` | Sim         | Lista fixa dos 27 estados brasileiros (UF)      |
| Cidade           | `select` | Sim         | Populada dinamicamente após seleção do estado   |
| Bairro           | `text`   | Sim         | —                                               |
| CEP              | `text`   | Sim         | Máscara: `XXXXX-XXX`                            |
| Rua/Logradouro   | `text`   | Sim         | —                                               |
| Número           | `text`   | Sim         | —                                               |

**Carregamento dinâmico de cidades (`location.js`):**
- Ao selecionar um estado, o campo "Cidade" é populado a partir de um JSON local com os municípios brasileiros (evita dependência de API externa em runtime)
- Enquanto o estado não estiver selecionado, o campo cidade exibe "Selecione o estado primeiro" e permanece desabilitado

---

### 3.8 Módulo: Serviços/Produtos (`services.js`)

Permite ao usuário adicionar uma lista dinâmica de serviços ou produtos com seus respectivos valores. O total é calculado automaticamente.

**Campos por item:**

| Campo           | Tipo     | Obrigatório | Validação                                  |
| --------------- | -------- | ----------- | ------------------------------------------ |
| Serviço/Produto | `text`   | Sim         | Mínimo 1 caractere                         |
| Valor (R$)      | `number` | Sim         | Positivo, máximo 2 casas decimais          |

**Comportamento:**
- A página inicia com **1 linha de serviço** pré-adicionada
- Botão **"+ Adicionar serviço"** insere nova linha ao final da lista
- Botão **"×"** (por linha) remove o item correspondente; a primeira linha não pode ser removida se for a única
- O **total** é recalculado em tempo real a cada alteração de valor
- Valores são formatados como moeda BRL (`R$ 1.250,00`) usando `Intl.NumberFormat`
- No recibo gerado, cada linha exibe: descrição + valor unitário. Ao final: **Total Geral**

---

### 3.9 Módulo: Observações

Campo de texto livre e opcional para informações adicionais ao recibo.

| Campo        | Tipo       | Obrigatório | Limite         |
| ------------ | ---------- | ----------- | -------------- |
| Observações  | `textarea` | Não         | 500 caracteres |

---

### 3.10 Módulo: Geração do Recibo (`receipt-builder.js`)

Responsável por transformar os dados do formulário em um documento HTML formatado, pronto para impressão ou salvamento como PDF.

**Fluxo de geração:**

1. `receipt-builder` recebe o objeto de dados coletados do formulário
2. Monta a estrutura HTML do recibo (template strings ou DOM manipulation)
3. Insere os dados campo a campo, respeitando visibilidade condicional:
   - Logo: exibida apenas se fornecida
   - Seção veículo: exibida apenas se ao menos um campo preenchido
   - Estabelecimento: exibida apenas se ao menos um campo preenchido
   - Observações: exibidas apenas se preenchidas
4. Renderiza o recibo em uma `<div id="receipt-preview">` oculta (visível apenas via `@media print` ou ao expandir a prévia)
5. Aciona `window.print()` para abrir o diálogo de impressão do navegador

**Estratégia de impressão/PDF:**
- A `<div id="receipt-preview">` usa `@media print` com `display: block`
- O formulário e o header da página usam `@media print` com `display: none`
- O usuário usa a funcionalidade nativa do navegador ("Salvar como PDF" ou impressora física)
- Não há dependência de bibliotecas de geração de PDF (jsPDF, pdf-lib), mantendo a stack enxuta

---

### 3.11 Módulo: Validação (`validator.js`)

Responsável por validar os dados do formulário antes da geração do recibo.

**Regras de validação:**

| Campo                      | Regra                                                                |
| -------------------------- | -------------------------------------------------------------------- |
| Tipo do Recibo             | Não pode estar no estado padrão (deve ter uma opção selecionada)     |
| Data de Emissão            | Campo obrigatório, data válida                                       |
| Cliente — Nome             | Obrigatório, mínimo 3 caracteres                                     |
| Cliente — Celular          | Obrigatório, formato `(XX) XXXXX-XXXX`                               |
| Beneficiário — Nome        | Obrigatório, mínimo 3 caracteres                                     |
| Beneficiário — CPF/CNPJ    | Opcional; se preenchido, valida dígitos verificadores (algoritmo oficial) |
| Veículo — Modelo           | Obrigatório, mínimo 2 caracteres                                     |
| Veículo — Ano              | Obrigatório, 4 dígitos, entre 1900 e ano atual + 1                   |
| Estabelecimento            | Todos os campos obrigatórios (Nome, Estado, Cidade, Bairro, CEP, Rua, Número) |
| Serviços                   | Ao menos 1 item com descrição e valor preenchidos                    |
| Valor de cada serviço      | Deve ser um número positivo                                          |
| Logo (upload)              | Se enviada: MIME type válido + tamanho ≤ 2 MB                        |
| Checkbox de privacidade    | Deve estar marcado para habilitar o botão de geração                 |

**Apresentação de erros:**
- Erros exibidos inline abaixo de cada campo inválido (mensagem em vermelho)
- Campo inválido recebe classe CSS `.field-error` (borda vermelha)
- Ao corrigir o campo, o erro é removido em tempo real (`on-input` ou `on-blur`)
- Se o formulário for submetido com erros, scroll automático até o primeiro campo inválido

---

### 3.12 Módulo: Máscaras de Input (`masks.js`)

| Campo       | Máscara / Formato                                       |
| ----------- | ------------------------------------------------------- |
| CPF         | `000.000.000-00`                                        |
| CNPJ        | `00.000.000/0000-00`                                    |
| CPF/CNPJ    | Aplica a máscara correspondente ao detectar comprimento |
| Celular     | `(00) 00000-0000`                                       |
| CEP         | `00000-000`                                             |
| Placa       | `AAA-0000` (antigo) ou `AAA-0A00` (Mercosul)            |
| Valor (R$)  | Formatação numérica com separador decimal e de milhar   |
| Ano         | 4 dígitos apenas                                        |

---

## 4. Segurança e Privacidade

### 4.1 Princípios de Privacidade

- **Zero transmissão de dados:** nenhum dado inserido no formulário (nomes, CPF/CNPJ, valores, logo) é enviado a qualquer servidor
- **Sem cookies de rastreamento:** não são utilizados cookies de terceiros para fins publicitários
- **Sem autenticação:** não há coleta de e-mail, senha ou qualquer dado de conta
- **Processamento local total:** toda a lógica roda no dispositivo do usuário

### 4.2 Content Security Policy (CSP)

```http
Content-Security-Policy:
  default-src 'self';
  script-src 'self';
  style-src 'self' https://fonts.googleapis.com;
  font-src https://fonts.gstatic.com;
  img-src 'self' data: blob: https:;
  connect-src 'none';
  object-src 'none';
  base-uri 'self';
```

> `img-src` inclui `data:` e `blob:` para suportar logos em Base64 e URLs de objeto geradas localmente. `connect-src: 'none'` garante que nenhuma requisição de rede seja feita com dados do usuário.

### 4.3 Política de Privacidade

O checkbox de consentimento ("Li e concordo com a Política de Privacidade") é **obrigatório** para habilitar a geração do recibo. A Política de Privacidade deve declarar explicitamente:

- Quais dados são processados (apenas localmente, sem coleta)
- Que nenhum dado é transmitido a terceiros
- Como a logo enviada é utilizada (apenas para composição visual do recibo)

---

## 5. Design de Interface (UI/UX)

### 5.1 Paleta de Cores (Tokens CSS)

A interface utiliza variáveis CSS customizadas para suportar tema claro e escuro com consistência visual.

| Token                  | Papel na Interface                                          |
| ---------------------- | ----------------------------------------------------------- |
| `--color-primary`      | Cor principal de ação (botão "Gerar Recibo", links)         |
| `--color-primary-dark` | Estado hover/active do botão primário                       |
| `--color-error`        | Bordas e mensagens de erro de validação                     |
| `--color-success`      | Feedback de ação concluída (logo carregada com sucesso)     |
| `--color-bg`           | Fundo geral da página                                       |
| `--color-surface`      | Fundo de cards e seções do formulário                       |
| `--color-border`       | Bordas de campos, separadores                               |
| `--color-text`         | Texto principal                                             |
| `--color-text-muted`   | Labels, placeholders, textos auxiliares                     |

### 5.2 Tipografia

| Uso                         | Fonte                    | Peso    |
| --------------------------- | ------------------------ | ------- |
| Título do recibo gerado      | Serif (ex: Merriweather) | Bold    |
| Labels e campos do form      | Sans-serif (ex: Inter)   | Regular |
| Valores monetários no recibo | Monospace (ex: Roboto Mono) | Medium |
| Assinatura no recibo         | Sans-serif               | Light   |

### 5.3 Layout da Página

A página é dividida em duas regiões principais:

1. **Formulário (visível na tela):** coluna central com largura máxima de 720px, organizado em seções com títulos e separadores visuais
2. **Recibo (oculto na tela, visível na impressão):** template de recibo renderizado em `<div id="receipt-preview">`, com estilo otimizado para página A4

### 5.4 Componentes Reutilizáveis

**Seção de Formulário**
Card com título de seção, borda superior colorida e espaçamento interno consistente. Cada grupo lógico de campos (cliente, beneficiário, veículo, etc.) é encapsulado em um desses cards.

**Campo de Input com Label**
Label acima do campo, mensagem de erro abaixo (visível apenas em estado de erro), placeholder descritivo. Suporte a ícone prefixado (ex: ícone de R$ no campo de valor).

**Lista de Serviços**
Container dinâmico com linha por serviço. Cada linha tem: campo de descrição (flex-grow), campo de valor (largura fixa), botão de remoção. Linha de total fixada ao final, atualizada em tempo real.

**Dropzone de Logo**
Área de arrastar e soltar com borda tracejada. Exibe ícone + instruções no estado vazio. Substitui por miniatura da imagem após upload bem-sucedido. Botão "Remover" visível no estado com imagem.

**Toast Notification**
Notificações temporárias (3–5 segundos) para feedback de ações como "Logo removida", "Serviço adicionado". Posicionadas no canto inferior direito.

**Botão Principal**
Botão de largura total com estado desabilitado (cinza, cursor `not-allowed`) e estado de loading (spinner + texto "Gerando..."). Habilitado apenas após checkbox de privacidade marcado.

### 5.5 Responsividade

| Breakpoint | Largura        | Comportamento                                                         |
| ---------- | -------------- | --------------------------------------------------------------------- |
| Mobile     | < 768px        | Layout em coluna única, campos de serviço empilhados verticalmente    |
| Tablet     | 768px – 1024px | Formulário centralizado com padding lateral, grid 2 colunas para endereço |
| Desktop    | > 1024px       | Formulário centralizado, largura máxima 720px, mais espaçamento       |

### 5.6 Layout de Impressão (`@media print`)

- O formulário e elementos de navegação são ocultados (`display: none`)
- O `<div id="receipt-preview">` é exibido e ocupa toda a página
- Fonte ajustada para 11pt, margens de 15mm
- Cores adaptadas para impressão monocromática (bordas em cinza, sem fundos coloridos)
- Logo inserida no canto superior esquerdo ou centralizada, com altura máxima de 60px

### 5.7 Acessibilidade (a11y)

- Todos os campos possuem `<label>` associado corretamente via `for`/`id`
- Mensagens de erro associadas ao campo via `aria-describedby`
- Navegação completa por teclado (Tab, Enter, Espaço)
- Contraste mínimo WCAG AA (4.5:1) em ambos os temas
- Campos obrigatórios indicados com `aria-required="true"` e marcador visual `*`
- Status de geração anunciado para leitores de tela via `aria-live="polite"`

---

## 6. SEO, PWA e Performance

### 6.1 Estrutura de Metadados

| Meta Tag                      | Valor recomendado                                                               |
| ----------------------------- | ------------------------------------------------------------------------------- |
| `<title>`                     | `Recebi — Gerador de Recibos Online Grátis`                                     |
| `<meta description>`          | "Crie recibos, orçamentos e ordens de serviço personalizados em segundos. Sem cadastro. Totalmente grátis." (155 chars) |
| `og:title`                    | `Recebi — Gere seu recibo agora, grátis e sem cadastro`                          |
| `og:description`              | Versão curta para WhatsApp/Facebook                                              |
| `og:image`                    | `/assets/og/recebi-og.jpg` (1200×630px)                                         |
| `twitter:card`                | `summary_large_image`                                                            |
| `<link rel="canonical">`      | URL canônica da página                                                           |
| JSON-LD `WebApplication`      | Schema markup para Google Knowledge Panel                                        |
| `<link rel="manifest">`       | `/manifest.json`                                                                 |

### 6.2 JSON-LD Schema

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Recebi",
  "url": "https://recebi.com.br",
  "description": "Gerador de recibos, orçamentos e ordens de serviço online, gratuito e sem cadastro.",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "BRL"
  }
}
```

### 6.3 Progressive Web App (PWA)

```json
{
  "name": "Recebi",
  "short_name": "Recebi",
  "description": "Gerador de recibos online",
  "start_url": "/index.html",
  "display": "standalone",
  "theme_color": "#2563EB",
  "background_color": "#FFFFFF",
  "icons": [
    { "src": "assets/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "assets/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

### 6.4 Performance

**Carregamento de fontes:**
- `preconnect` para `fonts.googleapis.com` e `fonts.gstatic.com`
- `font-display: swap` para evitar FOUT
- Subset de caracteres limitado ao alfabeto latino (`&subset=latin`)

**JavaScript:**
- Nenhuma biblioteca externa de terceiros carregada por padrão
- Scripts com `defer` para não bloquear o render inicial
- Código dividido em módulos ES6 com `type="module"` para carregamento eficiente

**Imagens:**
- Logo do usuário processada localmente (sem upload para CDN)
- Imagem OG comprimida em JPEG com qualidade 85%

**Metas de performance (Lighthouse):**

| Métrica                | Meta    |
| ---------------------- | ------- |
| Performance            | > 95    |
| Acessibilidade         | > 95    |
| Melhores Práticas      | > 90    |
| SEO                    | > 95    |
| LCP (Largest Contentful Paint) | < 1.5s |
| CLS (Cumulative Layout Shift)  | < 0.05 |
| FID / INP              | < 100ms |

---

## 7. Roadmap de Implementação

### 7.1 Fases de Desenvolvimento

| Fase                        | Entregas                                                                                           | Prioridade |
| --------------------------- | -------------------------------------------------------------------------------------------------- | ---------- |
| Fase 1 — MVP                | `index.html` funcional: formulário completo + geração de recibo + impressão via `window.print()`  | Alta       |
| Fase 2 — Qualidade          | Validação robusta (CPF/CNPJ), máscaras de input, tratamento de erros inline                       | Alta       |
| Fase 3 — Logo e Visual      | Upload de logo (File API + URL), dropzone, pré-visualização, integração no recibo                  | Alta       |
| Fase 4 — Localização        | Carregamento dinâmico de cidades por estado (JSON local com todos os municípios brasileiros)       | Média      |
| Fase 5 — PWA e SEO          | `manifest.json`, service worker básico, metadados completos, JSON-LD, `robots.txt`, `sitemap.xml` | Média      |
| Fase 6 — Polimento          | Tema escuro, testes de acessibilidade, otimização de performance, Lighthouse > 95                  | Baixa      |

### 7.2 Critérios de Aceite

Cada fase deve atender aos seguintes critérios antes de ser considerada concluída:

- Funciona em Chrome, Firefox, Safari e Edge (versões dos últimos 2 anos)
- Funciona em dispositivos móveis iOS e Android
- Recibo gerado e impresso corretamente em todos os navegadores listados
- Nenhuma requisição de rede é feita com os dados do formulário
- Exibe mensagens de erro claras para campos inválidos
- Score Lighthouse > 90 em Performance, Acessibilidade e SEO

---

## 8. Riscos e Mitigações

| Risco                                                              | Probabilidade | Impacto | Mitigação                                                                                      |
| ------------------------------------------------------------------ | ------------- | ------- | ---------------------------------------------------------------------------------------------- |
| Impressão com layout quebrado em Safari/iOS                        | Alta          | Alto    | Testes específicos com `@media print`; usar unidades absolutas (mm, pt) no CSS de impressão    |
| URL de logo bloqueada por CORS ao usar `<img>` no recibo impresso  | Média         | Médio   | Converter imagem via URL para Base64 usando `canvas.toDataURL()` antes de inserir no recibo     |
| CPF/CNPJ inválido passado para o recibo sem validação              | Média         | Médio   | Validação obrigatória com algoritmo de dígitos verificadores antes de habilitar a geração       |
| JSON de cidades desatualizado (municípios criados/extintos)        | Baixa         | Baixo   | Usar fonte oficial (IBGE) para o JSON; documentar data de atualização; campo de cidade editável |
| Usuário gera recibo com dados incorretos e imprime sem revisão     | Alta          | Médio   | Aviso proeminente antes do botão: "Revise todos os dados antes de gerar"                        |
| Logo em SVG com scripts embutidos (vetor de XSS)                   | Baixa         | Alto    | Sanitizar SVG antes de usar: remover `<script>`, `onload`, `href` com `javascript:`            |
| Navegador antigo sem suporte a ES6 Modules                         | Baixa         | Médio   | Build alternativo com script concatenado como fallback; exibir aviso de navegador desatualizado |

---

## 9. Referências Técnicas

- **File API (MDN):** https://developer.mozilla.org/en-US/docs/Web/API/File_API
- **FileReader.readAsDataURL (MDN):** https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL
- **window.print() (MDN):** https://developer.mozilla.org/en-US/docs/Web/API/Window/print
- **@media print (MDN):** https://developer.mozilla.org/en-US/docs/Web/CSS/@media#media_types
- **Intl.NumberFormat (MDN):** https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
- **Algoritmo de validação CPF:** https://www.receita.fazenda.gov.br/aplicacoes/atcta/cpf/funcoes.js
- **Algoritmo de validação CNPJ:** https://www.receita.fazenda.gov.br/pessoajuridica/cnpj/cnpjreva/
- **Municípios brasileiros (IBGE):** https://servicodados.ibge.gov.br/api/docs/localidades
- **Content Security Policy (MDN):** https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
- **Web App Manifest (MDN):** https://developer.mozilla.org/en-US/docs/Web/Manifest
- **WCAG 2.1 Guidelines:** https://www.w3.org/TR/WCAG21/
- **Schema.org WebApplication:** https://schema.org/WebApplication
- **Canvas.toDataURL (MDN):** https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL

---

_Recebi — SDD v1.0_
