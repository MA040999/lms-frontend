import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Icons } from "./ui/icons";
import { NavItem } from "@/types/nav";
import { usePathname } from "next/navigation";
import { UserMenu } from "./UserMenu";

interface MainNavProps {
  items?: NavItem[];
}

export function MainNav({ items }: MainNavProps) {
  const pathname = usePathname();
  return (
    <div className="sticky top-0 h-16 z-10 col-start-1 col-end-3 flex gap-6 md:gap-10 px-10 py-4 border-b bg-background">
      <Link href="/" className="flex items-center space-x-2">
        <Icons.logo className="h-6 w-6 text-primary" />
      </Link>
      {items?.length ? (
        <nav className="flex gap-6 w-full">
          {items?.map(
            (item, index) =>
              item.href && (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex items-center text-sm font-medium text-muted-foreground hover:text-secondary-foreground transition-colors",
                    item.disabled && "cursor-not-allowed opacity-80",
                    item.href === pathname && "text-secondary-foreground"
                  )}
                >
                  {item.title}
                </Link>
              )
          )}
          <div className="ml-auto my-auto flex">
            <UserMenu />
          </div>
        </nav>
      ) : null}
    </div>
  );
}
