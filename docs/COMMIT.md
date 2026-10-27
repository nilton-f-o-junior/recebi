Você é um especialista em Git e automação de workflow de desenvolvimento. Preciso atualizar e organizar os commits do repositório localizado em:
https://github.com/nilton-f-o-junior/recebi

Por favor, siga rigorosamente as instruções e regras abaixo para realizar as alterações no projeto:

1. Padrão de Commits:
   - Siga estritamente a especificação do Conventional Commits (versão pt-BR: https://www.conventionalcommits.org/pt-br/v1.0.0-beta.4/).
   - Estrutura da mensagem: `<tipo>(<escopo opcional>): <descrição curta e no imperativo>`
   - Principais tipos a utilizar:
     * feat: Nova funcionalidade.
     * fix: Correção de bug.
     * docs: Alterações em documentação.
     * style: Formatação/estilo sem alterar lógica.
     * refactor: Refatoração de código sem alterar comportamento.
     * test: Adição ou ajuste de testes.
     * chore: Configurações, dependências ou tarefas de build.
   - Separe as alterações em múltiplos commits atômicos (um commit focado por contexto/módulo alterado), evitando um único commit gigante.

2. Verificação Inicial & Trata de Alterações Indevidas na Branch Main:
   - Verifique o status atual do repositório (`git status`, `git branch`, `git diff`).
   - SE houver alterações não commitadas ou novas na branch `main`:
     1. Faça o commit dessas alterações na `main` seguindo o padrão Conventional Commits.
     2. Exiba para o usuário um resumo detalhado dos arquivos commitados e das mensagens de commit criadas na `main`.
     3. Faça o `git push` da branch `main`.
     4. Atualize a branch `develop` sincronizando-a com a `main` (via merge ou rebase da `main` para a `develop`) antes de prosseguir.

3. Fluxo de Trabalho e Confirmações na Branch Develop:
   - Certifique-se de estar na branch `develop`.
   - Organize e aplique todas as atualizações pendentes na `develop` usando os commits atômicos no padrão Conventional Commits.
   - **Pausa de Confirmação (Push na Develop):**
     * Apresente um resumo claro de todos os commits realizados e dos arquivos afetados na `develop`.
     * Pergunte explicitamente ao usuário: *"Posso realizar o push da branch develop para o repositório remoto?"*
     * AGUARDE a confirmação do usuário antes de rodar o `git push origin develop`.

4. Atualização e Confirmação na Branch Main:
   - Após a confirmação e push da `develop`, prepare a mesclagem para a `main` (`git checkout main` e merge da `develop`).
   - **Pausa de Confirmação (Merge/Push na Main):**
     * Mostre um resumo exato do que será feito na `main` (quais commits e alterações serão levados da `develop` para a `main`).
     * Pergunte explicitamente ao usuário: *"Posso atualizar a branch main e realizar o push para o repositório remoto?"*
     * AGUARDE a confirmação do usuário antes de efetuar a atualização e o `git push origin main`.
