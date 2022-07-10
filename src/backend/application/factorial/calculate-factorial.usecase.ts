import { Injectable } from "@nestjs/common";
import { FactorialInput } from "backend/domain/factorial/factorial-input";
import { FactorialResult } from "backend/domain/factorial/factorial-result";
import { CalculateFactorial } from "backend/domain/factorial/usecases";
import * as moment from "moment";
import { Worker } from "worker_threads";

@Injectable()
export class CalculateFactorialImpl extends CalculateFactorial {
  factorial(input: FactorialInput): Promise<FactorialResult> {
    return new Promise((resolve, reject) => {
      const startDate = moment();
      const worker = new Worker("./factorial-worker.js", {
        workerData: {
          value: input.value,
        },
      });

      worker.on("message", (result: string) => {
        const endDate = moment();
        resolve({
          result: result,
          seconds: endDate.diff(startDate, "seconds"),
        });
      });

      worker.on("error", (error) => {
        reject(error);
      });
    });
  }
}
