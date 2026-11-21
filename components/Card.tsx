import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  hoverable?: boolean;
};

export function Card({ className = "", hoverable = true, children, ...props }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-line bg-surface/80 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] backdrop-blur-md ${
        hoverable
          ? "transition duration-200 hover:-translate-y-0.5 hover:border-white/15 hover:shadow-[0_18px_50px_-20px_rgba(255,74,28,0.35)]"
          : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
