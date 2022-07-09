import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { ViewModule } from "./application/view/view.module";
import { ConfigModule } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { MetricModule } from "./application/metric/metric.module";
import { ScheduleModule } from "@nestjs/schedule";
import { PubSubModule } from "./infrastructure-graphql/pubsub.module";
import { FactorialModule } from "./application/factorial/factorial.module";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "frontend", "public"),
      renderPath: "/fonts.*|/images.*|/logos.*",
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      typePaths: ["./**/*.graphql"],
      useGlobalPrefix: true,
      driver: ApolloDriver,
      subscriptions: {
        "graphql-ws": true,
      },
    }),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    PubSubModule,
    MetricModule,
    FactorialModule,
    ViewModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
