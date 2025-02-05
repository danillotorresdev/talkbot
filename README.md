# TalkBot - Project Setup Guide

## Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (Version 18 or later recommended)
- [pnpm](https://pnpm.io/) (Preferred package manager)
- [PostgreSQL](https://www.postgresql.org/) (For Prisma usage)
- [Cypress](https://www.cypress.io/) (For end-to-end testing)

## Installation

### 1. Clone the repository
```sh
git clone https://github.com/your-username/talkbot.git
cd talkbot
```

### 2. Install dependencies
```sh
pnpm install
```

### 3. Configure environment variables
Copy the sample environment file and update it with your database credentials.
```sh
cp .env.sample .env
```

Edit the `.env` file and provide the necessary configurations, including database credentials and API keys.

### 4. Set up the database
Run Prisma migrations to initialize the database:
```sh
pnpm prisma migrate dev
```
Generate Prisma client:
```sh
pnpm prisma generate
```

## Running the Project

### Development Mode
```sh
pnpm dev
```
This starts the Next.js development server with Turbopack enabled.

### Building for Production
```sh
pnpm build
pnpm start
```

## Linting and Type Checking

### Run ESLint
```sh
pnpm lint
```

### Run TypeScript Type Checking
```sh
pnpm type-check
```

## Testing

### Unit and Integration Tests
Run tests with Vitest:
```sh
pnpm test
```

Watch mode:
```sh
pnpm test:watch
```

Generate test coverage report:
```sh
pnpm test:coverage
```

### End-to-End Tests (E2E)
Run Cypress tests:
```sh
pnpm test:e2e
```

Open Cypress UI:
```sh
pnpm test:e2e:open
```

## Folder Structure
```
📦 talkbot
├── 📂 app
│   ├── 📂 admin
│   ├── 📂 api
│   ├── 📂 components
│   ├── 📂 layout.tsx
│   ├── 📂 page.tsx
│
├── 📂 cypress (E2E tests)
├── 📂 lib
├── 📂 node_modules
├── 📂 prisma (Database migrations and schema)
├── 📂 public
├── 📂 services (API services)
├── 📂 utils
│
├── .env (Environment variables)
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── vitest.config.ts
├── next.config.ts
├── README.md
```

## Deployment

This project is compatible with [Vercel](https://vercel.com/) for deployment.
To deploy, install the Vercel CLI and run:
```sh
vercel
```
Follow the on-screen instructions to complete the deployment process.

---

If you have any questions or issues, feel free to create an issue on GitHub! 🚀

