// components/FilterBar.tsx
const filters = [
  "전체",
  "소품",
  "의상",
  "무대",
  "학교 프로젝트",
  "독립영화",
];

export default function FilterBar() {
  return (
    <section
      id="items"
      className="flex flex-wrap gap-2 rounded-2xl border border-slate-800 bg-slate-900/40 px-4 py-3"
    >
      {filters.map((label, i) => (
        <button
          key={label}
          className={`rounded-full px-3 py-1 text-xs ${
            i === 0
              ? "bg-sky-400 text-slate-950"
              : "bg-slate-900 text-slate-200 hover:bg-slate-800"
          }`}
        >
          {label}
        </button>
      ))}
    </section>
  );
}
