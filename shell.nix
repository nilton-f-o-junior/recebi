# Ambiente de desenvolvimento e testes do Recebi em NixOS.
#
# O binário do Cypress baixado pelo installador do npm não roda em NixOS
# (binário non-FHS), então o binário vem do Nix e o pacote npm cypress
# fica apenas como driver/CLI. O shellHook liga os dois:
#
#   CYPRESS_INSTALL_BINARY=0  -> npm instala sem baixar o binário próprio
#   CYPRESS_RUN_BINARY        -> CLI do npm usa o binário do Nix
#   CYPRESS_SKIP_VERIFY=true  -> `npx cypress verify` é no-op: ele força
#                                re-verificação e tenta gravar
#                                <bin>/binary_state.json dentro de
#                                /nix/store (read-only, EROFS).
#                                `cypress run`/`open` não forçam: leem o
#                                {"verified": true} que o pacote Nix traz.
#
# Uso:
#   nix-shell                       # nodejs + python3 + cypress + Xvfb
#   npm install                     # instala as devDependencies (sem binário)
#   npm run dev                     # sobe o app em http://localhost:4173
#   npm run cy:open / npm run cy:run
#
# Versão: cypress do nixpkgs estável (14.5.4). O nixos-unstable traz o
# 15.19.0, marcado como inseguro pelo nixpkgs (Electron 37 EOL com CVEs),
# por isso o projeto usa o canal estável. Migrar para o 15 quando o nixpkgs
# lançar uma versão com Electron atualizado e sem aviso de inseguro.
{ pkgs ? import (fetchTarball
    "https://github.com/NixOS/nixpkgs/archive/nixos-26.05.tar.gz") { } }:

assert pkgs.lib.assertMsg
  (pkgs.lib.versions.major pkgs.cypress.version == "14")
  "Recebi usa Cypress 14.x (canal estável). Veja o comentário no topo.";

pkgs.mkShell {
  packages = [
    pkgs.nodejs
    pkgs.python3
    pkgs.cypress
    # `cypress run` sobe um Xvfb quando não há $DISPLAY (sessão só Wayland)
    pkgs.xorg-server
  ];

  shellHook = ''
    export CYPRESS_INSTALL_BINARY=0
    export CYPRESS_RUN_BINARY=${pkgs.cypress}/bin/Cypress
    export CYPRESS_SKIP_VERIFY=true

    echo "recebi devshell: node $(${pkgs.nodejs}/bin/node --version) | cypress nix ${pkgs.cypress.version} (bin: $CYPRESS_RUN_BINARY)"
  '';
}
