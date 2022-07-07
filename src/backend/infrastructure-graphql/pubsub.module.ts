import { RedisPubSub } from "graphql-redis-subscriptions";
import { Global, Module } from "@nestjs/common";

@Global()
@Module({
  providers: [
    {
      provide: "PUB_SUB",
      useValue: new RedisPubSub({
        connection: {
          host: "0.0.0.0",
          port: "6379",
        },
      }),
    },
  ],
  exports: ["PUB_SUB"],
})
export class PubSubModule {}
