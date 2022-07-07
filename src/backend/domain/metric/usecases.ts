import { Metric, MetricName } from "./metric";

export abstract class GetMetrics {
  abstract getMetrics(
    name: MetricName,
    from?: Date,
    to?: Date
  ): Promise<Metric[]>;
}

export abstract class CreateMetric {
  abstract createMetric(product: Metric): Promise<Metric>;
}
