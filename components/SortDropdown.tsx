"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
    value: string;
    onChange: (value: string) => void;
};

const options = [
    { value: "year", label: "Year" },
    { value: "title", label: "Title" },
];

export default function SortDropdown({ value, onChange }: Props) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (!ref.current?.contains(e.target as Node)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const current = options.find((o) => o.value === value);

    return (
        <div ref={ref} className="relative flex-1">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="w-full h-[42px] bg-[#282828] border border-[#333] rounded-lg px-3 flex items-center justify-between text-sm hover:border-violet-500 transition-all"
            >
                <span>{current?.label}</span>

                <svg
                    className={`w-4 h-4 text-[#888] transition-transform ${open ? "rotate-180" : ""
                        }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path d="M6 9l6 6 6-6" />
                </svg>
            </button>

            {open && (
                <div className="absolute left-0 right-0 mt-2 bg-[#222] border border-[#333] rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => {
                                onChange(option.value);
                                setOpen(false);
                            }}
                            className={`w-full px-3 py-2.5 text-left text-sm transition-colors flex items-center justify-between
                ${value === option.value
                                    ? "bg-violet-500/15 text-violet-300"
                                    : "hover:bg-white/5"
                                }`}
                        >
                            {option.label}

                            {value === option.value && (
                                <svg
                                    className="w-4 h-4"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}