import { Expose } from "class-transformer";

export class FactorialResult {
  @Expose()
  result: string;

  @Expose()
  seconds: number;
}
