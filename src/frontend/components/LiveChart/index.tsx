import { gql } from "@apollo/client";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import UplotReact from "uplot-react";
import "uplot/dist/uPlot.min.css";
import client from "../../apollo-client";

import { Metric } from "../../hooks/useMetrics";

interface LiveChartProps {
  width: number;
  height: number;
}

const LiveChart: React.FC<LiveChartProps> = ({ width, height }) => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const [domLoaded, setDomLoaded] = useState<boolean>(false);

  const [data, setData] = useState<uPlot.AlignedData>([[], []]);

  const metricsRef = useRef<Metric[]>([]);

  const suscribedRef = useRef<boolean>(false);

  const options: uPlot.Options = useMemo(
    () => ({
      width,
      height,
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
    [width, height]
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
          variables: { name: "CPU" },
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
  }, [domLoaded, suscribedRef, metricsRef]);

  return (
    <>
      <div id="root" ref={chartRef}></div>
      {domLoaded && suscribedRef.current /*&& data[0].length === 200*/ ? (
        <UplotReact options={options} data={data} target={chartRef.current} />
      ) : (
        "Connecting..."
      )}
    </>
  );
};

export { LiveChart };
