import React, { useState } from "react";

import { Button, Col, DatePicker, Row } from "antd";

import { SearchOutlined } from "@ant-design/icons";

import styles from "./stats.module.scss";

import dynamic from "next/dynamic";

import type { DatePickerProps, RangePickerProps } from "antd/es/date-picker";
import moment from "moment";
import { TimeRange } from "../components/HistoryChart";

const { RangePicker } = DatePicker;

const HistoryChart = dynamic(
  () =>
    import("../components/HistoryChart").then(
      ({ HistoryChart }) => HistoryChart
    ),
  {
    ssr: false,
  }
);

interface HistoryProps {}

const History: React.FC<HistoryProps> = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>({
    from: moment().subtract(1, "day").toDate(),
    to: moment().toDate(),
  });

  const handleDateRangeChange = async (
    value: DatePickerProps["value"] | RangePickerProps["value"]
  ) => {
    const timeRange: TimeRange = {
      from: value[0]?.toDate(),
      to: value[1]?.toDate(),
    };

    setTimeRange(timeRange);
  };

  const handleRefresh = async () => {
    setTimeRange({
      from: moment().subtract(1, "day").toDate(),
      to: moment().toDate(),
    });
  };

  return (
    <Col className={styles["stats-page"]}>
      <Row className={styles["stats-controls"]}>
        <RangePicker
          showTime={{ format: "HH:mm" }}
          format="YYYY-MM-DD HH:mm"
          onOk={handleDateRangeChange}
          value={[
            timeRange.from
              ? moment(timeRange.from)
              : moment().subtract(1, "day"),
            moment(timeRange.to),
          ]}
        />
        <Button
          type="primary"
          icon={<SearchOutlined />}
          onClick={handleRefresh}
        />
      </Row>
      <Row className={styles["minute-container"]}>
        <HistoryChart
          title="Average per minute"
          timeRange={timeRange}
          metrics={[
            { name: "CPU_MINUTE_AVERAGE", color: "#ff355e" },
            { name: "RAM_MINUTE_AVERAGE", color: "#07a2ad" },
          ]}
        />
      </Row>
      <Row className={styles["hourly-daily-container"]}>
        <HistoryChart
          title="Hourly average"
          timeRange={timeRange}
          metrics={[
            { name: "CPU_HOUR_AVERAGE", color: "#ff355e" },
            { name: "RAM_HOUR_AVERAGE", color: "#07a2ad" },
          ]}
        />
        <HistoryChart
          title="Daily average"
          timeRange={timeRange}
          metrics={[
            { name: "CPU_DAY_AVERAGE", color: "#ff355e" },
            { name: "RAM_DAY_AVERAGE", color: "#07a2ad" },
          ]}
        />
      </Row>
    </Col>
  );
};

export default History;
