import { gql } from "@apollo/client";
import { useCallback, useRef, useState } from "react";
import client from "../apollo-client";

export interface Metric {
  name: string;
  value: number;
  timestamp: string;
}

interface MetricsHook {
  getAll: (metricName: string, from?: Date, to?: Date) => Promise<Metric[]>;
  getCount: () => Promise<number>;
  subscribe: (metricName: string) => Promise<void>;
  liveMetrics: Metric[];
  isLoading: boolean;
}

export const useMetrics = (): MetricsHook => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [liveMetrics, setLiveMetrics] = useState<Metric[]>([]);
  const liveMetricsRef = useRef<Metric[]>([]);

  const getAll = useCallback(
    async (metricName: string, from?: Date, to?: Date) => {
      setLoading(true);

      const { data } = await client.query({
        query: gql`
          query GetMetrics($name: String!, $from: String, $to: String) {
            metrics(name: $name, from: $from, to: $to) {
              name
              value
              timestamp
            }
          }
        `,
        variables: { name: metricName, from, to },
      });

      setLoading(false);
      return data.metrics;
    },
    []
  );

  const getCount = useCallback(async () => {
    setLoading(true);

    const { data } = await client.query({
      query: gql`
        query metricCount {
          metricCount
        }
      `,
    });

    setLoading(false);
    return data.metricCount;
  }, []);

  const subscribe = useCallback(async (metricName: string) => {
    client
      .subscribe({
        query: gql`
          subscription MetricAdded($name: String!) {
            metricAdded(name: $name) {
              name
              value
              timestamp
            }
          }
        `,
        variables: { name: metricName },
      })
      .subscribe((newData: any) => {
        if (liveMetricsRef.current.length === 200) {
          liveMetricsRef.current = [
            ...liveMetricsRef.current.slice(1),
            newData.data.metricAdded,
          ];
        } else {
          liveMetricsRef.current = [
            ...liveMetricsRef.current,
            newData.data.metricAdded,
          ];
        }

        setLiveMetrics(liveMetricsRef.current);
      });
  }, []);

  return { getAll, isLoading, getCount, subscribe, liveMetrics };
};
