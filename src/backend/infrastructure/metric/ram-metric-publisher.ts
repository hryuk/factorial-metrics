import { Inject, Injectable } from "@nestjs/common";
import { Cron, Interval } from "@nestjs/schedule";
import { Metric, MetricName } from "backend/domain/metric/metric";
import { MetricRepository } from "backend/domain/metric/metric.repository";
import { RedisPubSub } from "graphql-redis-subscriptions";
import * as moment from "moment";

var os = require("os-utils");

@Injectable()
export class RamMetricPublisher {
  constructor(
    private metricRepository: MetricRepository,
    @Inject("PUB_SUB") private pubSub: RedisPubSub
  ) {}

  @Interval(30)
  updateLiveRAM() {
    const metric = new Metric();
    metric.name = MetricName.RAM;
    metric.value = 100 - Math.floor(os.freememPercentage() * 100);
    metric.timestamp = new Date();
    this.pubSub.publish("metricAdded", { metricAdded: metric });
  }

  @Interval(1000)
  updateRAM() {
    const metric = new Metric();
    metric.name = MetricName.RAM;
    metric.value = 100 - Math.floor(os.freememPercentage() * 100);
    metric.timestamp = new Date();
    this.metricRepository.create(metric);
  }

  @Cron("0 * * * * *")
  async updateMinuteAverage() {
    const metric = new Metric();
    metric.name = MetricName.RAM_MINUTE_AVERAGE;
    metric.timestamp = new Date();

    const lastMinuteMetrics = await this.metricRepository.getAll(
      MetricName.RAM,
      moment(metric.timestamp).subtract(1, "minute").toDate(),
      metric.timestamp
    );

    metric.value = this.calculateMetricAverage(lastMinuteMetrics);

    this.metricRepository.create(metric);
  }

  @Cron("0 0 * * * *")
  async updateHourAverage() {
    const metric = new Metric();
    metric.name = MetricName.RAM_HOUR_AVERAGE;
    metric.timestamp = new Date();

    const lastHourMetrics = await this.metricRepository.getAll(
      MetricName.RAM_MINUTE_AVERAGE,
      moment(metric.timestamp).subtract(1, "hour").toDate(),
      metric.timestamp
    );

    metric.value = this.calculateMetricAverage(lastHourMetrics);

    this.metricRepository.create(metric);
  }

  @Cron("0 0 0 * * *")
  async updateDayAverage() {
    const metric = new Metric();
    metric.name = MetricName.RAM_DAY_AVERAGE;
    metric.timestamp = new Date();

    const lastDayMetrics = await this.metricRepository.getAll(
      MetricName.RAM_HOUR_AVERAGE,
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
