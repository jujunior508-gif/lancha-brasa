# Segurança

## Encontrou uma falha?

Escreva para **ola@brasaepao.com.br** (troque pelo e-mail real da loja) com os passos para reproduzir. Não abra uma issue pública com detalhes da falha.

## Como o site se protege

- **Site 100% estático.** Não há servidor, banco de dados, login nem senha. Nenhum dado de cliente é guardado pela loja: o pedido sai do celular do cliente direto para o WhatsApp.
- **Content Security Policy rígida** (no topo do `index.html`):
  - scripts só do próprio site (`app.js`); nenhum script colado no HTML é executado, o que bloqueia ataques de injeção de código (XSS);
  - nenhuma conexão para fora (`connect-src 'none'`), nenhum iframe, plugin ou formulário enviado a outro site;
  - imagens só do próprio site; fontes só do Google Fonts.
- **Entradas tratadas como texto.** Busca, nome, endereço e observações nunca viram HTML; caracteres de controle e `< >` são removidos e o tamanho é limitado antes de ir para a mensagem do WhatsApp.
- **Dados salvos no navegador são validados.** Carrinho e dados do pedido guardados no `localStorage` são conferidos item a item ao abrir o site; itens desconhecidos são descartados e quantidades limitadas a 99.
- **Fotos só da pasta `fotos/`.** O campo `foto` dos itens aceita apenas arquivos dessa pasta.
- **Links externos** abrem com `rel="noopener noreferrer"`, sem dar acesso à página de origem.

## Configurações do GitHub (faça uma vez)

1. **Settings → Pages → Enforce HTTPS**: deixe marcado.
2. **Settings → Code security**: ative *Secret scanning* e *Push protection* para impedir que senhas ou chaves sejam publicadas por engano.
3. **Settings → Branches → Add rule** para `main`: exija revisão antes de mudar o site, se mais alguém tiver acesso.
4. Ative a **verificação em duas etapas (2FA)** na sua conta do GitHub. É a forma mais comum de alguém invadir um site estático: entrando na conta de quem publica.

## Limites conhecidos

- O GitHub Pages não permite configurar cabeçalhos HTTP; por isso a proteção contra o site ser exibido dentro de outro site (clickjacking) não pode ser garantida por cabeçalho. Como o site não tem login nem ações sensíveis, o risco é baixo.
- O WhatsApp de pedidos é público por natureza: qualquer pessoa pode mandar mensagem para ele.
