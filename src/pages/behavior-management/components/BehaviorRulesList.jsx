import BehaviorRuleCard from "./BehaviorRuleCard";

function BehaviorRulesList({
  rules,
  selectedRuleId,
  onSelectRule,
  onToggleStatus,
  onDeleteRule,
}) {
  if (rules.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-slate-400">
        No rules match your search.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {rules.map((rule) => (
        <BehaviorRuleCard
          key={rule.id}
          rule={rule}
          active={rule.id === selectedRuleId}
          onSelect={onSelectRule}
          onToggle={onToggleStatus}
          onDelete={onDeleteRule}
        />
      ))}
    </ul>
  );
}

export default BehaviorRulesList;
