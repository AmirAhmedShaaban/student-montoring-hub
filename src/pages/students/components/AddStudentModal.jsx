import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

// Dropdown options aligned with the backend expected values.
const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

const GRADE_OPTIONS = [
  { value: "9", label: "Grade 9" },
  { value: "10", label: "Grade 10" },
  { value: "11", label: "Grade 11" },
  { value: "12", label: "Grade 12" },
];

const SECTION_OPTIONS = [
  { value: "1", label: "Section 1" },
  { value: "2", label: "Section 2" },
  { value: "3", label: "Section 3" },
];

const currentYear = new Date().getFullYear();

// Format a date value into "YYYY-MM-DD" as expected by the backend.
function formatDateForApi(value) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Validation schema for the add-student form.
const validationSchema = Yup.object({
  fullName: Yup.string()
    .trim()
    .min(3, "Full name must be at least 3 characters.")
    .required("Full name is required."),
  nationalID: Yup.string()
    .trim()
    .matches(/^\d{14,15}$/, "National ID must be 14-15 digits.")
    .required("National ID is required."),
  dateOfBirth: Yup.date()
    .max(new Date(), "Date of birth cannot be in the future.")
    .required("Date of birth is required."),
  gender: Yup.string().required("Gender is required."),
  gradeLevel: Yup.string().required("Grade level is required."),
  section: Yup.string().required("Section is required."),
  academicYear: Yup.number()
    .typeError("Academic year must be a number.")
    .integer("Academic year must be a whole number.")
    .min(2000, "Academic year is too old.")
    .max(currentYear + 1, "Academic year is too far in the future.")
    .required("Academic year is required."),
  studentCode: Yup.string().trim().required("Student code is required."),
  imageFile: Yup.mixed()
    .required("A student image is required.")
    .test(
      "fileType",
      "Only image files are allowed.",
      (file) => file && file.type?.startsWith("image/"),
    ),
});

// Shared input styles.
const inputClass =
  "w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10";
const labelClass = "block text-sm font-medium text-slate-600 mb-2";
const errorClass = "mt-1 text-xs font-medium text-rose-600";

function FieldError({ name, formik }) {
  if (formik.touched[name] && formik.errors[name]) {
    return <p className={errorClass}>{formik.errors[name]}</p>;
  }
  return null;
}

/**
 * Modal for adding a new student.
 * Rendered through a portal into document.body so its width/position are
 * never affected by parent overflow/transform/stacking contexts.
 *
 * @param {object} props
 * @param {boolean} props.isOpen
 * @param {Function} props.onClose
 * @param {Function} props.onSubmit - async (formData) => result. Receives a FormData object.
 */
