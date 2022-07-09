import { Metric } from "./metric";

export abstract class MetricRepository {
  abstract getAll(metricName: string, from: Date, to?: Date): Promise<Metric[]>;

  abstract create(metric: Metric): Promise<Metric>;

  abstract getCount(): Promise<number>;
}
