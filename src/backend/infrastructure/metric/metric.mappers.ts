import { DataMetric as MetricDTO } from "@prisma/client";
import { Metric } from "backend/domain/metric/metric";
import { instanceToPlain, plainToInstance } from "class-transformer";

export const toMetrics = (metrics: MetricDTO[]): Metric[] => {
  return metrics.map(toMetric);
};

export const toMetric = (metric: MetricDTO): Metric => {
  return plainToInstance(
    Metric,
    { ...metric, timestamp: metric.timestamp.toISOString() },
    { excludeExtraneousValues: true }
  );
};

export const toMetricDTO = (metric: Metric): MetricDTO => {
  return instanceToPlain(metric) as MetricDTO;
};
