import React, { useEffect, useMemo, useRef, useState } from "react";

import UplotReact from "uplot-react";
import "uplot/dist/uPlot.min.css";

import { Metric } from "../../hooks/useMetrics";

interface HistoryChartProps {
  metrics: Metric[];
}

const HistoryChart: React.FC<HistoryChartProps> = ({ metrics }) => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const [domLoaded, setDomLoaded] = useState<boolean>(false);

  const [options, setOptions] = useState<uPlot.Options>(
    useMemo(
      () => ({
        width: 1500,
        height: 150,
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
            label: "CPU",
            scale: "%",
            value: (_, v) => (v == null ? "-" : v.toFixed(1) + "%"),
            stroke: "#ff355e",
          },
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
      []
    )
  );

  useEffect(() => {
    if (chartRef.current) {
      setDomLoaded(true);
    }
  }, []);

  return (
    <>
      <div id="root" ref={chartRef}></div>
      {domLoaded && (
        <UplotReact
          options={options}
          data={[
            metrics.map((m) => new Date(m.timestamp).getTime() / 1000),
            metrics.map((m) => m.value),
          ]}
          target={chartRef.current}
        />
      )}
    </>
  );
};

export { HistoryChart };
