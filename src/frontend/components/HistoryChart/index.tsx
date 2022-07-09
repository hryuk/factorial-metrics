import { Card } from "antd";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import UplotReact from "uplot-react";
import "uplot/dist/uPlot.min.css";
import { useElementSize } from "usehooks-ts";

import { Metric, useMetrics } from "../../hooks/useMetrics";

import styles from "./historychart.module.scss";

export interface TimeRange {
  from?: Date;
  to?: Date;
}
export interface HistoryMetric {
  name: string;
  color: string;
}

interface HistoryChartProps {
  metrics: HistoryMetric[];
  timeRange: TimeRange;
  title?: string;
}

const HistoryChart: React.FC<HistoryChartProps> = (props) => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const [domLoaded, setDomLoaded] = useState<boolean>(false);

  const [chartCardRef, { width, height }] = useElementSize();

  const [metrics, setMetrics] = useState<Metric[][]>([]);

  const metricsRef = useRef<Metric[][]>(metrics);

  const { getAll } = useMetrics();

  const getMetrics = useCallback(async () => {
    props.metrics.forEach(async (metric, i) => {
      metricsRef.current[i] = await getAll(
        metric.name,
        props.timeRange.from,
        props.timeRange.to
      );
      setMetrics([...metricsRef.current]);
    });
  }, [getAll, props.timeRange, props.metrics]);

  useEffect(() => {
    getMetrics();
  }, [getMetrics]);

  useEffect(() => {
    metricsRef.current = metrics;
  }, [metrics]);

  const options: uPlot.Options = useMemo(
    () => ({
      title: props.title,
      width: width - 48,
      height: height - 80 - (props.title ? 60 : 0),
      cursor: {
        drag: {
          setScale: false,
        },
      },
      select: {
        show: false,
        left: 0,
        top: 0,
        width: 0,
        height: 0,
      },
      series: [
        {},
        ...props.metrics.map((m) => ({
          label: m.name,
          scale: "%",
          value: (_, v) => (v == null ? "-" : v.toFixed(1) + "%"),
          stroke: m.color,
        })),
      ],
      axes: [
        {},
        {
          scale: "%",
          values: (_, vals) => vals.map((v) => +v.toFixed(1) + "%"),
        },
      ],
      scales: {
        "%": {
          auto: false,
          range: [0, 100],
        },
      },
      plugins: [],
    }),
    [width, height, props.metrics, props.title]
  );

  useEffect(() => {
    if (chartRef.current) {
      setDomLoaded(true);
    }
  }, []);

  return (
    <Card ref={chartCardRef} className={styles["chart"]}>
      <div id="root" ref={chartRef}></div>
      {domLoaded && metrics.length === props.metrics.length && metrics[0] && (
        <UplotReact
          options={options}
          data={[
            metrics[0].map((m) => new Date(m.timestamp).getTime() / 1000),
            ...metrics.map((metric) => metric.map((m) => m.value)),
          ]}
          target={chartRef.current}
        />
      )}
    </Card>
  );
};

export { HistoryChart };
