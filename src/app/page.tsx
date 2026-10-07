<div className="mt-6">
  <div className="flex items-center gap-3">
    <div className="h-px flex-1 bg-slate-200" />
    <span className="text-[10px] font-semibold tracking-[0.18em] text-slate-400">
      NEW HERE?
    </span>
    <div className="h-px flex-1 bg-slate-200" />
  </div>

  <Link
    href="/signup"
    className="mt-4 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-4 transition hover:border-cyan-300 hover:bg-cyan-50/40"
  >
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <line x1="19" y1="8" x2="19" y2="14" />
          <line x1="22" y1="11" x2="16" y2="11" />
        </svg>
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-900">
          Create Account
        </p>
        <p className="text-xs text-slate-500">
          New to HOMEHEALTH 360? Get started here.
        </p>
      </div>
    </div>

    <span className="text-xl text-slate-400">→</span>
  </Link>
</div>