<!-- markdownlint-disable-file -->
<div align="center">
  <img src="https://image.pngaaa.com/758/7692758-middle.png" width="100" alt="NestJS Logo" />
  <h1>🐾 Fredericksen API - MVP 1</h1>

  <p>
    <img src="https://img.shields.io/badge/Status-Fase%20de%20Infraestrutura-C35050?style=flat-square" alt="Status">
    <img src="https://img.shields.io/badge/Security-AES--256--GCM-C35050?style=flat-square" alt="Security">
  </p>

  <div>
    <img src="https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=nestjs&logoColor=white" alt="NestJS">
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript">
    <img src="https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white" alt="Prisma">
    <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="Postgres">
  </div>
</div>

<br />

## Missão do Projeto

O **Fredericksen** é um ecossistema projetado sob a ótica de **Security by Design**. O objetivo deste MVP é garantir que dados sensíveis (alergias, medicamentos e tipo sanguíneo) sejam armazenados com criptografia de ponta, acessíveis apenas por identidades validadas via OAuth 2.0.

---

## Engenharia e Stack

- **Runtime:** Node.js v20 (LTS)
- **Core:** NestJS com Injeção de Dependência e Arquitetura Modular.
- **ORM:** Prisma para garantia de Type-safety no banco de dados.
- **Database:** PostgreSQL (Relacional) seguindo normalização de dados.
- **Containerização**: Uso de Docker para API e Banco de Dados, assegurando isolamento.
- **Security:**
  - **Non-Root Execution**: Processos executados via usuário node (segurança de privilégio mínimo).
  - **At Rest:** AES-256-GCM para campos sensíveis.
  - **In Transit:** Protocolo TLS/SSL obrigatório.
  - **Auth:** Google OAuth 2.0 / OpenID Connect.

> [!IMPORTANT]
> **Engineering Rules:** 
> * **Strict Type Safety:** Uso obrigatório de `strict: true` e `noImplicitAny` no compilador.
> * **Zero `any` Policy:** Proibição total do tipo `any`, forçando tipagem explícita em toda a aplicação.
> * **Standard Casing:** Código em `camelCase` e Banco de Dados em `snake_case` via mapeamento Prisma.
> * **Domain Integrity:** Uso de `Enums` para valores restritos, garantindo validade desde o schema.
> * **Async Safety:** Tratamento obrigatório de todas as Promises para evitar `floating promises`.
> * **Imutabilidade:** Preferência por `readonly` e Signals (Angular) para gestão de estado.


---

## Arquitetura de Dados

  <span><img src="./assets/images/MVP1-DER.png"></img><span>

---

## OpenAPI (Swagger)

<div align="center">
  <img src="./assets/images/Screenshot 2026-04-29 110354.png" width="100%" style="border-radius: 10px;" alt="Swagger Documentation">
  <img src="./assets/images/Screenshot 2026-04-29 110610.png" width="100%" style="border-radius: 10px;" alt="Swagger Documentation">
  <img src="./assets/images/Screenshot 2026-04-29 110401.png" width="100%" style="border-radius: 10px;" alt="Swagger Documentation">
</div>

---

## Requisitos funcionais e telas do MVP1
<img src="./assets/images/Screenshot 2026-04-29 113814.png" width="100%" style="border-radius: 10px;" alt="Swagger Documentation">
<img src="./assets/images/Screenshot 2026-04-29 114007.png" width="100%" style="border-radius: 10px;" alt="Swagger Documentation">

<br />



<div align="right">
  <sub>Construído com 🩷 por <b>Thaissa Leslye</b></sub><br />
  <sub>IA utilizada: Gemini na ferramenta Aprendizado Guiado e modo Raciocínio</sub><br/>
  <a href="./assets/prompt.md">Acesse o prompt do agente utilizado aqui!</a>
</div>
