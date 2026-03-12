// components/ui/Badge.tsx
import React from "react";

interface BadgeProps {
  text: string;
  color?: "blue" | "green" | "red" | "yellow" | "gray";
}

const colorClasses: Record<string, string> = {
  blue: "bg-blue-100 text-blue-800",
  green: "bg-green-100 text-green-800",
  red: "bg-red-100 text-red-800",
  yellow: "bg-yellow-100 text-yellow-800",
  gray: "bg-gray-100 text-gray-800",
};

export default function Badge({ text, color = "gray" }: BadgeProps) {
  return (
    <span
      className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${colorClasses[color]}`}
    >
      {text}
    </span>
  );
}