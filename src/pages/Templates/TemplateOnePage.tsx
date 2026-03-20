import { Link } from "react-router-dom";

export default function TemplateOnePage() {
  return (
    <main className="min-h-screen bg-[var(--theme-bg-soft)]">
      <div className="mx-auto max-w-2xl px-6 py-20">
        <Link 
          to="/home" 
          className="inline-block text-sm text-[var(--theme-muted-strong)] hover:text-[var(--theme-ink)] transition-colors"
        >
          ← Back
        </Link>

        <h1 className="mt-12 text-3xl font-light text-[var(--theme-ink)] tracking-tight">
          Covoit.
        </h1>

        <p className="mt-6 text-[var(--theme-muted)] leading-relaxed max-w-md">
          Share rides. Save money. Meet people.
        </p>

        <div className="mt-16 space-y-4">
          <div className="flex items-center gap-4 py-3 border-b border-[var(--theme-line)]">
            <span className="w-2 h-2 rounded-full bg-[#4ade80]"></span>
            <div>
              <p className="text-[#333] font-medium">Papeete → Faaa</p>
              <p className="text-sm text-[var(--theme-subtle)]">Today, 7:30 AM · 3 seats</p>
            </div>
          </div>

          <div className="flex items-center gap-4 py-3 border-b border-[var(--theme-line)]">
            <span className="w-2 h-2 rounded-full bg-[#60a5fa]"></span>
            <div>
              <p className="text-[#333] font-medium">Pirae → Papeete</p>
              <p className="text-sm text-[var(--theme-subtle)]">Tomorrow, 8:00 AM · 2 seats</p>
            </div>
          </div>

          <div className="flex items-center gap-4 py-3 border-b border-[var(--theme-line)]">
            <span className="w-2 h-2 rounded-full bg-[#f472b6]"></span>
            <div>
              <p className="text-[#333] font-medium">Mahina → Arue</p>
              <p className="text-sm text-[var(--theme-subtle)]">Fri, 6:45 AM · 4 seats</p>
            </div>
          </div>
        </div>

        <Link 
          to="/find-trip"
          className="mt-10 inline-block px-6 py-3 bg-[var(--theme-primary)] text-white text-sm font-medium rounded-full hover:bg-[var(--theme-primary-dim)] transition-colors"
        >
          Find a ride
        </Link>
      </div>
    </main>
  );
}
