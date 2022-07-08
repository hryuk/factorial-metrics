import { gql } from "@apollo/client";
import { Card } from "antd";
import React, { useEffect, useMemo, useRef, useState } from "react";

import UplotReact from "uplot-react";
import "uplot/dist/uPlot.min.css";
import { useElementSize } from "usehooks-ts";
import client from "../../apollo-client";

import { Metric } from "../../hooks/useMetrics";

import styles from "./livechart.module.scss";

interface LiveChartProps {
  title?: string;
  metricName: string;
  metricColor: string;
}

const LiveChart: React.FC<LiveChartProps> = ({
  title,
  metricName,
  metricColor,
}) => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const [domLoaded, setDomLoaded] = useState<boolean>(false);

  const [data, setData] = useState<uPlot.AlignedData>([[], []]);

  const [chartCardRef, { width, height }] = useElementSize();

  const metricsRef = useRef<Metric[]>([]);

  const suscribedRef = useRef<boolean>(false);

  const options: uPlot.Options = useMemo(
    () => ({
      title,
      width: width - 48,
      height: height - 80,
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
        {
          label: metricName,
          scale: "%",
          value: (_, v) => (v == null ? "-" : v.toFixed(1) + "%"),
          stroke: metricColor,
        },
      ],
      axes: [
        { show: false },
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
    [width, height, metricColor, metricName, title]
  );

  useEffect(() => {
    if (chartRef.current) {
      setDomLoaded(true);
    }
  }, []);

  useEffect(() => {
    const subscribe = async () => {
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
          if (metricsRef.current.length === 200) {
            metricsRef.current = [
              ...metricsRef.current.slice(1),
              newData.data.metricAdded,
            ];
          } else {
            metricsRef.current = [
              ...metricsRef.current,
              newData.data.metricAdded,
            ];
          }

          setData([
            metricsRef.current.map(
              (m) => new Date(m.timestamp).getTime() / 1000
            ),
            metricsRef.current.map((m) => m.value),
          ]);
        });
    };

    if (domLoaded && !suscribedRef.current) {
      suscribedRef.current = true;
      subscribe();
    }
  }, [domLoaded, suscribedRef, metricsRef, metricName]);

  return (
    <Card className={styles["chart-card"]} ref={chartCardRef}>
      <div id="root" ref={chartRef}></div>
      {domLoaded && suscribedRef.current ? (
        <UplotReact options={options} data={data} target={chartRef.current} />
      ) : (
        "Connecting..."
      )}
    </Card>
  );
};

export { LiveChart };
