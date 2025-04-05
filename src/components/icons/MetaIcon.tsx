
import { LucideProps } from "lucide-react";
import { forwardRef } from "react";

export const MetaIcon = forwardRef<SVGSVGElement, LucideProps>(
  (props, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z" fill="none" stroke="currentColor" />
        <path d="M15.5 8.5l-2.5 7h-2l-2.5-7" stroke="currentColor" fill="none" />
        <path d="M17 15.5H7" stroke="currentColor" fill="none" />
      </svg>
    );
  }
);

MetaIcon.displayName = "MetaIcon";
