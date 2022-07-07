import { gql } from "@apollo/client";
import { useCallback, useEffect, useState } from "react";
import client from "../apollo-client";

export interface Metric {
  name: string;
  value: number;
  timestamp: string;
}

interface MetricsHook {
  getAll: (name: string, from?: Date, to?: Date) => Promise<Metric[]>;
  isLoading: boolean;
}

export const useMetrics = (): MetricsHook => {
  const [isLoading, setLoading] = useState<boolean>(false);

  const getAll = useCallback(async (name: string, from?: Date, to?: Date) => {
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
      variables: { name, from, to },
    });

    setLoading(false);
    return data.metrics;
  }, []);

  return { getAll, isLoading };
};
