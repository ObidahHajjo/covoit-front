import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";

export default function AppLayout() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[var(--theme-bg)] text-[var(--theme-ink)]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-10rem] top-[-8rem] h-[22rem] w-[22rem] rounded-full bg-[radial-gradient(circle,_rgba(145,215,255,0.72)_0%,_rgba(145,215,255,0)_68%)] blur-2xl" />
        <div className="absolute right-[-7rem] top-[4rem] h-[20rem] w-[20rem] rounded-full bg-[radial-gradient(circle,_rgba(213,240,107,0.75)_0%,_rgba(213,240,107,0)_70%)] blur-2xl" />
        <div className="absolute bottom-[-10rem] left-1/2 h-[24rem] w-[24rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(255,122,89,0.18)_0%,_rgba(255,122,89,0)_72%)] blur-3xl" />
      </div>

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-28 pt-5 sm:px-6 md:px-8 md:pb-36 md:pt-8 lg:px-10">
        <div className="flex min-h-[calc(100vh-5rem)] flex-1 flex-col rounded-[2rem] border border-[var(--theme-line)] bg-[var(--theme-surface)] p-4 shadow-warm backdrop-blur-xl sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
