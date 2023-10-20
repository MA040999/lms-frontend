import { MainNavItem, SidebarNavItem } from "@/types/nav"

interface NavItems {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
}

export const navItems: NavItems = {
  mainNav: [
    {
        title: "Home",
        href: "/",
    },
  ],
  sidebarNav: [
    {
      title: "Home",
      href: "/",
      icon: 'home'
    },
  ],
}