import { Menu, Statistic } from "antd";
import { useEffect, useState } from "react";
import { useMetrics } from "../../hooks/useMetrics";
import styles from "./navbar.module.scss";

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = ({}) => {
  const [count, setCount] = useState<number | undefined>(undefined);
  const { getCount } = useMetrics();

  useEffect(() => {
    const getMetricCount = async () => {
      setCount(await getCount());
    };

    const interval = setInterval(getMetricCount, 1000);

    return () => clearInterval(interval);
  }, [getCount]);

  return (
    <>
      <Menu mode="horizontal" className={styles.navbar}>
        <div className={styles["left-buttons"]}>
          <h2>Factorial Metric Viewer</h2>
        </div>
        <div className={styles["center-buttons"]}></div>
        <div className={styles["right-buttons"]}>
          <Statistic
            title="Metrics persisted"
            value={count}
            loading={count === undefined}
          />
        </div>
      </Menu>
    </>
  );
};

export default Navbar;
