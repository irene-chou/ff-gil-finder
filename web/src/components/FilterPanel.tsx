import type { ProfitFilters } from '@shared/types.js';

interface Props {
  filters: ProfitFilters;
  onChange: (filters: ProfitFilters) => void;
}

const SALE_DAYS_OPTIONS = [1, 3, 7];

export function FilterPanel({ filters, onChange }: Props) {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
      {/* 等級上限 */}
      <label className="flex items-center gap-2 text-gray-400">
        <span>等級上限</span>
        <input
          type="number"
          min={1}
          max={100}
          placeholder="無"
          value={filters.maxLevel ?? ''}
          onChange={(e) => {
            const v = e.target.value;
            onChange({ ...filters, maxLevel: v ? Number(v) : null });
          }}
          className="w-16 border border-dark-600 rounded-lg px-2 py-1 text-gray-200 bg-dark-700 focus:border-gold-500 focus:outline-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </label>

      {/* 跳過秘笈 */}
      <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
        <input
          type="checkbox"
          checked={filters.skipBook}
          onChange={(e) => onChange({ ...filters, skipBook: e.target.checked })}
          className="accent-gold-500"
        />
        <span>跳過秘笈配方</span>
      </label>

      {/* 成交天數 */}
      <label className="flex items-center gap-2 text-gray-400">
        <span>最後成交</span>
        <select
          value={filters.saleDays}
          onChange={(e) => onChange({ ...filters, saleDays: Number(e.target.value) })}
          className="appearance-none border border-dark-600 rounded-lg px-2 py-1 pr-6 text-gray-200 bg-dark-700 focus:border-gold-500 focus:outline-none cursor-pointer bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%236b7280%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.23%207.21a.75.75%200%20011.06.02L10%2011.168l3.71-3.938a.75.75%200%20111.08%201.04l-4.25%204.5a.75.75%200%2001-1.08%200l-4.25-4.5a.75.75%200%2001.02-1.06z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1rem] bg-[right_0.25rem_center] bg-no-repeat"
        >
          {SALE_DAYS_OPTIONS.map((d) => (
            <option key={d} value={d}>{d} 天內</option>
          ))}
        </select>
      </label>
    </div>
  );
}
