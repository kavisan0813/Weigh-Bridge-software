export interface MobileBottomNavProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  darkMode?: boolean;
}

export function MobileBottomNav({ activeTab, onSelectTab, darkMode = false }: MobileBottomNavProps) {
  const bg = darkMode ? "bg-[#1F2937] border-[#374151]" : "bg-white border-[#E5E7EB]";

  const items = [
    { key: "home", label: "Home", icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )},
    { key: "weigh", label: "Weigh", isProminent: true, icon: (
      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path d="M12 2a3 3 0 00-3 3c0 1.5.83 2.8 2 3.46V10H7l-2 12h14L17 10h-4V8.46A3.5 3.5 0 0015 5a3 3 0 00-3-3z" />
      </svg>
    )},
    { key: "transactions", label: "Transactions", icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )},
    { key: "alerts", label: "Alerts", icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    )},
    { key: "more", label: "More", icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    )},
  ];

  return (
    <div className={`fixed bottom-0 left-0 right-0 h-16 border-t ${bg} flex items-center justify-around z-40 md:hidden shadow-lg px-2`}>
      {items.map((item) => {
        const isActive = activeTab === item.key;

        if (item.isProminent) {
          return (
            <button
              key={item.key}
              onClick={() => onSelectTab(item.key)}
              className="flex flex-col items-center justify-center -mt-6 cursor-pointer"
            >
              <div className="w-13 h-13 rounded-full bg-[#F97316] hover:bg-[#EA580C] active:scale-95 flex items-center justify-center shadow-lg border-4 border-white dark:border-[#1F2937] transition-all">
                {item.icon}
              </div>
              <span className="text-[10px] font-bold text-[#F97316] mt-1">{item.label}</span>
            </button>
          );
        }

        return (
          <button
            key={item.key}
            onClick={() => onSelectTab(item.key)}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-all cursor-pointer ${
              isActive
                ? "text-[#F97316] font-bold"
                : darkMode
                ? "text-gray-400 hover:text-gray-200"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            {item.icon}
            <span className="text-[10px] mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
