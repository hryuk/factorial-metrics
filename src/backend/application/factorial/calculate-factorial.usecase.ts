import { Injectable } from "@nestjs/common";
import { FactorialInput } from "backend/domain/factorial/factorial-input";
import { CalculateFactorial } from "backend/domain/factorial/usecases";
import { Worker } from "worker_threads";

@Injectable()
export class CalculateFactorialImpl extends CalculateFactorial {
  factorial(input: FactorialInput): Promise<string> {
    return new Promise((resolve, reject) => {
      const worker = new Worker("./factorial-worker.js", {
        workerData: {
          value: input.value,
        },
      });

      worker.on("message", (result) => {
        resolve(result);
      });

      worker.on("error", (error) => {
        reject(error);
      });
    });
  }
}
