import { IsDate, IsEnum, Length, Min } from "class-validator";
import { Expose } from "class-transformer";

export enum MetricName {
  CPU = "CPU",
  CPU_MINUTE_AVERAGE = "CPU_MINUTE_AVERAGE",
  CPU_HOUR_AVERAGE = "CPU_HOUR_AVERAGE",
  CPU_DAY_AVERAGE = "CPU_DAY_AVERAGE",
}

export class Metric {
  @Expose()
  id: BigInt;

  @Expose()
  @IsEnum(MetricName)
  name: MetricName;

  @Expose()
  @Min(0)
  value: number;

  @Expose()
  @IsDate()
  timestamp?: Date;
}
