import { Menu } from "antd";

import styles from "./navbar.module.scss";

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = ({}) => {
  return (
    <>
      <Menu mode="horizontal" className={styles.navbar}>
        <div className={styles["left-buttons"]}></div>
        <div className={styles["center-buttons"]}>
          {" "}
          <h2>Factorial metrics</h2>
        </div>
        <div className={styles["right-buttons"]}></div>
      </Menu>
    </>
  );
};

export default Navbar;
