# Pokémon Expo App

Este é um aplicativo Pokémon feito com React Native e Expo.

## Como funciona o Layout (Roteamento Customizado)

Ao invés de usar o sistema de roteamento padrão baseado em URLs do `expo-router` (onde cada arquivo na pasta `app` vira um caminho como `/pokedex`, `/profile`), este aplicativo utiliza um **roteamento baseado em estado local** (SPA - Single Page Application).

Tudo isso é gerenciado no arquivo `app/_layout.tsx`. Veja como funciona:

1. **RouteContext e RouteProvider:**
   O arquivo `_layout.tsx` cria um Contexto React chamado `RouteContext` que guarda a tela atual na variável de estado `currentRoute` (que pode ser `'login'`, `'pokedex'`, `'profile'`, etc).

2. **Troca de Telas (Renderização Condicional):**
   Dentro do componente `LayoutContent`, existe uma função `renderActiveScreen()` que verifica o valor de `currentRoute` e retorna o componente correspondente da pasta `app` (ex: `<PokedexScreen />`, `<BattleScreen />`). 
   - Isso garante que a URL do navegador nunca mude (fica sempre em `http://localhost:8081/`), dando a sensação de um aplicativo nativo mesmo rodando na Web.

3. **Autenticação:**
   O `RouteProvider` observa o estado de `isLoggedIn` (do `AuthContext`). Se o usuário não estiver logado, ele força o `currentRoute` a ser `'login'`, impedindo o acesso às outras páginas. Assim que o login é feito, ele muda automaticamente para `'pokedex'`.

4. **Estilos e Animações Globais (Web):**
   Como bônus, o `_layout.tsx` injeta tags de `<style>` globais diretamente no `<body>` quando o aplicativo está rodando na Web (`Platform.OS === 'web'`). Isso adiciona efeitos de CSS avançados (como o gradiente de fundo, animação de flutuação e scrollbar estilizada) que não seriam possíveis usando apenas o StyleSheet padrão do React Native.

## Contextos Globais
A estrutura do `_layout.tsx` também serve para envolver o app nos `Providers` globais para que os dados fiquem acessíveis em qualquer tela:
* `<AuthProvider>`: Gerencia o login e a sessão.
* `<PokemonProvider>`: Gerencia o time do treinador, perfil e vitórias.
* `<RouteProvider>`: Gerencia em qual tela estamos.
