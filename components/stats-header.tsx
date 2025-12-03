import { cn } from "@/lib/utils"

interface StatsHeaderProps {
    className?: string
    totalTime?: string
    sessions?: number
    streak?: number
}

export function StatsHeader({
    className,
    totalTime = "12h 45m",
    sessions = 28,
    streak = 5
}: StatsHeaderProps) {
    return (
        <div className={cn("flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 blur-reveal", className)}>
            <div>
                <h1 className="text-4xl font-medium tracking-tight text-foreground mb-2">Most Played</h1>
                <p className="text-muted-foreground">Your favorite stories this month.</p>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-8 md:gap-12 pb-1">
                <div>
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Total Time</div>
                    <div className="text-2xl font-semibold text-foreground tracking-tight">{totalTime}</div>
                </div>
                <div>
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Sessions</div>
                    <div className="text-2xl font-semibold text-foreground tracking-tight">{sessions}</div>
                </div>
                <div>
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Current Streak</div>
                    <div className="flex items-center gap-1.5 text-2xl font-semibold text-foreground tracking-tight">
                        {streak} <span className="text-muted-foreground text-lg font-normal">days</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
