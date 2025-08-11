"use client"

import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, BookOpen, Calendar, FolderGit2, Clock } from "lucide-react"

const stats = [
  { title: "Achievements", count: 12, icon: Trophy, href: "/admin/achievements" },
  { title: "Blogs", count: 8, icon: BookOpen, href: "/admin/blogs" },
  { title: "Events", count: 5, icon: Calendar, href: "/admin/events" },
  { title: "Projects", count: 15, icon: FolderGit2, href: "/admin/projects" },
  { title: "Upcoming Events", count: 3, icon: Clock, href: "/admin/upcoming_events" },
]

export default function AdminPage() {
  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-xl font-semibold">Admin Dashboard</h1>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.title} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.count}</div>
                <CardDescription>Total {stat.title.toLowerCase()}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </SidebarInset>
  )
}
