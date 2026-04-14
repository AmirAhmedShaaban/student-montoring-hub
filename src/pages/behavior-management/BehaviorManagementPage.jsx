import { useEffect, useMemo, useState } from "react";
import { behaviorRulesMockData } from "../../mocks/behaviorRules.mock";
import BehaviorEditorPanel from "./components/BehaviorEditorPanel";
import BehaviorRulesList from "./components/BehaviorRulesList";

function createRuleDraft(rule = {}) {
  return {
    id: rule.id ?? null,
    name: rule.name ?? "",
    category: rule.category ?? "",
    severity: rule.severity ?? "Medium",
    description: rule.description ?? "",
    consequences: rule.consequences ?? "",
    isActive: rule.isActive ?? true,
  };
}

function BehaviorManagementPage() {
  const [rules, setRules] = useState([]);
  const [selectedRuleId, setSelectedRuleId] = useState(null);
  const [draftRule, setDraftRule] = useState(createRuleDraft());
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const seededRules = behaviorRulesMockData.map((rule) => ({
      ...rule,
      isActive: rule.isActive ?? true,
    }));

    setRules(seededRules);
    setSelectedRuleId(seededRules[0]?.id ?? null);
  }, []);

  useEffect(() => {
    const selectedRule = rules.find((rule) => rule.id === selectedRuleId);
    setDraftRule(createRuleDraft(selectedRule));
  }, [rules, selectedRuleId]);

  const categories = useMemo(
    () =>
      Array.from(new Set(rules.map((rule) => rule.category))).filter(Boolean),
    [rules],
  );

  const filteredRules = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return rules;
    }

    return rules.filter((rule) => {
      return [
        rule.name,
        rule.category,
        rule.severity,
        rule.description,
        rule.consequences,
      ]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(query));
    });
  }, [rules, searchTerm]);

  const selectedRule = useMemo(
    () => rules.find((rule) => rule.id === selectedRuleId) ?? null,
    [rules, selectedRuleId],
  );

  const stats = useMemo(() => {
    return {
      total: rules.length,
      active: rules.filter((rule) => rule.isActive).length,
      highSeverity: rules.filter((rule) => rule.severity === "High").length,
    };
  }, [rules]);

  const handleSelectRule = (ruleId) => {
    setSelectedRuleId(ruleId);
  };

  const handleCreateRule = () => {
    const nextId =
      rules.length > 0
        ? Math.max(...rules.map((rule) => Number(rule.id) || 0)) + 1
        : 1;

    const newRule = {
      id: nextId,
      name: "",
      category: categories[0] ?? "",
      severity: "Medium",
      description: "",
      consequences: "",
      isActive: true,
    };

    setRules((currentRules) => [newRule, ...currentRules]);
    setSelectedRuleId(nextId);
  };

  const handleDraftChange = (updatedDraft) => {
    setDraftRule(updatedDraft);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedName = draftRule.name.trim();

    if (!trimmedName) {
      return;
    }

    const nextRule = {
      ...draftRule,
      name: trimmedName,
      category: draftRule.category.trim(),
      description: draftRule.description.trim(),
      consequences: draftRule.consequences.trim(),
    };

    setRules((currentRules) => {
      const ruleExists = currentRules.some(
        (rule) => rule.id === selectedRuleId,
      );

      if (!ruleExists) {
        const generatedId = selectedRuleId ?? Date.now();
        setSelectedRuleId(generatedId);

        return [{ ...nextRule, id: generatedId }, ...currentRules];
      }

      return currentRules.map((rule) =>
        rule.id === selectedRuleId ? { ...rule, ...nextRule } : rule,
      );
    });
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur sm:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-700">
              Behavior management
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Manage behavior rules with one focused workspace
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-600">
              Search existing rules, review the rule cards, and edit the details
              in the side panel without leaving the page.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[26rem]">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-500">Total rules</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">
                {stats.total}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-500">Active</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">
                {stats.active}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-500">
                High severity
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">
                {stats.highSeverity}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur">
            <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  Behavior rules list
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Filter by name, category, severity, description, or
                  consequence.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCreateRule}
                className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                Create rule
              </button>
            </div>

            <div className="mt-5 space-y-5">
              <label
                htmlFor="behavior-rule-search"
                className="block text-sm font-semibold text-slate-800"
              >
                Search rules
              </label>
              <input
                id="behavior-rule-search"
                type="search"
                name="behavior-rule-search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by rule, category, severity, or description"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              />

              <BehaviorRulesList
                rules={filteredRules}
                selectedRuleId={selectedRuleId}
                onSelectRule={handleSelectRule}
              />
            </div>
          </div>
        </div>

        <BehaviorEditorPanel
          rule={selectedRule}
          categories={categories}
          onChange={handleDraftChange}
          onSubmit={handleSubmit}
          onCreateRule={handleCreateRule}
        />
      </section>
    </main>
  );
}

export default BehaviorManagementPage;
