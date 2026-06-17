"use client"

import type { ReactNode } from "react"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { AppSidebar } from "@/components/app-sidebar"
import { ThemeToggle } from "@/components/theme-toggle"

interface ShellProps {
  title: string
  description?: string
  children: ReactNode
  actions?: ReactNode
}

export function AppShell({ title, description, children, actions }: ShellProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-5" />
          <div className="flex min-w-0 flex-1 flex-col">
            <h1 className="truncate text-base font-semibold leading-tight">
              {title}
            </h1>
            {description ? (
              <p className="truncate text-xs text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            {actions}
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
