import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
  label: string
  value: number | string
  icon: LucideIcon
  tone?: "primary" | "destructive" | "success" | "warning"
  hint?: string
}

const toneMap = {
  primary: "bg-primary/10 text-primary",
  destructive: "bg-destructive/10 text-destructive",
  success: "bg-success/10 text-success",
  warning: "bg-warning/20 text-warning-foreground",
}

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "primary",
  hint,
}: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-lg",
            toneMap[tone],
          )}
        >
          <Icon className="size-6" />
        </div>
        <div className="min-w-0">
          <p className="text-2xl font-bold leading-none">{value}</p>
          <p className="mt-1 truncate text-sm text-muted-foreground">{label}</p>
          {hint ? (
            <p className="mt-0.5 truncate text-xs text-muted-foreground/80">
              {hint}
            </p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}
