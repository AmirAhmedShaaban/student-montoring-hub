import { Card, Button } from "./HelpUI";

function QuickLinkIcon({ name }) {
  const iconClasses = "h-6 w-6 text-sky-700";

  if (name === "book") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={iconClasses}
        aria-hidden="true"
      >
        <path
          d="M6 4.5h11.5A2.5 2.5 0 0 1 20 7v12.5a1 1 0 0 1-1.6.8A5.4 5.4 0 0 0 14.9 19H6a2 2 0 0 1-2-2v-11a1.5 1.5 0 0 1 2-1.5Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M7.5 8h8.5M7.5 11h8.5M7.5 14h5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (name === "chat") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={iconClasses}
        aria-hidden="true"
      >
        <path
          d="M6.5 17.5 4 20V7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v7A2.5 2.5 0 0 1 17.5 17.5h-11Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M8 9.5h8M8 12.5h5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (name === "guide") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={iconClasses}
        aria-hidden="true"
      >
        <path
          d="M7 4.5h10A2.5 2.5 0 0 1 19.5 7v10A2.5 2.5 0 0 1 17 19.5H7A2.5 2.5 0 0 1 4.5 17V7A2.5 2.5 0 0 1 7 4.5Z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M8.5 8.5h7M8.5 12h7M8.5 15.5h4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={iconClasses}
      aria-hidden="true"
    >
      <path
        d="M12 4.5 13.8 9l4.7.4-3.5 3.2 1.1 4.6L12 15.1 7.9 17.2 9 12.6 5.5 9.4 10.2 9 12 4.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HelpQuickLinkCard({ item }) {
  const content = (
    <>
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 ring-1 ring-sky-100">
        <QuickLinkIcon name={item.icon} />
      </div>
      <div className="space-y-2 text-left">
        <h3 className="text-base font-semibold text-slate-950">{item.title}</h3>
        <p className="text-sm leading-6 text-slate-600">{item.description}</p>
      </div>
      <span className="mt-auto inline-flex text-sm font-semibold text-sky-700">
        Open section
      </span>
    </>
  );

  const sharedClasses =
    "group flex h-full flex-col gap-4 rounded-3xl border border-slate-200 bg-slate-50/80 p-5 text-left transition hover:-translate-y-0.5 hover:border-sky-200 hover:bg-sky-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500";

  if (item.href) {
    return (
      <a href={item.href} className={sharedClasses}>
        {content}
      </a>
    );
  }

  return (
    <Button type="button" variant="secondary" className={sharedClasses}>
      {content}
    </Button>
  );
}

function HelpQuickLinks({ items }) {
  return (
    <Card
      title="Quick links"
      description="Open the most common support areas without hunting through the dashboard."
      id="help-quick-links"
    >
      {items.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {items.map((item) => (
            <HelpQuickLinkCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm leading-6 text-slate-600">
          No quick links match your search. Clear the filter to see all support
          shortcuts.
        </div>
      )}
    </Card>
  );
}

export { HelpQuickLinkCard };
export default HelpQuickLinks;
