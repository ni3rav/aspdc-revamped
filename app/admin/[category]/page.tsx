"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { AddDataDialog } from "@/components/add-data-dialog"
import { PlusCircle } from "lucide-react"

// Define the configuration for each data category
const categoryConfig: Record<string, any> = {
  blogs: {
    title: "Blogs",
    columns: [
      { header: "Title", accessorKey: "title" },
      { header: "Author", accessorKey: "author" },
      { header: "Link", accessorKey: "link" },
      { header: "Publish Date", accessorKey: "publish_date" },
      { header: "Cover Image URL", accessorKey: "cover_image_url" },
      {
        header: "Actions",
        cell: () => (
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Modify
            </Button>
            <Button variant="destructive" size="sm">
              Delete
            </Button>
          </div>
        ),
      },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", placeholder: "Blog Post Title" },
      { name: "author", label: "Author", type: "text", placeholder: "Author Name" },
      { name: "link", label: "Link", type: "url", placeholder: "https://example.com/blog" },
      { name: "publish_date", label: "Publish Date", type: "date" },
      { name: "cover_image_url", label: "Cover Image URL", type: "url", placeholder: "https://example.com/cover.jpg" },
    ],
    data: [
      {
        id: "1",
        title: "Getting Started with Next.js",
        author: "Vercel",
        link: "#",
        publish_date: "2023-01-15",
        cover_image_url: "/placeholder.svg?height=100&width=100",
      },
      {
        id: "2",
        title: "Understanding Server Components",
        author: "React Team",
        link: "#",
        publish_date: "2023-02-20",
        cover_image_url: "/placeholder.svg?height=100&width=100",
      },
    ],
  },
  achievements: {
    title: "Achievements",
    columns: [
      { header: "Title", accessorKey: "title" },
      { header: "Description", accessorKey: "description" },
      { header: "Date", accessorKey: "date" },
      { header: "Image URL", accessorKey: "image_url" },
      {
        header: "Actions",
        cell: () => (
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Modify
            </Button>
            <Button variant="destructive" size="sm">
              Delete
            </Button>
          </div>
        ),
      },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", placeholder: "Achievement Title" },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        placeholder: "Brief description of the achievement",
      },
      { name: "date", label: "Date", type: "date" },
      { name: "image_url", label: "Image URL", type: "url", placeholder: "https://example.com/achievement.png" },
    ],
    data: [
      {
        id: "1",
        title: "Won Hackathon 2023",
        description: "Awarded for innovative project.",
        date: "2023-05-10",
        image_url: "/placeholder.svg?height=100&width=100",
      },
      {
        id: "2",
        title: "Published First Article",
        description: "First technical article published online.",
        date: "2022-11-01",
        image_url: "/placeholder.svg?height=100&width=100",
      },
    ],
  },
  events: {
    title: "Events",
    columns: [
      { header: "Name", accessorKey: "name" },
      { header: "Date", accessorKey: "date" },
      { header: "Description", accessorKey: "description" },
      { header: "Image URLs", accessorKey: "image_urls" },
      {
        header: "Actions",
        cell: () => (
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Modify
            </Button>
            <Button variant="destructive" size="sm">
              Delete
            </Button>
          </div>
        ),
      },
    ],
    fields: [
      { name: "name", label: "Name", type: "text", placeholder: "Event Name" },
      { name: "date", label: "Date", type: "date" },
      { name: "description", label: "Description", type: "textarea", placeholder: "Detailed event description" },
      { name: "image_urls", label: "Image URLs (comma-separated)", type: "text", placeholder: "url1, url2, url3" },
    ],
    data: [
      {
        id: "1",
        name: "Annual Tech Conference",
        date: "2024-09-20",
        description: "Largest tech gathering.",
        image_urls: ["/placeholder.svg?height=100&width=100"],
      },
      {
        id: "2",
        name: "Web Dev Workshop",
        date: "2024-07-10",
        description: "Hands-on coding session.",
        image_urls: ["/placeholder.svg?height=100&width=100"],
      },
    ],
  },
  projects: {
    title: "Projects",
    columns: [
      { header: "Name", accessorKey: "name" },
      { header: "Author", accessorKey: "author" },
      { header: "Description", accessorKey: "description" },
      { header: "Live Link", accessorKey: "live_link" },
      { header: "GitHub URL", accessorKey: "github_url" },
      { header: "Created At", accessorKey: "created_at" },
      { header: "Banner URL", accessorKey: "project_banner_url" },
      {
        header: "Actions",
        cell: () => (
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Modify
            </Button>
            <Button variant="destructive" size="sm">
              Delete
            </Button>
          </div>
        ),
      },
    ],
    fields: [
      { name: "name", label: "Name", type: "text", placeholder: "Project Name" },
      { name: "author", label: "Author", type: "text", placeholder: "Project Author" },
      { name: "description", label: "Description", type: "textarea", placeholder: "Detailed project description" },
      { name: "live_link", label: "Live Link", type: "url", placeholder: "https://live.example.com" },
      { name: "github_url", label: "GitHub URL", type: "url", placeholder: "https://github.com/user/repo" },
      { name: "created_at", label: "Created At", type: "date" },
      {
        name: "project_banner_url",
        label: "Project Banner URL",
        type: "url",
        placeholder: "https://example.com/banner.jpg",
      },
    ],
    data: [
      {
        id: "1",
        name: "E-commerce Platform",
        author: "Dev Team",
        description: "Online shopping site.",
        live_link: "#",
        github_url: "#",
        created_at: "2023-03-01",
        project_banner_url: "/placeholder.svg?height=100&width=100",
      },
      {
        id: "2",
        name: "Task Manager App",
        author: "Solo Dev",
        description: "Productivity tool.",
        live_link: "#",
        github_url: "#",
        created_at: "2023-06-15",
        project_banner_url: "/placeholder.svg?height=100&width=100",
      },
    ],
  },
  upcoming_events: {
    title: "Upcoming Events",
    columns: [
      { header: "Name", accessorKey: "name" },
      { header: "Date", accessorKey: "date" },
      { header: "Description", accessorKey: "description" },
      { header: "Location", accessorKey: "location" },
      { header: "Registration Link", accessorKey: "registration_link" },
      { header: "Event Image URL", accessorKey: "event_image_url" },
      {
        header: "Actions",
        cell: () => (
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Modify
            </Button>
            <Button variant="destructive" size="sm">
              Delete
            </Button>
          </div>
        ),
      },
    ],
    fields: [
      { name: "name", label: "Name", type: "text", placeholder: "Upcoming Event Name" },
      { name: "date", label: "Date", type: "date" },
      { name: "description", label: "Description", type: "textarea", placeholder: "Brief description of the event" },
      { name: "location", label: "Location", type: "text", placeholder: "Venue or Online" },
      {
        name: "registration_link",
        label: "Registration Link",
        type: "url",
        placeholder: "https://register.example.com",
      },
      { name: "event_image_url", label: "Event Image URL", type: "url", placeholder: "https://example.com/event.jpg" },
    ],
    data: [
      {
        id: "1",
        name: "AI & ML Workshop",
        date: "2024-10-05",
        description: "Learn about AI and Machine Learning.",
        location: "Online",
        registration_link: "#",
        event_image_url: "/placeholder.svg?height=100&width=100",
      },
      {
        id: "2",
        name: "Frontend Dev Meetup",
        date: "2024-11-12",
        description: "Networking and talks on frontend.",
        location: "City Hall",
        registration_link: "#",
        event_image_url: "/placeholder.svg?height=100&width=100",
      },
    ],
  },
}

export default function CategoryPage() {
  const params = useParams()
  const category = params.category as string
  const config = categoryConfig[category]

  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false)

  if (!config) {
    return (
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-xl font-semibold">Category Not Found</h1>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <p>The requested category "{category}" does not exist.</p>
        </div>
      </SidebarInset>
    )
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-xl font-semibold">{config.title} Management</h1>
        <Button className="ml-auto" onClick={() => setIsAddDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New {config.title.slice(0, -1)}
        </Button>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="border shadow-sm rounded-lg p-4">
          <h2 className="text-lg font-medium mb-4">Current {config.title}</h2>
          <DataTable data={config.data} columns={config.columns} />
        </div>
      </div>
      <AddDataDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        fields={config.fields}
        category={config.title.slice(0, -1)} // Pass singular category name
      />
    </SidebarInset>
  )
}
