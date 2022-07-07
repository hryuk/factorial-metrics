import { Injectable } from "@nestjs/common";
import { Metric } from "backend/domain/metric/metric";
import { MetricRepository } from "backend/domain/metric/metric.repository";
import { PrismaService } from "backend/infrastructure/prisma/prisma.service";
import { toMetric, toMetricDTO, toMetrics } from "./metric.mappers";

@Injectable()
export class PrismaMetricRepository extends MetricRepository {
  constructor(private prismaService: PrismaService) {
    super();
  }

  async getAll(metricName: string, from: Date, to?: Date): Promise<Metric[]> {
    return toMetrics(
      await this.prismaService.dataMetric.findMany({
        where: {
          name: { equals: metricName },
          timestamp: { gte: from, lt: to },
        },
      })
    );
  }

  async create(metric: Metric): Promise<Metric> {
    const productDto = await this.prismaService.dataMetric.create({
      data: toMetricDTO(metric),
    });
    return toMetric(productDto);
  }
}
