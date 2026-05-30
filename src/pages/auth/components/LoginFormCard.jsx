import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginInput from "./LoginInput";
import { login } from "../../../services/authService";

const formFields = [
  {
    id: "email",
    label: "Email address",
    type: "email",
    placeholder: "principal@school.edu",
    autoComplete: "email",
    inputMode: "email",
    required: true,
  },
  {
    id: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter your password",
    autoComplete: "current-password",
    required: true,
    helpText: "Use your school account credentials.",
  },
];

function LoginFormCard() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (errorMessage) {
      setErrorMessage("");
    }

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log("SUBMIT CLICKED");
    console.log(formData);

    setIsLoading(true);
    setErrorMessage("");

    try {
      const loginResult = await login(formData.email, formData.password);

      console.log("LOGIN RESULT", loginResult);

      if (!loginResult.success) {
        setErrorMessage(loginResult.message);
        setIsLoading(false);
        return;
      }

      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="rounded-4xl border border-slate-200 bg-white/90 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.10)] backdrop-blur-xl sm:p-8 lg:p-10">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
          Sign in
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
          Access the dashboard
        </h2>
        <p className="text-sm leading-6 text-slate-600 sm:text-base">
          Sign in to review reports, manage behavior records, and monitor
          student progress.
        </p>
      </div>

      {errorMessage ? (
        <p className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {errorMessage}
        </p>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
        {formFields.map((field) => (
          <div key={field.id}>
            <LoginInput
              id={field.id}
              label={field.label}
              type={field.type}
              value={formData[field.id]}
              onChange={handleChange}
              placeholder={field.placeholder}
              autoComplete={field.autoComplete}
              inputMode={field.inputMode}
              required={field.required}
              helpText={field.helpText}
            />
            {field.id === "password" ? (
              <div className="mt-3 flex items-center justify-end">
                <a
                  href="mailto:support@studentdashboard.edu?subject=Password%20reset%20request"
                  className="text-sm font-medium text-sky-700 transition hover:text-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                >
                  Forgot password?
                </a>
              </div>
            ) : null}
          </div>
        ))}

        <button
          type="submit"
          disabled={isLoading}
          className={`inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition focus:outline-none focus:ring-4 focus:ring-slate-900/20 ${
            isLoading
              ? "opacity-70 cursor-not-allowed"
              : "hover:-translate-y-0.5 hover:bg-slate-800"
          }`}
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        New to the system?{" "}
        <Link
          to="/register"
          className="font-semibold text-sky-700 transition hover:text-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
        >
          Create an account
        </Link>
      </p>
    </section>
  );
}

export default LoginFormCard;
