import { Link } from "react-router-dom";

/**
 * Render the second marketing template preview featuring a bold hero, highlighted rides, and product statistics.
 *
 * @returns The second template showcase page used to preview an alternate marketing direction.
 */
export default function TemplateTwoPage() {
  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#0f0f0f] to-[#16213e]"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff6b6b] rounded-full blur-[128px] opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#4ecdc4] rounded-full blur-[128px] opacity-15"></div>
        
        <div className="relative z-10 mx-auto max-w-6xl px-6 py-16">
          <nav className="flex items-center justify-between">
            <Link to="/home" className="text-sm text-white/60 hover:text-white transition-colors">
              ← Back to home
            </Link>
            <div className="flex gap-2">
              <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-[#ff6b6b] text-white rounded">
                Template 2
              </span>
            </div>
          </nav>

          <div className="mt-20 grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--theme-surface)]/5 rounded-full border border-white/10 mb-6">
                <span className="w-2 h-2 bg-[#4ecdc4] rounded-full animate-pulse"></span>
                <span className="text-sm text-white/80">Live routes available</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-black leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b6b] to-[#feca57]">
                  Ride together,
                </span>
                <br />
                <span className="text-white">save together.</span>
              </h1>
              
              <p className="mt-6 text-lg text-white/60 max-w-md">
                Join thousands of commuters sharing rides across Tahiti. Cut costs, reduce emissions, meet neighbors.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/find-trip"
                  className="px-8 py-4 bg-gradient-to-r from-[#ff6b6b] to-[#ee5a5a] text-white font-bold rounded-xl hover:scale-105 transition-transform shadow-lg shadow-[#ff6b6b]/25"
                >
                  Find a ride →
                </Link>
                <Link
                  to="/my-trips/new"
                  className="px-8 py-4 bg-[var(--theme-surface)]/5 border border-white/20 text-white font-bold rounded-xl hover:bg-[var(--theme-surface)]/10 transition-colors"
                >
                  Publish a ride
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#ff6b6b]/20 to-[#4ecdc4]/20 rounded-3xl blur-2xl"></div>
              <div className="relative bg-[var(--theme-surface)]/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-4">
                <div className="flex items-center gap-4 p-4 bg-[var(--theme-surface)]/5 rounded-2xl border border-white/10 hover:border-[#ff6b6b]/50 transition-colors cursor-pointer">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#ff6b6b] to-[#feca57] rounded-xl flex items-center justify-center">
                    <span className="text-xl">🚗</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">Papeete → Faaa</p>
                    <p className="text-sm text-white/50">Today, 7:30 AM · 3 seats · 500 XPF</p>
                  </div>
                  <span className="px-3 py-1 text-xs bg-[#4ecdc4]/20 text-[#4ecdc4] rounded-full">Available</span>
                </div>

                <div className="flex items-center gap-4 p-4 bg-[var(--theme-surface)]/5 rounded-2xl border border-white/10 hover:border-[#ff6b6b]/50 transition-colors cursor-pointer">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#4ecdc4] to-[#44a08d] rounded-xl flex items-center justify-center">
                    <span className="text-xl">🚗</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">Pirae → Papeete</p>
                    <p className="text-sm text-white/50">Tomorrow, 8:00 AM · 2 seats · 400 XPF</p>
                  </div>
                  <span className="px-3 py-1 text-xs bg-[#feca57]/20 text-[#feca57] rounded-full">1 left</span>
                </div>

                <div className="flex items-center gap-4 p-4 bg-[var(--theme-surface)]/5 rounded-2xl border border-white/10 hover:border-[#ff6b6b]/50 transition-colors cursor-pointer">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#a55eea] to-[#8854d0] rounded-xl flex items-center justify-center">
                    <span className="text-xl">🚗</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">Mahina → Arue</p>
                    <p className="text-sm text-white/50">Fri, 6:45 AM · 4 seats · 600 XPF</p>
                  </div>
                  <span className="px-3 py-1 text-xs bg-[#ff6b6b]/20 text-[#ff6b6b] rounded-full">Hot</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-20 grid grid-cols-3 gap-8">
            <div className="text-center">
              <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b6b] to-[#feca57]">2,847</p>
              <p className="mt-2 text-sm text-white/50">Active users</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#4ecdc4] to-[#44a08d]">12,450</p>
              <p className="mt-2 text-sm text-white/50">Rides shared</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#a55eea] to-[#8854d0]">98%</p>
              <p className="mt-2 text-sm text-white/50">Satisfaction</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
