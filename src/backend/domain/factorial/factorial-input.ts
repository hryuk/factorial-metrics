import { Max, Min } from "class-validator";
import { Expose } from "class-transformer";

export class FactorialInput {
  @Expose()
  @Min(0)
  @Max(12)
  value: number;
}
