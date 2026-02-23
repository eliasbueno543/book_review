# Aplicação de review de livros

Uma aplicação simples com a função de cadastrar usuários e permitir que postem reviews de livros que já leram.

Atualmente em desenvolvimento, deployment previsto para assim que o sistema de cliente e servidor estiver minimamente funcional.

## Tech Stack (atual)

**Cliente:** [React](https://react.dev/) ([create-react-app](https://www.npmjs.com/package/create-react-app/v/5.1.0)), [Typescript](https://www.npmjs.com/package/typescript), [Axios](https://www.npmjs.com/package/axios)

**Servidor:** [Node](https://nodejs.org/pt) (npm-init), [Typescript](https://www.npmjs.com/package/typescript), [Express.js](https://www.npmjs.com/package/express), [CORS](https://www.npmjs.com/package/cors), [node-postgres](https://www.npmjs.com/package/pg), [bcrypt.js](https://www.npmjs.com/package/bcryptjs), [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken), [cookie-parser](https://www.npmjs.com/package/cookie-parser)

## Objetivos

O projeto é independente e feito principalmente para treinamento e como início de portifólio. É visado desenvolvimento progressivo, possivelmente continuado mesmo após alcançado a meta final com o intuito de refiná-lo.

Atualmente, o plano de desenvolvimento envolve:

- Interface de login
- Comunicação cliente-servidor segura
- Estabelecimento de rotas
- Interface de criação de postagem
- Interface de vizualização de postagem
- Sistema de web scraping para automatizar busca por título e imagem de livros

## Log

##### 05/01/2026

- Base do servidor
- Base da comunicação de servidor com banco de dados

##### 06/01/2026

- Início de desenvolvimento do frontend (create-react-app)
- Base da comunicação de cliente e servidor

#### 07/01/2026

- Comentários
- Limpeza de código

#### 08/01/2026

- Limpeza de código
- Remoção de módulos inutilizados
- Base do sistema de cadastro de usuários
- Sanitização de queries para evitar injeção maliciosa

#### 10/01/2026

- Cadastro e autenticação de senhas com hash

#### 16/01/2026

- Base de criação de cookie para sessão

#### 17/01/2026

- Base da criação de sessão em banco de dados

#### 24/01/2026

- Limpeza de sistema de login
- Base do sistema de logout

#### 09/02/2026

- Base do middleware de autenticação
- Bloqueio de requisição em caso de falha de autenticação (usando cookies, sem conexão com banco de dados)
- Redirecionamento para página de login em caso de sessão inválida (usando cookies, sem conexão com banco de dados)

#### 21/02/2026

- Middleware de autenticação recursivo em caso de sessão válida e token expirado
- Páginas individuais possuem título

#### 22/02/2026

- Comentários
- Limpeza de código

#### 23/02/2026

- Correção de brecha de segurança em middleware de autenticação
- Limpeza de código
