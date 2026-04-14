import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getPasswordStrength, registerDummyUser } from "../../utils/auth";

const roleOptions = ["Teacher", "Counselor", "Principal", "Staff"];

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Teacher",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const passwordStrength = useMemo(
    () => getPasswordStrength(formData.password),
    [formData.password],
  );

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    if (errorMessage) {
      setErrorMessage("");
    }

    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (!formData.termsAccepted) {
      setErrorMessage(
        "You need to accept the terms before creating an account.",
      );
      return;
    }

    const registerResult = registerDummyUser({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    });

    if (!registerResult.success) {
      setErrorMessage(registerResult.message);
      return;
    }

    navigate("/dashboard", { replace: true });
  };

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid gap-4 min-h-[calc(100vh-3rem)] max-w-5xl items-center lg:grid-cols-[0.95fr_1.05fr]">
        <section className="hidden min-h-160 flex-col justify-between rounded-4xl border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#eff6ff_100%)] p-10 shadow-[0_20px_70px_rgba(15,23,42,0.08)] lg:flex">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                SB
              </span>
              Student Behavior Dashboard
            </div>

            <div className="max-w-lg space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-700">
                Create access
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-slate-900 xl:text-5xl">
                Set up your account and start monitoring student progress.
              </h1>
              <p className="text-base leading-7 text-slate-600 xl:text-lg">
                Use the same dummy access flow for now, then swap in the real
                database later without changing the UI.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { value: "Fast", label: "setup" },
              { value: "Safe", label: "dummy data" },
              { value: "Ready", label: "for backend" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/70 bg-white/80 p-4 text-center shadow-sm backdrop-blur"
              >
                <div className="text-2xl font-semibold text-slate-900">
                  {item.value}
                </div>
                <div className="mt-1 text-sm text-slate-600">{item.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-4xl border border-slate-200 bg-white/95 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.10)] backdrop-blur-xl sm:p-8 lg:p-10">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
              Create account
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
              Create Your Account
            </h2>
            <p className="text-sm leading-6 text-slate-600 sm:text-base">
              Join to start monitoring student progress effectively.
            </p>
          </div>

          {errorMessage ? (
            <p className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {errorMessage}
            </p>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-700"
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                autoComplete="name"
                required
                className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="yourname@example.com"
                autoComplete="email"
                required
                className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="role"
                className="block text-sm font-medium text-slate-700"
              >
                I am a
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
              >
                {roleOptions.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="new-password"
                  required
                  className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-16 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full px-2 py-1 text-sm font-medium text-slate-500 transition hover:text-slate-700"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <div className="space-y-2">
                <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className={`h-full rounded-full transition-all ${
                      passwordStrength.score === 1
                        ? "w-1/3 bg-rose-500"
                        : passwordStrength.score === 2
                          ? "w-2/3 bg-amber-500"
                          : passwordStrength.score === 3
                            ? "w-full bg-emerald-500"
                            : "w-0"
                    }`}
                  />
                </div>
                <p className="text-sm font-medium text-slate-500">
                  {passwordStrength.label}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-slate-700"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                autoComplete="new-password"
                required
                className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
              />
            </div>

            <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              <input
                type="checkbox"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleChange}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
              />
              <span>
                I agree to the{" "}
                <a
                  href="#"
                  className="font-semibold text-sky-700 hover:text-sky-800"
                >
                  Terms and Conditions
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="font-semibold text-sky-700 hover:text-sky-800"
                >
                  Privacy Policy
                </a>
                .
              </span>
            </label>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-600/20 transition hover:-translate-y-0.5 hover:bg-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/20"
            >
              Create Account
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-sky-700 transition hover:text-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            >
              Sign In
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}

export default RegisterPage;
