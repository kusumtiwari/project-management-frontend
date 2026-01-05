// NoDataFound.tsx
import { NoData } from "@/assets";
import { cn } from "@/lib/utils"; // your classNames utility

interface NoDataFoundProps {
    desc?: string;
    className?: string;
}

export default function NoDataFound({ desc = "No Data Found", className }: NoDataFoundProps) {
    return (
        <div className={cn("flex flex-col items-center justify-center w-full", className)}>
            <NoData />
            <p className="mt-4 text-center text-gray-500">{desc}</p>
        </div>
    );
}
