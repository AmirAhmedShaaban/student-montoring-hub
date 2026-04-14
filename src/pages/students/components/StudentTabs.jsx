function StudentTabs({ tabs, activeTab, onChange, activeLabel }) {
  return (
    <div className="border-b border-slate-200 px-2 pt-2">
      <div
        className="flex flex-wrap gap-2"
        role="tablist"
        aria-label="Student profile sections"
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;

          return (
            <button
              key={tab.id}
              id={`student-tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`student-panel-${tab.id}`}
              onClick={() => onChange(tab.id)}
              className={`rounded-t-2xl px-4 py-3 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                isActive
                  ? "border border-b-white bg-white text-slate-950 shadow-sm"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <p className="sr-only" aria-live="polite">
        {activeLabel} section selected
      </p>
    </div>
  );
}

export default StudentTabs;
