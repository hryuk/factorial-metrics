import { Inject, Injectable } from "@nestjs/common";
import { Cron, Interval } from "@nestjs/schedule";
import { Metric, MetricName } from "backend/domain/metric/metric";
import { MetricRepository } from "backend/domain/metric/metric.repository";
import { RedisPubSub } from "graphql-redis-subscriptions";
import * as moment from "moment";

var os = require("os-utils");

@Injectable()
export class CpuMetricPublisher {
  constructor(
    private metricRepository: MetricRepository,
    @Inject("PUB_SUB") private pubSub: RedisPubSub
  ) {}

  @Interval(30)
  updateLiveCPU() {
    os.cpuUsage((v) => {
      const metric = new Metric();
      metric.name = MetricName.CPU;
      metric.value = Math.floor(v * 100);
      metric.timestamp = new Date();
      this.pubSub.publish("metricAdded", { metricAdded: metric });
    });
  }

  @Interval(1000)
  updateCPU() {
    os.cpuUsage((v) => {
      const metric = new Metric();
      metric.name = MetricName.CPU;
      metric.value = Math.floor(v * 100);
      metric.timestamp = new Date();
      this.metricRepository.create(metric);
    });
  }

  @Cron("0 * * * * *")
  async updateMinuteAverage() {
    const metric = new Metric();
    metric.name = MetricName.CPU_MINUTE_AVERAGE;
    metric.timestamp = new Date();

    const lastMinuteMetrics = await this.metricRepository.getAll(
      MetricName.CPU,
      moment(metric.timestamp).subtract(1, "minute").toDate(),
      metric.timestamp
    );

    metric.value = this.calculateMetricAverage(lastMinuteMetrics);

    this.metricRepository.create(metric);
  }

  @Cron("0 0 * * * *")
  async updateHourAverage() {
    const metric = new Metric();
    metric.name = MetricName.CPU_HOUR_AVERAGE;
    metric.timestamp = new Date();

    const lastHourMetrics = await this.metricRepository.getAll(
      MetricName.CPU_MINUTE_AVERAGE,
      moment(metric.timestamp).subtract(1, "hour").toDate(),
      metric.timestamp
    );

    metric.value = this.calculateMetricAverage(lastHourMetrics);

    this.metricRepository.create(metric);
  }

  @Cron("0 0 0 * * *")
  async updateDayAverage() {
    const metric = new Metric();
    metric.name = MetricName.CPU_DAY_AVERAGE;
    metric.timestamp = new Date();

    const lastDayMetrics = await this.metricRepository.getAll(
      MetricName.CPU_HOUR_AVERAGE,
      moment(metric.timestamp).subtract(1, "day").toDate(),
      metric.timestamp
    );

    metric.value = this.calculateMetricAverage(lastDayMetrics);

    this.metricRepository.create(metric);
  }

  private calculateMetricAverage(metrics: Metric[]): number {
    return (
      metrics
        .map((m) => m.value)
        .reduce((total, current) => total + current, 0) / metrics.length
    );
  }
}
