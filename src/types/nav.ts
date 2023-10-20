import { Icons } from "@/components/ui/icons"

export interface NavItem {
  title: string
  href?: string
  disabled?: boolean
  external?: boolean
  icon?: keyof typeof Icons
  label?: string
}


export interface MainNavItem extends NavItem {}

export interface SidebarNavItem extends NavItem {}