function AddStudentModal({ isOpen, onClose, onSubmit }) {
  const [imagePreview, setImagePreview] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const fileInputRef = useRef(null);

  const formik = useFormik({
    initialValues: {
      fullName: "",
      nationalID: "",
      dateOfBirth: "",
      gender: "",
      gradeLevel: "",
      section: "",
      academicYear: currentYear,
      studentCode: "",
      imageFile: null,
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitError("");
      try {
        // Build FormData to support the binary image upload.
        const formData = new FormData();
        formData.append("FullName", values.fullName.trim());
        formData.append("NationalID", values.nationalID.trim());
        // Send the date as "YYYY-MM-DD" (the format the backend accepts).
        formData.append("DateOfBirth", formatDateForApi(values.dateOfBirth));
        formData.append("Gender", values.gender);
        formData.append("GradeLevel", values.gradeLevel);
        formData.append("Section", values.section);
        formData.append("AcademicYear", values.academicYear);
        formData.append("StudentCode", values.studentCode.trim());
        formData.append("ImageFile", values.imageFile);

        const result = await onSubmit?.(formData);

        if (result && result.success === false) {
          setSubmitError(result.message || "Failed to add student.");
          return;
        }

        resetForm();
        setImagePreview(null);
        onClose();
      } catch (error) {
        setSubmitError("Something went wrong. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Reset the form whenever the modal is opened.
  useEffect(() => {
    if (isOpen) {
      formik.resetForm();
      setImagePreview(null);
      setSubmitError("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Close on Escape, and lock body scroll while open.
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleImageChange = (event) => {
    const file = event.currentTarget.files?.[0] || null;
    formik.setFieldValue("imageFile", file);
    formik.setFieldTouched("imageFile", true, false);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const modal = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-student-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div className="relative max-h-[100vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/10 sm:p-8">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h2
              id="add-student-title"
              className="text-xl font-semibold text-slate-950"
            >
              Add new student
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Fill in the student details and upload a face image.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={formik.handleSubmit} className="pt-5" noValidate>
          <div className="grid gap-5 sm:grid-cols-2">
            {/* Full Name */}
            <div className="sm:col-span-2">
              <label htmlFor="fullName" className={labelClass}>
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Enter full name"
                className={inputClass}
                value={formik.values.fullName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <FieldError name="fullName" formik={formik} />
            </div>

            {/* National ID */}
            <div>
              <label htmlFor="nationalID" className={labelClass}>
                National ID
              </label>
              <input
                id="nationalID"
                name="nationalID"
                type="text"
                inputMode="numeric"
                placeholder="14-15 digits"
                className={inputClass}
                value={formik.values.nationalID}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <FieldError name="nationalID" formik={formik} />
            </div>

            {/* Student Code */}
            <div>
              <label htmlFor="studentCode" className={labelClass}>
                Student Code
              </label>
              <input
                id="studentCode"
                name="studentCode"
                type="text"
                placeholder="e.g. S-1011"
                className={inputClass}
                value={formik.values.studentCode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <FieldError name="studentCode" formik={formik} />
            </div>

            {/* Date of Birth */}
            <div>
              <label htmlFor="dateOfBirth" className={labelClass}>
                Date of Birth
              </label>
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                className={inputClass}
                value={formik.values.dateOfBirth}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <FieldError name="dateOfBirth" formik={formik} />
            </div>

            {/* Gender */}
            <div>
              <label htmlFor="gender" className={labelClass}>
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                className={inputClass}
                value={formik.values.gender}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="">Select gender</option>
                {GENDER_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <FieldError name="gender" formik={formik} />
            </div>

            {/* Grade Level */}
            <div>
              <label htmlFor="gradeLevel" className={labelClass}>
                Grade Level
              </label>
              <select
                id="gradeLevel"
                name="gradeLevel"
                className={inputClass}
                value={formik.values.gradeLevel}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="">Select grade</option>
                {GRADE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <FieldError name="gradeLevel" formik={formik} />
            </div>

            {/* Section */}
            <div>
              <label htmlFor="section" className={labelClass}>
                Section
              </label>
              <select
                id="section"
                name="section"
                className={inputClass}
                value={formik.values.section}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="">Select section</option>
                {SECTION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <FieldError name="section" formik={formik} />
            </div>

            {/* Academic Year */}
            <div>
              <label htmlFor="academicYear" className={labelClass}>
                Academic Year
              </label>
              <input
                id="academicYear"
                name="academicYear"
                type="number"
                placeholder="e.g. 2025"
                className={inputClass}
                value={formik.values.academicYear}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <FieldError name="academicYear" formik={formik} />
            </div>

            {/* Image Upload */}
            <div className="sm:col-span-2">
              <label className={labelClass}>Student Image</label>
              <div className="flex items-center gap-4">
                <label className="flex h-14 flex-1 cursor-pointer items-center justify-center rounded-2xl border border-dashed border-slate-300 transition hover:bg-slate-50">
                  <span className="text-sm font-medium text-slate-600">
                    {formik.values.imageFile
                      ? formik.values.imageFile.name
                      : "Choose image"}
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-14 w-14 rounded-2xl object-cover ring-1 ring-slate-200"
                  />
                ) : null}
              </div>
              <FieldError name="imageFile" formik={formik} />
            </div>
          </div>

          {submitError ? (
            <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {submitError}
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {formik.isSubmitting ? "Adding..." : "Add student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Render into document.body so parent containers never constrain the modal.
  return createPortal(modal, document.body);
}

export default AddStudentModal;
