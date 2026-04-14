import { Card, Input } from "./HelpUI";

function HelpSearchBar({ value, onChange, placeholder }) {
  return (
    <Card
      title="Search support content"
      description="Use a keyword to filter the quick links and FAQ answers below."
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <Input
          id="help-search"
          label="Search help topics"
          type="search"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete="off"
        />

        {value ? (
          <button
            type="button"
            onClick={() => onChange({ target: { value: "" } })}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            Clear search
          </button>
        ) : null}
      </div>
    </Card>
  );
}

export default HelpSearchBar;
