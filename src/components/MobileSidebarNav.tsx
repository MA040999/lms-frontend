import React, { ReactNode } from "react";
import { NavItem } from "@/types/nav";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent } from "./ui/sheet";
import SidebarNavItem from "./SidebarNavItem";

interface MobileSidebarNavProps {
  items?: NavItem[];
  children: ReactNode;
}

const MobileSidebarNav = ({ items, children }: MobileSidebarNavProps) => {
  const pathname = usePathname();

  return (
    <Sheet>
      {children}
      <SheetContent className="w-20 px-2 text-foreground" side={"left"}>
        <ul className="flex flex-col justify-center items-center overflow-y-auto pt-12 mb-4">
          {items?.map((item, idx) => (
            <SidebarNavItem
              key={idx}
              item={item}
              pathname={pathname}
            />
          ))}
        </ul>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebarNav;
