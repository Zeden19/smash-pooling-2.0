"use client";

import * as React from "react";
import { add, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TimePicker } from "./TimePicker";
import { Label } from "@/components/ui/label";

interface Props {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

export function DateTimePicker({ date, setDate }: Props) {
  /**
   * carry over the current time when a user clicks a new day
   * instead of resetting to 00:00
   */
  const handleSelect = (newDay: Date | undefined) => {
    if (!newDay) return;
    if (!date) {
      setDate(newDay);
      return;
    }
    const diff = newDay.getTime() - date.getTime();
    const diffInDays = diff / (1000 * 60 * 60 * 24);
    const newDateFull = add(date, { days: Math.ceil(diffInDays) });
    setDate(newDateFull);
  };

  return (
    <div>
      <Label htmlFor={"dateTime"}>Date & Time</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={"dateTime"}
            variant={"outline"}
            className={cn("w-full justify-start", !date && "text-muted-foreground")}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "Pp") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            required
            fromDate={new Date()}
            mode="single"
            selected={date}
            onSelect={(d) => handleSelect(d)}
            initialFocus
          />
          <div className="p-3 border-t border-border">
            <TimePicker setDate={setDate} date={date} />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
