import { FactorialInput } from "./factorial-input";

export abstract class CalculateFactorial {
  abstract factorial(input: FactorialInput): Promise<string>;
}
