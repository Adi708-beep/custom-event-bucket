export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto py-8 text-center text-sm text-muted-foreground">
        <p>
          © {new Date().getFullYear()} EventCraft • Built for college event management
        </p>
      </div>
    </footer>
  );
}
