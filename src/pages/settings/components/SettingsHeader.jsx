import { Card } from "./SettingsUI";

function SettingsHeader({ account, preferences }) {
  return (
    <Card className="bg-gradient-to-br from-sky-50 via-white to-emerald-50">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
            Account center
          </p>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Settings
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Manage profile information, security, and account preferences in a
              clean workspace built for teachers and administrators.
            </p>
          </div>
        </div>

        <dl className="grid gap-3 sm:grid-cols-2 lg:min-w-[360px]">
          <div className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm">
            <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Account status
            </dt>
            <dd className="mt-2 text-sm font-semibold text-slate-900">
              {account.status}
            </dd>
            <dd className="mt-1 text-sm leading-6 text-slate-600">
              Joined {account.joinedOn}
            </dd>
          </div>

          <div className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm">
            <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Default language
            </dt>
            <dd className="mt-2 text-sm font-semibold text-slate-900">
              {preferences.language}
            </dd>
            <dd className="mt-1 text-sm leading-6 text-slate-600">
              Notifications and labels follow this setting.
            </dd>
          </div>
        </dl>
      </div>
    </Card>
  );
}

export default SettingsHeader;
