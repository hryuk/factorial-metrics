import { Card, Menu, Statistic } from "antd";
import { ArrowUpOutlined } from "@ant-design/icons";
import styles from "./navbar.module.scss";

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = ({}) => {
  return (
    <>
      <Menu mode="horizontal" className={styles.navbar}>
        <div className={styles["left-buttons"]}>
          <h2>Factorial Metric Viewer</h2>
        </div>
        <div className={styles["center-buttons"]}></div>
        <div className={styles["right-buttons"]}>
          <Statistic title="Metrics persisted" value={112893} />
        </div>
      </Menu>
    </>
  );
};

export default Navbar;
