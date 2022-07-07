import { FactorialInput } from "backend/domain/factorial/factorial-input";
import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";

export const toFactorialInput = async (
  number: number
): Promise<FactorialInput> => {
  const input = plainToInstance(FactorialInput, { value: number });
  await validateOrReject(input);
  return input;
};
