# PagaAê - Front-end

O **PagaAê** é uma aplicação web desenvolvida para gerenciar despesas compartilhadas entre grupos de amigos. Focado na clareza financeira e em uma experiência de usuário ousada, o sistema elimina a dor de cabeça de calcular "quem deve quem" após um evento, churrasco ou viagem.

A interface foi construída seguindo a tendência do **Design Neobrutalista**, utilizando cores de alto contraste, tipografia forte, bordas marcadas e sombras sólidas para criar uma experiência de usuário única, responsiva e direta ao ponto.

## 📸 Preview da Aplicação

### Landing Page

<img width="1912" height="907" alt="lp-pagae" src="https://github.com/user-attachments/assets/1b62cfb8-aa01-4af8-a32e-0880168d28a4" />

### Página de detalhes do rolê

<img width="1902" height="906" alt="role-details" src="https://github.com/user-attachments/assets/e38e81d7-e87e-4e4b-82cb-42f3b2a9d244" />


## ✨ Principais Funcionalidades

* **Gerenciamento de Rolês:** Criação de grupos (hangouts) para concentrar as despesas de um evento específico.
* **Divisão Inteligente:** Adição de despesas com identificação exata de quem pagou e quem consumiu, calculando automaticamente as fatias de cada um.
* **Histórico de Pagamentos:** Registro de quem já quitou a dívida, atualizando o saldo geral do rolê em tempo real.
* **Links de Convite:** Geração de links exclusivos para os amigos entrarem direto no grupo.
* **Cláusulas de Segurança Financeira:** Usuários com pendências financeiras ativas são bloqueados pelo sistema e não podem sair do rolê até quitarem suas dívidas.
* **Feedback Visual Instantâneo:** Toasts neobrutalistas, loaders e modais interativos para cada ação do usuário.

## 🛠️ Tecnologias Utilizadas

O ecossistema do front-end foi arquitetado com as seguintes tecnologias:

* **[Angular](https://angular.dev/):** Framework principal (utilizando o novo Control Flow `@if`, `@for`).
* **[Tailwind CSS](https://tailwindcss.com/):** Estilização utilitária, fundamental para a construção ágil do design neobrutalista.
* **[PrimeNG](https://primeng.org/):** Biblioteca de componentes de interface (Modais, Toasts, Inputs complexos), customizados para abraçar a identidade visual do app.
* **[TypeScript](https://www.typescriptlang.org/):** Tipagem estática para garantir a integridade dos DTOs e segurança na integração com a API.

## Deploy em Produção
A aplicação está configurada para suportar deploy em instâncias em nuvem (como AWS EC2 via Nginx), com tratamentos adequados de CORS e rotas gerenciadas pelo Angular Router. As requisições HTTPS e a comunicação segura com o servidor Java garantem que recursos como o Login do Google funcionem perfeitamente.
