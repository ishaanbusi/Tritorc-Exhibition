export default function ProductSpecs({
  specs,
}: {
  specs: Record<string, string>;
}) {
  return (
    <div>
      <h2 className="text-xl font-medium mb-4">Specifications</h2>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
        {Object.entries(specs).map(([k, v]) => (
          <div key={k} className="flex gap-2">
            <dt className="w-40 text-zinc-400">{k}</dt>
            <dd className="flex-1 font-medium">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
