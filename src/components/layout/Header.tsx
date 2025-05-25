import { PencilRuler } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-2">
          <PencilRuler className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-semibold tracking-tight">Drawify</h1>
        </div>
        {/* Future placeholder for nav items or user profile */}
      </div>
    </header>
  );
}
