"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Trophy,
  BookOpen,
  Calendar,
  FolderGit2,
  Clock,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button"; // Import Button component

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Import Avatar components

const navItems = [
  { title: "achievements", href: "/admin/achievements", icon: Trophy },
  { title: "blogs", href: "/admin/blogs", icon: BookOpen },
  { title: "events", href: "/admin/events", icon: Calendar },
  { title: "projects", href: "/admin/projects", icon: FolderGit2 },
  { title: "upcoming_events", href: "/admin/upcoming_events", icon: Clock },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link
              href="/admin"
              className="flex items-center gap-2 font-semibold text-lg px-2 py-2"
            >
              <span>Admin Dashboard</span>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
        {/* Search bar removed as per request */}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.includes(item.href)}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center justify-between px-2 py-2">
              <div className="flex items-center gap-2">
                <span className="text-sm">
                  john.doe@example.com
                </span>
              </div>
              <Button variant="destructive" size="sm" className="size-8">
                <LogOut />
                <span className="sr-only">Logout</span>
              </Button>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
