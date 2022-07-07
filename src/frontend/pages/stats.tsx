import React, { useCallback, useEffect, useState } from "react";

import { Button, Card, Col, DatePicker, Row } from "antd";

import styles from "./stats.module.scss";

import dynamic from "next/dynamic";

import type { DatePickerProps, RangePickerProps } from "antd/es/date-picker";
import { Metric, useMetrics } from "../hooks/useMetrics";
import moment from "moment";

const { RangePicker } = DatePicker;

const HistoryChart = dynamic<any>(
  () =>
    import("../components/HistoryChart").then(
      ({ HistoryChart }) => HistoryChart
    ),
  {
    ssr: false,
  }
);

interface Range {
  from?: Date;
  to?: Date;
}

interface HistoryProps {}

const History: React.FC<HistoryProps> = () => {
  const [minuteAverages, setMinuteAverages] = useState<Metric[]>([]);
  const [hourAverages, setHourAverages] = useState<Metric[]>([]);
  const [dayAverages, setDayAverages] = useState<Metric[]>([]);

  const [timeRange, setTimeRange] = useState<Range>({});

  const { getAll } = useMetrics();

  const handleDateRangeChange = async (
    value: DatePickerProps["value"] | RangePickerProps["value"]
  ) => {
    const timeRange: Range = {
      from: value[0]?.toDate(),
      to: value[1]?.toDate(),
    };

    setTimeRange(timeRange);
  };

  const handleRefresh = async () => {
    setTimeRange({
      from: moment().subtract(1, "hour").toDate(),
      to: moment().toDate(),
    });
  };

  const getMetrics = useCallback(async () => {
    setMinuteAverages(
      await getAll("CPU_MINUTE_AVERAGE", timeRange.from, timeRange.to)
    );
    setHourAverages(
      await getAll("CPU_HOUR_AVERAGE", timeRange.from, timeRange.to)
    );
    setDayAverages(
      await getAll("CPU_DAY_AVERAGE", timeRange.from, timeRange.to)
    );
  }, [getAll, timeRange]);

  useEffect(() => {
    getMetrics();
  }, [getMetrics]);

  return (
    <Row>
      <RangePicker
        showTime={{ format: "HH:mm" }}
        format="YYYY-MM-DD HH:mm"
        onOk={handleDateRangeChange}
        value={[
          timeRange.from
            ? moment(timeRange.from)
            : moment().subtract(1, "hour"),
          moment(timeRange.to),
        ]}
      />
      <Button onClick={handleRefresh}>Refresh</Button>

      <Card title={<h3>Minute Averages</h3>}>
        <HistoryChart metrics={minuteAverages} />
      </Card>
      <Row className={"hourly-daily-container"}>
        <Card title={<h3>Hourly Averages</h3>}>
          <HistoryChart metrics={hourAverages} />
        </Card>
        <Card title={<h3>Daily Averages</h3>}>
          <HistoryChart metrics={dayAverages} />
        </Card>
      </Row>
    </Row>
  );
};

export default History;
