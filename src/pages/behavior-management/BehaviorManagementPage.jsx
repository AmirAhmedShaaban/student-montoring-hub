import { useEffect, useMemo, useState } from "react";
import { useDashboardMockData } from "../../mocks/dashboard.mock";
import {
  getAllBehaviorRules,
  createBehaviorRule,
  updateBehaviorRule,
  toggleBehaviorRuleStatus,
  deleteBehaviorRule,
} from "../../services/behaviorService";
import BehaviorEditorPanel from "./components/BehaviorEditorPanel";
import BehaviorRulesList from "./components/BehaviorRulesList";

/* ------------------------------------------------------------------ */
/*  Severity helpers – API uses numbers (0‑5), UI uses labels           */
/* ------------------------------------------------------------------ */

const SEVERITY_NUMBER_TO_TEXT = {
  0: "Low",
  1: "Low",
  2: "Low",
  3: "Medium",
  4: "High",
  5: "High",
};

const SEVERITY_TEXT_TO_NUMBER = {
  Low: 1,
  Medium: 3,
  High: 5,
};

function mapSeverityNumberToText(level) {
  return SEVERITY_NUMBER_TO_TEXT[level] ?? "Medium";
}

function mapSeverityTextToNumber(label) {
  return SEVERITY_TEXT_TO_NUMBER[label] ?? 3;
}

/* ------------------------------------------------------------------ */
/*  Field‑name mapping helpers between API and UI                      */
/* ------------------------------------------------------------------ */

/**
 * API response rule object → UI rule object.
 * `consequences` is NOT returned by the API, so it defaults to "".
 */
function mapApiRuleToUi(apiRule) {
  return {
    id: apiRule.ruleID ?? apiRule.id ?? null,
    name: apiRule.ruleName ?? apiRule.name ?? "",
    category: apiRule.category ?? "",
    severity: mapSeverityNumberToText(apiRule.severityLevel),
    description: apiRule.description ?? "",
    consequences: apiRule.consequences ?? "",
    isActive: apiRule.isActive ?? true,
  };
}

/**
 * UI rule object → API payload for CREATE.
 * Sends only the fields the backend expects.
 * `consequences` is intentionally excluded (not in API contract).
 */
function mapUiRuleToCreatePayload(uiRule, createdByUserID = 1) {
  return {
    ruleName: uiRule.name,
    description: uiRule.description,
    category: uiRule.category,
    severityLevel: mapSeverityTextToNumber(uiRule.severity),
    createdByUserID,
  };
}

/**
 * UI rule object → API payload for UPDATE.
 * `createdByUserID` is NOT sent (not in PUT contract).
 * `isActive` is NOT sent (changed only via PATCH toggle).
 * `consequences` is NOT sent (not in API contract).
 */
function mapUiRuleToUpdatePayload(uiRule) {
  return {
    ruleID: uiRule.id,
    ruleName: uiRule.name,
    description: uiRule.description,
    category: uiRule.category,
    severityLevel: mapSeverityTextToNumber(uiRule.severity),
  };
}

/* ------------------------------------------------------------------ */
/*  Draft factory                                                      */
/* ------------------------------------------------------------------ */

