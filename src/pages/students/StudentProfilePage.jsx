import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDashboardMockData } from "../../mocks/dashboard.mock";
import {
  getStudentById,
  getStudentAttendance,
  getStudentGrades,
  getStudentBehavior,
  getStudentNotes,
  addStudentNote,
} from "../../services/studentService";
import { getStudentAcademic } from "../../services/dashboardService";

import AddNoteForm from "./components/AddNoteForm";
import DisciplineIncidentsCard from "./components/DisciplineIncidentsCard";
import NotesPanel from "./components/NotesPanel";
import ProfileStatCard from "./components/ProfileStatCard";
import RecentIncidentsList from "./components/RecentIncidentsList";
import StudentProfileHeader from "./components/StudentProfileHeader";
import StudentTabs from "./components/StudentTabs";
import StudentAcademicCard from "../dashboard/components/StudentAcademicCard";
import BehaviorSummaryCards from "./components/BehaviorSummaryCards";
import BehaviorIncidentsList from "./components/BehaviorIncidentsList";
import StudentGradesCard from "./components/StudentGradesCard";

import {
  buildStudentProfile,
  STUDENT_PROFILE_TABS,
} from "./studentProfile.utils";

// ==================== MOCK DATA ====================
const mockBehaviorSummary = {
  totalIncidents: 5,
  pendingIncidents: 3,
  underReviewIncidents: 2,
  confirmedIncidents: 0,
  rejectedIncidents: 0,
};

const mockIncidents = [
  {
    incidentID: 1,
    studentID: 3,
    studentName: "Omar Khaled",
    ruleName: "Sleeping",
    source: "Camera",
    detail: "Detected behavior: This rule detects when a student is Sleeping.",
    confidence: 1.0,
    occurredAt: "2026-05-07T12:29:35.6945059",
    reviewStatusDisplay: "Pending",
  },
  {
    incidentID: 2,
    studentID: 3,
    studentName: "Omar Khaled",
    ruleName: "Raising Hand",
    source: "AI",
    detail:
      "Detected behavior: This rule detects when a student is Raising Hand.",
    confidence: 0.63,
    occurredAt: "2026-05-07T12:25:36.7751989",
    reviewStatusDisplay: "Pending",
  },
];

// Mock Grades Data
const mockGrades = [
  {
    gradeID: 1,
    studentID: 1,
    studentName: "Ahmed Mohamed",
    subject: "Math",
    score: 85.5,
    gradeLabel: "B+",
    term: "Term 1",
    academicYear: 2026,
    date: "2026-01-15T00:00:00",
  },
  {
    gradeID: 2,
    studentID: 1,
    studentName: "Ahmed Mohamed",
    subject: "Science",
    score: 92.0,
    gradeLabel: "A",
    term: "Term 1",
    academicYear: 2026,
    date: "2026-01-15T00:00:00",
  },
  {
    gradeID: 3,
    studentID: 1,
    studentName: "Ahmed Mohamed",
    subject: "English",
    score: 78.0,
    gradeLabel: "C+",
    term: "Term 1",
    academicYear: 2026,
    date: "2026-01-15T00:00:00",
  },
  {
    gradeID: 4,
    studentID: 1,
    studentName: "Ahmed Mohamed",
    subject: "History",
    score: 88.5,
    gradeLabel: "B+",
    term: "Term 1",
    academicYear: 2026,
    date: "2026-01-15T00:00:00",
  },
  {
    gradeID: 5,
    studentID: 1,
    studentName: "Ahmed Mohamed",
    subject: "Arabic",
    score: 95.0,
    gradeLabel: "A",
    term: "Term 1",
    academicYear: 2026,
    date: "2026-01-15T00:00:00",
  },
];

const mockGradeAverage = {
  averageScore: 88.1,
  totalSubjects: 5,
  highestScore: 95.0,
  lowestScore: 78.0,
};

