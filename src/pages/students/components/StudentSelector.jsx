import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAllStudents, addStudent } from "../../../services/studentService";
import { studentMockData } from "../../../mocks/student.mock";
import AddStudentModal from "./AddStudentModal";

function StudentSelector({ currentStudentId }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    loadStudents();
  }, []);

  async function loadStudents() {
    setLoading(true);
    try {
      const res = await getAllStudents();
      if (res.success) {
        setStudents(res.data);
      } else {
        setStudents(studentMockData || []);
      }
    } catch (error) {
      setStudents(studentMockData || []);
    } finally {
      setLoading(false);
    }
  }

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

  const filteredStudents = (students || []).filter(
    (s) =>
      (s.fullName &&
        s.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.name && s.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.studentID && s.studentID.toString().includes(searchTerm)) ||
      (s.id && s.id.toString().includes(searchTerm)),
  );

  // Handle the add-student submission coming from the modal.
  const handleAddStudent = async (formData) => {
    const result = await addStudent(formData);

    if (result.success) {
      // Refresh the list so the new student appears immediately.
      await loadStudents();

      // Navigate to the newly created student's profile when available.
      const newId = result.data?.studentID || result.data?.id;
      if (newId) {
        navigate(`/students/${newId}`);
      }
    }

    // Returning the result lets the modal show an error and stay open on failure.
    return result;
  };

  return (
    <>
      <div className="inline-flex items-center gap-2" ref={containerRef}>
        {/* Add Student Button */}
        <button
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/20 shadow-sm"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>Add Student</span>
        </button>

        {/* Switch Student Dropdown */}
        <div className="relative inline-block">
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
                </div>
              </div>

              <ul className="max-h-60 overflow-y-auto py-2">
                {loading ? (
                  <div className="p-4 text-center text-xs text-slate-500">
                    Loading...
                  </div>
                ) : filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => {
                    const id = student.studentID || student.id;
                    return (
                      <li
                        key={id}
                        onClick={() => {
                          navigate(`/students/${id}`);
                          setIsOpen(false);
                          setSearchTerm("");
                        }}
                        className={`px-4 py-2.5 text-sm cursor-pointer transition flex items-center justify-between ${
                          id === currentStudentId
                            ? "bg-sky-50 text-sky-700 font-medium"
                            : "text-slate-700 hover:bg-slate-50 hover:text-slate-950"
                        }`}
                      >
                        <span className="truncate">
                          {student.fullName || student.name}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 ml-2">
                          #{id}
                        </span>
                      </li>
                    );
                  })
                ) : (
                  <div className="p-4 text-center text-xs text-slate-500">
                    No students found.
                  </div>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Add Student Modal */}
      <AddStudentModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAddStudent}
      />
    </>
  );
}

export default StudentSelector;
