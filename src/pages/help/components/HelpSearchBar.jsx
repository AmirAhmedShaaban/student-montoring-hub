import { Card, Input } from "./HelpUI";

function HelpSearchBar({ value, onChange, placeholder }) {
  return (
    <Card
      title="Search the help center"
      description="Use a keyword to filter the FAQ answers below."
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="relative">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path
                d="m20 20-4.2-4.2M10.8 17A6.2 6.2 0 1 0 10.8 4.6a6.2 6.2 0 0 0 0 12.4Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <Input
            id="help-search"
            label="Search help topics"
            type="search"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            autoComplete="off"
            className="pl-12 sm:pl-14"
          />
        </div>

        {value ? (
          <button
            type="button"
            onClick={() => onChange({ target: { value: "" } })}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition duration-200 hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-500/15"
          >
            Clear search
          </button>
        ) : (
          <p className="text-sm leading-6 text-slate-500">
            Search results update the FAQ list in real time.
          </p>
        )}
      </div>
    </Card>
  );
}

export default HelpSearchBar;
