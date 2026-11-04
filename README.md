# Brasa & Pão Hamburgueria

Landing page de uma hamburgueria artesanal em Pinheiros, São Paulo.

## O que tem

- Topo com burger que se monta sozinho, faíscas de brasa e vapor
- Cardápio com 24 itens no estilo dos apps de delivery: lista por categoria (burgers, porções, bebidas e sobremesas), barra de categorias fixa que acompanha a rolagem, busca, combo nos burgers e botão de quantidade (− 1 +) direto no card
- No celular: cards compactos (foto + nome + preço) e barra fixa "Ver pedido" com o total
- **Monte o seu lanche:** escolha um pronto (Clássico, Duplo, Bacon, Picante, Vegetariano) ou toque nos 12 ingredientes; o burger se monta na tela, ganha nome automático e o preço e as calorias atualizam na hora
- Carrinho em forma de comanda, com retirada ou entrega (grátis acima de R$ 120)
- **Pedido pelo WhatsApp:** o cliente preenche nome, endereço, pagamento e observações, e o site abre o WhatsApp da loja com o pedido já escrito
- Linha do tempo do preparo, avaliações reais (quando cadastradas) e rodapé com contato pelo WhatsApp
- Responsiva, com tema claro e escuro, e respeita a preferência de "reduzir movimento"

## Dados da loja (WhatsApp, telefone, redes sociais)

No `app.js`, procure por `DADOS DA LOJA`. Ali ficam o WhatsApp (só dígitos, com 55 e DDD), o telefone, o e-mail e os endereços do Instagram, Facebook e TikTok. Rede social em branco esconde o ícone.

## Como editar o cardápio

No `app.js`, procure por `COMO EDITAR O CARDÁPIO`. Logo abaixo está a lista de itens (`const MENU=[`). Cada item é um bloco `{ ... }`:

- **Preço:** `price:36.9` (com ponto, sem "R$")
- **Nome e descrição:** `name:'...'` e `desc:'...'`
- **Selo:** `badge:'Mais pedido'` (apague para tirar)
- **Categoria:** `cat:'burgers'`, `'sides'`, `'drinks'` ou `'desserts'`
- **Tirar um item:** apague o bloco inteiro dele
- **Novo item:** copie um bloco parecido e troque o `id`
- **Foto real:** coloque o arquivo na pasta `fotos/` e acrescente `foto:'fotos/nome.jpg'` no item (veja `fotos/LEIA-ME.md`)

Os ingredientes do "Monte o seu" ficam no `app.js`, em `const ING=[`: dá para mudar o preço (`p`), as calorias (`c`) e a quantidade máxima (`max`) de cada um.

## Avaliações

A seção de avaliações só aparece quando houver avaliações reais. No `app.js`, procure por `AVALIAÇÕES` e coloque as avaliações dos clientes (Google, iFood, Instagram), com autorização deles.

## Prévia nas redes sociais

O arquivo `og.jpg` é a imagem que aparece quando alguém compartilha o link. Ela usa o endereço do GitHub Pages (`https://jujunior508-gif.github.io/lancha-brasa/`); se o site for publicado em outro endereço, troque o `og:image` no topo do `index.html`.

## Segurança

Site estático, sem servidor nem banco de dados. A CSP aceita só scripts do próprio site (`app.js`), sem nada colado no HTML, e bloqueia conexões externas. Tudo o que o cliente digita é tratado como texto. Detalhes, como relatar falhas e as configurações recomendadas do GitHub (HTTPS, 2FA, secret scanning) estão em [SECURITY.md](SECURITY.md).

**Arquivos:** `index.html` (página), `app.js` (comportamento), `fotos/` (fotos dos lanches), `og.jpg` (prévia nas redes).

## Como abrir

Abra o `index.html` no navegador. Para publicar, use o GitHub Pages: Settings → Pages → Deploy from branch → `main` / root.

> Os números de telefone, o endereço e as avaliações são de exemplo. Troque pelos dados reais antes de publicar.
