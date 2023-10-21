import React from "react";
import Link from "next/link";
import { NavItem } from "@/types/nav";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { IconComponent } from "./ui/icons";

interface SidebarNavProps {
  items?: NavItem[];
}

const SidebarNav = ({ items }: SidebarNavProps) => {
  const pathname = usePathname();

  return (
    <aside
      className={`h-[calc(100vh-4rem)] w-full sticky top-16 left-0 bg-secondary col-start-1 row-start-2 z-20 border-r overscroll-y-contain`}
      aria-label="Sidebar"
    >
      <div className="h-full flex flex-col pb-5 overflow-hidden">
        <ul className="flex flex-col justify-center items-center space-y-6 overflow-y-auto p-2 mb-4">
          {items?.map((item, idx) => (
            <li key={idx}>
              {item.href && (
                <Link
                  href={item.href}
                  className={cn(
                    "group flex w-full items-center justify-center rounded-md border border-transparent px-2 py-1 transition-colors",
                    item.disabled && "cursor-not-allowed opacity-60",
                    pathname === item.href
                      ? "font-medium text-primary bg-primary/10"
                      : "text-muted-foreground hover:bg-secondary-foreground/5"
                  )}
                  target={item.external ? "_blank" : ""}
                  rel={item.external ? "noreferrer" : ""}
                >
                  <div className="flex flex-col justify-center items-center">
                    {item.icon && (
                      <IconComponent
                        icon={item.icon}
                        className="h-6 w-6"
                      />
                    )}
                    <span className="text-sm">{item.title}</span>
                  </div>
                </Link>
              )}
            </li>
          ))}
        </ul>
        <div className="mt-auto mx-auto"></div>
      </div>
    </aside>
  );
};

export default SidebarNav;
