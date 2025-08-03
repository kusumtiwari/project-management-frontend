import React, { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import type { InputHTMLAttributes } from "react";
import { Input as ShadcnInput } from "@/components/ui/input";
import {
    Select as ShadcnSelect,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Input Component
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    name: string;
    label?: string;
    rules?: any;
    error?: string;
    leftIcon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
    name,
    label,
    type = "text",
    rules,
    error,
    leftIcon,
    className = "",
    ...rest
}) => {
    const { register } = useFormContext();
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    return (
        <div className="relative">
            {label && (
                <label htmlFor={name} className="block mb-1.5 text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}

            <div className="relative">
                {leftIcon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                        {leftIcon}
                    </div>
                )}

                <ShadcnInput
                    id={name}
                    type={inputType}
                    placeholder={rest.placeholder}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${name}-error` : undefined}
                    {...register(name, rules)}
                    {...rest}
                    className={cn(
                        "px-4 py-5 placeholder-gray-500",
                        "bg-stone-200 rounded-lg",
                        "border border-transparent",
                        "focus:outline-none focus:ring-0 focus:border-transparent",
                        "transition-all duration-200 ease-in-out",
                        leftIcon && "pl-10",
                        isPassword && "pr-12",
                        error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
                        className
                    )}

                />


                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors duration-200 z-10"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? (
                            <EyeOff size={20} />
                        ) : (
                            <Eye size={20} />
                        )}
                    </button>
                )}
            </div>

            {error && (
                <p id={`${name}-error`} className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="inline-block w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                    {error}
                </p>
            )}
        </div>
    );
};

// Select Component
type SelectProps = {
    label: string;
    name: string;
    options: { label: string; value: string }[];
    rules?: any;
    className?: string;
    placeholder?: string;
    error?: string;
    [key: string]: any;
};

const Select = ({
    label,
    name,
    options,
    rules,
    className = "",
    placeholder,
    error,
    ...rest
}: SelectProps) => {
    const { control } = useFormContext();

    return (
        <div className="mb-5">
            <label htmlFor={name} className="block mb-2 text-sm font-medium text-gray-700">
                {label}
            </label>

            <Controller
                name={name}
                control={control}
                rules={rules}
                render={({ field }) => (
                    <ShadcnSelect
                        value={field.value || ""}
                        onValueChange={field.onChange}
                        {...rest}
                    >
                        <SelectTrigger
                            className={cn(
                                "px-4 py-3 text-red-900 placeholder-gray-500",
                                "bg-stone-200 rounded-lg",
                                "border-2 border-transparent",
                                "focus:border-red-800 focus:ring-2 focus:ring-red-800/20",
                                "hover:border-red-300",
                                "transition-all duration-200 ease-in-out",
                                error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
                                className
                            )}
                            aria-invalid={!!error}
                            aria-describedby={error ? `${name}-error` : undefined}
                        >
                            <SelectValue
                                placeholder={placeholder || `Select ${label}`}
                                className="text-red-900"
                            />
                        </SelectTrigger>

                        <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
                            {options.map((opt) => (
                                <SelectItem
                                    key={opt.value}
                                    value={opt.value}
                                    className="hover:bg-stone-100 focus:bg-stone-100 text-red-900 cursor-pointer"
                                >
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </ShadcnSelect>
                )}
            />

            {error && (
                <p id={`${name}-error`} className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="inline-block w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                    {error}
                </p>
            )}
        </div>
    );
};

// Export both components
export { Input, Select };