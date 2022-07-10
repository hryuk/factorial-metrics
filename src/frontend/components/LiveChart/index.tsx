import React, { useEffect, useMemo, useRef } from "react";

import { Card } from "antd";
import UplotReact from "uplot-react";
import { useElementSize } from "usehooks-ts";

import { useMetrics } from "../../hooks/useMetrics";

import "uplot/dist/uPlot.min.css";
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

  const [chartCardRef, { width, height }] = useElementSize();
  const { subscribe, liveMetrics } = useMetrics();

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
    subscribe(metricName);
  }, [metricName, subscribe]);

  return (
    <Card className={styles["chart-card"]} ref={chartCardRef}>
      <div id="root" ref={chartRef}></div>
      {liveMetrics.length > 0 ? (
        <UplotReact
          options={options}
          data={[
            liveMetrics.map((m) => new Date(m.timestamp).getTime() / 1000),
            liveMetrics.map((m) => m.value),
          ]}
          target={chartRef.current}
        />
      ) : (
        "Connecting..."
      )}
    </Card>
  );
};

export { LiveChart };
