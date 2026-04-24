"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export function DatePickerSimple() {
    const [date, setDate] = React.useState<Date | undefined>(new Date())
    const [open, setOpen] = React.useState(false)

    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha <span className="text-red-500">*</span>
            </label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className="bg-white border border-gray-300 rounded-xl h-9 px-3 text-sm font-medium w-full flex justify-start items-center gap-2 focus:bg-white focus:ring-2 focus:ring-ring/60 focus:border-primary/40 transition-colors"
                    >
                        <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
                        {date ? format(date, "dd/MM/yyyy") : <span>Selecciona fecha</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-auto p-0"
                    align="start"
                    side="bottom"
                    style={{
                        minWidth: "260px",
                        maxWidth: "320px",
                        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                        borderRadius: "16px",
                        border: "1px solid var(--color-border)",
                    }}
                >
                    <div className="p-2">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(selected) => {
                                setDate(selected)
                                setOpen(false)
                            }}
                            className="rounded-lg"
                        />
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}
