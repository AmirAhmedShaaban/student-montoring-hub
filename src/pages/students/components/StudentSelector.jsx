import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAllStudents } from "../../../services/studentService";

function StudentSelector({ currentStudentId }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    async function loadStudents() {
      setLoading(true);
      try {
        const res = await getAllStudents();
        if (res.success) {
          setStudents(res.data);
        }
      } catch (error) {
        console.error("Error loading students for selector:", error);
      } finally {
        setLoading(false);
      }
    }
    loadStudents();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredStudents = students.filter(
    (s) =>
      s.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studentID?.toString().includes(searchTerm),
  );

  return (
    <div className="relative inline-block" ref={containerRef}>
      {/* Trigger Button - Now looks like a professional action button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-sky-400 hover:text-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500/20 shadow-sm"
      >
        <svg
          className="h-4 w-4 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
          />
        </svg>
        <span>Switch Student</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-72 max-h-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl backdrop-blur-sm">
          {/* Search Input inside the dropdown */}
          <div className="p-3 border-b border-slate-100 bg-slate-50/50">
            <div className="relative">
              <input
                autoFocus
                type="text"
                placeholder="Search name or ID..."
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/10 transition"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                className="absolute right-3 top-2.5 h-4 w-4 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <ul className="max-h-60 overflow-y-auto py-2">
            {loading ? (
              <div className="p-4 text-center text-xs text-slate-500">
                Loading...
              </div>
            ) : filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <li
                  key={student.studentID}
                  onClick={() => {
                    navigate(`/students/${student.studentID}`);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                  className={`px-4 py-2.5 text-sm cursor-pointer transition flex items-center justify-between ${
                    student.studentID === currentStudentId
                      ? "bg-sky-50 text-sky-700 font-medium"
                      : "text-slate-700 hover:bg-slate-50 hover:text-slate-950"
                  }`}
                >
                  <span className="truncate">{student.fullName}</span>
                  <span className="text-[10px] font-mono text-slate-400 ml-2">
                    #{student.studentID}
                  </span>
                </li>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-slate-500">
                No students found.
              </div>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default StudentSelector;
