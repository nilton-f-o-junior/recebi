
# Inventário de casos E2E

Fonte dos títulos: [`docs/TDD_Recebi_Casos_de_Teste.md`](../../docs/TDD_Recebi_Casos_de_Teste.md) (v2.1).
Este arquivo lista os **101 casos** por spec; o status de implementação, skips e divergências fica em
[`cypress/PROGRESSO.md`](../PROGRESSO.md).

## /modules
form.cy.js
    TC-FRM-001: Carregamento Inicial do Formulário
    TC-FRM-002: Habilitação do Botão ao Marcar Privacidade
    TC-FRM-003: Submissão de Formulário Válido
    TC-FRM-004: Redirecionamento para GitHub do Projeto
    TC-FRM-005: Validação Nativa de Campos Obrigatórios
    TC-FRM-006: Barra de Progresso do Formulário

info-recibo.cy.js
    TC-INF-001: Seleção de Tipo de Recibo
    TC-INF-002: Data de Emissão

upload-logo.cy.js
    TC-LOG-001: Upload de Imagem via Drag and Drop
    TC-LOG-002: Upload de Imagem via Clique
    TC-LOG-003: Validação de Formato de Arquivo
    TC-LOG-004: Validação de Tamanho de Arquivo
    TC-LOG-005: Inserção de Logo via URL
    TC-LOG-006: Sanitização de SVG
    TC-LOG-007: Alternância entre Abas de Logo
    TC-LOG-008: Atributo de Imagem Injetável pela URL da Logo

dados-cliente.cy.js
    TC-CLI-001: Preenchimento de Dados Obrigatórios
    TC-CLI-002: Validação de Nome Mínimo
    TC-CLI-003: Validação de CPF Válido
    TC-CLI-004: Validação de CPF Inválido
    TC-CLI-005: Validação de Celular

dados-beneficiario.cy.js
    TC-BEN-001: Preenchimento de Dados Obrigatórios
    TC-BEN-002: Validação de CNPJ Válido
    TC-BEN-003: Validação de CNPJ Inválido
    TC-BEN-004: Nome e Celular do Beneficiário

dados-veiculo.cy.js
    TC-VEI-001: Preenchimento de Campos Obrigatórios
    TC-VEI-002: Máscara e Formato de Placa
    TC-VEI-003: Validação de Ano do Veículo
    TC-VEI-004: Visibilidade Condicional da Seção

dados-estabelecimento.cy.js
    TC-EST-001: Preenchimento Completo de Endereço
    TC-EST-002: Carregamento Dinâmico de Cidades
    TC-EST-003: Validação de CEP
    TC-EST-004: Preenchimento Automático por CEP
    TC-EST-005: CEP Não Encontrado ou Falha de Rede
    TC-EST-006: Falha ao Carregar Cidades
    TC-EST-007: Estado e Cidade Obrigatórios

servicos-produtos.cy.js
    TC-SRV-001: Adição de Serviço
    TC-SRV-002: Remoção de Serviço
    TC-SRV-003: Restrição de Remoção da Única Linha
    TC-SRV-004: Cálculo de Total com Múltiplos Serviços
    TC-SRV-005: Validação de Serviço Obrigatório
    TC-SRV-006: Valores Negativos e Não Numéricos
    TC-SRV-007: Aplicação de Desconto (Porcentagem)
    TC-SRV-008: Exibição de Desconto no Recibo
    TC-SRV-009: Linha de Serviço Vazia Bloqueia a Geração

observacoes.cy.js
    TC-OBS-001: Campo de Observações Opcional
    TC-OBS-002: Exibição Condicional no Recibo
    TC-OBS-003: Contador de Caracteres

geracao-recibo.cy.js
    TC-GER-001: Geração Completa de Recibo
    TC-GER-002: Visibilidade Condicional no Recibo
    TC-GER-003: Modelo de Recibo Padrão
    TC-GER-004: Modelo de Recibo Detalhado
    TC-GER-005: Marca d'água e Estética

validacao-campos.cy.js
    TC-VAL-001: Validação em Tempo Real
    TC-VAL-002: Scroll até Primeiro Erro
    TC-VAL-003: Classe CSS de Erro
    TC-VAL-004: Documento Opcional, Porém Validado

mascaras-input.cy.js
    TC-MSK-001: Máscara de CPF
    TC-MSK-002: Máscara de CNPJ
    TC-MSK-003: Máscara de Celular
    TC-MSK-004: Máscara de CEP
    TC-MSK-005: Máscara de Placa
    TC-MSK-006: Máscara de Ano

home.cy.js
    TC-HOM-001: Conteúdo da Página Inicial
    TC-HOM-002: Navegação para o Formulário

preview-recibo.cy.js
    TC-PRE-001: Abertura do Preview
    TC-PRE-002: Fechamento do Preview
    TC-PRE-003: Impressão e Título do Arquivo
    TC-PRE-004: Regeneração do Recibo
    TC-PRE-005: Fechar o Preview com a Tecla Esc

personalizacao.cy.js
    TC-PER-001: Cores Sugeridas
    TC-PER-002: Cor Personalizada
    TC-PER-003: Seleção de Modelo

politica-privacidade.cy.js
    TC-POL-001: Acesso e Conteúdo
    TC-POL-002: Contato

raiz de /e2e/ (Testes Globais e Regras do Sistema)

seguranca.cy.js
    TC-SEG-001: Transmissão Zero de Dados
    TC-SEG-002: CSP Headers
    TC-SEG-003: Sem Cookies de Rastreamento nem Persistência
    TC-SEG-004: Consentimento de Privacidade
    TC-SEG-005: Escape de HTML nos Dados do Usuário
    TC-SEG-006: Origem dos Scripts

acessibilidade.cy.js
    TC-A11-001: Labels Associados aos Campos
    TC-A11-002: Navegação por Teclado
    TC-A11-003: Contraste de Cores
    TC-A11-004: Campos Obrigatórios Marcados
    TC-A11-005: Gerenciamento de Foco e Anúncios no Preview
    TC-A11-006: Idioma e Título das Páginas

impressao.cy.js
    TC-IMP-001: CSS @media print — Formulário Oculto
    TC-IMP-002: CSS @media print — Layout A4
    TC-IMP-003: Cores na Impressão
    TC-IMP-004: Salvar como PDF

compatibilidade.cy.js
    TC-BRW-001: Compatibilidade Chrome
    TC-BRW-002: Compatibilidade Firefox
    TC-BRW-003: Compatibilidade Safari
    TC-BRW-004: Compatibilidade Microsoft Edge
    TC-BRW-005: Responsividade Mobile (iOS)
    TC-BRW-006: Responsividade Mobile (Android)
    TC-BRW-007: Responsividade Tablet e Pontos de Quebra

seo-pwa.cy.js
    TC-SEO-001: Metadados da Página Inicial
    TC-SEO-002: Manifest e Ícones
    TC-SEO-003: robots.txt e sitemap.xml
