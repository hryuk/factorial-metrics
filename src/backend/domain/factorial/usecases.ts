import { FactorialInput } from "./factorial-input";
import { FactorialResult } from "./factorial-result";

export abstract class CalculateFactorial {
  abstract factorial(input: FactorialInput): Promise<FactorialResult>;
}
