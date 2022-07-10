import React from "react";

import { Row, Col } from "antd";

import styles from "./index.module.scss";

import dynamic from "next/dynamic";

import FactorialCalculator from "../components/FactorialCalculator";

// Disables Server-Side rendering of the component, as it does not work without a browser
const LiveChart = dynamic(
  () => import("../components/LiveChart").then(({ LiveChart }) => LiveChart),
  {
    ssr: false,
  }
);

interface IndexProps {}

const Index: React.FC<IndexProps> = () => {
  return (
    <Row className={styles["index-page"]}>
      <Col span={14} className={styles["charts"]}>
        <Col className={`${styles["live-chart"]} ${styles["first-chart"]}`}>
          <LiveChart title="CPU" metricName="CPU" metricColor="#ff355e" />
        </Col>
        <Col className={styles["live-chart"]}>
          <LiveChart title="RAM" metricName="RAM" metricColor="#07a2ad" />
        </Col>
      </Col>
      <Col span={10} className={styles["factorial-controls"]}>
        <FactorialCalculator />
      </Col>
    </Row>
  );
};

export default Index;
