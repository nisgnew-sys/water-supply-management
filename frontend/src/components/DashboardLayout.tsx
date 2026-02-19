import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function DashboardLayout() {
    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main style={{ flex: 1, overflowX: 'hidden', overflowY: 'auto', background: '#f3f4f6', padding: '24px 28px' }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
