<!-- ELECTRON_OZONE_PLATFORM_HINT=auto npx cypress open -->

/modules
form.cy.js
    TC-FRM-001: Carregamento Inicial do Formulário
    TC-FRM-002: Habilitação do Botão ao Marcar Privacidade
    TC-FRM-003: Submissão de Formulário Válido
    TC-FRM-004: Redirecionamento para GitHub do Projeto

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

dados-veiculo.cy.js
    TC-VEI-001: Preenchimento de Campos Obrigatórios
    TC-VEI-002: Validação de Placa Mercosul
    TC-VEI-003: Validação de Ano do Veículo
    TC-VEI-004: Visibilidade Condicional da Seção

dados-estabelecimento.cy.js
    TC-EST-001: Preenchimento Completo de Endereço
    TC-EST-002: Carregamento Dinâmico de Cidades
    TC-EST-003: Validação de CEP

servicos-produtos.cy.js
    TC-SRV-001: Adição de Serviço
    TC-SRV-002: Remoção de Serviço
    TC-SRV-003: Restrição de Remoção da Única Linha
    TC-SRV-004: Cálculo de Total com Múltiplos Serviços
    TC-SRV-005: Validação de Serviço Obrigatório
    TC-SRV-007: Aplicação de Desconto (Porcentagem)
    TC-SRV-008: Exibição de Desconto no Recibo

observacoes.cy.js
    TC-OBS-001: Campo de Observações Opcional
    TC-OBS-002: Exibição Condicional no Recibo

geracao-recibo.cy.js
    TC-GER-001: Geração Completa de Recibo
    TC-GER-002: Visibilidade Condicional no Recibo
    TC-GER-004: Modelo de Recibo Detalhado
    TC-GER-005: Marca d'água e Estética

validacao-campos.cy.js
    TC-VAL-001: Validação em Tempo Real (on-blur)
    TC-VAL-002: Scroll até Primeiro Erro
    TC-VAL-003: Classe CSS de Erro

mascaras-input.cy.js
    TC-MSK-001: Máscara de CPF
    TC-MSK-002: Máscara de CNPJ
    TC-MSK-003: Máscara de Celular
    TC-MSK-004: Máscara de CEP
    TC-MSK-005: Máscara de Placa

raiz de /e2e/ (Testes Globais e Regras do Sistema)

seguranca.cy.js
    TC-SEG-001: Transmissão Zero de Dados
    TC-SEG-002: CSP Headers
    TC-SEG-003: Sem Cookies de Rastreamento
    TC-SEG-004: Consentimento de Privacidade

acessibilidade.cy.js
    TC-A11-001: Labels Associados aos Campos
    TC-A11-002: Navegação por Teclado
    TC-A11-003: Contraste de Cores
    TC-A11-004: Campos Obrigatórios Marcados

impressao.cy.js
    TC-IMP-001: CSS @media print — Formulário Oculto
    TC-IMP-002: CSS @media print — Recibo Visível
    TC-IMP-003: Impressão Monocromática
    TC-IMP-004: Salvar como PDF

compatibilidade.cy.js
    TC-BRW-001: Compatibilidade Chrome
    TC-BRW-002: Compatibilidade Firefox
    TC-BRW-003: Compatibilidade Safari
    TC-BRW-004: Compatibilidade Microsoft Edge
    TC-BRW-005: Responsividade Mobile (iOS)
    TC-BRW-006: Responsividade Mobile (Android)
    TC-BRW-007: Responsividade Tablet

