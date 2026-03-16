import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

export default function AppLayout() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <main className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 pb-24 pt-4">
                <Outlet />
            </main>
            <BottomNav />
        </div>
    );
}