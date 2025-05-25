export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t">
      <div className="container mx-auto flex h-16 items-center justify-center px-4 md:px-8">
        <p className="text-sm text-muted-foreground">
          &copy; {currentYear} Drawify. Tekno Ömer Yapımı.
        </p>
      </div>
    </footer>
  );
}