function StudentProfileWorkspace({
  profile,
  latestAnalysis,
  studentId,
  academicData,
}) {
  const [activeTab, setActiveTab] = useState(STUDENT_PROFILE_TABS[0].id);
  const [notes, setNotes] = useState(profile.notes || []);
  const [draftNote, setDraftNote] = useState({
    category: "Assessment",
    text: "",
  });
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [noteError, setNoteError] = useState("");

  const handleAddNote = async (event) => {
    event.preventDefault();
    setNoteError("");
    const trimmedText = draftNote.text.trim();

    if (trimmedText.length < 10) {
      setNoteError("Note text must be at least 10 characters.");
      return;
    }

    try {
      setIsSubmittingNote(true);
      const notePayload = {
        userID: 1,
        noteText: trimmedText,
        noteType: draftNote.category,
      };

      const result = await addStudentNote(studentId, notePayload);

      if (result.success) {
        const newNote = {
          id: result.data?.noteID || `note-${Date.now()}`,
          author: "Current Staff",
          category: draftNote.category,
          text: trimmedText,
          timestamp: new Date(),
        };
        setNotes((prev) => [newNote, ...prev]);
        setDraftNote({ category: "Assessment", text: "" });
      } else {
        setNoteError(result.message);
      }
    } catch (err) {
      setNoteError("Something went wrong while saving the note.");
    } finally {
      setIsSubmittingNote(false);
    }
  };

  const activeTabLabel =
    STUDENT_PROFILE_TABS.find((tab) => tab.id === activeTab)?.label ??
    STUDENT_PROFILE_TABS[0].label;

  const panelId = `student-panel-${activeTab}`;
  const tabId = `student-tab-${activeTab}`;

  const getActiveTabContent = () => {
    if (activeTab === "overview") {
      return (
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <ProfileStatCard
                label="Attendance"
                value={`${Math.round(profile.attendanceRate)}%`}
                detail={profile.attendanceDetail}
                accent="bg-sky-50 text-sky-700 ring-sky-100"
              />
              <ProfileStatCard
                label="Academic Avg"
                value={`${Math.round((profile.gpa / 4) * 100)}%`}
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
                  <dt className="text-slate-500">System Status</dt>
                  <dd className="font-medium text-slate-900">
                    {profile.riskLevel === "Low" ? "Active" : "Inactive"}
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

          <div className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur">
              <h2 className="text-lg font-semibold text-slate-950">
                Latest AI analysis
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Shared result from the latest uploaded media.
              </p>
              <dl className="mt-5 space-y-4 text-sm">
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                  <dt className="text-slate-500">Classification</dt>
                  <dd className="font-medium text-slate-900">
                    {latestAnalysis.classification}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                  <dt className="text-slate-500">Cluster</dt>
                  <dd className="font-medium text-slate-900">
                    {latestAnalysis.cluster}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                  <dt className="text-slate-500">Risk level</dt>
                  <dd className="font-medium text-slate-900">
                    {latestAnalysis.riskLevel}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                  <dt className="text-slate-500">Follow-up</dt>
                  <dd className="font-medium text-slate-900">
                    {latestAnalysis.followUpStatus}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-slate-500">Suggested intervention</dt>
                  <dd className="font-medium text-slate-900">
                    {latestAnalysis.suggestedIntervention}
                  </dd>
                </div>
              </dl>
            </section>

            <StudentAcademicCard academicData={academicData} />
          </div>
        </div>
      );
    }

    if (activeTab === "behavior") {
      return (
        <div className="space-y-8">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,18rem)_minmax(0,1fr)]">
            <DisciplineIncidentsCard
              count={profile.disciplineIncidents}
              riskLevel={profile.riskLevel}
              trend={profile.disciplineTrend}
              lastIncident={profile.recentIncidents[0]}
            />
            <RecentIncidentsList incidents={profile.recentIncidents} />
          </div>

          <div className="space-y-6">
            <BehaviorSummaryCards summary={mockBehaviorSummary} />
            <BehaviorIncidentsList incidents={mockIncidents} />
          </div>
        </div>
      );
    }

    if (activeTab === "grades") {
      return (
        <StudentGradesCard grades={mockGrades} averageData={mockGradeAverage} />
      );
    }

    return (
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,24rem)]">
        <NotesPanel notes={notes} />
        <div>
          <AddNoteForm
            value={draftNote}
            categories={["Reading", "Assignment", "Assessment"]}
            onChange={setDraftNote}
            onSubmit={handleAddNote}
            disabled={isSubmittingNote}
          />
          {noteError && (
            <p className="mt-2 text-sm text-red-600 font-medium px-2">
              {noteError}
            </p>
          )}
        </div>
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
  const dashboardData = useDashboardMockData();
  const [profileData, setProfileData] = useState(null);
  const [academicData, setAcademicData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchFullProfile() {
      try {
        setLoading(true);
        setError("");
        const targetId = id ? Number(id) : 1;

        const [
          studentRes,
          attendanceRes,
          gradesRes,
          behaviorRes,
          notesRes,
          academicRes,
        ] = await Promise.all([
          getStudentById(targetId),
          getStudentAttendance(targetId),
          getStudentGrades(targetId),
          getStudentBehavior(targetId),
          getStudentNotes(targetId),
          getStudentAcademic(targetId),
        ]);

        if (studentRes.success) {
          const transformedProfile = buildStudentProfile(
            studentRes.data,
            attendanceRes.data || [],
            gradesRes.data || [],
            behaviorRes.data || [],
          );
          transformedProfile.notes = notesRes.success ? notesRes.data : [];
          setProfileData(transformedProfile);

          if (academicRes.success) {
            setAcademicData(academicRes.data);
          }
        } else {
          setError(
            studentRes.message || "Failed to load student base records.",
          );
        }
      } catch (err) {
        setError("An unexpected error occurred while loading profile data.");
      } finally {
        setLoading(false);
      }
    }

    fetchFullProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-sky-600 mx-auto" />
          <p className="text-sm font-medium text-slate-600 animate-pulse">
            Assembling profile intelligence view...
          </p>
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 bg-slate-50">
        <div className="max-w-md w-full bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-center">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto text-xl font-bold">
            !
          </div>
          <h2 className="mt-4 text-lg font-semibold text-slate-950">
            Profile Unreachable
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {error || "The requested records do not exist."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-5 w-full rounded-2xl bg-slate-950 py-2.5 text-sm font-semibold text-white shadow hover:bg-slate-900 transition"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <StudentProfileWorkspace
      key={profileData.id}
      profile={profileData}
      latestAnalysis={dashboardData.latestAnalysisResult}
      studentId={profileData.id}
      academicData={academicData}
    />
  );
}

export default StudentProfilePage;
