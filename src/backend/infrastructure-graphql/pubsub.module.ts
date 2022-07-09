import { RedisPubSub } from "graphql-redis-subscriptions";
import { Global, Module } from "@nestjs/common";

@Global()
@Module({
  providers: [
    {
      provide: "PUB_SUB",
      useValue: new RedisPubSub({
        connection: {
          host: process.env.REDIS_HOST,
          port: process.env.REDIS_PORT,
        },
      }),
    },
  ],
  exports: ["PUB_SUB"],
})
export class PubSubModule {}
