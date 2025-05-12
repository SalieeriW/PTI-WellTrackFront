"use client";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

import {
  Home,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  PieChart,
  User,
  AlarmClock,
  Camera,
} from "lucide-react";

const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Challenges",
    url: "/challenges",
    icon: MessageSquare,
  },
  {
    title: "User Settings",
    url: "/usersettings",
    icon: User,
  },
  {
    title: "Pomodoro",
    url: "/pomodoro",
    icon: AlarmClock,
  },
  {
    title: "Camera",
    url: "/camera",
    icon: Camera,
  },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r" collapsible="offcanvas">
      <SidebarHeader className="border-b p-3.5">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="h-6 w-6" />
          <span className="text-lg font-semibold">WellTrack</span>
        </div>
      </SidebarHeader>
      <SidebarGroup>
        <SidebarGroupLabel>Control Panel</SidebarGroupLabel>
        <SidebarContent>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a
                    href={item.url}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors ${
                      pathname === item.url
                        ? "bg-muted text-primary"
                        : "hover:bg-muted/50 text-muted-foreground"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </SidebarGroup>
      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="#">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
