# Vet CRM - Backend

Backend du CRM pour cabinet vétérinaire développé avec NestJS et Prisma.

## Stack

- NestJS
- Prisma ORM
- PostgreSQL
- TypeScript

---

## Structure

- clients/ → gestion des propriétaires
- pets/ → gestion des animaux
- prisma/ → schema et service Prisma

---

## Modèle de données

### Client (propriétaire)

- civility (Mr, Mme, etc.)
- firstName
- lastName
- email
- phone
- pets → relation (1 client → N pets)

### Pet (animal)

- name
- age
- size
- weight
- species (chien, chat, hamster, tortue)
- clientId → propriétaire

---

## Relation

Un client peut avoir plusieurs animaux  
Un animal appartient à un seul client

---

## Installation

```bash
npm install
npm run start:dev
```
