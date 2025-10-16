export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto py-8 text-center text-sm text-muted-foreground">
        <p>
          © {new Date().getFullYear()} EVENT BUCKET • Production-ready event pages for colleges — templates, RSVP, and publishing
        </p>
      </div>
    </footer>
  );
}
