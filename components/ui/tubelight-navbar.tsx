"use client"

import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  url: string
}

interface NavBarProps {
  items: NavItem[]
  className?: string
}

export function NavBar({ items, className }: NavBarProps) {
  const pathname = usePathname()

  // Only exact match for "/", otherwise allow exact or prefix (for nested routes)
  const isPathActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname === href || pathname.startsWith(href + "/")
  }

  return (
    <motion.div
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 12 }}
      className={cn("fixed left-1/2 -translate-x-1/2 z-50 mb-6 sm:pt-6", className)}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="flex items-center gap-2 bg-background/5 border border-border backdrop-blur-lg py-1 px-1 rounded-full shadow-lg"
      >
        {items.map((item, i) => {
          const isActive = isPathActive(item.url)

          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
              className={cn(
                "relative cursor-pointer text-lg font-semibold px-5 py-1 rounded-full transition-colors",
                "text-foreground/80 hover:text-primary",
                isActive && "bg-muted text-primary"
              )}
            >
              <Link
                href={item.url}
              >
                <span className="hidden md:inline">{item.name}</span>

                {isActive && (
                  <motion.div
                    layoutId="lamp"
                    className="absolute inset-0 w-full bg-primary/5 rounded-full -z-10"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <motion.div
                      animate={{ y: [0, -2, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-t-full"
                    >
                      <div className="absolute w-12 h-6 bg-primary/20 rounded-full blur-md -top-2 -left-2" />
                      <div className="absolute w-8 h-6 bg-primary/20 rounded-full blur-md -top-1" />
                      <div className="absolute w-4 h-4 bg-primary/20 rounded-full blur-sm top-0 left-2" />
                    </motion.div>
                  </motion.div>
                )}
              </Link>
            </motion.div>
          )
        })}
      </motion.div>
    </motion.div>
  )
}