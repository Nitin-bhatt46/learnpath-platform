export function LearningGraphic() {
  return (
    <div className="relative min-h-[320px] overflow-hidden rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <div className="absolute left-6 top-6 h-14 w-14 rounded-full bg-emerald-100" />
      <div className="absolute right-8 top-10 h-10 w-24 rounded-full bg-stone-100" />
      <div className="relative mx-auto mt-8 max-w-sm">
        <div className="rounded-lg border border-stone-200 bg-[#f7f5f0] p-4 shadow-sm">
          <div className="h-3 w-28 rounded-full bg-emerald-500" />
          <div className="mt-5 grid gap-3">
            <div className="h-10 rounded-md bg-white" />
            <div className="h-10 rounded-md bg-white" />
            <div className="h-10 rounded-md bg-white" />
          </div>
        </div>
        <div className="ml-auto mt-4 w-64 rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase text-emerald-700">Current path</p>
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-emerald-500" />
              <span className="h-3 w-32 rounded-full bg-stone-200" />
            </div>
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-emerald-300" />
              <span className="h-3 w-24 rounded-full bg-stone-200" />
            </div>
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-stone-300" />
              <span className="h-3 w-36 rounded-full bg-stone-200" />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-6 left-8 rounded-md border border-stone-200 bg-white px-4 py-3 shadow-sm">
        <p className="text-sm font-semibold text-stone-950">Learn</p>
      </div>
      <div className="absolute bottom-6 right-8 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 shadow-sm">
        <p className="text-sm font-semibold text-emerald-700">Build</p>
      </div>
    </div>
  );
}
