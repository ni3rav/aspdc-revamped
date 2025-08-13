import type React from "react";
import { FloatingNavbar } from "@/components/admin/floating-navbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen min-w-screen bg-background flex justify-center items-center">
      <FloatingNavbar basePath="/admin" />
      <main className="pt-20 px-4 pb-8 max-h-10/12 w-3/4 overflow-x-hidden overflow-y-scroll">
        {children}
      </main>
    </div>
  );
}
