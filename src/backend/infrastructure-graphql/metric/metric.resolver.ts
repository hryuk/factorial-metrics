import { Inject } from "@nestjs/common";
import { Resolver, Query, Args, Subscription } from "@nestjs/graphql";
import { MetricName } from "backend/domain/metric/metric";
import { GetMetricCount, GetMetrics } from "backend/domain/metric/usecases";
import { RedisPubSub } from "graphql-redis-subscriptions";

@Resolver("metric")
export class MetricResolver {
  constructor(
    private getMetrics: GetMetrics,
    private getMetricCount: GetMetricCount,
    @Inject("PUB_SUB") private pubSub: RedisPubSub
  ) {}

  @Query("metrics")
  async metrics(
    @Args("name") name: string,
    @Args("from") from?: string,
    @Args("to") to?: string
  ) {
    const fromDate = from ? new Date(from) : undefined;
    const toDate = to ? new Date(to) : undefined;

    if (!Object.values<string>(MetricName).includes(name)) {
      throw new Error(`Invalid provided metric name "${name}"`);
    }

    return await this.getMetrics.getMetrics(
      name as MetricName,
      fromDate,
      toDate
    );
  }

  @Query("metricCount")
  async metricCount() {
    return await this.getMetricCount.getCount();
  }

  @Subscription("metricAdded", {
    filter: (payload, variables) => payload.metricAdded.name === variables.name,
  })
  metricAdded() {
    return this.pubSub.asyncIterator("metricAdded");
  }
}
