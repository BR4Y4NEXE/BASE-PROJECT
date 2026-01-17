import React from 'react';
import { LayoutDashboard, Receipt, Settings, FileSpreadsheet } from 'lucide-react';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
    const menuItems = [
        { id: 'dashboard', label: 'DASHBOARD', icon: LayoutDashboard },
        { id: 'expenses', label: 'EXPENSES', icon: Receipt },
        { id: 'import', label: 'IMPORT_DATA', icon: FileSpreadsheet },
        { id: 'settings', label: 'SETTINGS', icon: Settings },
    ];

    return (
        <aside className="w-64 bg-obsidian border-r-4 border-stone h-screen flex flex-col p-4 shadow-pixel z-10">
            <div className="mb-8 flex flex-col gap-2 items-center border-b-4 border-stone pb-6">
                <div className="bg-diamond p-2 border-4 border-white shadow-pixel">
                    <img src="/base_logo.png" alt="BASE" className="w-12 h-12 object-contain" style={{ width: '48px', height: '48px' }} />
                </div>
                <h1 className="text-2xl text-diamond font-bold tracking-widest mt-2 drop-shadow-md">BASE</h1>
            </div>

            <nav className="flex-1 space-y-4">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-4 p-3 border-2 transition-all duration-100
                ${post_process_class(isActive)}
              `}
                        >
                            <Icon size={20} className={isActive ? 'text-obsidian' : 'text-stone'} />
                            <span className={`font-bold font-pixel text-xs ${isActive ? 'text-obsidian' : 'text-stone'}`}>
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </nav>

            <div className="mt-auto border-t-4 border-stone pt-4">
                <p className="text-xs text-stone text-center font-mono">
                    v1.0.0
                    <br />
                    STABLE_BUILD
                </p>
            </div>
        </aside>
    );
};

// Helper to keep class cleaner
function post_process_class(isActive: boolean) {
    if (isActive) {
        return "bg-diamond border-white shadow-pixel translate-x-1";
    }
    return "bg-transparent border-transparent hover:border-stone hover:bg-obsidian hover:translate-x-1";
}

export default Sidebar;
