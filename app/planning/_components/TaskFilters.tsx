"use client"

import { Filter, Layers, Calendar, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type TaskType = "project" | "study" | "event"
type TaskStatus = "pending" | "in_progress" | "done" | "not_initialized"

interface TaskFiltersProps {
  filters: {
    types: Record<TaskType, boolean>
    status: Record<TaskStatus, boolean>
  }
  onToggleFilter: (filterGroup: "types" | "status", key: TaskType | TaskStatus) => void
  onRefresh: () => void
  isRefreshing: boolean
}

export function TaskFilters({
  filters,
  onToggleFilter,
  onRefresh,
  isRefreshing,
}: TaskFiltersProps) {
  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1">
            <Layers className="h-4 w-4" /> Tipos
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40" onCloseAutoFocus={(e) => e.preventDefault()}>
          <div className="p-2">
            <DropdownMenuCheckboxItem
              checked={filters.types.project}
              onCheckedChange={() => onToggleFilter("types", "project")}
            >
              <span className="flex items-center gap-2">
                <Layers className="h-4 w-4" /> Projetos
              </span>
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.types.study}
              onCheckedChange={() => onToggleFilter("types", "study")}
            >
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Estudos
              </span>
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.types.event}
              onCheckedChange={() => onToggleFilter("types", "event")}
            >
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" /> Eventos
              </span>
            </DropdownMenuCheckboxItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1">
            <Filter className="h-4 w-4" /> Status
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40" onCloseAutoFocus={(e) => e.preventDefault()}>
          <div className="p-2">
            <DropdownMenuCheckboxItem
              checked={filters.status.not_initialized}
              onCheckedChange={() => onToggleFilter("status", "not_initialized")}
            >
              Não Iniciadas
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.status.pending}
              onCheckedChange={() => onToggleFilter("status", "pending")}
            >
              Pendentes
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.status.in_progress}
              onCheckedChange={() => onToggleFilter("status", "in_progress")}
            >
              Em Progresso
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.status.done}
              onCheckedChange={() => onToggleFilter("status", "done")}
            >
              Concluídas
            </DropdownMenuCheckboxItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="outline"
        size="icon"
        onClick={onRefresh}
        disabled={isRefreshing}
        className={isRefreshing ? "animate-spin" : ""}
      >
        <svg
          className="h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
          <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
          <path d="M16 21h5v-5" />
        </svg>
      </Button>
    </div>
  )
}
