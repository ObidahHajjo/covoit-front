import { Link } from "react-router-dom";

/**
 * Render the third marketing template preview with neon visuals, animated ride highlights, and supporting feature blocks.
 *
 * @returns The third template showcase page for the high-energy visual concept.
 */
export default function TemplateThreePage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#ff0080] rounded-full blur-[200px] opacity-30 animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-[#00ff88] rounded-full blur-[180px] opacity-25"></div>
        <div className="absolute top-[30%] right-[20%] w-[400px] h-[400px] bg-[#8b5cf6] rounded-full blur-[150px] opacity-20"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50"></div>
      </div>

      <div className="relative z-10">
        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link to="/home" className="group flex items-center gap-2 text-white/60 hover:text-white transition-colors">
              <span className="w-8 h-8 rounded-lg bg-[var(--theme-surface)]/10 flex items-center justify-center group-hover:bg-[var(--theme-surface)]/20 transition-colors">←</span>
              <span className="hidden sm:inline text-sm">Back</span>
            </Link>
            <div className="flex items-center gap-3">
              <span className="px-4 py-2 text-xs font-black uppercase tracking-[0.2em] bg-gradient-to-r from-[#ff0080] to-[#8b5cf6] text-white rounded-full animate-pulse">
                Template 3
              </span>
            </div>
          </div>
        </nav>

        <section className="pt-32 pb-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-[var(--theme-surface)]/5 border border-white/10 rounded-full mb-8 backdrop-blur-sm">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff88] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00ff88]"></span>
                  </span>
                  <span className="text-sm font-medium text-white/80">47 rides available now</span>
                </div>

                <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tight">
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#ff0080] via-[#ff4d4d] to-[#ff0080] bg-[length:200%_auto] animate-gradient">
                    SHARE
                  </span>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] via-[#00d4ff] to-[#00ff88] bg-[length:200%_auto] animate-gradient animation-delay-1000">
                    YOUR
                  </span>
                  <span className="block text-white">
                    RIDE.
                  </span>
                </h1>

                <p className="mt-8 text-xl text-white/50 max-w-xl leading-relaxed">
                  The future of mobility in French Polynesia. Connect with drivers and passengers in real-time. 
                  <span className="text-[#00ff88]"> Zero fees.</span> <span className="text-[#ff0080]"> Zero emissions.</span>
                </p>

                <div className="mt-10 flex flex-wrap gap-4">
                  <Link
                    to="/find-trip"
                    className="group relative px-10 py-5 bg-gradient-to-r from-[#ff0080] to-[#8b5cf6] text-white font-black text-lg rounded-2xl overflow-hidden transition-transform hover:scale-105"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-[#ff0080] to-[#ff4d4d] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    <span className="relative">FIND A RIDE</span>
                  </Link>
                  <Link
                    to="/my-trips/new"
                    className="group relative px-10 py-5 bg-[var(--theme-surface)]/5 border-2 border-white/20 text-white font-black text-lg rounded-2xl overflow-hidden backdrop-blur-sm hover:border-[#00ff88] transition-colors"
                  >
                    <span className="absolute inset-0 bg-[#00ff88]/10 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    <span className="relative">PUBLISH A RIDE</span>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#ff0080]/30 via-[#8b5cf6]/20 to-[#00ff88]/30 rounded-3xl blur-3xl animate-pulse"></div>
                  <div className="relative bg-[var(--theme-surface)]/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 space-y-3">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 rounded-full bg-[#ff0080] animate-pulse"></div>
                      <div className="w-3 h-3 rounded-full bg-[#8b5cf6]"></div>
                      <div className="w-3 h-3 rounded-full bg-[#00ff88]"></div>
                      <span className="ml-2 text-xs font-bold uppercase tracking-wider text-white/40">Live Feed</span>
                    </div>

                    {[
                      { from: "Papeete", to: "Faaa", time: "NOW", seats: 3, color: "#ff0080", price: "500 XPF" },
                      { from: "Pirae", to: "Papeete", time: "7:45 AM", seats: 2, color: "#8b5cf6", price: "400 XPF" },
                      { from: "Mahina", to: "Arue", time: "8:00 AM", seats: 4, color: "#00ff88", price: "600 XPF" },
                      { from: "Faaa", to: "Punaauia", time: "8:30 AM", seats: 1, color: "#ff4d4d", price: "350 XPF" },
                    ].map((ride, i) => (
                      <div
                        key={i}
                        className="group flex items-center gap-4 p-4 bg-[var(--theme-surface)]/5 rounded-2xl border border-white/10 hover:border-white/30 transition-all cursor-pointer hover:bg-[var(--theme-surface)]/10"
                        style={{ animationDelay: `${i * 100}ms` }}
                      >
                        <div
                          className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                          style={{ background: `linear-gradient(135deg, ${ride.color}40, ${ride.color}20)` }}
                        >
                          🚗
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-white truncate">
                            {ride.from} <span className="text-white/30">→</span> {ride.to}
                          </p>
                          <p className="text-sm text-white/40">{ride.time} · {ride.seats} seats · {ride.price}</p>
                        </div>
                        <div
                          className="w-2 h-8 rounded-full"
                          style={{ background: ride.color }}
                        ></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-6 border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { value: "12,847", label: "Users", gradient: "from-[#ff0080] to-[#ff4d4d]" },
                { value: "45,230", label: "Rides", gradient: "from-[#8b5cf6] to-[#6366f1]" },
                { value: "98.7%", label: "Happy", gradient: "from-[#00ff88] to-[#00d4ff]" },
                { value: "2.4M", label: "XPF Saved", gradient: "from-[#fbbf24] to-[#f59e0b]" },
              ].map((stat, i) => (
                <div key={i} className="text-center p-6 bg-[var(--theme-surface)]/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <p className={`text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r ${stat.gradient}`}>
                    {stat.value}
                  </p>
                  <p className="mt-2 text-sm font-medium text-white/40 uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: "⚡",
                  title: "Instant Matching",
                  desc: "Real-time algorithm connects you with the perfect ride in seconds.",
                  color: "#ff0080",
                },
                {
                  icon: "🛡️",
                  title: "Verified Users",
                  desc: "Every member is verified. Rate drivers and passengers after each ride.",
                  color: "#8b5cf6",
                },
                {
                  icon: "🌍",
                  title: "Eco Impact",
                  desc: "Track your carbon savings. Every shared ride makes a difference.",
                  color: "#00ff88",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="group relative p-8 bg-[var(--theme-surface)]/5 rounded-3xl border border-white/10 backdrop-blur-sm overflow-hidden hover:border-white/20 transition-all"
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `radial-gradient(circle at center, ${feature.color}20, transparent 70%)` }}
                  ></div>
                  <div className="relative">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6"
                      style={{ background: `linear-gradient(135deg, ${feature.color}30, ${feature.color}10)` }}
                    >
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-white/50 leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="py-8 px-6 border-t border-white/5">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/30">© 2024 Covoit. The future of shared mobility.</p>
            <div className="flex gap-6">
              <Link to="/find-trip" className="text-sm text-white/50 hover:text-[#ff0080] transition-colors">Find rides</Link>
              <Link to="/my-trips" className="text-sm text-white/50 hover:text-[#8b5cf6] transition-colors">My trips</Link>
              <Link to="/bookings" className="text-sm text-white/50 hover:text-[#00ff88] transition-colors">Bookings</Link>
            </div>
          </div>
        </footer>
      </div>

      {/* Inline keyframes are kept local so this preview page can define its bespoke animation timing without touching shared styles. */}
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </main>
  );
}
