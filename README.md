# limited-stock-product-backend

This is a **Node.js + TypeScript + Prisma + PostgreSQL backend** for a limited-stock product drop system.  
It supports **reservation**, **checkout**, **automatic expiration**, and **transaction-safe stock management**.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup](#setup)
- [Environment Variables](#environment-variables)
- [Database Migrations](#database-migrations)
- [API Endpoints](#api-endpoints)
- [Concurrency & Race Condition Handling](#concurrency--race-condition-handling)
- [Architecture](#architecture)
- [Trade-offs](#trade-offs)
- [Scaling Considerations](#scaling-considerations)

---

## Features

- Reserve products with limited stock
- Complete checkout from a reservation
- Automatic reservation expiration (cron job)
- Transactional stock updates to prevent overselling
- Pagination, filtering, and sorting for orders
- Centralized error handling & structured request logging
- Strict TypeScript with Prisma v4
- Observability: request logs, error logs, health check
- Zod input validation

---

## Tech Stack

- Node.js + TypeScript
- Express.js
- PostgreSQL
- Prisma ORM v4
- Zod for input validation

---
