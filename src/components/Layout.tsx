import React, { ReactElement } from "react";
import { MainNav } from "./MainNav";
import { navItems } from "@/utils/navItems";
import SidebarNav from "./SidebarNav";

const Layout = ({ children }: { children: ReactElement }) => {
  return (
    <div className="grid grid-cols-[0fr_1fr] grid-rows-[0fr_1fr] min-h-screen w-screen">
      <MainNav items={navItems.mainNav} />
      <SidebarNav items={navItems.sidebarNav} />
      {children}
    </div>
  );
};

export default Layout;
