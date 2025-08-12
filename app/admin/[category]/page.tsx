"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { AddDataDialog } from "@/components/add-data-dialog";
import { PlusCircle } from "lucide-react";
import { useAchievements } from "@/hooks/useAchievements";
import { useBlogs } from "@/hooks/useBlogs";
import { useEvents } from "@/hooks/useEvents";
import { useProjects } from "@/hooks/useProjects";
import { useUpcomingEvents } from "@/hooks/useUpcomingEvents";

// Define the configuration for each data category
const categoryConfig: Record<string, any> = {
  // eslint-disable-line
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
      {
        name: "title",
        label: "Title",
        type: "text",
        placeholder: "add achievement title",
      },
      { name: "date", label: "Date", type: "date" },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        placeholder: "Brief description of the achievement",
      },
      {
        name: "image_url",
        label: "Image Url",
        type: "url",
        placeholder:
          "a publicly uploaded image url (lol object storage service)",
      },
    ],
  },
  blogs: {
    title: "Blogs",
    columns: [
      { header: "Title", accessorKey: "title" },
      { header: "Author", accessorKey: "author" },
      { header: "Publish Date", accessorKey: "publish_date" },
      { header: "Link", accessorKey: "link" },
      { header: "Cover Image Url", accessorKey: "cover_image" },
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
      {
        name: "title",
        label: "Title",
        type: "text",
        placeholder: "add blog title",
      },
      { name: "author", label: "Author", type: "text" },
      {
        name: "publish_date",
        label: "Publish Date",
        type: "text",
        placeholder: "date of blog published",
      },
      {
        name: "link",
        label: "Link",
        type: "url",
        placeholder: "link to blog",
      },
      {
        name: "cover_image",
        label: "Cover Image URL",
        type: "url",
        placeholder: "link to blog's cover image",
      },
    ],
  },
  events: {
    title: "Events",
    columns: [
      { header: "Name", accessorKey: "name" },
      { header: "Details", accessorKey: "details" },
      { header: "Date", accessorKey: "event_date" },
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
      {
        name: "name",
        label: "Name",
        type: "text",
        placeholder: "add event name",
      },
      { name: "event_date", label: "Date", type: "date" },
      {
        name: "details",
        label: "Details",
        type: "textarea",
        placeholder: "details of event",
      },
      {
        name: "image_urls",
        label: "Image URLs",
        type: "textarea",
        placeholder: "urls to images separated by comma(,)",
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
      { header: "Github URL", accessorKey: "github_url" },
      { header: "Project banner URL", accessorKey: "project_banner_url" },
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
      {
        name: "name",
        label: "Name",
        type: "text",
        placeholder: "add project name",
      },
      { name: "author", label: "Author", type: "text" },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        placeholder: "details of project",
      },
      {
        name: "live_link",
        label: "Live Link",
        type: "url",
        placeholder: "link to deployement",
      },
      {
        name: "github_url",
        label: "Github URL",
        type: "url",
        placeholder: "link to github repo",
      },
      {
        name: "project_banner_url",
        label: "Project banner URL",
        type: "url",
        placeholder: "link to project banner image",
      },
    ],
  },
  upcoming_events: {
    title: "Upcoming Events",
    columns: [
      { header: "Name", accessorKey: "name" },
      { header: "Date", accessorKey: "upcoming_event_date" },
      { header: "Description", accessorKey: "description" },
      { header: "Location", accessorKey: "location" },
      { header: "Registration Link", accessorKey: "registartion_link" },
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
      {
        name: "name",
        label: "Name",
        type: "text",
        placeholder: "add project name",
      },
      { name: "upcoming_event_date", label: "Date", type: "date" },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        placeholder: "details of upcoming event",
      },
      {
        name: "registration_link",
        label: "Live Link",
        type: "url",
        placeholder: "link to deployement",
      },
      {
        name: "location",
        label: "Location",
        type: "text",
        placeholder: "location of the event",
      },
      {
        name: "event_imgae_url",
        label: "Event Image",
        type: "url",
        placeholder: "link to event image",
      },
    ],
  },
};

const fetchingHooks = {
  achievements: useAchievements,
  blogs: useBlogs,
  events: useEvents,
  projects: useProjects,
  upcoming_events: useUpcomingEvents,
};

export default function CategoryPage() {
  const params = useParams();
  const category = params.category as keyof typeof fetchingHooks;
  const config = categoryConfig[category];
  const fetchingHook = fetchingHooks[category];

  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);

  const { data = [], isLoading } = fetchingHook();

  if (!config) {
    return (
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-xl font-semibold">Category Not Found</h1>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <p>{`The requested category "${category}" does not exist.`}</p>
        </div>
      </SidebarInset>
    );
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
          {/* @ts-ignore */}
          <DataTable data={data} columns={config.columns} />
        </div>
      </div>
      <AddDataDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        fields={config.fields}
        category={config.title.slice(0, -1)} // Pass singular category name
      />
    </SidebarInset>
  );
}
