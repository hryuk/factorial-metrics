import { Module } from "@nestjs/common";
import { CalculateFactorial } from "backend/domain/factorial/usecases";
import { FactorialResolver } from "backend/infrastructure-graphql/factorial/factorial.resolver";
import { CalculateFactorialImpl } from "./calculate-factorial.usecase";

@Module({
  providers: [
    FactorialResolver,
    { provide: CalculateFactorial, useClass: CalculateFactorialImpl },
  ],
})
export class FactorialModule {}
