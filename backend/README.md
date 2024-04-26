<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

## Instructions

1. Install dependencies

```bash
$ pnpm install
```

2. Set environment variables. Copy `.env.example` and rename it to `.env`

3. Init Postgres container

```bash
$ docker compose up -d
```

4. Run database migrations

```bash
$ npx prisma migrate dev --name init
```

5. Run the application

```bash
# development
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

6. Make a GET request to /seed to load test data into the database (click [here]("http://localhost:3000/seed"))
