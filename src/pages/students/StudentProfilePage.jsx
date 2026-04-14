import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { studentMockData } from "../../mocks/student.mock";

import AddNoteForm from "./components/AddNoteForm";
import DisciplineIncidentsCard from "./components/DisciplineIncidentsCard";
import NotesPanel from "./components/NotesPanel";
import ProfileStatCard from "./components/ProfileStatCard";
import RecentIncidentsList from "./components/RecentIncidentsList";
import StudentProfileHeader from "./components/StudentProfileHeader";
import StudentTabs from "./components/StudentTabs";
import {
  buildStudentProfile,
  NOTES_CATEGORIES,
  STUDENT_PROFILE_TABS,
} from "./studentProfile.utils";

function StudentProfileWorkspace({ profile }) {
  const [activeTab, setActiveTab] = useState(STUDENT_PROFILE_TABS[0].id);
  const [notes, setNotes] = useState(profile.notes);
  const [draftNote, setDraftNote] = useState({
    category: NOTES_CATEGORIES[0],
    text: "",
  });

  const handleAddNote = (event) => {
    event.preventDefault();

    const trimmedText = draftNote.text.trim();

    if (!trimmedText) {
      return;
    }

    setNotes((currentNotes) => [
      {
        id: `note-${Date.now()}`,
        author: "Current staff",
        category: draftNote.category,
        text: trimmedText,
        timestamp: new Date(),
      },
      ...currentNotes,
    ]);

    setDraftNote({
      category: NOTES_CATEGORIES[0],
      text: "",
    });
  };

  const activeTabLabel =
    STUDENT_PROFILE_TABS.find((tab) => tab.id === activeTab)?.label ??
    STUDENT_PROFILE_TABS[0].label;

  const panelId = `student-panel-${activeTab}`;
  const tabId = `student-tab-${activeTab}`;

  const getActiveTabContent = () => {
    if (activeTab === "overview") {
      return (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="grid gap-6 md:grid-cols-2">
            <ProfileStatCard
              label="Attendance"
              value={`${Math.round(profile.attendanceRate)}%`}
              detail={profile.attendanceDetail}
              accent="bg-sky-50 text-sky-700 ring-sky-100"
            />
            <ProfileStatCard
              label="GPA"
              value={profile.gpa.toFixed(2)}
              detail={profile.gpaDetail}
              accent="bg-emerald-50 text-emerald-700 ring-emerald-100"
            />
          </div>

          <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur">
            <h2 className="text-lg font-semibold text-slate-950">
              Quick profile
            </h2>
            <dl className="mt-5 space-y-4 text-sm">
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                <dt className="text-slate-500">Homeroom</dt>
                <dd className="font-medium text-slate-900">
                  {profile.className}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                <dt className="text-slate-500">Risk level</dt>
                <dd className="font-medium text-slate-900">
                  {profile.riskLevel}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-slate-500">Last updated</dt>
                <dd className="font-medium text-slate-900">
                  {profile.lastUpdated}
                </dd>
              </div>
            </dl>
          </section>
        </div>
      );
    }

    if (activeTab === "behavior") {
      return (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,18rem)_minmax(0,1fr)]">
          <DisciplineIncidentsCard
            count={profile.disciplineIncidents}
            riskLevel={profile.riskLevel}
            trend={profile.disciplineTrend}
            lastIncident={profile.recentIncidents[0]}
          />

          <RecentIncidentsList incidents={profile.recentIncidents} />
        </div>
      );
    }

    return (
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,24rem)]">
        <NotesPanel notes={notes} />

        <AddNoteForm
          value={draftNote}
          categories={NOTES_CATEGORIES}
          onChange={setDraftNote}
          onSubmit={handleAddNote}
        />
      </div>
    );
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
      <StudentProfileHeader student={profile} />

      <section className="rounded-4xl border border-slate-200 bg-white/80 p-2 shadow-sm backdrop-blur">
        <StudentTabs
          tabs={STUDENT_PROFILE_TABS}
          activeTab={activeTab}
          onChange={setActiveTab}
          activeLabel={activeTabLabel}
        />

        <div className="p-4 sm:p-6">
          <div
            id={panelId}
            role="tabpanel"
            aria-labelledby={tabId}
            tabIndex={0}
            className="focus:outline-none"
          >
            {getActiveTabContent()}
          </div>
        </div>
      </section>
    </main>
  );
}

function StudentProfilePage() {
  const { id } = useParams();

  const profile = useMemo(() => {
    const mockStudent = studentMockData.find(
      (entry) => entry.id === Number(id),
    );
    const selectedStudent = mockStudent || studentMockData[0];

    return buildStudentProfile(selectedStudent);
  }, [id]);

  return <StudentProfileWorkspace key={profile.id} profile={profile} />;
}

export default StudentProfilePage;
