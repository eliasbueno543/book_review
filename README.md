# Aplicação de review de livros

Uma aplicação simples com a função de cadastrar usuários e permitir que postem reviews de livros que já leram.

Atualmente em desenvolvimento, deployment previsto para assim que o sistema de cliente e servidor estiver minimamente funcional.

## Tech Stack (atual)

**Cliente:** React (create-react-app), Typescript, Axios

**Servidor:** Node (npm-init), Typescript, Express, Cors, node-postgres, bcryptjs

## Objetivos

O projeto é independente e feito principalmente para treinamento e como início de portifólio. É visado desenvolvimento progressivo, possivelmente continuado mesmo após alcançado a meta final com o intuito de refiná-lo.

Atualmente, os próximos passos do desenvolvimento são:

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
