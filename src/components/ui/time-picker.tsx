// TimePicker.tsx
import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ClockIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimePickerProps {
    value: string;
    onChange: (time: string) => void;
    className?: string;
}

export const TimePicker: React.FC<TimePickerProps> = ({ value, onChange, className }) => {
    const [open, setOpen] = React.useState(false);
    const [tempTime, setTempTime] = React.useState(value);

    React.useEffect(() => {
        setTempTime(value);
    }, [value]);

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTempTime(e.target.value);
    };

    const handleSelect = () => {
        onChange(tempTime);
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-between", className)}>
                    <span>{value || "Select time"}</span>
                    <ClockIcon className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40 p-2">
                <Input
                    type="time"
                    value={tempTime}
                    onChange={handleTimeChange}
                    className="w-full"
                />
                <Button
                    onClick={handleSelect}
                    className="mt-2 w-full"
                >
                    Set Time
                </Button>
            </PopoverContent>
        </Popover>
    );
};
