import { Injectable } from "@nestjs/common";
import { Metric, MetricName } from "backend/domain/metric/metric";
import { MetricRepository } from "backend/domain/metric/metric.repository";
import { GetMetrics } from "backend/domain/metric/usecases";

@Injectable()
export class GetMetricsImpl extends GetMetrics {
  constructor(private readonly metricRepository: MetricRepository) {
    super();
  }

  async getMetrics(
    name: MetricName,
    from?: Date,
    to?: Date
  ): Promise<Metric[]> {
    if (!from) {
      var today = new Date();
      var last5Mins = new Date(today.getTime() - 1000 * 60 * 5);
      from = last5Mins;
    }

    if (to && to.getTime() < from.getTime()) {
      throw new Error("Invalid time range, to < from");
    }

    return await this.metricRepository.getAll(name, from, to);
  }
}
