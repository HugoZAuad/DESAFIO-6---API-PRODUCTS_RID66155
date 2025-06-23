# API de Produtos

Esta é uma API RESTful para gerenciar produtos, clientes, pedidos e estoque.

## Visão Geral do Projeto

O projeto é uma API construída com Node.js e TypeScript que fornece endpoints para operações CRUD (Criar, Ler, Atualizar, Deletar) em produtos, clientes e pedidos. Ele também gerencia o estoque de produtos e o histórico de vendas.

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução para JavaScript no servidor.
- **TypeScript**: Superset de JavaScript que adiciona tipagem estática.
- **Express**: Framework web para Node.js.
- **TypeORM**: ORM para TypeScript e JavaScript.
- **PostgreSQL**: Banco de dados relacional.
- **Jest**: Framework de testes para JavaScript.
- **TSyringe**: Injeção de dependência para TypeScript.
- **Celebrate**: Validação de requisições para Express.
- **Nodemailer**: Módulo para envio de e-mails.
- **Dotenv**: Carrega variáveis de ambiente de um arquivo `.env`.
- **ESLint**: Ferramenta de linting para JavaScript e TypeScript.
- **Prettier**: Formatador de código.

## Práticas de Desenvolvimento e Arquitetura

Este projeto foi desenvolvido seguindo práticas modernas de engenharia de software para garantir um código limpo, manutenível e escalável.

- **Arquitetura em Camadas**: A aplicação é dividida em camadas de responsabilidade:

  - **Infraestrutura (Infra)**: Camada mais externa, responsável pela configuração do servidor web (Express), rotas e middlewares.
  - **Serviços (Services)**: Onde reside a lógica de negócio da aplicação. Cada serviço tem uma única responsabilidade, orquestrando as operações necessárias para completar uma tarefa.
  - **Domínio (Domain)**: Contém as entidades e as interfaces de repositório, representando o núcleo do negócio sem acoplamento com tecnologias externas.

- **Injeção de Dependência (Dependency Injection)**: Utilizamos o `tsyringe` para gerenciar as dependências entre as classes. Isso desacopla os componentes, facilita a manutenção e torna os testes unitários mais simples, permitindo a fácil substituição de dependências por mocks.

- **Padrão de Repositório (Repository Pattern)**: A camada de acesso a dados é abstraída através de interfaces de repositório. Isso isola a lógica de negócio das implementações de banco de dados, permitindo que o ORM (TypeORM) ou a fonte de dados seja trocado com impacto mínimo no restante da aplicação.

## Princípios SOLID

Os princípios SOLID são a base do design de software desta API, resultando em um sistema mais robusto e flexível.

- **(S) Princípio da Responsabilidade Única (SRP)**: Cada classe, especialmente na camada de serviço, tem um e apenas um motivo para mudar. Por exemplo, o `CreateProductService` é exclusivamente responsável por criar um novo produto, enquanto o `SyncStockWithProductService` lida apenas com a sincronização de estoque.

- **(O) Princípio do Aberto/Fechado (OCP)**: O sistema é projetado para ser aberto a extensões, mas fechado para modificações. Graças à injeção de dependência e ao uso de serviços, é possível adicionar novas funcionalidades (como um serviço de notificação por e-mail após uma venda) sem alterar o código dos serviços existentes.

- **(I) Princípio da Segregação de Interfaces (ISP)**: As interfaces de repositório (`IProductRepositories`, `ICustomerRepository`, etc.) são específicas para cada agregado, garantindo que as classes de serviço dependam apenas dos métodos que realmente precisam usar.

- **(D) Princípio da Inversão de Dependência (DIP)**: Os módulos de alto nível (serviços de negócio) não dependem de módulos de baixo nível (implementações concretas de repositórios). Ambos dependem de abstrações (interfaces). O `tsyringe` é a ferramenta que "conecta" essas abstrações às suas implementações em tempo de execução.

## Como Iniciar

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/HugoZAuad/DESAFIO-6---API-PRODUCTS_RID66155.git
   cd seu-repositorio
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**

   Crie um arquivo `.env` na raiz do projeto, baseado no `.env.example`.

4. **Execute as migrações do banco de dados:**

   ```bash
   npm run migration:run
   ```

5. **Inicie o servidor de desenvolvimento:**

   ```bash
   npm run dev
   ```

O servidor estará rodando em `http://localhost:3333`.

## Rotas da API

### Produtos

- **`POST /products`**: Cria um novo produto.
  - **Body:**
    ```json
    {
      "name": "Nome do Produto",
      "price": 10.0,
      "quantity": 100
    }
    ```
- **`GET /products`**: Lista todos os produtos.
- **`GET /products/:id`**: Busca um produto pelo ID.
- **`PUT /products/:id`**: Atualiza um produto.
- **`DELETE /products/:id`**: Deleta um produto.

### Clientes

- **`POST /customers`**: Cria um novo cliente.
  - **Body:**
    ```json
    {
      "name": "Nome do Cliente",
      "email": "cliente@email.com"
    }
    ```
- **`GET /customers`**: Lista todos os clientes.
- **`GET /customers/:id`**: Busca um cliente pelo ID.
- **`PUT /customers/:id`**: Atualiza um cliente.
- **`DELETE /customers/:id`**: Deleta um cliente.

### Pedidos

- **`POST /orders`**: Cria um novo pedido.
  - **Body:**
    ```json
    {
      "customer_id": "uuid-do-cliente",
      "products": [
        {
          "id": "uuid-do-produto",
          "quantity": 2
        }
      ]
    }
    ```
- **`GET /orders`**: Lista todos os pedidos.
- **`GET /orders/:id`**: Busca um pedido pelo ID.

### Vendas

- **`GET /sales`**: Lista todas as vendas.

### Estoque

- **`GET /stock`**: Lista o estoque de todos os produtos.
- **`POST /stock`**: Adiciona estoque a um produto.
  - **Body:**
    ```json
    {
      "product_id": "uuid-do-produto",
      "quantity": 10
    }
    ```

## Licença

Este projeto está licenciado sob a Licença ISC.
