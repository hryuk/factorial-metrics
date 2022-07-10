# Factorial Metrics

An appplication that calculates factorials of numbers and shows metrics about system performance.

## Technologies

- [CockroachDB](https://www.cockroachlabs.com/) - Scalable SQL database
- [Redis](https://redis.io/) - In-memory data store
- [Nodejs](https://nodejs.org/en/) - Javascript runtime for backend applications
- [GraphQL](https://graphql.org/) - Query language for APIs

## Frameworks and libraries

- [Nest.js](https://nestjs.com/) - A progressive Node.js framework.
- [Next.js](https://nextjs.org) - React framework
- [Prisma](https://www.prisma.io/) - Typescript ORM
- [uPlot](https://github.com/leeoniya/uPlot) - Chart for time series data
- [Apollo](https://www.apollographql.com/) - GraphQL Client
- [Ant Design](https://ant.design/) - React UI Framework

## Running locally

To run the application locally:

```bash
curl -fsS https://raw.githubusercontent.com/hryuk/factorial-metrics/main/docker-compose.yml | docker-compose -f - up
```

Open [http://localhost:3000](http://localhost:3000) with your browser to view the application running.

## Development

First, clone the repository and move to de `src` directory:

```bash
git clone https://github.com/hryuk/factorial-metrics.git
cd factorial-metrics/src
```

Then, start a local instance of CockroachDB and Redis:

```bash
docker-compose up -d
```

Finally, run the development server:

```bash
npm run start:dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to view the application running.
