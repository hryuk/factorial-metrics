import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  LineChartOutlined,
  HistoryOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { Button, Menu } from "antd";
import Link from "next/link";
import React, { useState } from "react";

import styles from "./sidebar.module.scss";

interface SidebarProps {}

const Sidebar: React.FC<SidebarProps> = ({}) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  return (
    <div className={styles["sidebar"]}>
      <Menu
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        mode="inline"
        inlineCollapsed={collapsed}
      >
        <Menu.Item
          key="1"
          icon={<LineChartOutlined />}
          style={{
            marginTop: 0,
          }}
        >
          <Link href="/" passHref>
            Live
          </Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<HistoryOutlined />}>
          <Link href="/history" passHref>
            History
          </Link>
        </Menu.Item>
        <Menu.Item key="3" icon={<BarChartOutlined />}>
          <Link href="/stats" passHref>
            Stats
          </Link>
        </Menu.Item>
        <div className={styles["spacer"]}></div>
        <Button
          type="text"
          onClick={() => setCollapsed(!collapsed)}
          icon={collapsed ? <ArrowRightOutlined /> : <ArrowLeftOutlined />}
          className={styles["collapse-button"]}
        />
      </Menu>
    </div>
  );
};

export default Sidebar;