function createRuleDraft(rule = {}) {
  return {
    id: rule.id ?? null,
    name: rule.name || "",
    category: rule.category || "",
    severity: rule.severity || "Medium",
    description: rule.description || "",
    consequences: rule.consequences || "",
    isActive: rule.isActive ?? true,
  };
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

function BehaviorManagementPage() {
  const dashboardData = useDashboardMockData();

  /* ---- state ---- */
  const [rules, setRules] = useState([]);
  const [selectedRuleId, setSelectedRuleId] = useState(null);
  const [draftRule, setDraftRule] = useState(createRuleDraft());
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);

  /* ---- initial fetch ---- */
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getAllBehaviorRules()
      .then((res) => {
        if (cancelled) return;
        if (res.success) {
          const uiRules = (res.data || []).map(mapApiRuleToUi);
          setRules(uiRules);
          if (uiRules.length > 0) {
            setSelectedRuleId((prev) => prev ?? uiRules[0].id);
          }
        } else {
          setError(res.message || "Failed to load rules.");
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err?.message || "Unexpected error loading rules.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  /* ---- sync draft when selected rule changes ---- */
  useEffect(() => {
    const selectedRule = rules.find((rule) => rule.id === selectedRuleId);
    setDraftRule(createRuleDraft(selectedRule));
  }, [rules, selectedRuleId]);

  /* ---- derived data ---- */
  const categories = useMemo(
    () =>
      Array.from(new Set(rules.map((rule) => rule.category))).filter(Boolean),
    [rules],
  );

  const filteredRules = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return rules;

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

  const stats = useMemo(() => {
    return {
      total: rules.length,
      active: rules.filter((rule) => rule.isActive).length,
      highSeverity: rules.filter((rule) => rule.severity === "High").length,
    };
  }, [rules]);

  /* ---- event handlers ---- */
  const handleSelectRule = (ruleId) => {
    setSelectedRuleId(ruleId);
  };

  const handleCreateRule = () => {
    const optimisticId = `new-${Date.now()}`;
    const newRule = {
      id: optimisticId,
      name: "",
      category: categories[0] ?? "General",
      severity: "Medium",
      description: "",
      consequences: "",
      isActive: true,
    };

    setRules((prev) => [newRule, ...prev]);
    setSelectedRuleId(optimisticId);
  };

  const handleDraftChange = (updatedDraft) => {
    setDraftRule(updatedDraft);
  };

  /**
   * Called when the ToggleField inside BehaviorRuleForm is flipped.
   * For existing rules we call the PATCH endpoint immediately;
   * for unsaved ("new-*") rules we only update the local draft.
   */
  const handleToggleInForm = async (newIsActive) => {
    // 1) Update draft immediately so the UI feels instant
    setDraftRule((prev) => ({ ...prev, isActive: newIsActive }));

    const ruleId = draftRule.id;
    if (ruleId == null || String(ruleId).startsWith("new-")) {
      // Not persisted yet — nothing to patch
      return;
    }

    // 2) Call the dedicated toggle endpoint
    try {
      const res = await toggleBehaviorRuleStatus(ruleId);
      if (res.success) {
        // Sync the list
        setRules((prev) =>
          prev.map((r) =>
            r.id === ruleId ? { ...r, isActive: newIsActive } : r,
          ),
        );
      } else {
        // Revert on failure
        setDraftRule((prev) => ({ ...prev, isActive: !newIsActive }));
        setSaveMessage({
          type: "error",
          text: res.message || "Toggle failed.",
        });
      }
    } catch {
      setDraftRule((prev) => ({ ...prev, isActive: !newIsActive }));
      setSaveMessage({ type: "error", text: "Network error during toggle." });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedName = draftRule.name.trim();
    if (!trimmedName) return;

    const nextDraft = {
      ...draftRule,
      name: trimmedName,
      category: draftRule.category.trim(),
      description: draftRule.description.trim(),
      consequences: draftRule.consequences.trim(),
    };

    setSaving(true);
    setSaveMessage(null);

    try {
      const isNew = String(nextDraft.id).startsWith("new-");

      if (isNew) {
        // ----- CREATE -----
        const payload = mapUiRuleToCreatePayload(nextDraft);
        const res = await createBehaviorRule(payload);

        if (res.success) {
          const created = mapApiRuleToUi(res.data);
          setRules((prev) => [
            created,
            ...prev.filter((r) => r.id !== nextDraft.id),
          ]);
          setSelectedRuleId(created.id);
          setSaveMessage({
            type: "success",
            text: res.message || "Rule created.",
          });
        } else {
          setSaveMessage({
            type: "error",
            text: res.message || "Failed to create rule.",
          });
        }
      } else {
        // ----- UPDATE -----
        const payload = mapUiRuleToUpdatePayload(nextDraft);
        const res = await updateBehaviorRule(payload);

        if (res.success) {
          // Server may return the full object — map it back; fall back to draft
          const updated = res.data ? mapApiRuleToUi(res.data) : nextDraft;
          setRules((prev) =>
            prev.map((r) => (r.id === nextDraft.id ? { ...r, ...updated } : r)),
          );
          setSaveMessage({
            type: "success",
            text: res.message || "Rule updated.",
          });
        } else {
          setSaveMessage({
            type: "error",
            text: res.message || "Failed to update rule.",
          });
        }
      }
    } catch (err) {
      setSaveMessage({
        type: "error",
        text: err?.message || "Unexpected error saving rule.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (ruleId) => {
    // Optimistic toggle
    setRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, isActive: !r.isActive } : r)),
    );

    try {
      const res = await toggleBehaviorRuleStatus(ruleId);
      if (!res.success) {
        // Revert on failure
        setRules((prev) =>
          prev.map((r) =>
            r.id === ruleId ? { ...r, isActive: !r.isActive } : r,
          ),
        );
        setSaveMessage({
          type: "error",
          text: res.message || "Toggle failed.",
        });
      }
    } catch {
      setRules((prev) =>
        prev.map((r) =>
          r.id === ruleId ? { ...r, isActive: !r.isActive } : r,
        ),
      );
      setSaveMessage({ type: "error", text: "Network error during toggle." });
    }
  };

  const handleDeleteRule = async (ruleId) => {
    const previousRules = rules;
    setRules((prev) => prev.filter((r) => r.id !== ruleId));
    if (selectedRuleId === ruleId) {
      setSelectedRuleId(null);
    }

    try {
      const res = await deleteBehaviorRule(ruleId);
      if (!res.success) {
        setRules(previousRules);
        setSaveMessage({
          type: "error",
          text: res.message || "Delete failed.",
        });
      } else {
        setSaveMessage({
          type: "success",
          text: res.message || "Rule deleted.",
        });
      }
    } catch {
      setRules(previousRules);
      setSaveMessage({ type: "error", text: "Network error during delete." });
    }
  };

  /* ---- render ---- */
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
      {/* ---------- Hero / stats ---------- */}
      <section className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur sm:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-700">
              Behavior management
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Review incidents and intervention rules in one focused workspace
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-600">
              Review incidents, classifications, severity, and interventions
              alongside the current AI analysis result.
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

      {/* ---------- AI Analysis (still mock) ---------- */}
      <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">
              Latest AI analysis
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Shared result currently driving monitoring and follow-up.
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
            {dashboardData.latestAnalysisResult.followUpStatus}
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-500">Classification</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">
              {dashboardData.latestAnalysisResult.classification}
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-500">Risk level</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">
              {dashboardData.latestAnalysisResult.riskLevel}
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-500">Cluster</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">
              {dashboardData.latestAnalysisResult.cluster}
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-500">
              Latest incident
            </p>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-950">
              {dashboardData.latestAnalysisResult.latestIncident}
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
          Suggested intervention:{" "}
          {dashboardData.latestAnalysisResult.suggestedIntervention}
        </div>
      </section>

      {/* ---------- Rules list + editor ---------- */}
      <section className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        {/* left column: list */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur">
            <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  Behavior incidents and rules
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Filter by incident rule, category, severity, or response.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCreateRule}
                className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                Add rule
              </button>
            </div>

            <div className="mt-5 space-y-5">
              <label
                htmlFor="behavior-rule-search"
                className="block text-sm font-semibold text-slate-800"
              >
                Search incidents
              </label>
              <input
                id="behavior-rule-search"
                type="search"
                name="behavior-rule-search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by incident, category, severity, or response"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              />

              {loading && (
                <p className="py-8 text-center text-sm text-slate-400">
                  Loading rules…
                </p>
              )}
              {error && !loading && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {!loading && !error && (
                <BehaviorRulesList
                  rules={filteredRules}
                  selectedRuleId={selectedRuleId}
                  onSelectRule={handleSelectRule}
                  onToggleStatus={handleToggleStatus}
                  onDeleteRule={handleDeleteRule}
                />
              )}
            </div>
          </div>
        </div>

        {/* right column: editor — CRITICAL: receives draftRule, not selectedRule */}
        <BehaviorEditorPanel
          rule={draftRule}
          categories={categories}
          onChange={handleDraftChange}
          onSubmit={handleSubmit}
          onCreateRule={handleCreateRule}
          onDeleteRule={handleDeleteRule}
          onToggleStatus={handleToggleInForm}
          saving={saving}
          saveMessage={saveMessage}
          onClearMessage={() => setSaveMessage(null)}
        />
      </section>
    </main>
  );
}

export default BehaviorManagementPage;
