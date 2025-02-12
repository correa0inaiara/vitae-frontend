# Sobre esse projeto
Repositório do Front-end do meu Projeto de TCC da Especialização em Desenvolvimento Web Full Stack. 

## Nome do Projeto
Projeto Vitae - Sistemas de Vagas

## Tecnologias
Esse projeto foi desenvolvido com React e CSS.

### Estrutura do Projeto
```
-- public
|
-- src
|
------ assets
|
------ components
|
------ config
|
------ data
|
------ enums
|
------ estilos
|
------ hooks
|
------ pages
|
------ App.js
|
------ Routes.js
|
------ index.js
|
-- .gitignore
|
-- README.md
|
-- package-lock.json
|
-- package.json

```

- ./public
Nesta pasta contém algumas imagens, o arquivo robots para configurações de indexação nos buscadores e um arquivo HTML que será exibido caso o JavaScript não esteja habilitado na página.

- ./src/index.js
Definição da estrutura root do projeto. Essencial para a renderização correta da aplicação.

- ./src/App.js
Definição da rota principal (main) da aplicação. Aqui também foram definidos todos os estilos.

- ./src/Routes.js
Definição de quais componentes serão exibidos e quais rotas: públicas ou protegidas por login.

- ./src/assets
Imagens, logo, SVGs e fontes utilizadas no projeto.

- ./src/components
Contém o código HTML dos componentes e a lógica de seu funcionamento.

- ./src/config
Definição dos itens do menu para usuários logados e desligados, separado por tipo de usuário.

- ./src/data
Todas as chamada para a API.

- ./src/enums
Definição dos ENUMs utilizados na aplicação.


- ./src/estilos
Todos os estilos CSS dos componentes e as definições das variáveis utilizadas.

- ./src/hooks
Hooks customizados para salvar alguns dados no Local Storage e para armazenar os dados da Autenticação.

- ./src/pages
Construção da páginas de acordo com os componentes criados.
