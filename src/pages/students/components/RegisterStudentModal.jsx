// src/pages/students/components/RegisterStudentModal.jsx

import { useState } from "react";

export default function RegisterStudentModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    studentCode: "",
    studentName: "",
    faceImage: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, faceImage: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("StudentCode", formData.studentCode);
    data.append("StudentName", formData.studentName);
    if (formData.faceImage) {
      data.append("FaceImage", formData.faceImage);
    }

    await onSubmit(data);
    setLoading(false);
    handleClose();
  };

  const handleClose = () => {
    setFormData({ studentCode: "", studentName: "", faceImage: null });
    setPreview(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-slate-950">
            Register New Student
          </h2>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 text-2xl"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Student Code */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Student Code
            </label>
            <input
              type="text"
              name="studentCode"
              value={formData.studentCode}
              onChange={handleInputChange}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              placeholder="Enter student code"
              required
            />
          </div>

          {/* Student Name */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Student Name
            </label>
            <input
              type="text"
              name="studentName"
              value={formData.studentName}
              onChange={handleInputChange}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              placeholder="Enter student name"
              required
            />
          </div>

          {/* Face Image Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Face Image
            </label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer rounded-2xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                Choose Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="h-14 w-14 rounded-2xl object-cover border border-slate-200"
                />
              )}
            </div>
            <p className="mt-1 text-xs text-slate-500">JPG or PNG (Max 5MB)</p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-2xl border border-slate-300 px-6 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-slate-950 px-6 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-70"
            >
              {loading ? "Registering..." : "Register Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
