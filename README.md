<div align="center">
  <h1>🐾 Fredericksen API | Backend Specification</h1>
  <p><strong>Status:</strong> <code>Fase de Infraestrutura & Autenticação</code></p>
  
  [![NestJS](https://img.shields.io/badge/Framework-NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
  [![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
  [![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
</div>

<br>

<p align="justify">
  Este repositório contém a fundação técnica e a especificação do backend para o projeto <strong>Fredericksen</strong>. A arquitetura foi desenhada sob a ótica de <strong>Engineering Excellence</strong>, priorizando a separação de domínios, segurança de dados sensíveis e um fluxo de entrega profissional.
</p>

---

## 🛠 Stack Técnica Detalhada

### **Core & Language**

- **Framework:** NestJS (Arquitetura Modular & Injeção de Dependência).
- **Linguagem:** TypeScript (Typing Strict Mode).
- **Documentação Dinâmica:** Swagger (OpenAPI 3.0) & Compodoc (Arquitetura Visual).

### **Persistência & Infraestrutura**

- **ORM:** Prisma (Type-safe para produtividade e migrações seguras).
- **Database:** PostgreSQL 15+ (Relacional).
- **Caching & Session:** Redis (Armazenamento em memória para alta performance e gestão de tokens).
- **Containerização:** Docker & Docker Compose.

### **Security & Validation (Security by Design)**

- **Autenticação:** Passport.js integrado com Google OAuth 2.0.
- **Criptografia:** Implementação de **AES-256** para dados em repouso e **TLS/SSL (HTTPS)** para dados em trânsito.
- **Data Integrity:** Validação estrita via _Class-validator_ e _Pipes_ customizados.
- **Sanitização:** Middlewares para proteção contra XSS e injeção de dados.

### **Qualidade & Observabilidade (Shift-Left)**

- **Testing Suite:** Jest & Supertest (Foco em TDD e Testes de Integração).
- **Code Quality:** ESLint & Prettier (Padrões de codificação rigorosos).

---

## Decisões de Arquitetura

### **Vertical Slice Architecture**

Diferente do modelo tradicional em camadas, este projeto adota **Vertical Slices**. Cada funcionalidade (ex: Auth, Profile) é tratada como um módulo independente que contém sua própria lógica de negócio, persistência e validação.

> **Benefício:** Reduz o acoplamento e facilita a manutenção, permitindo que cada "fatia" do sistema evolua sem afetar as demais.

### **NestJS & Modularidade**

O uso do NestJS permite implementar essa visão de fatias verticais através de módulos independentes, utilizando **Dependency Injection** para manter o código testável e organizado.

---

## Engineering & Security Standards

- **Design-First (OpenAPI):** A API foi documentada via Swagger antes da implementação, garantindo um contrato claro entre Frontend e Backend.
- **Security by Design:** Planejamento de criptografia **AES-256** para dados sensíveis do perfil (como medicamentos e alergias) e integração com **Google OAuth 2.0**.
- **GitFlow Workflow:** Uso rigoroso de branches (`feature/`, `develop`, `main`) para garantir a integridade do código e um histórico de commits profissional.
- **Integridade de Dados:** Validação estrita via DTOs e Pipes para garantir que os requisitos de campos obrigatórios (**RFE03**) sejam atendidos antes da persistência no **PostgreSQL**.

---

## Modelagem de Dados

<p align="justify">
  O sistema baseia-se em uma estrutura relacional otimizada, com uma relação 1:1 entre as entidades <code>usuario</code> e <code>perfil</code>, garantindo que as informações de personalização e dados sensíveis estejam vinculadas de forma segura à identidade do usuário.
</p>

---

## Roadmap

| Módulo | Atividade Técnica | Status |
| :--- | :--- | :--- |
| **01. Discovery & Design** | Refinamento e Produto | ✅ DONE |
| | Modelagem de Dados | ✅ DONE |
| | Design de API (Swagger) | ✅ DONE |
| **02. Backend Core** | Backend: Infra e Auth | 🚧 IN PROGRESS |
| | Backend: Feature Slice | ⏳ TO DO |
| **03. Frontend App** | Frontend: Foundation | ⏳ TO DO |
| | Frontend: Feature Profile | ⏳ TO DO |
| **04. Cloud & Deploy** | Deploy Nuvem (Render) | ⏳ TO DO |
| **05. Infrastructure** | Dockerização e Local DB | ⏳ TO DO |
| | Networking e Túnel SSL | ⏳ TO DO |
| **06. CI/CD & QA** | Deploy Local (Fins didáticos) | ⏳ TO DO |
| | Testes QA | ⏳ TO DO |

---
<br>
<div align="right">
  <img src="https://img.shields.io/badge/Made%20with%20%E2%9D%A4%20by-Thaissa%20Leslye-FFB6C1?style=flat-square" alt="Made by Thaissa">
</div>