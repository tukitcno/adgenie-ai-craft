
import { LucideProps } from "lucide-react";

export function TikTokIcon(props: LucideProps) {
  return (
    <svg
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
      <path d="M9 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm10-7a3 3 0 0 0-3-3h-3v12a2 2 0 1 1-4 0v-2h-2v2a4 4 0 1 0 8 0V9a3 3 0 0 0 3 0 3 3 0 0 0 1-1V5z" fill="currentColor" stroke="none" />
    </svg>
  );
}
