import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";

export default function AppLayout() {
  return (
    <div className="relative min-h-screen bg-[#fafafa] text-[#222]">
      <main className="mx-auto min-h-screen w-full max-w-2xl px-6 py-8 pb-28">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  );
}
