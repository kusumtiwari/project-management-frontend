// DatePicker.tsx
import * as React from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { DayPicker } from "react-day-picker";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import "react-day-picker/dist/style.css";

interface DatePickerProps {
    value?: Date;
    onChange: (date: Date) => void;
    className?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, className }) => {
    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(value);

    const handleSelect = (date: Date | undefined) => {
        if (date) {
            setSelectedDate(date);
            onChange(date);
        }
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "w-full justify-between text-left",
                        !selectedDate && "text-muted-foreground",
                        className
                    )}
                >
                    {selectedDate ? selectedDate.toLocaleDateString() : "Select date"}
                    <CalendarIcon className="ml-2 h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleSelect}
                />
            </PopoverContent>
        </Popover>
    );
};
