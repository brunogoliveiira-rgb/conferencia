# Art Conferência

Aplicativo web (PWA) para conferência de produtos importando romaneios em PDF.
Funciona no celular como um app instalado e também offline (após o primeiro acesso).

## Como publicar no GitHub Pages

1. Crie um repositório no GitHub (ex.: `art-conferencia`).
2. Envie **todos** os arquivos desta pasta para a raiz do repositório (mantenha a pasta `icons`).
3. Vá em **Settings → Pages**.
4. Em **Source**, escolha **Deploy from a branch**, branch `main` e pasta `/ (root)` → **Save**.
5. Aguarde 1–2 minutos. O endereço será: `https://SEU-USUARIO.github.io/art-conferencia/`

## Como instalar no celular

- **Android (Chrome):** abra o link → menu ⋮ → **Instalar aplicativo** (ou *Adicionar à tela inicial*).
- **iPhone (Safari):** abra o link → botão Compartilhar → **Adicionar à Tela de Início**.

## Atualizações

Sempre que alterar o `index.html`, abra o `sw.js` e aumente o número em `const VERSION = 'v1';`
(ex.: `'v2'`) para que os celulares baixem a nova versão.

## Observações

- Os dados (romaneio atual, histórico e calculadora) ficam salvos no próprio celular (localStorage).
  Limpar os dados do navegador apaga essas informações.
- O PDF.js é carregado do cdnjs e fica guardado em cache para uso offline.
