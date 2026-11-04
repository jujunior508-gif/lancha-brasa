# Brasa & Pão Hamburgueria

Landing page de uma hamburgueria artesanal em Pinheiros, São Paulo.

## O que tem

- Topo com burger que se monta sozinho, faíscas de brasa e vapor
- Cardápio com 24 itens no estilo dos apps de delivery: lista por categoria (burgers, porções, bebidas e sobremesas), barra de categorias fixa que acompanha a rolagem, busca, combo nos burgers e botão de quantidade (− 1 +) direto no card
- No celular: cards compactos (foto + nome + preço) e barra fixa "Ver pedido" com o total
- **Monte o seu lanche:** escolha um pronto (Clássico, Duplo, Bacon, Picante, Vegetariano) ou toque nos 12 ingredientes; o burger se monta na tela, ganha nome automático e o preço e as calorias atualizam na hora
- Carrinho em forma de comanda, com retirada ou entrega (grátis acima de R$ 120)
- **Pedido pelo WhatsApp:** o cliente preenche nome, endereço, pagamento e observações, e o site abre o WhatsApp da loja com o pedido já escrito
- Seção "Anatomia" com o burger que desmonta pelo botão, pelo controle deslizante ou tocando nele
- Linha do tempo do preparo, carrossel de avaliações e rodapé com newsletter
- Responsiva, com tema claro e escuro, e respeita a preferência de "reduzir movimento"

## Configurar o WhatsApp da loja

No `index.html`, procure por `const WHATSAPP=` e troque o número pelo da loja, só com dígitos, no formato código do país + DDD + número (ex.: `5511912345678`). Troque também o número que aparece no rodapé e o link `wa.me` do ícone do WhatsApp.

## Como editar o cardápio

No `index.html`, procure por `COMO EDITAR O CARDÁPIO`. Logo abaixo está a lista de itens (`const MENU=[`). Cada item é um bloco `{ ... }`:

- **Preço:** `price:36.9` (com ponto, sem "R$")
- **Nome e descrição:** `name:'...'` e `desc:'...'`
- **Selo:** `badge:'Mais pedido'` (apague para tirar)
- **Categoria:** `cat:'burgers'`, `'sides'`, `'drinks'` ou `'desserts'`
- **Tirar um item:** apague o bloco inteiro dele
- **Novo item:** copie um bloco parecido e troque o `id`

Os ingredientes do "Monte o seu" ficam logo abaixo, em `const ING=[`: dá para mudar o preço (`p`), as calorias (`c`) e a quantidade máxima (`max`) de cada um.

## Segurança

- Página 100% estática: não há servidor, banco de dados nem coleta de dados. O pedido sai direto do navegador do cliente para o WhatsApp.
- Content Security Policy bloqueia scripts e conexões externas; só as fontes do Google Fonts são carregadas.
- Os textos digitados pelo cliente são limpos e têm limite de tamanho antes de entrar na mensagem do WhatsApp.
- Links externos usam `rel="noopener noreferrer"`.

## Como abrir

Abra o `index.html` no navegador. Para publicar, use o GitHub Pages: Settings → Pages → Deploy from branch → `main` / root.

> Os números de telefone, o endereço e as avaliações são de exemplo. Troque pelos dados reais antes de publicar.
