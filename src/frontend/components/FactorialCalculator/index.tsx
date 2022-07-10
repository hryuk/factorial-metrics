import React, { useEffect, useRef, useState } from "react";

import { Input } from "antd";

import styles from "./factorial-calculator.module.scss";

const { Search } = Input;

import { gql } from "@apollo/client";
import client from "../../apollo-client";

import { SendOutlined, SyncOutlined } from "@ant-design/icons";

import { v4 as uuidv4 } from "uuid";

interface Job {
  id: string;
  query: number;
  result: string | undefined | null;
  duration?: number;
  errors: string[];
}

const MAX_CALCULABLE_NUMBER = 12;
const SLOW_CALCULABLE_NUMBER = 10;

interface FactorialCalculatorProps {}

const FactorialCalculator: React.FC<FactorialCalculatorProps> = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const jobsRef = useRef<Job[]>([]);

  const [status, setStatus] = useState<"error" | "warning" | undefined>(
    undefined
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.currentTarget.value);

    if (value <= SLOW_CALCULABLE_NUMBER) {
      setStatus(undefined);
    } else if (value <= MAX_CALCULABLE_NUMBER) {
      setStatus("warning");
    } else {
      setStatus("error");
    }
  };

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
              return {
                ...v,
                result: data.data.factorial.result,
                duration: data.data.factorial.seconds,
              };
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
    <>
      <Search
        className={`${styles["factorial-calculator"]} ${
          styles["factorial-calculator-" + status]
        }`}
        placeholder="enter numbers to calculate factorials, max: 12"
        enterButton={<SendOutlined />}
        size="large"
        type="number"
        min={0}
        max={MAX_CALCULABLE_NUMBER}
        status={status}
        onChange={handleChange}
        onSearch={handleSearch}
      />
      <div className={styles["factorial-results"]}>
        {jobs.map((job) => (
          <div key={job.id}>
            {`Factorial of ${job.query}: `}
            {job.result === undefined && <SyncOutlined spin />}
            {job.result === null && "Error!"}
            {job.result &&
              `${job.result}, calculated in ${job.duration} seconds`}
          </div>
        ))}
      </div>
    </>
  );
};

export default FactorialCalculator;
