import { useId, useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

export function DatePickerWithLabel({
  label,
  date,
  onChange,
  disabled,
  minDate,
  maxDate,
}: {
  label: string
  date?: Date
  onChange: (date?: Date) => void
  disabled?: boolean
  minDate?: Date
  maxDate?: Date
}) {
  const id = useId()
  const [open, setOpen] = useState(false)

  return (
    <div className="group relative min-w-[140px]">
      <label
        htmlFor={id}
        className="bg-background text-foreground absolute start-1 top-0 z-10 block -translate-y-1/2 px-2 text-xs font-medium"
      >
        {label}
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            className="w-full justify-start text-left font-normal"
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "dd/MM/yyyy") : "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => {
              onChange(d)
              setOpen(false)
            }}
            disabled={(d) =>
              (!!minDate && d < minDate) || (!!maxDate && d > maxDate)
            }
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
