import * as React from "react";

import styles from "./layout.module.less";

import Navbar from "../components/Navbar";

import Sidebar from "../components/Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={styles["main"]}>
      <Navbar />
      <div className={styles["layout-container"]}>
        <Sidebar />
        <div className={styles["layout"]}>{children}</div>
      </div>
    </div>
  );
};

export default Layout;
