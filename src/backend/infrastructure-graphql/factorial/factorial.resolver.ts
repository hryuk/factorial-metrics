import { Resolver, Args, Mutation } from "@nestjs/graphql";
import { CalculateFactorial } from "backend/domain/factorial/usecases";
import { toFactorialInput } from "./factorial.mappers";

@Resolver("factorial")
export class FactorialResolver {
  constructor(private calculateFactorial: CalculateFactorial) {}

  @Mutation()
  async factorial(@Args("number") number: number) {
    const factorialResult = await this.calculateFactorial.factorial(
      await toFactorialInput(number)
    );
    return {
      result: factorialResult.result,
      seconds: factorialResult.seconds,
    };
  }
}
