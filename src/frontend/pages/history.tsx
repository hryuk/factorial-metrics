import React, { useState } from "react";

import { Button, Col, DatePicker, Row } from "antd";

import styles from "./history.module.scss";

import dynamic from "next/dynamic";
import { SearchOutlined } from "@ant-design/icons";

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
    from: moment().subtract(1, "hour").toDate(),
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
      from: moment().subtract(1, "hour").toDate(),
      to: moment().toDate(),
    });
  };

  return (
    <Col className={styles["history-page"]}>
      <Row className={styles["chart-controls"]}>
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
        <Button
          type="primary"
          icon={<SearchOutlined />}
          onClick={handleRefresh}
        />
      </Row>
      <Row className={styles["chart-container"]}>
        <HistoryChart
          timeRange={timeRange}
          metrics={[
            { name: "CPU", color: "#ff355e" },
            { name: "RAM", color: "#07a2ad" },
          ]}
        />
      </Row>
    </Col>
  );
};

export default History;
