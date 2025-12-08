// components/ItemCard.tsx
import { MapPin } from "lucide-react";

export type Item = {
  id: number;
  title: string;
  category: string;
  location: string;
  status: "대여 가능" | "대여 중";
  thumbnail: string;
};

type Props = {
  item: Item;
};

export default function ItemCard({ item }: Props) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40">
      <div className="relative h-40 w-full overflow-hidden">
        <img
          src={item.thumbnail}
          alt={item.title}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        <span
          className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
            item.status === "대여 가능"
              ? "bg-emerald-400 text-slate-950"
              : "bg-slate-800 text-slate-100"
          }`}
        >
          {item.status}
        </span>
      </div>
      <div className="space-y-2 px-3 pb-3 pt-2">
        <div className="flex items-center gap-2 text-[10px] text-slate-400">
          <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px]">
            {item.category}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {item.location}
          </span>
        </div>
        <h3 className="line-clamp-2 text-sm font-semibold text-slate-50">
          {item.title}
        </h3>
      </div>
    </article>
  );
}
