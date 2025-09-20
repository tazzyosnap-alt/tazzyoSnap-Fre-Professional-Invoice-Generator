import { Button } from "@/components/ui/button";
import { Moon, Sun, FileText } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="border-b bg-card">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-md">
            <FileText className="w-4 h-4" />
          </div>
          <h1 className="text-xl font-semibold text-foreground">TazzyoSnap</h1>
          <span className="text-sm text-muted-foreground">Professional Invoice Generator</span>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          data-testid="button-theme-toggle"
        >
          {theme === "light" ? (
            <Moon className="w-4 h-4" />
          ) : (
            <Sun className="w-4 h-4" />
          )}
        </Button>
      </div>
    </header>
  );
}