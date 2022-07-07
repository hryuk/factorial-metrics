import { Module } from "@nestjs/common";
import { GetMetricsImpl } from "backend/application/metric/get-metrics.usecase";
import { MetricRepository } from "backend/domain/metric/metric.repository";
import { GetMetrics } from "backend/domain/metric/usecases";
import { MetricResolver } from "backend/infrastructure-graphql/metric/metric.resolver";
import { PrismaService } from "backend/infrastructure/prisma/prisma.service";
import { PrismaMetricRepository } from "backend/infrastructure/metric/prisma-metric.repository";
import { MetricPublisher } from "backend/infrastructure/metric/metric-publisher";

@Module({
  providers: [
    MetricResolver,
    MetricPublisher,
    PrismaService,
    { provide: MetricRepository, useClass: PrismaMetricRepository },
    { provide: GetMetrics, useClass: GetMetricsImpl },
  ],
})
export class MetricModule {}
