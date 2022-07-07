import React, { useEffect, useRef, useState } from "react";

import { Input, Card, Row, Col, List, Spin } from "antd";

import styles from "./index.module.scss";

const { Search } = Input;

import dynamic from "next/dynamic";
import { gql } from "@apollo/client";
import client from "../apollo-client";

import { v4 as uuidv4 } from "uuid";
import { useElementSize } from "usehooks-ts";

const LiveChart = dynamic<any>(
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

const CARD_PADDING = 24 * 2;

const Index: React.FC<IndexProps> = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const jobsRef = useRef<Job[]>([]);

  const [chartCardRef, { width, height }] = useElementSize();

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
        console.log(error);
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
    <>
      <Row>
        <Col span={14}>
          <Card
            title={<h3>Live Metrics</h3>}
            ref={chartCardRef}
            className={styles["chart-card"]}
          >
            <LiveChart
              width={width - CARD_PADDING}
              height={height - CARD_PADDING}
            />
          </Card>
          <Card
            title={<h3>Live Metrics</h3>}
            ref={chartCardRef}
            className={styles["chart-card"]}
          >
            <LiveChart
              width={width - CARD_PADDING}
              height={height - CARD_PADDING}
            />
          </Card>
        </Col>
        <Col span={8} offset={1} className={styles["factorial-controls"]}>
          <Search
            className={styles["factorial-calculator"]}
            placeholder="enter numbers to factorize"
            enterButton="Calculate"
            size="large"
            loading={false}
            onSearch={handleSearch}
          />
          <List
            className={styles["factorial-results"]}
            size="small"
            dataSource={jobs}
            renderItem={(job) => (
              <List.Item>
                {`Factorial of ${job.query}`}{" "}
                {job.result === undefined && <Spin size="small" />}
                {job.result === null && "Error!"}
                {job.result && `Result: ${job.result}`}
              </List.Item>
            )}
          />
        </Col>
      </Row>
    </>
  );
};

export default Index;
