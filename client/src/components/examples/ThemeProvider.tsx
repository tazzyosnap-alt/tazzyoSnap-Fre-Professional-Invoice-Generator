import { ThemeProvider } from '../ThemeProvider';
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

// Example component showing theme provider functionality
function ThemeExample() {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Theme Provider Example</h2>
      <p className="text-muted-foreground">This demonstrates the theme provider working with light/dark mode.</p>
      <div className="flex gap-2">
        <Button>Primary Button</Button>
        <Button variant="secondary">Secondary Button</Button>
        <Button variant="outline">Outline Button</Button>
      </div>
    </div>
  );
}

export default function ThemeProviderExample() {
  return (
    <ThemeProvider>
      <ThemeExample />
    </ThemeProvider>
  );
}