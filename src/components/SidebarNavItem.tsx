import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { IconComponent } from "./ui/icons";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "./ui/tooltip";
import { NavItem } from "@/types/nav";

interface SidebarNavItemProps {
  item: NavItem;
  pathname: string;
}

const SidebarNavItem = ({ item, pathname }: SidebarNavItemProps) => {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <li className="mb-6">
            {item.href && (
              <Link
                href={item.href}
                className={cn(
                  "group flex w-full items-center justify-center rounded-md border border-transparent p-2 transition-colors",
                  item.disabled && "cursor-not-allowed opacity-60",
                  pathname === item.href
                    ? "font-medium text-primary bg-primary/10"
                    : "text-muted-foreground hover:bg-secondary-foreground/5"
                )}
                target={item.external ? "_blank" : ""}
                rel={item.external ? "noreferrer" : ""}
              >
                <div className="flex flex-col text-center justify-center items-center">
                  {item.icon && (
                    <IconComponent icon={item.icon} className="h-6 w-6" />
                  )}
                </div>
              </Link>
            )}
          </li>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{item.title}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SidebarNavItem;
