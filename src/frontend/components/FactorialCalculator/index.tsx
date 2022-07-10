import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Input } from "antd";
import { SendOutlined, SyncOutlined } from "@ant-design/icons";

import { useFactorial } from "../../hooks/useFactorial";

import styles from "./factorial-calculator.module.scss";

const { Search } = Input;

const MAX_CALCULABLE_NUMBER = 12;
const SLOW_CALCULABLE_NUMBER = 10;

interface FactorialCalculatorProps {}

const FactorialCalculator: React.FC<FactorialCalculatorProps> = () => {
  const { calculateFactorial, jobs } = useFactorial();

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
    calculateFactorial({ id, query: value, result: undefined, errors: [] });
  };

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
