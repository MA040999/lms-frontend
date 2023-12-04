import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Icons } from "./ui/icons";
import { NavItem } from "@/types/nav";
import { usePathname } from "next/navigation";
import { UserMenu } from "./UserMenu";
import MobileSidebarNav from "./MobileSidebarNav";
import { navItems } from "@/utils/navItems";
import { SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import Image from "next/image";

interface MainNavProps {
  items?: NavItem[];
}

export function MainNav({ items }: MainNavProps) {
  const pathname = usePathname();
  return (
    <div className="sticky top-0 h-16 z-10 col-start-1 col-end-3 flex gap-6 md:gap-10 px-4 sm:px-10 py-4 border-b bg-background">
      <MobileSidebarNav items={navItems.sidebarNav}>
        <SheetTrigger className="sm:hidden" asChild>
          <Button variant="ghost" size={"icon"} className="h-full rounded-sm">
            <Icons.menuIcon className="w-6 h-6 text-foreground" />
          </Button>
        </SheetTrigger>
      </MobileSidebarNav>
      <Link href="/" className="flex items-center space-x-2">
        <Image
          src="/logo.jpeg"
          alt="Logo"
          className="mx-auto h-auto w-auto min-w-[59px] min-h-[44px] max-w-[65px] max-h-[95px]"
          width={100}
          height={100}
          priority
        />
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
                    "hidden sm:flex items-center text-sm font-medium text-muted-foreground hover:text-secondary-foreground transition-colors",
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
