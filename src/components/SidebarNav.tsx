import React from "react";
import { NavItem } from "@/types/nav";
import { usePathname } from "next/navigation";
import SidebarNavItem from "./SidebarNavItem";

interface SidebarNavProps {
  items?: NavItem[];
}

const SidebarNav = ({ items }: SidebarNavProps) => {
  const pathname = usePathname();

  return (
    <aside
      className={`hidden sm:block h-[calc(100vh-4rem)] w-full sticky top-16 left-0 bg-secondary col-start-1 row-start-2 z-20 border-r overscroll-y-contain`}
      aria-label="Sidebar"
    >
      <div className="h-full flex flex-col pb-5 overflow-hidden">
        <ul className="flex flex-col justify-center items-center overflow-y-auto p-2 mb-4">
          {items?.map((item, idx) => (
            <SidebarNavItem
              key={idx}
              item={item}
              pathname={pathname}
            />
          ))}
        </ul>
        <div className="mt-auto mx-auto"></div>
      </div>
    </aside>
  );
};

export default SidebarNav;
