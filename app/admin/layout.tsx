import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Admin View",
};

export default function AdminRoutesLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = cookies();
  return (
    <>
      <SidebarProvider defaultOpen>
        <AppSidebar />
        {children}
      </SidebarProvider>
    </>
  );
}
