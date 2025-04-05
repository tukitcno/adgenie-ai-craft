
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Sparkles } from "lucide-react";

export function Header() {
  return (
    <header className="border-b sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <span className="text-lg font-bold">AdGenie</span>
        </div>
        <nav className="flex items-center gap-2">
          <ThemeToggle />
          <Button size="sm" variant="outline">Sign In</Button>
          <Button size="sm">Get Started</Button>
        </nav>
      </div>
    </header>
  );
}
