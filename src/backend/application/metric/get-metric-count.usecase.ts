import { Injectable } from "@nestjs/common";
import { MetricRepository } from "backend/domain/metric/metric.repository";
import { GetMetricCount } from "backend/domain/metric/usecases";

@Injectable()
export class GetMetricCountImpl extends GetMetricCount {
  constructor(private readonly metricRepository: MetricRepository) {
    super();
  }

  async getCount(): Promise<number> {
    return await this.metricRepository.getCount();
  }
}
