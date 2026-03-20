import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";

export default function AppLayout() {
  return (
    <div className="relative min-h-screen bg-[transparent] text-[var(--theme-ink)]">
      <div className="pointer-events-none fixed inset-x-0 top-0 z-0 h-56 bg-[radial-gradient(circle_at_top,rgba(212,233,197,0.5),transparent_70%)]" />
      <main className="relative z-10 mx-auto min-h-screen w-full max-w-6xl px-4 py-6 pb-32 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  );
}
