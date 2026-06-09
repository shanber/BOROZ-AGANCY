export default function AdminRequestsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="border-b border-slate-200/60 pb-5">
        <div className="h-4 w-28 rounded bg-slate-100" />
        <div className="mt-3 h-7 w-40 rounded bg-slate-200" />
        <div className="mt-3 h-4 w-96 max-w-full rounded bg-slate-100" />
      </div>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_190px_220px_170px_auto]">
        <div className="h-11 rounded-xl bg-slate-100" />
        <div className="h-11 rounded-xl bg-slate-100" />
        <div className="h-11 rounded-xl bg-slate-100" />
        <div className="h-11 rounded-xl bg-slate-100" />
        <div className="h-11 rounded-xl bg-slate-100" />
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="grid grid-cols-6 gap-4 border-b border-slate-100 p-5">
            <div className="h-4 rounded bg-slate-100" />
            <div className="h-4 rounded bg-slate-100" />
            <div className="h-4 rounded bg-slate-100" />
            <div className="h-4 rounded bg-slate-100" />
            <div className="h-4 rounded bg-slate-100" />
            <div className="h-4 rounded bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
