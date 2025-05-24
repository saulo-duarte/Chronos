import type { Category, TaskFilters } from "@/types/Task"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Search, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { DatePickerWithLabel } from "@/components/datepicker"

interface TaskFiltersProps {
  categories: Category[]
  filters: TaskFilters
  onFiltersChange: (filters: TaskFilters) => void
}

export function TaskFilters({ categories, filters, onFiltersChange }: TaskFiltersProps) {
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
      dateFilter: {},
      searchTerm: "",
    })
  }

  const hasActiveFilters =
    filters.categoryId !== null ||
    filters.searchTerm ||
    filters.dateFilter.startDate ||
    filters.dateFilter.endDate ||
    filters.dateFilter.withoutDate

  const startDate = filters.dateFilter.startDate ? new Date(filters.dateFilter.startDate) : undefined
  const endDate = filters.dateFilter.endDate ? new Date(filters.dateFilter.endDate) : undefined

  return (
    <div className="flex items-center gap-3 p-4 bg-background rounded-lg w-full overflow-x-auto">
      {/* Search Input */}
      <div className="relative flex-shrink-0 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search tasks..."
          value={filters.searchTerm || ""}
          onChange={(e) => updateFilters({ searchTerm: e.target.value })}
          className="pl-10 h-[40px] w-full"
        />
      </div>

      {/* Category Select */}
      <div className="relative flex-shrink-0 min-w-[150px]">
        <label
          htmlFor="category"
          className="bg-background text-foreground absolute left-3 top-0 z-10 block -translate-y-1/2 px-2 text-xs font-medium"
        >
          Category
        </label>
        <Select
          value={filters.categoryId?.toString() || "all"}
          onValueChange={(value) => updateFilters({ categoryId: value === "all" ? null : Number.parseInt(value) })}
        >
          <SelectTrigger id="category" className="h-[40px] w-full">
            <SelectValue placeholder="Choose a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Start Date */}
      <div className="flex-shrink-0 min-w-[140px]">
        <DatePickerWithLabel
          label="Start Date"
          date={startDate}
          onChange={(d) => updateDateFilter({ startDate: d ? format(d, "yyyy-MM-dd") : undefined })}
          maxDate={endDate}
        />
      </div>

      {/* End Date */}
      <div className="flex-shrink-0 min-w-[140px]">
        <DatePickerWithLabel
          label="End Date"
          date={endDate}
          onChange={(d) => updateDateFilter({ endDate: d ? format(d, "yyyy-MM-dd") : undefined })}
          minDate={startDate}
        />
      </div>

      {/* Without Date Switch */}
      <div className="flex flex-col items-center gap-1 flex-shrink-0 min-w-[120px]">
        <Label className="text-xs text-muted-foreground whitespace-nowrap">Without Date</Label>
        <Switch
          checked={filters.dateFilter.withoutDate || false}
          onCheckedChange={(checked) =>
            updateDateFilter({
              withoutDate: checked as boolean,
              startDate: checked ? undefined : filters.dateFilter.startDate,
              endDate: checked ? undefined : filters.dateFilter.endDate,
            })
          }
        />
      </div>

      {/* Clear Button */}
      <div className="flex-shrink-0 min-w-[80px]">
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className={`h-[40px] w-full text-muted-foreground hover:text-destructive transition-all duration-200 ${
            hasActiveFilters ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Clear
        </Button>
      </div>
    </div>
  )
}