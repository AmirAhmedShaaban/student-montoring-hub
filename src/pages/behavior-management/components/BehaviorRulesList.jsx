import BehaviorRuleCard from "./BehaviorRuleCard";

function BehaviorRulesList({ rules, selectedRuleId, onSelectRule }) {
  if (!rules.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white/80 p-8 text-center shadow-sm">
        <p className="text-base font-semibold text-slate-950">No rules found</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Try a different search term or create a new behavior rule.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-4" aria-label="Behavior rules list">
      {rules.map((rule) => (
        <BehaviorRuleCard
          key={rule.id}
          rule={rule}
          active={rule.id === selectedRuleId}
          onSelect={onSelectRule}
        />
      ))}
    </ul>
  );
}

export default BehaviorRulesList;
