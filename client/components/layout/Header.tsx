import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-gradient-to-br from-primary to-fuchsia-500" />
          <span className="text-lg font-semibold tracking-tight">EventCraft</span>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <span>Create drag-and-drop event pages</span>
        </div>
      </div>
    </header>
  );
}
