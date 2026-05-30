import React, { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  icon?: React.ReactNode;
  suffix?: React.ReactNode;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, icon, suffix, error, className, ...props }, ref) => {
    return (
      <div className="flex flex-col w-full">
        {label && (
          <label htmlFor={props.id} className="mb-1.5 block text-[15px] font-semibold text-[#2f394e]">
            {label}
          </label>
        )}
        <div 
          className={twMerge(
            "flex items-center w-full rounded-xl border bg-white px-3 transition-shadow focus-within:ring-2 focus-within:ring-gray-400/50",
            error ? "border-red-500" : "border-[#94a3b8]",
            !className?.includes('h-') && "h-[46px]",
            className
          )}
        >
          {icon && (
            <div className="mr-2 flex shrink-0 items-center justify-center text-[#94a3b8]">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className="h-full w-full flex-1 bg-transparent text-[#2f394e] outline-none placeholder:text-[#94a3b8] placeholder:font-normal text-[15px]"
            {...props}
          />
          {suffix && (
            <div className="ml-2 flex shrink-0 items-center justify-center">
              {suffix}
            </div>
          )}
        </div>
        {error ? (
          <span className="mt-1 block text-sm text-red-500">{error}</span>
        ) : helperText ? (
          <span className="mt-1 block text-sm text-[#94a3b8]">
            {helperText}
          </span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
