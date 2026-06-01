// src/pages/students/components/StudentAttendanceCard.jsx

import { useState } from "react";

export default function StudentAttendanceCard({
  attendanceRecords = [],
  summary,
}) {
  const [statusFilter, setStatusFilter] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All");

  // فلترة البيانات
  const filteredRecords = attendanceRecords.filter((record) => {
    const statusMatch =
      statusFilter === "All" || record.statusDisplay === statusFilter;
    const sourceMatch =
      sourceFilter === "All" || record.source === sourceFilter;
    return statusMatch && sourceMatch;
  });

  const uniqueStatuses = [
    ...new Set(attendanceRecords.map((r) => r.statusDisplay)),
  ];
  const uniqueSources = [...new Set(attendanceRecords.map((r) => r.source))];

  if (!attendanceRecords || attendanceRecords.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-slate-500">
          No attendance records found for this student.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      {summary && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-3xl border border-slate-200 bg-white p-5">
            <p className="text-sm font-medium text-slate-600">
              Attendance Rate
            </p>
            <p className="mt-2 text-4xl font-semibold text-emerald-600">
              {summary.attendancePercentage}%
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5">
            <p className="text-sm font-medium text-slate-600">Present Days</p>
            <p className="mt-2 text-4xl font-semibold text-slate-950">
              {summary.presentDays}
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5">
            <p className="text-sm font-medium text-slate-600">Absent Days</p>
            <p className="mt-2 text-4xl font-semibold text-rose-600">
              {summary.absentDays}
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5">
            <p className="text-sm font-medium text-slate-600">Late Days</p>
            <p className="mt-2 text-4xl font-semibold text-amber-600">
              {summary.lateDays || 0}
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5">
            <p className="text-sm font-medium text-slate-600">Total Days</p>
            <p className="mt-2 text-4xl font-semibold text-slate-950">
              {summary.totalDays}
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-2xl border border-slate-300 px-4 py-2 text-sm"
          >
            <option value="All">All Statuses</option>
            {uniqueStatuses.map((status, index) => (
              <option key={index} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Source
          </label>
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="rounded-2xl border border-slate-300 px-4 py-2 text-sm"
          >
            <option value="All">All Sources</option>
            {uniqueSources.map((source, index) => (
              <option key={index} value={source}>
                {source}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Attendance Records */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-slate-950">
            Attendance Records
          </h3>
          <p className="text-sm text-slate-500">
            Showing {filteredRecords.length} of {attendanceRecords.length}{" "}
            records
          </p>
        </div>

        <div className="space-y-3">
          {filteredRecords.length > 0 ? (
            filteredRecords.map((record, index) => (
              <div
                key={index}
                className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-5 hover:bg-slate-50 transition"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="font-semibold text-slate-950">
                      {new Date(record.attendanceDate).toLocaleDateString()}
                    </p>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        record.statusDisplay === "Present"
                          ? "bg-emerald-100 text-emerald-700"
                          : record.statusDisplay === "Absent"
                            ? "bg-rose-100 text-rose-700"
                            : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {record.statusDisplay}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-600">
                    <span>
                      Source:{" "}
                      <span className="font-medium text-slate-800">
                        {record.source}
                      </span>
                    </span>
                    <span>
                      Check-in:{" "}
                      <span className="font-medium text-slate-800">
                        {record.checkInTime
                          ? new Date(record.checkInTime).toLocaleTimeString(
                              [],
                              { hour: "2-digit", minute: "2-digit" },
                            )
                          : "N/A"}
                      </span>
                    </span>
                    {record.lateMinutes > 0 && (
                      <span className="text-amber-600">
                        Late by {record.lateMinutes} min
                      </span>
                    )}
                  </div>
                </div>

                {record.confidenceScore > 0 && (
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Confidence</p>
                    <p className="text-lg font-semibold text-slate-950">
                      {record.confidenceScore}%
                    </p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-slate-500 py-6">
              No records match the selected filters.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
