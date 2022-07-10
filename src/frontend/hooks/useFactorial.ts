import { gql } from "@apollo/client";
import { useCallback, useRef, useState } from "react";
import client from "../apollo-client";

interface Job {
  id: string;
  query: number;
  result: string | undefined | null;
  duration?: number;
  errors: string[];
}

interface FactorialHook {
  jobs: Job[];
  calculateFactorial: (newJob: Job) => Promise<void>;
}

export const useFactorial = (): FactorialHook => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const jobsRef = useRef<Job[]>([]);

  const calculateFactorial = useCallback(async (newJob: Job) => {
    jobsRef.current = [newJob, ...jobsRef.current];
    setJobs(jobsRef.current);

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

      jobsRef.current = jobsRef.current.map((v) => {
        if (v.id === newJob.id) {
          return {
            ...v,
            result: data.data.factorial.result,
            duration: data.data.factorial.seconds,
          };
        } else {
          return v;
        }
      });
    } catch (error) {
      jobsRef.current = jobsRef.current.map((v) => {
        if (v.id === newJob.id) {
          return { ...v, result: null, errors: [error] };
        } else {
          return v;
        }
      });
      console.error(error);
    }

    setJobs(jobsRef.current);
  }, []);

  return { calculateFactorial, jobs };
};
