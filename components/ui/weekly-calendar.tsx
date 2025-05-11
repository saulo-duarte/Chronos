"use client"

import { useEffect, useState } from "react"
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, isSameDay, parseISO } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ChevronLeft, ChevronRight, Calendar, CheckCircle2, Clock, Circle } from "lucide-react"
import type { Task } from "@/types/Task"
import { invoke } from "@tauri-apps/api/core"
import { cn } from "@/lib/utils"

export default function WeeklyTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }))

  useEffect(() => {
    async function fetchTasks() {
      try {
        const allTasks: Task[] = await invoke("get_all_tasks_command")
        console.log("Fetched tasks:", allTasks)

        const weekStart = currentWeekStart
        const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 })

        const filtered = allTasks.filter((task) => {
          if (!task.due_date) return false
          const dueDate = parseISO(task.due_date)
          return dueDate >= weekStart && dueDate <= weekEnd
        })

        setTasks(filtered)
      } catch (error) {
        console.error("Error fetching tasks:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [currentWeekStart])

  const handlePrevWeek = () => {
    setCurrentWeekStart((prev) => subWeeks(prev, 1))
  }

  const handleNextWeek = () => {
    setCurrentWeekStart((prev) => addWeeks(prev, 1))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 w-full">
        <div className="animate-pulse text-muted-foreground">Loading tasks...</div>
      </div>
    )
  }

  return (
    <Card className="w-full border border-border bg-background shadow-lg py-1">
      <CardHeader className="pb-2 space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={handlePrevWeek} size="sm" className="h-8 px-2">
            <ChevronLeft className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Previous</span>
          </Button>

          <CardTitle className="flex items-center gap-2 text-base sm:text-lg font-medium">
            <Calendar className="h-4 w-4" />
            <span>
              {format(currentWeekStart, "MMM d")} -{" "}
              {format(endOfWeek(currentWeekStart, { weekStartsOn: 1 }), "MMM d, yyyy")}
            </span>
          </CardTitle>

          <Button variant="outline" onClick={handleNextWeek} size="sm" className="h-8 px-2">
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        <Separator className="my-0"/>
      </CardHeader>

      <CardContent className="p-0 -mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-px bg-border">
          {Array.from({ length: 7 }).map((_, i) => {
            const dayDate = new Date(currentWeekStart)
            dayDate.setDate(currentWeekStart.getDate() + i)

            const day = format(dayDate, "EEE")
            const dayNum = format(dayDate, "d")
            const isToday = isSameDay(dayDate, new Date())

            const dayTasks = tasks.filter((task) => task.due_date && isSameDay(parseISO(task.due_date), dayDate))

            return (
              <div key={i} className={cn("flex flex-col min-h-[120px] p-3 bg-background", isToday && "bg-muted")}>
                <div className="flex items-center justify-center mb-2">
                  <div
                    className={cn(
                      "flex flex-col items-center justify-center w-8 h-8 rounded-full",
                      isToday ? "bg-primary text-primary-foreground" : "text-foreground",
                    )}
                  >
                    <span className="text-xs font-medium">{day}</span>
                    <span className="text-sm font-bold">{dayNum}</span>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 max-h-[200px] scrollbar-thin">
                  {dayTasks.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center italic">No tasks</p>
                  ) : (
                    dayTasks.map((task) => (
                      <Card
                        key={task.id}
                        className={cn(
                          "border-0 shadow p-2 hover:bg-accent/50 transition-colors",
                          task.type === "project"
                            ? "bg-violet-700/30"
                            : task.type === "study"
                              ? "bg-blue-700/30"
                              : task.type === "event"
                                ? "bg-emerald-700/30"
                                : "bg-background",
                        )}
                      >
                        <div className="flex flex-col gap-1">
                          <CardTitle className="text-xs sm:text-sm font-medium line-clamp-2">{task.title}</CardTitle>
                          <div className="flex items-center justify-between">
                            <span
                              className={cn(
                                "text-[10px] font-medium px-2 py-2 rounded-full",
                                task.type === "project"
                                  ? "bg-violet-500/30 text-violet-300"
                                  : task.type === "study"
                                    ? "bg-blue-500/30 text-blue-300"
                                    : "bg-emerald-500/30 text-emerald-300",
                              )}
                            >
                              {task.type}
                            </span>
                            <span
                              className={cn(
                                "flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full",
                                task.status === "done"
                                  ? "bg-green-500/20 text-green-300"
                                  : task.status === "in_progress"
                                    ? "bg-amber-500/20 text-amber-300"
                                    : "bg-gray-500/0 text-gray-300",
                              )}
                            >
                              {task.status === "done" ? (
                                <>
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  <span>Done</span>
                                </>
                              ) : task.status === "in_progress" ? (
                                <>
                                  <Clock className="h-3 w-3 mr-1" />
                                  <span>In Progress</span>
                                </>
                              ) : (
                                <>
                                  <Circle className="h-3 w-3 mr-1" />
                                  <span>To Do</span>
                                </>
                              )}
                            </span>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
