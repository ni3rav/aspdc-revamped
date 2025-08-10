"use client";

import { useProjects } from "@/hooks/useProjects";

export default function ProjectsPage() {
  const { data, isLoading, isError } = useProjects();

  if (isLoading) {
    return <div className="p-6 text-gray-600">Loading projects...</div>;
  }

  if (isError || !data) {
    return <div className="p-6 text-red-500">Failed to load projects.</div>;
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Projects</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((project) => (
          <div
            key={project.github_url}
            className="border border-gray-200 rounded-md p-4 hover:shadow-md transition"
          >
            <h2 className="text-lg font-semibold mb-1">{project.name}</h2>
            <p className="text-sm text-gray-500 mb-2">by {project.author}</p>
            <p className="text-sm mb-4">{project.description}</p>
            <div className="flex gap-4 text-sm">
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Live
                </a>
              )}
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  GitHub
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
