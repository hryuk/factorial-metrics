import React, { useEffect, useRef, useState } from "react";

import { Input, Row, Col, List } from "antd";

import styles from "./index.module.scss";

const { Search } = Input;

import dynamic from "next/dynamic";
import { gql } from "@apollo/client";
import client from "../apollo-client";

import { SendOutlined, SyncOutlined } from "@ant-design/icons";

import { v4 as uuidv4 } from "uuid";

const LiveChart = dynamic(
  () => import("../components/LiveChart").then(({ LiveChart }) => LiveChart),
  {
    ssr: false,
  }
);

interface Job {
  id: string;
  query: number;
  result: string | undefined;
  errors: string[];
}

interface IndexProps {}

const Index: React.FC<IndexProps> = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const jobsRef = useRef<Job[]>([]);

  const handleSearch = (value) => {
    const id = uuidv4();
    setJobs([{ id, query: value, result: undefined, errors: [] }, ...jobs]);
  };

  useEffect(() => {
    const doRequest = async (newJob: Job) => {
      try {
        const data = await client.mutate({
          mutation: gql`
          mutation {
            factorial(number: ${newJob.query}) {
              result
              seconds
            }
          }
        `,
        });

        setJobs(
          jobsRef.current.map((v) => {
            if (v.id === newJob.id) {
              return { ...v, result: data.data.factorial.result };
            } else {
              return v;
            }
          })
        );
      } catch (error) {
        console.error(error);
        setJobs(
          jobsRef.current.map((v) => {
            if (v.id === newJob.id) {
              return { ...v, result: null, errors: [error] };
            } else {
              return v;
            }
          })
        );
      }
    };

    jobsRef.current = jobs;
    if (jobs.length > 0 && jobs[0].result === undefined) {
      doRequest(jobs[0]);
    }
  }, [jobs]);

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
        <Search
          className={styles["factorial-calculator"]}
          placeholder="enter numbers to calculate their factorials"
          enterButton={<SendOutlined />}
          size="large"
          loading={false}
          onSearch={handleSearch}
        />
        <div className={styles["factorial-results"]}>
          {jobs.map((job) => (
            <div className={styles["factorial-result"]} key={job.id}>
              {`Factorial of ${job.query}: `}
              {job.result === undefined && <SyncOutlined spin />}
              {job.result === null && "Error!"}
              {job.result && `${job.result}`}
            </div>
          ))}
        </div>
      </Col>
    </Row>
  );
};

export default Index;
