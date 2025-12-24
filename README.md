## Description

Biro Perjalanan Mlaku-Mulu

## Project Setup

### Clone repository:

```bash
git clone https://github.com/nurhanna01/biro-perjalanan.git
```

### Install dependencies:

```bash
npm install
```

### Set .env.local

Set database configuration in .env.local.

### Database

Create a new database with the same name as DB_NAME in .env.local.

### Run Seeder for Mock User Data

```bash
npm run seed
```

### Compile and Run the Project

```bash

# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod

```

## API Access Rules

To access user and trips endpoints, get a token from /api/auth/login using the mock accounts below.

#### Account for Employee Role

```bash
email    : pegawai@example.com
password : 123456
```

#### Account for Tourist Role

```bash
email    : tourist@example.com
password : 123456
```

### Set header token for authorization

set token for api user and trip in header **authorization**, get token from response /api/auth/login
