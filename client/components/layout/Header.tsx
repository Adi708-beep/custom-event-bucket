import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-md bg-gradient-to-br from-primary to-fuchsia-500 shadow-lg flex items-center justify-center">
            <svg
              className="h-5 w-5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M3 12h18M12 3v18" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight">
              EVENT BUCKET
            </span>
            <span className="text-xs text-muted-foreground -mt-0.5">
              Drag & drop event page builder
            </span>
          </div>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <span>Create drag-and-drop event pages</span>
        </div>
      </div>
    </header>
  );
}
