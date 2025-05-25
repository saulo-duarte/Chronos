import { useMemo, useState } from "react"
import type { Category, TaskFilters } from "@/types/Task"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Trash2, CalendarX2, Clock } from "lucide-react"
import { format, startOfToday } from "date-fns"
import { DatePickerWithLabel } from "@/components/datepicker"
import { cn } from "@/lib/utils"

interface TaskFiltersProps {
  categories: Category[]
  filters: TaskFilters
  onFiltersChange: (filters: TaskFilters) => void
}

export function TaskFilters({ categories, filters, onFiltersChange }: TaskFiltersProps) {
  const today = startOfToday()
  const [showOverdue, setShowOverdue] = useState(false)

  const updateFilters = (updates: Partial<TaskFilters>) => {
    onFiltersChange({ ...filters, ...updates })
  }

  const updateDateFilter = (updates: Partial<TaskFilters["dateFilter"]>) => {
    updateFilters({
      dateFilter: { ...filters.dateFilter, ...updates },
    })
  }

  const clearFilters = () => {
    onFiltersChange({
      categoryId: null,
      status: null,
      dateFilter: {},
      searchTerm: "",
    })
    setShowOverdue(false)
  }

  const startDate = filters.dateFilter.startDate ? new Date(filters.dateFilter.startDate) : undefined
  const endDate = filters.dateFilter.endDate ? new Date(filters.dateFilter.endDate) : undefined

  const handleOverdueToggle = () => {
    const toggled = !showOverdue
    setShowOverdue(toggled)
    if (toggled) {
      updateDateFilter({
        startDate: undefined,
        endDate: format(today, "yyyy-MM-dd"),
        withoutDate: false,
      })
    } else {
      if (filters.dateFilter.endDate === format(today, "yyyy-MM-dd")) {
        updateDateFilter({ endDate: undefined })
      }
    }
  }

  return (
    <div className="flex items-center gap-3 p-4 bg-background rounded-lg w-full overflow-x-auto">
      <div className="relative flex-shrink-0 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search tasks..."
          value={filters.searchTerm || ""}
          onChange={(e) => updateFilters({ searchTerm: e.target.value })}
          className="pl-10 h-[40px] w-full"
        />
      </div>

      <div className="relative flex-shrink-0 min-w-[150px] max-w-[180px]">
        <label
          htmlFor="category"
          className="bg-background text-foreground absolute left-3 top-0 z-10 block -translate-y-1/2 px-2 text-xs font-medium"
        >
          Category
        </label>
        <Select
          value={filters.categoryId?.toString() || "all"}
          onValueChange={(value) =>
            updateFilters({ categoryId: value === "all" ? null : Number.parseInt(value) })
          }
        >
          <SelectTrigger id="category" className="h-[40px] w-full">
            <SelectValue placeholder="Choose a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                <span className="truncate block max-w-[150px]">{category.name}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="relative flex-shrink-0 min-w-[150px] max-w-[180px]">
        <label
          htmlFor="status"
          className="bg-background text-foreground absolute left-3 top-0 z-10 block -translate-y-1/2 px-2 text-xs font-medium"
        >
          Status
        </label>
        <Select
          value={filters.status || "all"}
          onValueChange={(value) =>
            updateFilters({ status: value === "all" ? null : (value as TaskFilters["status"]) })
          }
        >
          <SelectTrigger id="status" className="h-[40px] w-full">
            <SelectValue placeholder="Choose a status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="not_initialized">Not Initialized</SelectItem>
            <SelectItem value="to_do">To Do</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-shrink-0 min-w-[140px]">
        <DatePickerWithLabel
          label="Start Date"
          date={startDate}
          onChange={(d) =>
            updateDateFilter({ startDate: d ? format(d, "yyyy-MM-dd") : undefined })
          }
          maxDate={endDate}
        />
      </div>

      {/* End Date */}
      <div className="flex-shrink-0 min-w-[140px]">
        <DatePickerWithLabel
          label="End Date"
          date={endDate}
          onChange={(d) =>
            updateDateFilter({ endDate: d ? format(d, "yyyy-MM-dd") : undefined })
          }
          minDate={startDate}
        />
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <Button
          variant="outline"
          size="sm"
          aria-pressed={filters.dateFilter.withoutDate}
          onClick={() =>
            updateDateFilter({
              withoutDate: !filters.dateFilter.withoutDate,
              startDate: undefined,
              endDate: undefined,
            })
          }
          className={cn(
            "h-[40px] text-foreground border",
            filters.dateFilter.withoutDate &&
              "text-primary border-primary"
          )}
        >
          <CalendarX2 className="w-4 h-4 mr-1" />
          No Date
        </Button>

        <Button
          variant="outline"
          size="sm"
          aria-pressed={showOverdue}
          onClick={handleOverdueToggle}
          className={cn(
            "h-[40px] text-foreground border",
            showOverdue &&
              "text-destructive border-primary"
          )}
        >
          <Clock className="w-4 h-4 mr-1" />
          Overdue
        </Button>
      </div>

      <div className="flex-shrink-0 min-w-[100px]">
        <Button
          variant="outline"
          size="sm"
          onClick={clearFilters}
          className="h-[40px] w-full text-foreground hover:text-destructive"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Clear
        </Button>
      </div>
    </div>
  )
}
